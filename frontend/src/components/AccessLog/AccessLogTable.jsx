import React from 'react';

/**
 * AccessLogTable – Displays scan history for an RFID card.
 */
const SCAN_COLORS = {
  ENTRY:  { bg: '#dcfce7', color: '#166534', icon: '🟢' },
  EXIT:   { bg: '#fef3c7', color: '#92400e', icon: '🟡' },
  VERIFY: { bg: '#dbeafe', color: '#1e40af', icon: '🔵' },
};

const AccessLogTable = ({ logs = [], loading = false }) => {
  if (loading) {
    return (
      <div className="log-loading">
        <div className="log-spinner" />
        <span>Loading scan history…</span>
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="log-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
          <rect x="9" y="3" width="6" height="4" rx="1"/>
        </svg>
        <p>No scan history yet</p>
      </div>
    );
  }

  return (
    <div className="log-table-wrapper">
      <table className="log-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date &amp; Time</th>
            <th>Gate</th>
            <th>Operator</th>
            <th>Device</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const cfg = SCAN_COLORS[log.scan_type] || SCAN_COLORS.VERIFY;
            return (
              <tr key={log.id}>
                <td>
                  <span className="log-type-badge" style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.icon} {log.scan_type}
                  </span>
                </td>
                <td className="log-time">
                  {new Date(log.scan_time).toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </td>
                <td>{log.gate || '—'}</td>
                <td>{log.scanned_by || '—'}</td>
                <td className="log-device">{log.device_id || '—'}</td>
                <td>{log.remarks || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AccessLogTable;
