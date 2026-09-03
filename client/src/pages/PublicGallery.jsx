import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { galleryService, getMediaUrl } from '../services/galleryService';
import Loader from '../components/common/Loader';

export default function PublicGallery() {
  const { token } = useParams();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const isVideo = (photo) => /\.(mp4|webm|ogg|mov|avi|mkv|m4v|mpeg|mpg|3gp)$/i.test(photo.original_filename || '');

  useEffect(() => {
    galleryService.getByToken(token)
      .then((res) => {
        setGallery(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Gallery link is invalid or expired.');
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
        <Loader message="Loading your secure gallery..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white p-3">
        <div className="text-center" style={{ maxWidth: '450px' }}>
          <i className="bi bi-shield-lock-fill text-danger" style={{ fontSize: '4rem' }}></i>
          <h4 className="fw-bold mt-3">Access Denied</h4>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-dark text-white">
      {/* Studio Header */}
      <header className="py-4 border-bottom border-secondary border-opacity-25 px-4 text-center">
        <span className="badge bg-primary text-uppercase px-3 py-1 mb-2" style={{ letterSpacing: '1px' }}>
          RAJA STUDIO
        </span>
        <h2 className="fw-bold mb-1">{gallery.title}</h2>
        <p className="text-muted small mb-0">Client: {gallery.customer_name} • Delivered by Raja Studio ERP</p>
      </header>

      {/* Masonry-Style Photo Grid */}
      <main className="container-fluid py-5 px-4">
        {gallery.photos?.length === 0 ? (
          <div className="text-center text-muted py-5">
            <h5>Photos are being prepared by the studio editor.</h5>
          </div>
        ) : (
          <div className="row g-4">
            {gallery.photos?.map((p) => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
                <div
                  className="rounded overflow-hidden shadow-lg position-relative"
                  style={{ cursor: 'pointer', height: '260px', backgroundColor: '#1e293b' }}
                  onClick={() => setLightboxPhoto(p)}
                >
                  {isVideo(p) ? (
                    <video src={getMediaUrl(p.storage_url)} className="w-100 h-100" style={{ objectFit: 'cover' }} muted />
                  ) : (
                    <img src={getMediaUrl(p.storage_url)} alt={p.original_filename} className="w-100 h-100" style={{ objectFit: 'cover', transition: 'transform 0.3s' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 9999 }}
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            className="btn btn-light position-absolute top-0 end-0 m-4 rounded-circle"
            onClick={() => setLightboxPhoto(null)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
          {isVideo(lightboxPhoto) ? (
            <video src={getMediaUrl(lightboxPhoto.storage_url)} controls autoPlay style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
          ) : (
            <img src={getMediaUrl(lightboxPhoto.storage_url)} alt={lightboxPhoto.original_filename} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
          )}
        </div>
      )}
    </div>
  );
}