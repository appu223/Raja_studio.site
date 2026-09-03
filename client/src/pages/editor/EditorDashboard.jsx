import { useState, useEffect } from 'react';
import { staffPortalService } from '../../services/staffPortalService';
import { deliverableService } from '../../services/deliverableService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

export default function EditorDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status & QC Modal
  const [actionTask, setActionTask] = useState(null);
  const [notes, setNotes] = useState('');

  // Multi-Format Deliverable Modal
  const [dispatchTask, setDispatchTask] = useState(null);
  const [taskDeliverables, setTaskDeliverables] = useState([]);
  const [deliverableForm, setDeliverableForm] = useState({
    title: '',
    asset_type: 'JPG Image',
    file_url: '',
    file_size: 'High-Res 300DPI',
    editor_notes: '',
  });
  const [submittingDeliv, setSubmittingDeliv] = useState(false);
  const [loadingDelivs, setLoadingDelivs] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mRes, tRes] = await Promise.all([
        staffPortalService.getEditorDashboard(),
        staffPortalService.getEditorTasks(),
      ]);
      setMetrics(mRes.data.data);
      setTasks(tRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (taskId, nextStatus, qcNotes = '') => {
    try {
      await staffPortalService.updateEditorTask(taskId, nextStatus, qcNotes);
      setActionTask(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating task status');
    }
  };

  const handleOpenDispatch = async (task) => {
    setDispatchTask(task);
    setDeliverableForm({
      title: `${task.task_name} - Final Export`,
      asset_type: 'JPG Image',
      file_url: '',
      file_size: 'High-Res 300DPI',
      editor_notes: 'Retouched, color graded, and sharpened for print.',
    });

    try {
      setLoadingDelivs(true);
      const res = await deliverableService.getByTask(task.id);
      setTaskDeliverables(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDelivs(false);
    }
  };

  const handleCreateDeliverable = async (e) => {
    e.preventDefault();
    if (!deliverableForm.file_url) {
      alert('Please provide the download link / CDN URL');
      return;
    }

    setSubmittingDeliv(true);
    try {
      await deliverableService.create({
        task_id: dispatchTask.id,
        booking_id: dispatchTask.booking_id,
        title: deliverableForm.title,
        asset_type: deliverableForm.asset_type,
        file_url: deliverableForm.file_url,
        file_size: deliverableForm.file_size,
        editor_notes: deliverableForm.editor_notes,
      });

      const res = await deliverableService.getByTask(dispatchTask.id);
      setTaskDeliverables(res.data.data);
      setDeliverableForm({ ...deliverableForm, file_url: '', title: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to dispatch file');
    } finally {
      setSubmittingDeliv(false);
    }
  };

  if (loading) return <Loader message="Loading editor queue..." />;

  const getPriorityBadge = (p) => {
    const map = { urgent: 'bg-danger text-white', high: 'bg-warning text-dark', medium: 'bg-info text-dark', low: 'bg-secondary text-white' };
    return <span className={`badge ${map[p] || 'bg-light text-dark'} text-uppercase`}>{p}</span>;
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Editor Post-Production & Client Delivery Suite</h4>
        <p className="text-muted small mb-0">Retouch media, generate JPG/PNG/PDF/Video exports, and dispatch directly via WhatsApp</p>
      </div>

      {/* 4 Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <span className="text-muted small">Pending Tasks</span>
            <h3 className="fw-bold text-dark my-1">{metrics.pending_tasks}</h3>
            <small className="text-muted">In retouch queue</small>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <span className="text-muted small">Urgent Priority</span>
            <h3 className="fw-bold text-danger my-1">{metrics.urgent_tasks}</h3>
            <small className="text-muted">Immediate turnaround</small>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <span className="text-muted small">Ready for QC</span>
            <h3 className="fw-bold text-warning my-1">{metrics.ready_for_qc}</h3>
            <small className="text-muted">Inspection required</small>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <span className="text-muted small">Approved & Delivered</span>
            <h3 className="fw-bold text-success my-1">{metrics.approved_tasks}</h3>
            <small className="text-muted">Completed projects</small>
          </div>
        </div>
      </div>

      {/* Task Queue Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
          <span><i className="bi bi-list-task text-info me-2"></i>My Post-Production Queue</span>
          <span className="badge bg-light text-dark border">{tasks.length} Active Tasks</span>
        </div>
        <div className="card-body p-0">
          {tasks.length === 0 ? (
            <EmptyState icon="bi-check-all" title="Queue Empty" message="No pending retouches or edits." />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Task Name</th>
                    <th>Shoot Session</th>
                    <th>Client</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Pipeline Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark">{t.task_name}</div>
                        {t.qc_notes && <small className="text-danger d-block">QC Note: {t.qc_notes}</small>}
                      </td>
                      <td><code>{t.session_code}</code></td>
                      <td>{t.customer_name}</td>
                      <td>{getPriorityBadge(t.priority)}</td>
                      <td className="small text-muted">{new Date(t.due_date).toLocaleDateString()}</td>
                      <td><StatusBadge status={t.status} /></td>
                      <td className="text-end pe-4">
                        <div className="btn-group">
                          {t.status === 'queued' && (
                            <button className="btn btn-sm btn-primary" onClick={() => handleUpdateStatus(t.id, 'in_progress')}>
                              Start Editing
                            </button>
                          )}
                          {t.status === 'in_progress' && (
                            <button className="btn btn-sm btn-warning" onClick={() => handleUpdateStatus(t.id, 'qc_review')}>
                              Submit for QC
                            </button>
                          )}
                          {t.status === 'qc_review' && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => {
                                setActionTask(t);
                                setNotes(t.qc_notes || '');
                              }}
                            >
                              QC Sign-Off
                            </button>
                          )}
                          {/* Deliverable & WhatsApp Button Available for all working tasks */}
                          <button
                            className="btn btn-sm btn-outline-success ms-1"
                            title="Dispatch Finished JPG/PNG/PDF or WhatsApp link"
                            onClick={() => handleOpenDispatch(t)}
                          >
                            <i className="bi bi-whatsapp me-1"></i>Deliver Files
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* QC Signoff Modal */}
      {actionTask && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Quality Check Sign-Off</h5>
                <button type="button" className="btn-close" onClick={() => setActionTask(null)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="small text-muted mb-3">
                  Confirm that the color grading, skin tones, and exports adhere to Raja Studio standards.
                </p>
                <div className="mb-0">
                  <label className="form-label small fw-semibold">Sign-Off Notes</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="e.g. Skin tones calibrated, 300 DPI print files verified..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer bg-light d-flex justify-content-between">
                <button className="btn btn-outline-danger" onClick={() => handleUpdateStatus(actionTask.id, 'revisions_needed', notes)}>
                  Request Revision
                </button>
                <button className="btn btn-success" onClick={() => handleUpdateStatus(actionTask.id, 'approved', notes)}>
                  <i className="bi bi-check-circle-fill me-1"></i>Approve & Deliver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Format & WhatsApp Delivery Hub Modal */}
      {dispatchTask && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-dark text-white">
                <div>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-cloud-arrow-up-fill text-info me-2"></i>
                    Deliverable Dispatch Hub
                  </h5>
                  <small className="text-white-50">
                    Client: {dispatchTask.customer_name} &bull; Booking #{dispatchTask.booking_number}
                  </small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setDispatchTask(null)}></button>
              </div>

              <div className="modal-body p-4">
                {/* Form to attach finished files */}
                <div className="p-3 bg-light rounded border mb-4">
                  <h6 className="fw-bold small text-uppercase mb-3">Attach Finished Deliverable File</h6>
                  <form onSubmit={handleCreateDeliverable}>
                    <div className="row g-2 mb-2">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Deliverable Title *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          required
                          placeholder="e.g. Edited Wedding Album (40 Pages)"
                          value={deliverableForm.title}
                          onChange={(e) => setDeliverableForm({ ...deliverableForm, title: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">File Format *</label>
                        <select
                          className="form-select form-select-sm"
                          value={deliverableForm.asset_type}
                          onChange={(e) => setDeliverableForm({ ...deliverableForm, asset_type: e.target.value })}
                        >
                          <option value="JPG Image">JPG Image (High-Res Photo)</option>
                          <option value="PNG Transparent">PNG Image (Transparent / Cutout)</option>
                          <option value="PDF Document / Album">PDF Printable Album / Document</option>
                          <option value="DOC / Word File">DOC / Word Agreement / Spec</option>
                          <option value="Video (MP4 / Link)">Video (MP4 / Google Drive / Vimeo)</option>
                          <option value="ZIP Archive">ZIP Compressed Master Archive</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-md-8">
                        <label className="form-label small fw-semibold">Download Link / Cloud Storage URL *</label>
                        <input
                          type="url"
                          className="form-control form-control-sm"
                          required
                          placeholder="https://drive.google.com/... or CDN URL or Cloudinary"
                          value={deliverableForm.file_url}
                          onChange={(e) => setDeliverableForm({ ...deliverableForm, file_url: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">File Size / Spec</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. 45 MB / 300 DPI"
                          value={deliverableForm.file_size}
                          onChange={(e) => setDeliverableForm({ ...deliverableForm, file_size: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Editor Note</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Color corrected with warm skin tone profile"
                        value={deliverableForm.editor_notes}
                        onChange={(e) => setDeliverableForm({ ...deliverableForm, editor_notes: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-sm w-100 fw-semibold" disabled={submittingDeliv}>
                      {submittingDeliv ? 'Attaching & Syncing...' : 'Add Deliverable File'}
                    </button>
                  </form>
                </div>

                {/* List of Deliverables & Instant WhatsApp Action */}
                <h6 className="fw-bold small text-uppercase mb-2">Ready Deliverables for this Project:</h6>
                {loadingDelivs ? (
                  <Loader message="Loading files..." />
                ) : taskDeliverables.length === 0 ? (
                  <div className="text-center p-3 text-muted border rounded small">
                    No deliverables attached yet. Use the form above to attach files.
                  </div>
                ) : (
                  <div className="list-group list-group-flush border rounded">
                    {taskDeliverables.map((deliv) => {
                      let rawPhone = deliv.customer_phone ? deliv.customer_phone.replace(/\D/g, '') : '';
                      if (rawPhone.length === 10) rawPhone = '91' + rawPhone;
                      const waMsg = encodeURIComponent(
                        `Hello ${deliv.customer_name}! 📸✨\n\nYour edited deliverable "${deliv.title}" (${deliv.asset_type}) from Raja Studio is ready for download!\n\nAccess link: ${deliv.file_url}\n\nThank you for choosing Raja Studio!`
                      );
                      const waUrl = `https://api.whatsapp.com/send?phone=${rawPhone}&text=${waMsg}`;

                      return (
                        <div key={deliv.id} className="list-group-item p-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-dark text-white">{deliv.asset_type}</span>
                              <strong className="text-dark">{deliv.title}</strong>
                            </div>
                            <small className="text-muted d-block mt-1">
                              Size: {deliv.file_size} &bull; {deliv.editor_notes || 'Ready'}
                            </small>
                          </div>

                          <div className="d-flex gap-2">
                            <a
                              href={deliv.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-secondary"
                              title="Direct Preview"
                            >
                              <i className="bi bi-box-arrow-up-right"></i>
                            </a>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-success fw-semibold"
                            >
                              <i className="bi bi-whatsapp me-1"></i>Send via WhatsApp
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDispatchTask(null)}>
                  Close Hub
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}