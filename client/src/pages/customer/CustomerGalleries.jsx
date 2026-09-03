import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerPortalService } from '../../services/customerPortalService';
import { deliverableService } from '../../services/deliverableService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

export default function CustomerGalleries() {
  const [galleries, setGalleries] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      customerPortalService.getGalleries(),
      deliverableService.getMyFiles(),
    ])
      .then(([gRes, dRes]) => {
        setGalleries(gRes.data.data);
        setDeliverables(dRes.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader message="Loading your media & deliverables..." />;

  const getFileIcon = (type) => {
    if (type.includes('PDF')) return 'bi-file-earmark-pdf-fill text-danger';
    if (type.includes('DOC')) return 'bi-file-earmark-word-fill text-primary';
    if (type.includes('Video')) return 'bi-file-earmark-play-fill text-warning';
    if (type.includes('ZIP')) return 'bi-file-earmark-zip-fill text-secondary';
    return 'bi-file-earmark-image-fill text-success';
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">My Digital Deliverables & Media Vault</h4>
        <p className="text-muted small mb-0">High-resolution photo albums, printable PDFs, transparent PNGs, and video masters</p>
      </div>

      {/* Section 1: Delivered Files (JPG / PNG / PDF / DOC / Video) */}
      <h6 className="fw-bold mb-3">
        <i className="bi bi-cloud-arrow-down-fill text-primary me-2"></i>
        Delivered Files & Documents ({deliverables.length})
      </h6>

      {deliverables.length === 0 ? (
        <div className="card border-0 shadow-sm p-4 text-center mb-4 bg-white">
          <i className="bi bi-inbox text-muted" style={{ fontSize: '2.5rem' }}></i>
          <h6 className="fw-bold mt-2">No individual file dispatches yet</h6>
          <p className="text-muted small mb-0">When your editor uploads individual PDF albums or high-res JPG files, they will appear here.</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Deliverable File</th>
                    <th>Format</th>
                    <th>Size / Quality</th>
                    <th>Editor Notes</th>
                    <th>Delivered Date</th>
                    <th className="text-end pe-4">Download Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deliverables.map((d) => (
                    <tr key={d.id}>
                      <td className="ps-4">
                        <i className={`bi ${getFileIcon(d.asset_type)} fs-5 me-2`}></i>
                        <strong className="text-dark">{d.title}</strong>
                        <small className="text-muted d-block">Booking #{d.booking_number}</small>
                      </td>
                      <td><span className="badge bg-light text-dark border">{d.asset_type}</span></td>
                      <td className="small text-muted">{d.file_size}</td>
                      <td className="small text-muted">{d.editor_notes || '—'}</td>
                      <td className="small text-muted">{new Date(d.created_at).toLocaleDateString()}</td>
                      <td className="text-end pe-4">
                        <a
                          href={d.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-primary fw-semibold"
                        >
                          <i className="bi bi-download me-1"></i>Download File
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Online Galleries */}
      <h6 className="fw-bold mb-3">
        <i className="bi bi-images text-info me-2"></i>
        Online Photo Collections ({galleries.length})
      </h6>

      {galleries.length === 0 ? (
        <EmptyState
          icon="bi-images"
          title="No Published Albums Yet"
          message="Once the studio editors complete color grading, your web gallery will be ready here."
        />
      ) : (
        <div className="row g-4">
          {galleries.map((g) => (
            <div className="col-md-6 col-lg-4" key={g.id}>
              <div className="card h-100 border-0 shadow-sm overflow-hidden">
                <div
                  style={{
                    height: '180px',
                    backgroundColor: '#cbd5e1',
                    backgroundImage: g.cover_url ? `url(${g.cover_url})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  className="d-flex align-items-end justify-content-end p-2"
                >
                  <span className="badge bg-dark bg-opacity-75 text-white">
                    <i className="bi bi-camera me-1"></i> {g.photo_count} Photos
                  </span>
                </div>
                <div className="card-body p-4">
                  <span className="badge bg-light text-dark border mb-2"><code>#{g.booking_number}</code></span>
                  <h5 className="fw-bold mb-2">{g.title}</h5>
                  <Link
                    to={`/gallery/view/${g.access_token}`}
                    target="_blank"
                    className="btn btn-primary w-100 fw-semibold"
                  >
                    <i className="bi bi-eye-fill me-2"></i>Open Fullscreen Gallery
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}