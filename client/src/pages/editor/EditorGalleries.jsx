import { useState, useEffect } from 'react';
import { galleryService } from '../../services/galleryService';
import { bookingService } from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

export default function EditorGalleries() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Album Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [creating, setCreating] = useState(false);

  // Darkroom Asset Ingestion Modal
  const [activeGallery, setActiveGallery] = useState(null);
  const [batchUrls, setBatchUrls] = useState('');
  const [addingPhotos, setAddingPhotos] = useState(false);
  const [inspectPhoto, setInspectPhoto] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  const loadGalleries = async () => {
    try {
      setLoading(true);
      const res = await galleryService.getAll();
      setGalleries(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleries();
  }, []);

  const handleOpenCreateModal = async () => {
    try {
      const res = await bookingService.getAll('');
      setBookings(res.data.data);
      setSelectedBooking('');
      setGalleryTitle('');
      setShowCreateModal(true);
    } catch (err) {
      alert('Could not fetch active bookings');
    }
  };

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await galleryService.create({
        booking_id: parseInt(selectedBooking, 10),
        title: galleryTitle,
      });
      setShowCreateModal(false);
      loadGalleries();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating gallery');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenDarkroom = async (galleryId) => {
    try {
      const res = await galleryService.getById(galleryId);
      setActiveGallery(res.data.data);
      setBatchUrls('');
      setCopySuccess('');
    } catch (err) {
      alert('Failed to load gallery assets');
    }
  };

  // Batch Image URL Ingestion
  const handleBatchAddPhotos = async (e) => {
    e.preventDefault();
    if (!batchUrls.trim()) return;

    // Parse one or multiple URLs separated by newlines or commas
    const urlList = batchUrls
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http'));

    if (urlList.length === 0) {
      alert('Please enter valid HTTP/HTTPS image URLs');
      return;
    }

    setAddingPhotos(true);
    try {
      const payload = urlList.map((url, idx) => ({
        original_filename: `RET-${Date.now().toString().slice(-4)}-${idx + 1}.jpg`,
        storage_url: url,
        thumbnail_url: url,
        is_cover: (activeGallery.photos?.length === 0 && idx === 0),
      }));

      await galleryService.addPhotos(activeGallery.id, payload);
      const updated = await galleryService.getById(activeGallery.id);
      setActiveGallery(updated.data.data);
      setBatchUrls('');
      loadGalleries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to ingest photos');
    } finally {
      setAddingPhotos(false);
    }
  };

  const handleSetCover = async (photoId) => {
    try {
      await galleryService.setCover(activeGallery.id, photoId);
      const updated = await galleryService.getById(activeGallery.id);
      setActiveGallery(updated.data.data);
      loadGalleries();
    } catch (err) {
      alert('Error updating cover asset');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await galleryService.deletePhoto(activeGallery.id, photoId);
      const updated = await galleryService.getById(activeGallery.id);
      setActiveGallery(updated.data.data);
      loadGalleries();
    } catch (err) {
      alert('Error removing asset');
    }
  };

  const handleCopyClientLink = (token) => {
    const publicUrl = `${window.location.origin}/gallery/view/${token}`;
    navigator.clipboard.writeText(publicUrl);
    setCopySuccess('Client link copied!');
    setTimeout(() => setCopySuccess(''), 2500);
  };

  return (
    <div className="text-dark">
      {/* Darkroom Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 p-4 rounded-3 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div>
          <span className="badge bg-info text-dark text-uppercase px-2 py-1 mb-2" style={{ letterSpacing: '1px' }}>
            <i className="bi bi-palette-fill me-1"></i> Post-Production Studio Darkroom
          </span>
          <h3 className="fw-bold mb-1">Editor Digital Gallery & Asset Curation</h3>
          <p className="mb-0 text-white-50 small">
            Batch-upload retouched photos, select high-res hero covers, and curate client-facing delivery albums.
          </p>
        </div>
        <button className="btn btn-info text-dark fw-bold text-nowrap" onClick={handleOpenCreateModal}>
          <i className="bi bi-folder-plus me-1"></i> New Studio Album
        </button>
      </div>

      {/* Gallery Showcase Grid */}
      {loading ? (
        <Loader message="Loading studio digital collections..." />
      ) : galleries.length === 0 ? (
        <EmptyState
          icon="bi-images"
          title="No Galleries In Production"
          message="Create an album for any booking to begin attaching color-graded retouches."
        />
      ) : (
        <div className="row g-4">
          {galleries.map((g) => (
            <div className="col-md-6 col-xl-4" key={g.id}>
              <div className="card h-100 border-0 shadow overflow-hidden" style={{ backgroundColor: '#1e293b', color: '#f8fafc' }}>
                <div
                  style={{
                    height: '210px',
                    backgroundColor: '#0f172a',
                    backgroundImage: g.cover_url ? `url(${g.cover_url})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                  className="d-flex flex-column justify-content-between p-3"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <span className="badge bg-dark bg-opacity-75 border border-secondary text-info">
                      <code>#{g.booking_number}</code>
                    </span>
                    <span className="badge bg-dark bg-opacity-75 text-white">
                      <i className="bi bi-camera me-1"></i> {g.photo_count} Retouched Photos
                    </span>
                  </div>
                  {!g.cover_url && (
                    <div className="text-center text-white-50 small py-4">
                      <i className="bi bi-image fs-1 d-block mb-1"></i>
                      No cover selected
                    </div>
                  )}
                </div>

                <div className="card-body p-3">
                  <h5 className="fw-bold mb-1 text-white text-truncate">{g.title}</h5>
                  <p className="text-white-50 small mb-3">
                    <i className="bi bi-person-circle me-1 text-info"></i>Client: {g.customer_name}
                  </p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-info text-dark fw-bold w-100"
                      onClick={() => handleOpenDarkroom(g.id)}
                    >
                      <i className="bi bi-sliders me-1"></i> Open In Darkroom
                    </button>
                    <button
                      className="btn btn-sm btn-outline-light"
                      title="Copy Public Delivery Link"
                      onClick={() => handleCopyClientLink(g.access_token)}
                    >
                      <i className="bi bi-link-45deg"></i>
                    </button>
                  </div>
                  {copySuccess && (
                    <div className="text-info small mt-2 text-center">{copySuccess}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Album Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleCreateGallery}>
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-folder-plus text-info me-2"></i>Initialize Client Album
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Target Booking *</label>
                    <select
                      className="form-select"
                      required
                      value={selectedBooking}
                      onChange={(e) => setSelectedBooking(e.target.value)}
                    >
                      <option value="">-- Select Booking --</option>
                      {bookings.map((b) => (
                        <option key={b.id} value={b.id}>
                          #{b.booking_number} — {b.customer_name} ({b.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-0">
                    <label className="form-label small fw-semibold">Album Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Traditional Wedding Ceremony Master Edit"
                      value={galleryTitle}
                      onChange={(e) => setGalleryTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm fw-semibold" disabled={creating}>
                    {creating ? 'Creating Album...' : 'Create Album'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Full Darkroom Curation & Ingestion Drawer */}
      {activeGallery && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg text-white" style={{ backgroundColor: '#0f172a' }}>
              <div className="modal-header border-secondary d-flex justify-content-between align-items-center">
                <div>
                  <span className="badge bg-info text-dark mb-1">DARKROOM ASSET WORKSPACE</span>
                  <h4 className="modal-title fw-bold text-white mb-0">{activeGallery.title}</h4>
                  <small className="text-white-50">
                    Client: {activeGallery.customer_name} &bull; Booking #{activeGallery.booking_number} &bull; {activeGallery.photos?.length || 0} Assets Loaded
                  </small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setActiveGallery(null)}></button>
              </div>

              <div className="modal-body p-4">
                {/* Batch Ingestion Terminal */}
                <div className="p-3 rounded-3 mb-4 border border-secondary" style={{ backgroundColor: '#1e293b' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small fw-bold text-uppercase text-info">
                      <i className="bi bi-cloud-upload-fill me-1"></i> Batch Ingest Retouched Asset URLs
                    </span>
                    <small className="text-white-50">Paste one or multiple URLs (separated by new lines)</small>
                  </div>
                  <form onSubmit={handleBatchAddPhotos}>
                    <div className="mb-2">
                      <textarea
                        rows="3"
                        className="form-control font-monospace small bg-dark text-white border-secondary"
                        placeholder="https://images.unsplash.com/...&#10;https://drive.google.com/..."
                        value={batchUrls}
                        onChange={(e) => setBatchUrls(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-white-50">Supports Unsplash, Cloudinary, AWS S3, or CDN links</small>
                      <button type="submit" className="btn btn-sm btn-info text-dark fw-bold px-3" disabled={addingPhotos}>
                        {addingPhotos ? 'Ingesting Assets...' : 'Ingest Assets Into Gallery'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Asset Grid */}
                <h6 className="fw-bold text-uppercase small text-white-50 mb-3">
                  Gallery Asset Matrix ({activeGallery.photos?.length || 0} items)
                </h6>

                {activeGallery.photos?.length === 0 ? (
                  <div className="text-center py-5 border border-secondary rounded-3 text-white-50" style={{ backgroundColor: '#1e293b' }}>
                    <i className="bi bi-images fs-1 d-block mb-2 text-secondary"></i>
                    <h6>No photos loaded in this darkroom</h6>
                    <p className="small mb-0">Paste image URLs above to add retouches for this client.</p>
                  </div>
                ) : (
                  <div className="row g-3" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                    {activeGallery.photos?.map((photo) => (
                      <div className="col-sm-6 col-md-4 col-lg-3" key={photo.id}>
                        <div className="rounded-3 overflow-hidden border border-secondary position-relative" style={{ backgroundColor: '#1e293b' }}>
                          <img
                            src={photo.storage_url}
                            alt={photo.original_filename}
                            style={{ height: '150px', width: '100%', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => setInspectPhoto(photo)}
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/400x300/1e293b/ffffff?text=Asset+Offline';
                            }}
                          />

                          {photo.is_cover === 1 && (
                            <span className="position-absolute top-0 start-0 m-2 badge bg-warning text-dark shadow fw-bold">
                              ★ HERO COVER
                            </span>
                          )}

                          <div className="p-2 d-flex justify-content-between align-items-center bg-dark">
                            <span className="small text-truncate text-white-50" style={{ maxWidth: '110px' }}>
                              {photo.original_filename}
                            </span>
                            <div className="d-flex gap-1">
                              {photo.is_cover !== 1 && (
                                <button
                                  className="btn btn-sm btn-outline-warning py-0 px-2"
                                  title="Set as Hero Cover"
                                  onClick={() => handleSetCover(photo.id)}
                                >
                                  ★
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-info py-0 px-2"
                                title="Inspect Fullscreen"
                                onClick={() => setInspectPhoto(photo)}
                              >
                                <i className="bi bi-arrows-fullscreen"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger py-0 px-2"
                                title="Remove Asset"
                                onClick={() => handleDeletePhoto(photo.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer border-secondary d-flex justify-content-between bg-dark">
                <button
                  type="button"
                  className="btn btn-outline-info btn-sm fw-semibold"
                  onClick={() => handleCopyClientLink(activeGallery.access_token)}
                >
                  <i className="bi bi-link-45deg me-1"></i> Copy Client Share Link
                </button>
                <button type="button" className="btn btn-light btn-sm fw-bold px-4" onClick={() => setActiveGallery(null)}>
                  Close Darkroom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Asset Inspector */}
      {inspectPhoto && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 10000 }}
          onClick={() => setInspectPhoto(null)}
        >
          <button
            className="btn btn-light position-absolute top-0 end-0 m-4 rounded-circle"
            onClick={() => setInspectPhoto(null)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
          <img
            src={inspectPhoto.storage_url}
            alt={inspectPhoto.original_filename}
            style={{ maxWidth: '92%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px' }}
          />
        </div>
      )}
    </div>
  );
}