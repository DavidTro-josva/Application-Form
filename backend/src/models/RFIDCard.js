/**
 * ========================================================
 * RFID CARD MODEL – RFIDCard.js
 * Handles generation, retrieval, and status management
 * of RFID family access cards.
 * Falls back to local JSON store when MySQL is offline.
 * ========================================================
 */
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/db');
const path = require('path');
const fs = require('fs');

// ---- Local JSON Fallback Store ----
const FALLBACK_FILE = path.join(__dirname, '../../data/rfid_fallback.json');

function loadFallback() {
  if (!fs.existsSync(FALLBACK_FILE)) {
    fs.mkdirSync(path.dirname(FALLBACK_FILE), { recursive: true });
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify({ cards: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
}

function saveFallback(data) {
  fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
}

function isConnectionError(err) {
  const codes = ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'PROTOCOL_CONNECTION_LOST', 'ER_ACCESS_DENIED_ERROR'];
  return codes.includes(err.code) || (err.message && err.message.includes('ECONNREFUSED'));
}

// ---- Card Number Generator ----
let cardCounter = 1;
function generateCardNumber() {
  const year = new Date().getFullYear();
  const seq = String(cardCounter++).padStart(4, '0');
  return `HKS-CARD-${year}-${seq}`;
}

function generateRFIDSerial() {
  const seq = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  return `RFID-TN-${seq}`;
}

function buildQRPayload(uniqueCardId, studentId, parentId, relationship) {
  return JSON.stringify({
    system: 'TN_HAPPY_KIDS_SCHOOL',
    cardId: uniqueCardId,
    studentId,
    parentId,
    relationship,
    token: Buffer.from(`${uniqueCardId}:${studentId}:HKS`).toString('base64'),
    url: `https://tnhappykids.school/verify/${uniqueCardId}`,
  });
}

function getIssueDate() {
  return new Date().toISOString().split('T')[0];
}

function getExpiryDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
}

// =========================================================
// GENERATE CARDS FOR ALL FAMILY MEMBERS OF A STUDENT
// =========================================================
async function generateCardsForAdmission(studentId) {
  try {
    const conn = await pool.getConnection();

    // Fetch student info
    const [students] = await conn.execute(
      'SELECT student_id, full_name FROM students WHERE student_id = ?',
      [studentId]
    );
    if (!students.length) {
      conn.release();
      throw new Error(`Student with id ${studentId} not found.`);
    }

    // Fetch all parents/guardians for this student
    const [parents] = await conn.execute(
      'SELECT parent_id, student_id, relation_type, full_name, photo_path FROM parents WHERE student_id = ?',
      [studentId]
    );

    conn.release();

    const generated = [];

    for (const parent of parents) {
      // Skip if card already exists for this relationship
      const [existing] = await pool.execute(
        'SELECT id FROM rfid_cards WHERE student_id = ? AND relationship = ?',
        [studentId, parent.relation_type]
      );
      if (existing.length > 0) {
        generated.push({ skipped: true, relationship: parent.relation_type, reason: 'Card already exists' });
        continue;
      }

      const uniqueCardId = uuidv4();
      const cardNumber = generateCardNumber();
      const rfidSerial = generateRFIDSerial();
      const qrPayload = buildQRPayload(uniqueCardId, studentId, parent.parent_id, parent.relation_type);
      const issueDate = getIssueDate();
      const expiryDate = getExpiryDate();

      await pool.execute(
        `INSERT INTO rfid_cards
          (student_id, parent_id, relationship, holder_name, holder_photo,
           card_number, unique_card_id, rfid_serial, qr_payload,
           issue_date, expiry_date, status, activation_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', NOW())`,
        [
          studentId,
          parent.parent_id,
          parent.relation_type,
          parent.full_name,
          parent.photo_path,
          cardNumber,
          uniqueCardId,
          rfidSerial,
          qrPayload,
          issueDate,
          expiryDate,
        ]
      );

      generated.push({
        relationship: parent.relation_type,
        holderName: parent.full_name,
        cardNumber,
        uniqueCardId,
        rfidSerial,
        status: 'ACTIVE',
        issueDate,
        expiryDate,
      });
    }

    return { success: true, studentId, generated };
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn('⚠️ [MySQL Offline] Falling back to local JSON for RFID generation');
      return generateCardsFallback(studentId);
    }
    throw error;
  }
}

