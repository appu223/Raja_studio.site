import { useState, useEffect } from 'react';
import { galleryService, getMediaUrl } from '../services/galleryService';
import { bookingService } from '../services/bookingService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Galleries() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Creation modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [creating, setCreating] = useState(false);

  // Photo Management Modal
  const [activeGallery, setActiveGallery] = useState(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoFilename, setNewPhotoFilename] = useState('');
  const [newPhotoFiles, setNewPhotoFiles] = useState([]);
  const [addingPhoto, setAddingPhoto] = useState(false);
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
    const loadTimer = setTimeout(() => loadGalleries(), 0);
    return () => clearTimeout(loadTimer);
  }, []);

  const handleOpenCreate = async () => {
    try {
      const res = await bookingService.getAll('');
      setBookings(res.data.data);
      setSelectedBooking('');
      setGalleryTitle('');
      setShowCreateModal(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not load bookings');
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
      alert(err.response?.data?.message || 'Failed to create gallery');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenPhotoManager = async (galleryId) => {
    try {
      const res = await galleryService.getById(galleryId);
      setActiveGallery(res.data.data);
      setCopySuccess('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load photos');
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newPhotoUrl && newPhotoFiles.length === 0) return;
    const maxFileSize = 200 * 1024 * 1024 * 1024;
    if (newPhotoFiles.some((file) => !file.type.startsWith('image/') && !file.type.startsWith('video/'))) {
      alert('Only image and video files are supported');
      return;
    }
    if (newPhotoFiles.some((file) => file.size > maxFileSize)) {
      alert('Each file must be 200 GB or smaller');
      return;
    }
    setAddingPhoto(true);
    try {
      if (newPhotoFiles.length > 0) {
        await galleryService.uploadFiles(activeGallery.id, newPhotoFiles);
      } else {
        await galleryService.addPhotos(activeGallery.id, [{
          original_filename: newPhotoFilename || `Photo-${Date.now().toString().slice(-4)}.jpg`,
          storage_url: newPhotoUrl,
          thumbnail_url: newPhotoUrl,
          is_cover: activeGallery.photos?.length === 0,
        }]);
      }
      setNewPhotoUrl('');
      setNewPhotoFilename('');
      setNewPhotoFiles([]);
      const updated = await galleryService.getById(activeGallery.id);
      setActiveGallery(updated.data.data);
      loadGalleries();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding photo');
    } finally {
      setAddingPhoto(false);
    }
  };

  const handleSetCover = async (photoId) => {
    try {
      await galleryService.setCover(activeGallery.id, photoId);
      const updated = await galleryService.getById(activeGallery.id);
      setActiveGallery(updated.data.data);
      loadGalleries();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating cover');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await galleryService.deletePhoto(activeGallery.id, photoId);
      const updated = await galleryService.getById(activeGallery.id);
      setActiveGallery(updated.data.data);
      loadGalleries();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting photo');
    }
  };

  const copyPublicLink = (token) => {
    const publicUrl = `${window.location.origin}/gallery/view/${token}`;
    navigator.clipboard.writeText(publicUrl);
    setCopySuccess('Copied to clipboard!');
    setTimeout(() => setCopySuccess(''), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Digital Galleries & Client Delivery</h4>
          <p className="text-muted small mb-0">Publish online galleries, manage digital assets, and generate secure client access links</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <i className="bi bi-images me-2"></i>Create New Gallery
        </button>
      </div>

      {/* Gallery Cards */}
      {loading ? (
        <Loader message="Loading studio albums..." />
      ) : galleries.length === 0 ? (
        <EmptyState
          icon="bi-images"
          title="No Digital Galleries"
          message="Create an album for any booking to begin attaching retouched photos for client viewing."
        />
      ) : (
        <div className="row g-4">
          {galleries.map((g) => (
            <div className="col-md-6 col-xl-4" key={g.id}>
              <div className="card h-100 border-0 shadow-sm overflow-hidden">
                <div
                  style={{
                    height: '180px',
                    backgroundColor: '#e2e8f0',
                    backgroundImage: g.cover_url ? `url(${getMediaUrl(g.cover_url)})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  className="d-flex align-items-end justify-content-end p-2"
                >
                  <span className="badge bg-dark bg-opacity-75 text-white">
                    <i className="bi bi-camera me-1"></i> {g.photo_count} Photos
                  </span>
                </div>
                <div className="card-body">
                  <span className="badge bg-light text-dark border mb-2">
                    <code>{g.booking_number}</code>
                  </span>
                  <h5 className="fw-bold mb-1">{g.title}</h5>
                  <p className="text-muted small mb-3">Client: {g.customer_name}</p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary w-100"
                      onClick={() => handleOpenPhotoManager(g.id)}
                    >
                      <i className="bi bi-folder2-open me-1"></i> Manage Photos
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      title="Copy Secure Client Link"
                      onClick={() => copyPublicLink(g.access_token)}
                    >
                      <i className="bi bi-link-45deg fs-6"></i>
                    </button>
                  </div>
                  {copySuccess && (
                    <div className="text-success small mt-2 text-center">{copySuccess}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Gallery Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleCreateGallery}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Create Digital Gallery</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
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
                      <option value="">-- Choose Booking --</option>
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
                      placeholder="e.g. Vikram & Ananya Wedding Highlights"
                      value={galleryTitle}
                      onChange={(e) => setGalleryTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={creating}>
                    {creating ? 'Generating Secure Token...' : 'Create Album'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Manage Photos Modal */}
      {activeGallery && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title fw-bold">{activeGallery.title}</h5>
                  <small className="text-muted">Client: {activeGallery.customer_name} • Booking #{activeGallery.booking_number}</small>
                </div>
                <button type="button" className="btn-close" onClick={() => setActiveGallery(null)}></button>
              </div>
              <div className="modal-body p-4">
                {/* Add Photo Form */}
                <div className="p-3 bg-light rounded border mb-4">
                  <h6 className="fw-bold mb-2 small text-uppercase">Attach Photo or Video Asset</h6>
                  <form onSubmit={handleAddPhoto} className="row g-2">
                    <div className="col-md-6">
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept="image/*,video/*"
                        multiple
                        onChange={(e) => setNewPhotoFiles(Array.from(e.target.files || []))}
                      />
                      <small className="text-muted">Images and videos up to 200 GB each</small>
                    </div>
                    <div className="col-md-4">
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        placeholder="Or paste a CDN / cloud URL"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Filename (optional)"
                        value={newPhotoFilename}
                        onChange={(e) => setNewPhotoFilename(e.target.value)}
                      />
                      <button type="submit" className="btn btn-sm btn-primary w-100" disabled={addingPhoto}>
                        {addingPhoto ? 'Uploading...' : 'Attach'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Photo Grid */}
                {activeGallery.photos?.length === 0 ? (
                  <EmptyState
                    icon="bi-image"
                    title="No Photos in Album"
                    message="Paste image URLs above to attach photos for the client to preview."
                  />
                ) : (
                  <div className="row g-3" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                    {activeGallery.photos?.map((p) => (
                      <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
                        <div className="card h-100 border shadow-sm position-relative">
                          {p.original_filename?.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) ? (
                            <video src={getMediaUrl(p.storage_url)} className="card-img-top" style={{ height: '140px', objectFit: 'cover' }} muted />
                          ) : (
                            <img src={getMediaUrl(p.storage_url)} alt={p.original_filename} className="card-img-top" style={{ height: '140px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Preview+Unavailable'; }} />
                          )}
                          {p.is_cover === 1 && (
                            <span className="position-absolute top-0 start-0 m-2 badge bg-warning text-dark shadow-sm">
                              Cover
                            </span>
                          )}
                          <div className="card-body p-2 d-flex justify-content-between align-items-center">
                            <span className="text-truncate small" style={{ maxWidth: '100px' }}>
                              {p.original_filename}
                            </span>
                            <div className="d-flex gap-1">
                              {p.is_cover !== 1 && (
                                <button
                                  className="btn btn-sm btn-light border"
                                  title="Set as Album Cover"
                                  onClick={() => handleSetCover(p.id)}
                                >
                                  <i className="bi bi-star"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Remove Photo"
                                onClick={() => handleDeletePhoto(p.id)}
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
              <div className="modal-footer bg-light d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => copyPublicLink(activeGallery.access_token)}
                >
                  <i className="bi bi-clipboard me-1"></i> Copy Client Share Link
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setActiveGallery(null)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}