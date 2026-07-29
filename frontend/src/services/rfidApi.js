/**
 * ========================================================
 * RFID API SERVICE – rfidApi.js
 * Frontend API calls for RFID card management
 * ========================================================
 */
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/admission', '')
  : '/api';

const RFID_URL = `${BASE}/rfid`;

// Generate cards for all family members of a student
export async function generateCards(studentId) {
  const { data } = await axios.post(`${RFID_URL}/generate/${studentId}`);
  return data;
}

// Get all cards for a student by studentId
export async function getCardsByStudent(studentId) {
  const { data } = await axios.get(`${RFID_URL}/cards/${studentId}`);
  return data;
}

// Look up cards by Application Number (e.g. HKS-2026-0001)
export async function lookupCardsByAppNumber(applicationNumber) {
  const { data } = await axios.get(`${RFID_URL}/lookup/${applicationNumber}`);
  return data;
}

// Get student info by application number (even if no cards generated yet)
export async function getStudentInfo(applicationNumber) {
  const { data } = await axios.get(`${RFID_URL}/student-info/${applicationNumber}`);
  return data;
}

// Get a single card by card ID
export async function getCardById(cardId) {
  const { data } = await axios.get(`${RFID_URL}/card/${cardId}`);
  return data;
}

// Update card status: ACTIVE | INACTIVE | BLOCKED
export async function updateCardStatus(cardId, status) {
  const { data } = await axios.patch(`${RFID_URL}/card/${cardId}/status`, { status });
  return data;
}

// Delete a card permanently
export async function deleteCard(cardId) {
  const { data } = await axios.delete(`${RFID_URL}/card/${cardId}`);
  return data;
}

// Regenerate a card (delete + recreate)
export async function regenerateCard(cardId) {
  const { data } = await axios.post(`${RFID_URL}/card/${cardId}/regenerate`);
  return data;
}

// Get scan history for a card
export async function getCardLogs(cardId) {
  const { data } = await axios.get(`${RFID_URL}/logs/${cardId}`);
  return data;
}

// Log a manual scan event
export async function logScan(payload) {
  const { data } = await axios.post(`${RFID_URL}/scan`, payload);
  return data;
}
