import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="editorial-section text-center position-relative overflow-hidden" id="contact">
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <span className="badge bg-warning text-dark text-uppercase px-3 py-1 mb-3" style={{ letterSpacing: '2px' }}>
          Begin Your Story
        </span>
        <h2 className="editorial-giant-heading mb-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>
          Ready To Freeze <br />
          <span className="text-warning" style={{ fontStyle: 'italic' }}>Time With Us?</span>
        </h2>
        <p className="text-white-50 mx-auto mb-4" style={{ maxWidth: '560px', fontSize: '1.1rem' }}>
          Whether planning an intimate wedding or a high-profile fashion campaign, reserve your date with our dedicated photography team today.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/customer/new-booking" className="btn-cinematic-primary" data-cursor="BOOK">
            <i className="bi bi-calendar2-check-fill me-1"></i> Book A Session Now
          </Link>
          <Link to="/login" className="btn-cinematic-outline" data-cursor="PORTAL">
            <i className="bi bi-box-arrow-in-right me-1"></i> Access Client / Staff Portal
          </Link>
        </div>
      </div>
    </section>
  );
}