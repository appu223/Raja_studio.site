import { useState, useEffect } from 'react';
import { serviceCatalogService } from '../services/serviceService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Services() {
  const [tab, setTab] = useState('services'); // 'services' | 'packages'
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    code: '',
    description: '',
    base_price: '',
    duration_minutes: 60,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [srvRes, pkgRes] = await Promise.all([
        serviceCatalogService.getServices(),
        serviceCatalogService.getPackages(),
      ]);
      setServices(srvRes.data.data);
      setPackages(pkgRes.data.data);
    } catch (err) {
      console.error('Error fetching catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadTimer = setTimeout(() => loadData(), 0);
    return () => clearTimeout(loadTimer);
  }, []);

  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceForm({ name: '', code: '', description: '', base_price: '', duration_minutes: 60 });
    setShowServiceModal(true);
  };

  const handleOpenEditService = (srv) => {
    setEditingService(srv);
    setServiceForm({
      name: srv.name,
      code: srv.code,
      description: srv.description || '',
      base_price: srv.base_price,
      duration_minutes: srv.duration_minutes,
    });
    setShowServiceModal(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await serviceCatalogService.updateService(editingService.id, serviceForm);
      } else {
        await serviceCatalogService.createService(serviceForm);
      }
      setShowServiceModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await serviceCatalogService.toggleService(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Services & Packages Catalog</h4>
          <p className="text-muted small mb-0">Configure photography services, pricing rates, and bundled packages</p>
        </div>
        {tab === 'services' && (
          <button className="btn btn-primary" onClick={handleOpenCreateService}>
            <i className="bi bi-plus-circle me-2"></i>New Service
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-2 d-flex gap-2">
          <button
            className={`btn btn-sm ${tab === 'services' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setTab('services')}
          >
            <i className="bi bi-camera me-1"></i> Individual Services ({services.length})
          </button>
          <button
            className={`btn btn-sm ${tab === 'packages' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setTab('packages')}
          >
            <i className="bi bi-box-seam me-1"></i> Bundled Packages ({packages.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Loading service catalog..." />
      ) : tab === 'services' ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {services.length === 0 ? (
              <EmptyState title="No Services Defined" message="Create services to start accepting studio bookings." />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Code</th>
                      <th>Service Name</th>
                      <th>Duration</th>
                      <th>Base Rate</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id}>
                        <td className="ps-4">
                          <code>{s.code}</code>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{s.name}</div>
                          <small className="text-muted">{s.description || 'No description provided'}</small>
                        </td>
                        <td>{s.duration_minutes ? `${s.duration_minutes} mins` : 'Flexible'}</td>
                        <td>
                          <span className="fw-bold text-dark">
                            ₹{Number(s.base_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`btn btn-sm ${s.is_active ? 'btn-outline-success' : 'btn-outline-secondary'}`}
                            style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                            onClick={() => handleToggleActive(s.id)}
                          >
                            {s.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="text-end pe-4">
                          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleOpenEditService(s)}>
                            <i className="bi bi-pencil"></i>
                          </button>
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
        /* Packages View */
        <div className="row g-3">
          {packages.length === 0 ? (
            <div className="col-12">
              <EmptyState title="No Packages Available" message="Bundled packages help clients choose predefined combos." />
            </div>
          ) : (
            packages.map((pkg) => (
              <div className="col-md-6" key={pkg.id}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-primary bg-opacity-10 text-primary mb-2"><code>{pkg.code}</code></span>
                        <h5 className="fw-bold mb-1">{pkg.name}</h5>
                      </div>
                      <h4 className="fw-bold text-success mb-0">
                        ₹{Number(pkg.package_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </h4>
                    </div>
                    <p className="text-muted small mb-3">{pkg.description}</p>
                    <div className="p-3 bg-light rounded border">
                      <div className="text-muted small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                        Included Services:
                      </div>
                      <ul className="list-unstyled mb-0 small">
                        {pkg.items?.map((item) => (
                          <li key={item.service_id} className="d-flex justify-content-between py-1 border-bottom">
                            <span><i className="bi bi-check2-circle text-success me-2"></i>{item.name}</span>
                            <span className="text-muted">Qty: {item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Service Create/Edit Modal */}
      {showServiceModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleSaveService}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">{editingService ? 'Edit Service' : 'Add New Service'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowServiceModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Service Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Candid Wedding Photography"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Service Code</label>
                      <input
                        type="text"
                        className="form-control"
                        disabled={!!editingService}
                        placeholder="Auto-generated if empty"
                        value={serviceForm.code}
                        onChange={(e) => setServiceForm({ ...serviceForm, code: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Base Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        required
                        placeholder="25000"
                        value={serviceForm.base_price}
                        onChange={(e) => setServiceForm({ ...serviceForm, base_price: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Estimated Duration (Minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={serviceForm.duration_minutes}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: e.target.value })}
                    />
                  </div>
                  <div className="mb-0">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      placeholder="Equipment provided, outputs, etc."
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowServiceModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Service</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}