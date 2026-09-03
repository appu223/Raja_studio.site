import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Administration() {
  const [tab, setTab] = useState('users'); // 'users' | 'audit'
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // New User Modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    role_id: '3', // Photographer by default
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    designation: 'Staff Photographer',
    skills: '',
  });
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [uRes, rRes, aRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getRoles(),
        adminService.getAuditLogs(),
      ]);
      setUsers(uRes.data.data);
      setRoles(rRes.data.data);
      setAuditLogs(aRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setErrorMsg('');
    try {
      await adminService.createUser(userForm);
      setShowUserModal(false);
      setUserForm({
        role_id: '3',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        designation: 'Staff Photographer',
        skills: '',
      });
      loadAdminData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error provisioning account');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleUser = async (id) => {
    try {
      await adminService.toggleStatus(id);
      loadAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Status toggle failed');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">System Administration & Access Control</h4>
          <p className="text-muted small mb-0">Manage studio staff accounts, role permissions, and immutable security audit trails</p>
        </div>
        {tab === 'users' && (
          <button className="btn btn-primary" onClick={() => setShowUserModal(true)}>
            <i className="bi bi-person-plus-fill me-2"></i>Provision Staff User
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-2 d-flex gap-2">
          <button
            className={`btn btn-sm ${tab === 'users' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setTab('users')}
          >
            <i className="bi bi-people-fill me-1"></i> Staff Directory & RBAC ({users.length})
          </button>
          <button
            className={`btn btn-sm ${tab === 'audit' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setTab('audit')}
          >
            <i className="bi bi-shield-check me-1"></i> Security Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Loading administrative ledger..." />
      ) : tab === 'users' ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Staff Member</th>
                    <th>Role</th>
                    <th>Designation & Skills</th>
                    <th>Contact Phone</th>
                    <th>Account Status</th>
                    <th className="text-end pe-4">Access Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">{u.first_name} {u.last_name}</div>
                        <small className="text-muted">{u.email}</small>
                      </td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1">
                          {u.role_name}
                        </span>
                      </td>
                      <td>
                        <div className="small fw-semibold text-dark">{u.designation || 'Staff'}</div>
                        <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                          {u.skills || 'General operations'}
                        </small>
                      </td>
                      <td className="small text-muted">{u.phone || '—'}</td>
                      <td>
                        <span className={`badge ${u.status === 'active' ? 'bg-success' : 'bg-danger'} text-uppercase`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className={`btn btn-sm ${u.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => handleToggleUser(u.id)}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {auditLogs.length === 0 ? (
              <EmptyState icon="bi-shield" title="Audit Log Clean" message="System mutations and security events will log here." />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Timestamp</th>
                      <th>Action</th>
                      <th>Target Entity</th>
                      <th>Performed By</th>
                      <th>Details</th>
                      <th className="text-end pe-4">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="ps-4 small text-muted">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            <code>{log.action}</code>
                          </span>
                        </td>
                        <td><code>{log.entity_name} #{log.entity_id}</code></td>
                        <td>
                          <span className="fw-semibold text-dark">
                            {log.first_name ? `${log.first_name} (${log.role_name})` : 'System'}
                          </span>
                        </td>
                        <td className="small text-muted">{log.details || '—'}</td>
                        <td className="text-end pe-4 small text-muted">{log.ip_address || '127.0.0.1'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showUserModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleCreateUser}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Provision Studio Account</h5>
                  <button type="button" className="btn-close" onClick={() => setShowUserModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  {errorMsg && <div className="alert alert-danger py-2 small">{errorMsg}</div>}

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">First Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={userForm.first_name}
                        onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Last Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={userForm.last_name}
                        onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Temporary Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        required
                        placeholder="••••••••"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">System Authority Role *</label>
                      <select
                        className="form-select"
                        value={userForm.role_id}
                        onChange={(e) => setUserForm({ ...userForm, role_id: e.target.value })}
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} — {r.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-0">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Studio Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Lead Drone Specialist"
                        value={userForm.designation}
                        onChange={(e) => setUserForm({ ...userForm, designation: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Specialist Skills</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Gimbal, 4K Cinema, Lightroom"
                        value={userForm.skills}
                        onChange={(e) => setUserForm({ ...userForm, skills: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowUserModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={creating}>
                    {creating ? 'Hashing & Provisioning...' : 'Provision User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}