import { useState, useEffect } from 'react';
import { editingService } from '../services/editingService';
import { shootService } from '../services/shootService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';

export default function Editing() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  // Create Task Modal
  const [showModal, setShowModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [editors, setEditors] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedEditor, setAssignedEditor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // QC Review Modal
  const [qcTask, setQcTask] = useState(null);
  const [qcNotes, setQcNotes] = useState('');

  const loadQueue = async (status = '') => {
    try {
      setLoading(true);
      const res = await editingService.getQueue(status);
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue(filterStatus);
  }, [filterStatus]);

  const handleOpenCreateModal = async () => {
    setErrorMsg('');
    try {
      const [sessRes, edRes] = await Promise.all([
        shootService.getAll(''),
        editingService.getEditors(),
      ]);
      setSessions(sessRes.data.data);
      setEditors(edRes.data.data);
      setSelectedSession('');
      setTaskName('');
      setPriority('medium');
      setDueDate('');
      setAssignedEditor('');
      setShowModal(true);
    } catch (err) {
      alert('Could not load completed sessions or editor profiles');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await editingService.create({
        session_id: parseInt(selectedSession, 10),
        task_name: taskName,
        priority,
        due_date: dueDate,
        assigned_editor_id: assignedEditor ? parseInt(assignedEditor, 10) : null,
      });
      setShowModal(false);
      loadQueue(filterStatus);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectStatus = async (id, nextStatus) => {
    try {
      await editingService.updateStatus(id, nextStatus);
      loadQueue(filterStatus);
    } catch (err) {
      alert(err.response?.data?.message || 'Status transition failed');
    }
  };

  const handleSubmitQC = async (status) => {
    if (!qcTask) return;
    try {
      await editingService.updateStatus(qcTask.id, status, qcNotes);
      setQcTask(null);
      setQcNotes('');
      loadQueue(filterStatus);
    } catch (err) {
      alert(err.response?.data?.message || 'QC signoff failed');
    }
  };

  const getPriorityBadge = (p) => {
    const map = {
      urgent: 'bg-danger text-white',
      high: 'bg-warning text-dark',
      medium: 'bg-info text-dark',
      low: 'bg-secondary text-white',
    };
    return <span className={`badge ${map[p] || 'bg-light text-dark'} text-uppercase`}>{p}</span>;
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Post-Production & Editing Queue</h4>
          <p className="text-muted small mb-0">Track raw ingestion, color grading, retouches, QC review, and gallery approvals</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <i className="bi bi-scissors me-2"></i>Queue Editing Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-2 d-flex gap-2 flex-wrap">
          {[
            { label: 'All Tasks', value: '' },
            { label: 'Queued', value: 'queued' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'QC Review', value: 'qc_review' },
            { label: 'Approved', value: 'approved' },
            { label: 'Revisions', value: 'revisions_needed' },
          ].map((f) => (
            <button
              key={f.value}
              className={`btn btn-sm ${filterStatus === f.value ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setFilterStatus(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <Loader message="Loading editing pipeline..." />
          ) : tasks.length === 0 ? (
            <EmptyState
              icon="bi-scissors"
              title="Editing Queue Empty"
              message="No post-production tasks waiting. Queue a task from any shoot session."
            />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Task Details</th>
                    <th>Shoot Session</th>
                    <th>Assigned Editor</th>
                    <th>Priority</th>
                    <th>Target Due Date</th>
                    <th>Progress Status</th>
                    <th className="text-end pe-4">Pipeline Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id}>
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">{t.task_name}</div>
                        <small className="text-muted">Client: {t.customer_name}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          <code>{t.session_code}</code>
                        </span>
                      </td>
                      <td>
                        {t.editor_first_name ? (
                          <div className="fw-medium text-dark">
                            <i className="bi bi-person-circle text-primary me-1"></i>
                            {t.editor_first_name} {t.editor_last_name}
                          </div>
                        ) : (
                          <span className="text-muted small">Unassigned</span>
                        )}
                      </td>
                      <td>{getPriorityBadge(t.priority)}</td>
                      <td>
                        <i className="bi bi-clock-history me-1 text-muted small"></i>
                        {new Date(t.due_date).toLocaleDateString()}
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="text-end pe-4">
                        {t.status === 'queued' && (
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleDirectStatus(t.id, 'in_progress')}
                          >
                            Start Editing
                          </button>
                        )}
                        {t.status === 'in_progress' && (
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleDirectStatus(t.id, 'qc_review')}
                          >
                            Send to QC
                          </button>
                        )}
                        {t.status === 'qc_review' && (
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => {
                              setQcTask(t);
                              setQcNotes(t.qc_notes || '');
                            }}
                          >
                            Conduct QC Review
                          </button>
                        )}
                        {t.status === 'approved' && (
                          <span className="badge bg-success bg-opacity-10 text-success border px-2 py-1">
                            <i className="bi bi-check-all me-1"></i>Ready for Delivery
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleCreateTask}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Queue New Post-Production Task</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  {errorMsg && <div className="alert alert-danger py-2 small">{errorMsg}</div>}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Shoot Session *</label>
                    <select
                      className="form-select"
                      required
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                    >
                      <option value="">-- Choose Shoot Session --</option>
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.session_code} — {s.customer_name} ({s.session_status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Task Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Wedding Raw Color Grading & Album Retouch"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Priority</label>
                      <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Due Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-0">
                    <label className="form-label small fw-semibold">Assign Post-Production Editor</label>
                    <select
                      className="form-select"
                      value={assignedEditor}
                      onChange={(e) => setAssignedEditor(e.target.value)}
                    >
                      <option value="">-- Unassigned (Lead Retoucher Pool) --</option>
                      {editors.map((ed) => (
                        <option key={ed.id} value={ed.id}>
                          {ed.first_name} {ed.last_name} ({ed.skills || 'Editor'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Queuing...' : 'Queue Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* QC Review Modal */}
      {qcTask && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Quality Check (QC) Review</h5>
                <button type="button" className="btn-close" onClick={() => setQcTask(null)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="small text-muted mb-3">
                  Inspect color consistency, export resolution, skin tones, and alignment before approving for delivery.
                </p>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">QC Feedback / Correction Notes</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Provide notes if revisions are requested, or add sign-off comments..."
                    value={qcNotes}
                    onChange={(e) => setQcNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer bg-light d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleSubmitQC('revisions_needed')}
                >
                  <i className="bi bi-arrow-return-left me-1"></i>Request Revisions
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleSubmitQC('approved')}
                >
                  <i className="bi bi-check-circle-fill me-1"></i>Approve & Mark Gallery Ready
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}