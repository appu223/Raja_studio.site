import { useState, useEffect } from 'react';
import { inventoryService } from '../services/inventoryService';
import { shootService } from '../services/shootService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Inventory() {
  const [tab, setTab] = useState('equipment'); // 'equipment' | 'logs'
  const [equipmentList, setEquipmentList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Equipment Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [eqForm, setEqForm] = useState({
    name: '',
    category: 'Camera Body',
    asset_tag: '',
    serial_number: '',
    condition_status: 'operational',
  });

  // Checkout Modal
  const [checkoutTarget, setCheckoutTarget] = useState(null);
  const [checkoutUserId, setCheckoutUserId] = useState('');
  const [checkoutSessionId, setCheckoutSessionId] = useState('');
  const [checkoutNote, setCheckoutNote] = useState('Clean lens and full battery');

  // Checkin Modal
  const [checkinTarget, setCheckinTarget] = useState(null);
  const [checkinCondition, setCheckinCondition] = useState('Good condition, cleaned');
  const [checkinStatus, setCheckinStatus] = useState('operational');

  const loadData = async () => {
    try {
      setLoading(true);
      const [eqRes, trRes, stRes, seRes] = await Promise.all([
        inventoryService.getEquipment(),
        inventoryService.getTransactions(),
        shootService.getStaff(),
        shootService.getAll(''),
      ]);
      setEquipmentList(eqRes.data.data);
      setTransactions(trRes.data.data);
      setStaffList(stRes.data.data);
      setSessions(seRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEquipment = async (e) => {
    e.preventDefault();
    try {
      await inventoryService.createEquipment(eqForm);
      setShowAddModal(false);
      setEqForm({ name: '', category: 'Camera Body', asset_tag: '', serial_number: '', condition_status: 'operational' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add equipment');
    }
  };

  const handleConfirmCheckout = async (e) => {
    e.preventDefault();
    try {
      await inventoryService.checkout({
        equipment_id: checkoutTarget.id,
        issued_to_user_id: parseInt(checkoutUserId, 10),
        session_id: checkoutSessionId ? parseInt(checkoutSessionId, 10) : null,
        condition_note: checkoutNote,
      });
      setCheckoutTarget(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    }
  };

  const handleConfirmCheckin = async (e) => {
    e.preventDefault();
    try {
      await inventoryService.checkin({
        equipment_id: checkinTarget.id,
        condition_on_checkin: checkinCondition,
        condition_status: checkinStatus,
      });
      setCheckinTarget(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    }
  };

  const getConditionBadge = (status) => {
    if (status === 'operational') return <span className="badge bg-success bg-opacity-10 text-success border">Operational</span>;
    if (status === 'maintenance_required') return <span className="badge bg-warning bg-opacity-10 text-dark border">Needs Service</span>;
    return <span className="badge bg-danger text-white">Retired</span>;
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Equipment Inventory & Gear Tracking</h4>
          <p className="text-muted small mb-0">Control cameras, lenses, lighting kits, drone assets, and check-out logs</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>Register New Gear
        </button>
      </div>

      {/* Tabs */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-2 d-flex gap-2">
          <button
            className={`btn btn-sm ${tab === 'equipment' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setTab('equipment')}
          >
            <i className="bi bi-box-seam me-1"></i> Gear Registry ({equipmentList.length})
          </button>
          <button
            className={`btn btn-sm ${tab === 'logs' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setTab('logs')}
          >
            <i className="bi bi-clock-history me-1"></i> Checkout & Return History ({transactions.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Loading equipment inventory..." />
      ) : tab === 'equipment' ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {equipmentList.length === 0 ? (
              <EmptyState icon="bi-camera" title="No Equipment Registered" message="Register studio cameras and gear to begin issuing to crew." />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Asset Tag</th>
                      <th>Equipment Description</th>
                      <th>Category</th>
                      <th>Serial #</th>
                      <th>Condition</th>
                      <th>Availability</th>
                      <th className="text-end pe-4">Dispatch Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentList.map((eq) => (
                      <tr key={eq.id}>
                        <td className="ps-4">
                          <code>{eq.asset_tag}</code>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{eq.name}</div>
                        </td>
                        <td>
                          <span className="badge bg-light text-secondary border">{eq.category}</span>
                        </td>
                        <td className="small text-muted">{eq.serial_number || '—'}</td>
                        <td>{getConditionBadge(eq.condition_status)}</td>
                        <td>
                          {eq.is_checked_out ? (
                            <span className="badge bg-danger bg-opacity-10 text-danger border">
                              <i className="bi bi-arrow-right-circle me-1"></i>Checked out to {eq.checked_out_to}
                            </span>
                          ) : (
                            <span className="badge bg-success bg-opacity-10 text-success border">
                              <i className="bi bi-check2 me-1"></i>In Studio Locker
                            </span>
                          )}
                        </td>
                        <td className="text-end pe-4">
                          {eq.is_checked_out ? (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => {
                                setCheckinTarget(eq);
                                setCheckinCondition('Good condition, cleaned');
                                setCheckinStatus('operational');
                              }}
                            >
                              <i className="bi bi-box-arrow-in-down me-1"></i>Return Gear
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              disabled={eq.condition_status === 'retired'}
                              onClick={() => {
                                setCheckoutTarget(eq);
                                setCheckoutUserId(staffList[0]?.id || '');
                                setCheckoutSessionId('');
                              }}
                            >
                              <i className="bi bi-box-arrow-up-right me-1"></i>Issue Out
                            </button>
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
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {transactions.length === 0 ? (
              <EmptyState icon="bi-clock" title="No Checkout Logs" message="Equipment dispatch logs will record here when gear is issued." />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Asset</th>
                      <th>Issued To Crew</th>
                      <th>Shoot Session</th>
                      <th>Checked Out At</th>
                      <th>Returned At</th>
                      <th>Condition On Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tr) => (
                      <tr key={tr.id}>
                        <td className="ps-4">
                          <div className="fw-semibold text-dark">{tr.equipment_name}</div>
                          <small className="text-muted">{tr.asset_tag}</small>
                        </td>
                        <td>
                          <i className="bi bi-person-fill text-primary me-1"></i>
                          {tr.first_name} {tr.last_name}
                        </td>
                        <td>
                          {tr.session_code ? (
                            <span className="badge bg-light text-dark border"><code>{tr.session_code}</code></span>
                          ) : (
                            <span className="text-muted small">In-Studio / Misc</span>
                          )}
                        </td>
                        <td className="small text-muted">{new Date(tr.checkout_time).toLocaleString()}</td>
                        <td className="small text-muted">
                          {tr.checkin_time ? new Date(tr.checkin_time).toLocaleString() : <span className="badge bg-danger">Open</span>}
                        </td>
                        <td className="small text-muted">{tr.condition_on_checkin || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleCreateEquipment}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Register Studio Equipment</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Equipment Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Sony A7 IV Camera Body"
                      value={eqForm.name}
                      onChange={(e) => setEqForm({ ...eqForm, name: e.target.value })}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Category *</label>
                      <select
                        className="form-select"
                        value={eqForm.category}
                        onChange={(e) => setEqForm({ ...eqForm, category: e.target.value })}
                      >
                        <option value="Camera Body">Camera Body</option>
                        <option value="Lens">Lens</option>
                        <option value="Lighting">Lighting</option>
                        <option value="Audio">Audio</option>
                        <option value="Drone">Drone</option>
                        <option value="Stabilizer / Grip">Stabilizer / Grip</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Asset Tag Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Auto-generated if blank"
                        value={eqForm.asset_tag}
                        onChange={(e) => setEqForm({ ...eqForm, asset_tag: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-0">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Serial Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="SN-XXXXXXX"
                        value={eqForm.serial_number}
                        onChange={(e) => setEqForm({ ...eqForm, serial_number: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Initial Condition</label>
                      <select
                        className="form-select"
                        value={eqForm.condition_status}
                        onChange={(e) => setEqForm({ ...eqForm, condition_status: e.target.value })}
                      >
                        <option value="operational">Operational</option>
                        <option value="maintenance_required">Maintenance Required</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Equipment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutTarget && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleConfirmCheckout}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Issue Equipment: {checkoutTarget.name}</h5>
                  <button type="button" className="btn-close" onClick={() => setCheckoutTarget(null)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Issue To Crew Member *</label>
                    <select
                      className="form-select"
                      required
                      value={checkoutUserId}
                      onChange={(e) => setCheckoutUserId(e.target.value)}
                    >
                      {staffList.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.first_name} {st.last_name} ({st.role_name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Linked Shoot Session (Optional)</label>
                    <select
                      className="form-select"
                      value={checkoutSessionId}
                      onChange={(e) => setCheckoutSessionId(e.target.value)}
                    >
                      <option value="">-- General / In-Studio Use --</option>
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.session_code} — {s.customer_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-0">
                    <label className="form-label small fw-semibold">Condition Note on Checkout</label>
                    <input
                      type="text"
                      className="form-control"
                      value={checkoutNote}
                      onChange={(e) => setCheckoutNote(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setCheckoutTarget(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Confirm Issue</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Checkin Return Modal */}
      {checkinTarget && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleConfirmCheckin}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Return Gear: {checkinTarget.name}</h5>
                  <button type="button" className="btn-close" onClick={() => setCheckinTarget(null)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Condition Upon Return *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Lens clean, sensors clean, battery recharged"
                      value={checkinCondition}
                      onChange={(e) => setCheckinCondition(e.target.value)}
                    />
                  </div>

                  <div className="mb-0">
                    <label className="form-label small fw-semibold">Return Status</label>
                    <select
                      className="form-select"
                      value={checkinStatus}
                      onChange={(e) => setCheckinStatus(e.target.value)}
                    >
                      <option value="operational">Operational (Ready for Locker)</option>
                      <option value="maintenance_required">Maintenance Required (Damage / Cleaning)</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setCheckinTarget(null)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Complete Check-in</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}