// ---- Fallback: generate cards into local JSON ----
function generateCardsFallback(studentId) {
  const data = loadFallback();
  let mockParents = [
    { relation_type: 'FATHER', full_name: 'Father (Offline Mode)' },
    { relation_type: 'MOTHER', full_name: 'Mother (Offline Mode)' },
  ];

  try {
    const admissionsPath = path.join(__dirname, '../../data/fallback_admissions.json');
    if (fs.existsSync(admissionsPath)) {
      const fallbackData = JSON.parse(fs.readFileSync(admissionsPath, 'utf8'));
      const student = fallbackData.admissions.find(a => a.studentId === studentId);
      if (student) {
        mockParents = [];
        if (student.parentInfo?.father?.fullName) {
          mockParents.push({ relation_type: 'FATHER', full_name: student.parentInfo.father.fullName });
        }
        if (student.parentInfo?.mother?.fullName) {
          mockParents.push({ relation_type: 'MOTHER', full_name: student.parentInfo.mother.fullName });
        }
        if (student.guardianInfo?.guardianName) {
          mockParents.push({ relation_type: 'GUARDIAN', full_name: student.guardianInfo.guardianName });
        }
        if (student.guardianInfo?.guardian2Name) {
          mockParents.push({ relation_type: 'GUARDIAN2', full_name: student.guardianInfo.guardian2Name });
        }
        if (mockParents.length === 0) {
           mockParents = [
             { relation_type: 'FATHER', full_name: 'Father (Offline Mode)' },
             { relation_type: 'MOTHER', full_name: 'Mother (Offline Mode)' },
           ];
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ [MySQL Offline] Could not read fallback_admissions.json for real names.');
  }
  const generated = [];

  for (const parent of mockParents) {
    const existing = data.cards.find(
      (c) => c.student_id === studentId && c.relationship === parent.relation_type
    );
    if (existing) {
      generated.push({ skipped: true, relationship: parent.relation_type });
      continue;
    }

    const uniqueCardId = uuidv4();
    const card = {
      id: data.cards.length + 1,
      student_id: studentId,
      relationship: parent.relation_type,
      holder_name: parent.full_name,
      holder_photo: null,
      card_number: generateCardNumber(),
      unique_card_id: uniqueCardId,
      rfid_serial: generateRFIDSerial(),
      qr_payload: buildQRPayload(uniqueCardId, studentId, null, parent.relation_type),
      issue_date: getIssueDate(),
      expiry_date: getExpiryDate(),
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };
    data.cards.push(card);
    generated.push(card);
  }

  saveFallback(data);
  return { success: true, studentId, generated, fallback: true };
}

// =========================================================
// GET ALL CARDS FOR A STUDENT
// =========================================================
async function getCardsByStudentId(studentId) {
  try {
    const [rows] = await pool.execute(
      `SELECT rc.*, s.full_name AS student_name, s.application_number
         FROM rfid_cards rc
         JOIN students s ON rc.student_id = s.student_id
        WHERE rc.student_id = ?
        ORDER BY FIELD(rc.relationship,'FATHER','MOTHER','GUARDIAN','GUARDIAN2')`,
      [studentId]
    );
    return rows;
  } catch (error) {
    if (isConnectionError(error)) {
      const data = loadFallback();
      return data.cards.filter((c) => c.student_id === parseInt(studentId));
    }
    throw error;
  }
}

// =========================================================
// GET CARDS BY APPLICATION NUMBER (for frontend lookup)
// =========================================================
async function getCardsByApplicationNumber(applicationNumber) {
  try {
    const [rows] = await pool.execute(
      `SELECT rc.*, s.full_name AS student_name, s.application_number
         FROM rfid_cards rc
         JOIN students s ON rc.student_id = s.student_id
        WHERE s.application_number = ?
        ORDER BY FIELD(rc.relationship,'FATHER','MOTHER','GUARDIAN','GUARDIAN2')`,
      [applicationNumber]
    );
    return rows;
  } catch (error) {
    if (isConnectionError(error)) {
      const data = loadFallback();
      return data.cards;
    }
    throw error;
  }
}

// =========================================================
// GET SINGLE CARD BY ID
// =========================================================
async function getCardById(cardId) {
  try {
    const [rows] = await pool.execute(
      `SELECT rc.*, s.full_name AS student_name, s.application_number
         FROM rfid_cards rc
         JOIN students s ON rc.student_id = s.student_id
        WHERE rc.id = ?`,
      [cardId]
    );
    return rows[0] || null;
  } catch (error) {
    if (isConnectionError(error)) {
      const data = loadFallback();
      return data.cards.find((c) => c.id === parseInt(cardId)) || null;
    }
    throw error;
  }
}

// =========================================================
// UPDATE CARD STATUS (ACTIVE / INACTIVE / BLOCKED)
// =========================================================
async function updateCardStatus(cardId, status) {
  const allowed = ['ACTIVE', 'INACTIVE', 'BLOCKED'];
  if (!allowed.includes(status)) throw new Error(`Invalid status: ${status}`);

  try {
    const [result] = await pool.execute(
      'UPDATE rfid_cards SET status = ? WHERE id = ?',
      [status, cardId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    if (isConnectionError(error)) {
      const data = loadFallback();
      const card = data.cards.find((c) => c.id === parseInt(cardId));
      if (card) { card.status = status; saveFallback(data); return true; }
      return false;
    }
    throw error;
  }
}

// =========================================================
// DELETE CARD
// =========================================================
async function deleteCard(cardId) {
  try {
    const [result] = await pool.execute('DELETE FROM rfid_cards WHERE id = ?', [cardId]);
    return result.affectedRows > 0;
  } catch (error) {
    if (isConnectionError(error)) {
      const data = loadFallback();
      const idx = data.cards.findIndex((c) => c.id === parseInt(cardId));
      if (idx !== -1) { data.cards.splice(idx, 1); saveFallback(data); return true; }
      return false;
    }
    throw error;
  }
}

// =========================================================
// REGENERATE A CARD (delete + recreate)
// =========================================================
async function regenerateCard(cardId) {
  const existing = await getCardById(cardId);
  if (!existing) throw new Error('Card not found');
  await deleteCard(cardId);
  return generateCardsForAdmission(existing.student_id);
}

// =========================================================
// LOOK UP STUDENT BY APPLICATION NUMBER (even with no cards)
// =========================================================
async function getStudentByApplicationNumber(applicationNumber) {
  try {
    const [rows] = await pool.execute(
      `SELECT student_id, full_name, application_number
         FROM students WHERE application_number = ? LIMIT 1`,
      [applicationNumber]
    );
    return rows[0] || null;
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn('⚠️ [MySQL Offline] Reading student from fallback_admissions.json.');
      try {
        const admissionsPath = path.join(__dirname, '../../data/fallback_admissions.json');
        if (fs.existsSync(admissionsPath)) {
          const fallbackData = JSON.parse(fs.readFileSync(admissionsPath, 'utf8'));
          const student = fallbackData.admissions.find(a => a.applicationNumber === applicationNumber);
          if (student) {
            return {
              student_id: student.studentId,
              full_name: student.studentInfo.fullName,
              application_number: student.applicationNumber
            };
          }
        }
      } catch (err) {
        console.warn('⚠️ [MySQL Offline] Fallback read failed', err);
      }
      return null;
    }
    throw error;
  }
}

module.exports = {
  generateCardsForAdmission,
  getCardsByStudentId,
  getCardsByApplicationNumber,
  getStudentByApplicationNumber,
  getCardById,
  updateCardStatus,
  deleteCard,
  regenerateCard,
};
