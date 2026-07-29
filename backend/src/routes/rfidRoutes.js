/**
 * ========================================================
 * RFID ROUTES – rfidRoutes.js
 * All RFID card management endpoints
 * ========================================================
 */
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rfidController');

// --- Card Generation ---
router.post('/generate/:studentId',   ctrl.generateCards);

// --- Card Retrieval ---
router.get('/cards/:studentId',       ctrl.getCardsByStudent);
router.get('/lookup/:applicationNumber', ctrl.lookupCardsByAppNumber);
router.get('/student-info/:applicationNumber', ctrl.getStudentInfo);
router.get('/card/:cardId',           ctrl.getCardById);

// --- Card Management ---
router.patch('/card/:cardId/status',  ctrl.updateStatus);
router.delete('/card/:cardId',        ctrl.deleteCard);
router.post('/card/:cardId/regenerate', ctrl.regenerateCard);

// --- Access Logs ---
router.get('/logs/:cardId',           ctrl.getCardLogs);
router.get('/student-logs/:studentId', ctrl.getStudentLogs);
router.post('/scan',                  ctrl.logScan);

module.exports = router;
