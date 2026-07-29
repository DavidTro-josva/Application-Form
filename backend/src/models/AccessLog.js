/**
 * ========================================================
 * ACCESS LOG MODEL – AccessLog.js
 * Records every RFID card scan event (Entry / Exit / Verify)
 * Falls back to local JSON when MySQL is offline.
 * ========================================================
 */
const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

const FALLBACK_FILE = path.join(__dirname, '../../data/rfid_fallback.json');

function loadFallback() {
  if (!fs.existsSync(FALLBACK_FILE)) return { cards: [], logs: [] };
  const raw = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
  if (!raw.logs) raw.logs = [];
  return raw;
}

function saveFallback(data) {
  fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
}

function isConnectionError(err) {
  const codes = ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'PROTOCOL_CONNECTION_LOST', 'ER_ACCESS_DENIED_ERROR'];
  return codes.includes(err.code) || (err.message && err.message.includes('ECONNREFUSED'));
}

// =========================================================
// LOG A SCAN EVENT
// =========================================================
async function logScan({ cardId, studentId, scanType = 'ENTRY', gate, scannedBy, deviceId, remarks }) {
  try {
    const [result] = await pool.execute(
      `INSERT INTO access_logs (card_id, student_id, scan_type, gate, scanned_by, device_id, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [cardId, studentId, scanType, gate || 'Main Gate', scannedBy || 'System', deviceId || null, remarks || null]
    );
    // Update last_scan_time on card
    await pool.execute('UPDATE rfid_cards SET last_scan_time = NOW() WHERE id = ?', [cardId]);
    return { success: true, logId: result.insertId };
  } catch (error) {
    if (isConnectionError(error)) {
      const data = loadFallback();
      const log = {
        id: (data.logs || []).length + 1,
        card_id: cardId,
        student_id: studentId,
        scan_type: scanType,
        gate: gate || 'Main Gate',
        scanned_by: scannedBy || 'System',
        scan_time: new Date().toISOString(),
        device_id: deviceId || null,
        remarks: remarks || null,
      };
      data.logs.push(log);
      saveFallback(data);
      return { success: true, logId: log.id, fallback: true };
    }
    throw error;
  }
}

// =========================================================
// GET LOGS BY CARD ID
// =========================================================
async function getLogsByCard(cardId, limit = 50) {
  try {
    const [rows] = await pool.execute(
      `SELECT al.*, rc.card_number, rc.holder_name, rc.relationship
         FROM access_logs al
         JOIN rfid_cards rc ON al.card_id = rc.id
        WHERE al.card_id = ?
        ORDER BY al.scan_time DESC
        LIMIT ?`,
      [cardId, limit]
    );
    return rows;
  } catch (error) {
    if (isConnectionError(error)) {
      const data = loadFallback();
      return (data.logs || []).filter((l) => l.card_id === parseInt(cardId));
    }
    throw error;
  }
}

// =========================================================
// GET ALL LOGS FOR A STUDENT
// =========================================================
async function getLogsByStudent(studentId, limit = 100) {
  try {
    const [rows] = await pool.execute(
      `SELECT al.*, rc.card_number, rc.holder_name, rc.relationship
         FROM access_logs al
         JOIN rfid_cards rc ON al.card_id = rc.id
        WHERE al.student_id = ?
        ORDER BY al.scan_time DESC
        LIMIT ?`,
      [studentId, limit]
    );
    return rows;
  } catch (error) {
    if (isConnectionError(error)) {
      const data = loadFallback();
      return (data.logs || []).filter((l) => l.student_id === parseInt(studentId));
    }
    throw error;
  }
}

module.exports = { logScan, getLogsByCard, getLogsByStudent };
