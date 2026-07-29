/**
 * ========================================================
 * RFID CONTROLLER – rfidController.js
 * Handles all RFID card management API requests
 * ========================================================
 */
const RFIDCard = require('../models/RFIDCard');
const AccessLog = require('../models/AccessLog');

// POST /api/rfid/generate/:studentId
async function generateCards(req, res, next) {
  try {
    const { studentId } = req.params;
    if (!studentId || isNaN(parseInt(studentId))) {
      return res.status(400).json({ success: false, message: 'Valid studentId is required.' });
    }
    const result = await RFIDCard.generateCardsForAdmission(parseInt(studentId));
    return res.status(201).json({
      success: true,
      message: `RFID cards generated successfully.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/rfid/cards/:studentId
async function getCardsByStudent(req, res, next) {
  try {
    const { studentId } = req.params;
    const cards = await RFIDCard.getCardsByStudentId(parseInt(studentId));
    return res.status(200).json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    next(error);
  }
}

// GET /api/rfid/lookup/:applicationNumber
async function lookupCardsByAppNumber(req, res, next) {
  try {
    const { applicationNumber } = req.params;
    const cards = await RFIDCard.getCardsByApplicationNumber(applicationNumber);
    return res.status(200).json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    next(error);
  }
}

// GET /api/rfid/card/:cardId
async function getCardById(req, res, next) {
  try {
    const card = await RFIDCard.getCardById(parseInt(req.params.cardId));
    if (!card) return res.status(404).json({ success: false, message: 'Card not found.' });
    return res.status(200).json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/rfid/card/:cardId/status
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'INACTIVE', 'BLOCKED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be ACTIVE, INACTIVE, or BLOCKED.' });
    }
    const updated = await RFIDCard.updateCardStatus(parseInt(req.params.cardId), status);
    if (!updated) return res.status(404).json({ success: false, message: 'Card not found.' });
    return res.status(200).json({ success: true, message: `Card status updated to ${status}.` });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/rfid/card/:cardId
async function deleteCard(req, res, next) {
  try {
    const deleted = await RFIDCard.deleteCard(parseInt(req.params.cardId));
    if (!deleted) return res.status(404).json({ success: false, message: 'Card not found.' });
    return res.status(200).json({ success: true, message: 'Card deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

// POST /api/rfid/card/:cardId/regenerate
async function regenerateCard(req, res, next) {
  try {
    const result = await RFIDCard.regenerateCard(parseInt(req.params.cardId));
    return res.status(201).json({ success: true, message: 'Card regenerated successfully.', data: result });
  } catch (error) {
    next(error);
  }
}

// GET /api/rfid/logs/:cardId
async function getCardLogs(req, res, next) {
  try {
    const logs = await AccessLog.getLogsByCard(parseInt(req.params.cardId));
    return res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
}

// GET /api/rfid/student-logs/:studentId
async function getStudentLogs(req, res, next) {
  try {
    const logs = await AccessLog.getLogsByStudent(parseInt(req.params.studentId));
    return res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
}

// POST /api/rfid/scan
async function logScan(req, res, next) {
  try {
    const { cardId, studentId, scanType, gate, scannedBy, deviceId, remarks } = req.body;
    if (!cardId || !studentId) {
      return res.status(400).json({ success: false, message: 'cardId and studentId are required.' });
    }
    const result = await AccessLog.logScan({ cardId, studentId, scanType, gate, scannedBy, deviceId, remarks });
    return res.status(201).json({ success: true, message: 'Scan logged.', data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  generateCards,
  getCardsByStudent,
  lookupCardsByAppNumber,
  getCardById,
  updateStatus,
  deleteCard,
  regenerateCard,
  getCardLogs,
  getStudentLogs,
  logScan,
};
