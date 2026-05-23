import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

const STAGE_LABELS = {
  data_capture: 'Data Capture',
  doc_verification: 'Document Verification',
  kyc_approval: 'KYC Approval',
  aml_screening: 'AML Screening',
  fraud_check: 'Fraud Check',
  manual_review: 'Manual Review',
  pending_docs: 'Pending Documents',
  escalated: 'Compliance Escalation',
  otp_verification: 'OTP Verification',
  complete: 'Completed',
  rejected: 'Rejected',
};

const EVENT_LABELS = {
  decision_summary: 'Stage Update',
  decision_agent_start: 'Decision Started',
  decision_agent_complete: 'Decision Made',
  decision_agent_error: 'Decision Error',
  queued_for_review: 'Queued For Review',
  application_rejected: 'Application Rejected',
  pending_docs_requested: 'Documents Requested',
  escalated_to_compliance: 'Escalated',
};

const toLabel = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const stageLabel = (value) => STAGE_LABELS[value] || toLabel(value) || 'Unknown';

const eventLabel = (value) => EVENT_LABELS[value] || toLabel(value) || 'Audit Event';

const statusBadgeClass = (status) => {
  const key = String(status || '').toLowerCase();
  if (key === 'approve' || key === 'approved') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  }
  if (key === 'reject' || key === 'rejected') {
    return 'bg-red-50 text-red-700 ring-red-200';
  }
  if (key === 'pending') {
    return 'bg-amber-50 text-amber-700 ring-amber-200';
  }
  return 'bg-slate-100 text-slate-600 ring-slate-200';
};

const statusLabel = (status) => {
  const key = String(status || '').toLowerCase();
  if (key === 'approve') return 'Approved';
  if (key === 'reject' || key === 'rejected') return 'Rejected';
  if (key === 'pending') return 'Pending';
  if (key === 'undecided') return 'In Progress';
  return toLabel(status) || 'Unknown';
};

const filterAdjacentDuplicates = (logs) => {
  if (!logs.length) return logs;
  const filtered = [];
  for (let i = 0; i < logs.length; i += 1) {
    const curr = logs[i];
    const prev = filtered[filtered.length - 1];
    if (
      prev &&
      curr.event_type === 'decision_summary' &&
      prev.event_type === 'decision_agent_complete' &&
      String(prev.stage) === String(curr.stage) &&
      String(prev.status || prev.decision).toLowerCase() ===
        String(curr.status || curr.decision).toLowerCase()
    ) {
      const prevTime = prev.created_at ? new Date(prev.created_at).getTime() : 0;
      const currTime = curr.created_at ? new Date(curr.created_at).getTime() : 0;
      if (Math.abs(currTime - prevTime) <= 10000) {
        continue;
      }
    }
    filtered.push(curr);
  }
  return filtered;
};

const auditDisplayLine = (log) => {
  if (log?.display_line) return log.display_line;
  const output = log?.output_payload || {};
  if (String(output?.action || log?.decision).toLowerCase() === 'undecided' && log?.stage) {
    return `${stageLabel(log.stage)}: review in progress.`;
  }
  return log?.friendly_text || 'No summary available.';
};

export default function CaseDetailsModal({ isOpen, onClose, loading, error, details }) {
  const caseData = details?.case || {};
  const overall = details?.overall || {};
  const auditLogs = filterAdjacentDuplicates(details?.audit_logs || []);
  const amlChecks = details?.aml_checks || [];
  const complianceFlagged = Boolean(
    caseData?.flagged ||
      caseData?.compliance === 'Non-Compliant' ||
      caseData?.stage === 'rejected'
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-modal-title"
        >
          <motion.div
            className="absolute inset-0 bg-nexus-navy/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 id="case-modal-title" className="text-lg font-semibold text-nexus-navy">
                Customer Compliance Details
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-nexus-navy"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-4rem)] overflow-y-auto p-6">
              {loading && (
                <div className="py-8 text-center text-slate-500">Loading details...</div>
              )}
              {!loading && error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}
              {!loading && !error && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {[
                      ['Customer', caseData.full_name || 'N/A'],
                      ['Session', caseData.session_id || 'N/A'],
                      ['Stage', stageLabel(caseData.stage)],
                      ['Overall Alerts', overall.total_alerts ?? 0],
                      [
                        'Compliance',
                        complianceFlagged ? 'Flagged / Non-Compliant' : 'Normal',
                      ],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {label}
                        </span>
                        <div
                          className={cn(
                            'mt-0.5 text-sm font-medium text-nexus-navy',
                            label === 'Compliance' && complianceFlagged && 'text-red-600'
                          )}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <section>
                    <h4 className="mb-3 text-sm font-semibold text-nexus-navy">
                      AML Screening Checks
                    </h4>
                    {amlChecks.length === 0 && (
                      <p className="text-sm text-slate-500">No AML checks found.</p>
                    )}
                    <div className="space-y-3">
                      {amlChecks.map((check, idx) => (
                        <div
                          key={`${check.check}-${idx}`}
                          className={cn(
                            'rounded-lg border-l-4 bg-slate-50 p-4',
                            check.important
                              ? 'border-l-red-500'
                              : 'border-l-nexus-emerald'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-sm text-nexus-navy">{check.check}</strong>
                            <span
                              className={cn(
                                'text-xs font-semibold uppercase',
                                check.important ? 'text-red-600' : 'text-emerald-600'
                              )}
                            >
                              {toLabel(check.status)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            {check.detail || 'No details available.'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-3 text-sm font-semibold text-nexus-navy">
                      Decision Audit Logs
                    </h4>
                    {auditLogs.length === 0 && (
                      <p className="text-sm text-slate-500">No decision logs found.</p>
                    )}
                    <div className="space-y-3">
                      {auditLogs.map((log) => {
                        const status = log.status || log.decision || 'undecided';
                        return (
                          <div
                            key={log.id}
                            className="rounded-lg border border-slate-200 bg-white p-4"
                          >
                            <div className="flex items-start justify-between gap-3 text-sm">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <strong className="text-nexus-navy">
                                    {eventLabel(log.event_type)}
                                  </strong>
                                  <span
                                    className={cn(
                                      'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset',
                                      statusBadgeClass(status)
                                    )}
                                  >
                                    {statusLabel(status)}
                                  </span>
                                </div>
                                <p className="mt-1.5 text-sm text-slate-600">
                                  {auditDisplayLine(log)}
                                </p>
                              </div>
                              <span className="shrink-0 text-xs text-slate-500">
                                {log.created_at
                                  ? new Date(log.created_at).toLocaleString()
                                  : 'n/a'}
                              </span>
                            </div>
                            {log.log_hash && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600">
                                  Technical details
                                </summary>
                                <p className="mt-1 truncate font-mono text-xs text-slate-400">
                                  Hash: {log.log_hash}
                                </p>
                              </details>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
