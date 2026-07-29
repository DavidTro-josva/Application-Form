import React, { useState, useCallback } from 'react';
import CardFlip from '../../components/IDCard/CardFlip';
import AccessLogTable from '../../components/AccessLog/AccessLogTable';
import {
  lookupCardsByAppNumber,
  generateCards,
  updateCardStatus,
  deleteCard,
  regenerateCard,
  getCardLogs,
  getStudentInfo,
} from '../../services/rfidApi';
import './RFIDDashboard.css';

/* ─── Relationship display config ─────────────────────────── */
const REL = {
  FATHER:    { label: 'Father',     color: '#2563eb', bg: '#dbeafe' },
  MOTHER:    { label: 'Mother',     color: '#db2777', bg: '#fce7f3' },
  GUARDIAN:  { label: 'Guardian 1', color: '#059669', bg: '#d1fae5' },
  GUARDIAN2: { label: 'Guardian 2', color: '#d97706', bg: '#fef3c7' },
};

/* ─── Stats row ────────────────────────────────────────────── */
const StatsRow = ({ cards }) => {
  const total    = cards.length;
  const active   = cards.filter((c) => c.status === 'ACTIVE').length;
  const inactive = cards.filter((c) => c.status === 'INACTIVE').length;
  const blocked  = cards.filter((c) => c.status === 'BLOCKED').length;
  const stats = [
    { label: 'Total Cards',  value: total,    color: '#6366f1', icon: '🪪' },
    { label: 'Active',       value: active,   color: '#22c55e', icon: '✅' },
    { label: 'Inactive',     value: inactive, color: '#94a3b8', icon: '⏸️' },
    { label: 'Blocked',      value: blocked,  color: '#ef4444', icon: '🚫' },
  ];
  return (
    <div className="rfid-stats-row">
      {stats.map((s) => (
        <div key={s.label} className="rfid-stat-card">
          <div className="rsc-icon">{s.icon}</div>
          <div className="rsc-value" style={{ color: s.color }}>{s.value}</div>
          <div className="rsc-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

/* ─── Card action menu ─────────────────────────────────────── */
const CardActionMenu = ({ card, onStatusChange, onDelete, onRegenerate, onViewLogs }) => {
  const [open, setOpen] = useState(false);
  const actions = [
    card.status !== 'ACTIVE'   && { label: '✅ Activate',   fn: () => onStatusChange(card.id, 'ACTIVE') },
    card.status !== 'INACTIVE' && { label: '⏸️ Deactivate', fn: () => onStatusChange(card.id, 'INACTIVE') },
    card.status !== 'BLOCKED'  && { label: '🚫 Block',      fn: () => onStatusChange(card.id, 'BLOCKED') },
    { label: '🔄 Regenerate', fn: () => onRegenerate(card.id) },
    { label: '📋 Scan History', fn: () => onViewLogs(card) },
    { label: '🗑️ Delete',    fn: () => onDelete(card.id), danger: true },
  ].filter(Boolean);

  return (
    <div className="card-action-menu">
      <button className="cam-trigger" onClick={() => setOpen((o) => !o)} title="Card options">
        ⋮
      </button>
      {open && (
        <div className="cam-dropdown" onMouseLeave={() => setOpen(false)}>
          {actions.map((a) => (
            <button
              key={a.label}
              className={`cam-item ${a.danger ? 'cam-danger' : ''}`}
              onClick={() => { a.fn(); setOpen(false); }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main Dashboard ───────────────────────────────────────── */
const RFIDDashboard = () => {
  const [appNumber, setAppNumber]   = useState('');
  const [cards, setCards]           = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId]   = useState(null);
  const [loading, setLoading]       = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError]           = useState(null);
  const [success, setSuccess]       = useState(null);
  const [filter, setFilter]         = useState('ALL');
  const [search, setSearch]         = useState('');
  const [logModal, setLogModal]     = useState(null); // { card, logs }
  const [logsLoading, setLogsLoading] = useState(false);

  const logoUrl = '/logo.png';

  /* Look up cards by application number */
  const handleLookup = useCallback(async (e) => {
    e.preventDefault();
    if (!appNumber.trim()) return;
    setLoading(true);
    setError(null);
    setCards([]);
    setStudentName('');
    setStudentId(null);
    setSuccess(null);
    try {
      const res = await lookupCardsByAppNumber(appNumber.trim().toUpperCase());
      const cardList = res.data || [];
      setCards(cardList);

      if (cardList.length > 0) {
        // Cards already exist — get info from them
        setStudentName(cardList[0].student_name || '');
        setStudentId(cardList[0].student_id || null);
      } else {
        // No cards yet — still fetch the student so Generate button appears
        try {
          const studentRes = await getStudentInfo(appNumber.trim().toUpperCase());
          if (studentRes?.data) {
            setStudentName(studentRes.data.full_name || '');
            setStudentId(studentRes.data.student_id || null);
            setSuccess('Student found! Click "⚡ Generate ID Cards" to create RFID access cards for the family.');
          } else {
            setError('No student found with this application number. Please check and try again.');
          }
        } catch (studentErr) {
          setError(
            studentErr.response?.data?.message ||
            'No student found with this application number. Please check and try again.'
          );
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not look up cards. Check the application number.');
    } finally {
      setLoading(false);
    }
  }, [appNumber]);

  /* Generate cards */
  const handleGenerate = useCallback(async () => {
    if (!studentId) { setError('Please look up a student first.'); return; }
    setGenerating(true);
    setError(null);
    setSuccess(null);
    try {
      await generateCards(studentId);
      const res = await lookupCardsByAppNumber(appNumber.trim().toUpperCase());
      setCards(res.data || []);
      setSuccess(`✅ RFID cards generated successfully for ${studentName}!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Card generation failed.');
    } finally {
      setGenerating(false);
    }
  }, [studentId, appNumber, studentName]);

  /* Status update */
  const handleStatusChange = useCallback(async (cardId, status) => {
    try {
      await updateCardStatus(cardId, status);
      setCards((prev) => prev.map((c) => c.id === cardId ? { ...c, status } : c));
      setSuccess(`Card status updated to ${status}.`);
    } catch (err) {
      setError('Failed to update card status.');
    }
  }, []);

  /* Delete */
  const handleDelete = useCallback(async (cardId) => {
    if (!window.confirm('Delete this RFID card permanently?')) return;
    try {
      await deleteCard(cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
      setSuccess('Card deleted.');
    } catch (err) {
      setError('Failed to delete card.');
    }
  }, []);

  /* Regenerate */
  const handleRegenerate = useCallback(async (cardId) => {
    if (!window.confirm('Regenerate this card? A new card number and QR code will be issued.')) return;
    try {
      await regenerateCard(cardId);
      const res = await lookupCardsByAppNumber(appNumber.trim().toUpperCase());
      setCards(res.data || []);
      setSuccess('Card regenerated successfully.');
    } catch (err) {
      setError('Failed to regenerate card.');
    }
  }, [appNumber]);

  /* View logs */
  const handleViewLogs = useCallback(async (card) => {
    setLogModal({ card, logs: [] });
    setLogsLoading(true);
    try {
      const res = await getCardLogs(card.id);
      setLogModal({ card, logs: res.data || [] });
    } catch {
      setLogModal({ card, logs: [] });
    } finally {
      setLogsLoading(false);
    }
  }, []);

  /* Print card */
  const handlePrint = useCallback((card) => {
    const printWin = window.open('', '_blank', 'width=900,height=600');
    const logoTag = logoUrl ? `<img src="${window.location.origin}${logoUrl}" style="height:48px;object-fit:contain;" />` : '';
    printWin.document.write(`
      <html><head><title>RFID Card – ${card.holder_name}</title>
      <style>
        @page { size: 85.6mm 54mm; margin: 0; }
        body { margin: 0; padding: 8mm; font-family: Inter, sans-serif; background: #f0f4ff; }
        .card-wrap { width: 85.6mm; }
        h3 { margin: 0 0 4px; font-size: 11pt; color: #1e3a8a; }
        p { margin: 2px 0; font-size: 9pt; color: #334155; }
        .badge { display:inline-block; padding: 2px 8px; border-radius:9999px; font-size:8pt; font-weight:700; }
        .active { background:#dcfce7; color:#166534; }
        .inactive { background:#f1f5f9; color:#475569; }
        .blocked { background:#fee2e2; color:#991b1b; }
        hr { border:none; border-top:1px solid #e2e8f0; margin:6px 0; }
      </style></head><body>
      <div class="card-wrap">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          ${logoTag}
          <div>
            <h3>TN Happy Kids School</h3>
            <p style="font-size:8pt;color:#64748b">RFID Family Access Card</p>
          </div>
        </div>
        <hr/>
        <p><b>Name:</b> ${card.holder_name}</p>
        <p><b>Relation:</b> ${card.relationship?.replace('GUARDIAN2','Guardian 2').replace('GUARDIAN','Guardian 1')}</p>
        <p><b>Student:</b> ${card.student_name || ''}</p>
        <p><b>Card No:</b> ${card.card_number}</p>
        <p><b>RFID:</b> ${card.rfid_serial}</p>
        <p><b>Issue:</b> ${card.issue_date ? new Date(card.issue_date).toLocaleDateString('en-IN') : '—'}</p>
        <p><b>Expiry:</b> ${card.expiry_date ? new Date(card.expiry_date).toLocaleDateString('en-IN') : '—'}</p>
        <p><span class="badge ${(card.status||'').toLowerCase()}">${card.status||'ACTIVE'}</span></p>
        <hr/>
        <p style="font-size:7pt;color:#94a3b8;text-align:center">If Found, Return to TN Happy Kids School | +91 98765 43210</p>
      </div>
      <script>window.onload=()=>{window.print();window.close();}<\/script>
      </body></html>
    `);
    printWin.document.close();
  }, [logoUrl]);

  /* Filtered + searched cards */
  const filtered = cards.filter((c) => {
    const matchFilter = filter === 'ALL' || c.relationship === filter || c.status === filter;
    const matchSearch = !search || c.holder_name?.toLowerCase().includes(search.toLowerCase())
      || c.card_number?.toLowerCase().includes(search.toLowerCase())
      || c.rfid_serial?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="rfid-dashboard">
      {/* === Header === */}
      <div className="rfid-dash-header">
        <div className="rdh-title-row">
          <div className="rdh-icon">🪪</div>
          <div>
            <h1 className="rdh-title">RFID Family ID Card Management</h1>
            <p className="rdh-subtitle">Generate, manage and track access cards for student families</p>
          </div>
        </div>
      </div>

      {/* === Lookup Form === */}
      <div className="rfid-lookup-card">
        <form onSubmit={handleLookup} className="rfid-lookup-form">
          <div className="rfl-input-wrap">
            <svg className="rfl-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="rfl-input"
              type="text"
              placeholder="Enter Application Number (e.g. HKS-2026-0001)"
              value={appNumber}
              onChange={(e) => setAppNumber(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button type="submit" className="rfl-btn-search" disabled={loading}>
            {loading ? <span className="rfid-spinner" /> : '🔍 Search'}
          </button>
          {studentId && (
            <button
              type="button"
              className="rfl-btn-generate"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? <span className="rfid-spinner" /> : '⚡ Generate ID Cards'}
            </button>
          )}
        </form>

        {studentName && (
          <div className="rfid-student-info">
            <span className="rsi-label">Student:</span>
            <span className="rsi-name">{studentName}</span>
            <span className="rsi-count">{cards.length} card{cards.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="rfid-alert rfid-alert-error">
            ⚠️ {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}
        {success && (
          <div className="rfid-alert rfid-alert-success">
            {success}
            <button onClick={() => setSuccess(null)}>✕</button>
          </div>
        )}
      </div>

      {/* === Stats Row === */}
      {cards.length > 0 && <StatsRow cards={cards} />}

      {/* === Filter + Search Bar === */}
      {cards.length > 0 && (
        <div className="rfid-toolbar">
          <div className="rfid-filters">
            {['ALL','FATHER','MOTHER','GUARDIAN','GUARDIAN2','ACTIVE','INACTIVE','BLOCKED'].map((f) => (
              <button
                key={f}
                className={`rfid-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'GUARDIAN' ? 'Guardian 1' : f === 'GUARDIAN2' ? 'Guardian 2' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="rfid-search-mini">
            <input
              placeholder="Search name, card no…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* === Card Grid === */}
      {filtered.length > 0 && (
        <div className="rfid-card-grid">
          {filtered.map((card) => {
            const rel = REL[card.relationship] || REL.FATHER;
            return (
              <div key={card.id} className="rfid-card-item">
                {/* Card header */}
                <div className="rci-header">
                  <span className="rci-rel-badge" style={{ background: rel.bg, color: rel.color }}>
                    {rel.label}
                  </span>
                  <span className={`rci-status-dot status-${(card.status||'ACTIVE').toLowerCase()}`} />
                  <CardActionMenu
                    card={card}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onRegenerate={handleRegenerate}
                    onViewLogs={handleViewLogs}
                  />
                </div>

                {/* Flip card preview */}
                <CardFlip card={card} studentName={studentName} logoUrl={logoUrl} />

                {/* Card footer meta */}
                <div className="rci-footer">
                  <div className="rci-card-no">{card.card_number}</div>
                  <div className="rci-rfid">{card.rfid_serial}</div>
                  <button className="rci-print-btn" onClick={() => handlePrint(card)} title="Download / Print">
                    🖨️ Print
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Empty state when no cards === */}
      {!loading && cards.length === 0 && appNumber && (
        <div className="rfid-empty-state">
          <div className="res-icon">🪪</div>
          <h3>No RFID Cards Found</h3>
          <p>Enter the student's application number and click <strong>Generate ID Cards</strong> to create family access cards.</p>
        </div>
      )}

      {/* === Scan History Modal === */}
      {logModal && (
        <div className="rfid-modal-overlay" onClick={() => setLogModal(null)}>
          <div className="rfid-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rfid-modal-header">
              <h2>📋 Scan History – {logModal.card.holder_name}</h2>
              <button className="rfid-modal-close" onClick={() => setLogModal(null)}>✕</button>
            </div>
            <div className="rfid-modal-body">
              <AccessLogTable logs={logModal.logs} loading={logsLoading} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFIDDashboard;
