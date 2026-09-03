import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="row g-5 mb-5">
          <div className="col-lg-4">
            <h4 className="fw-bold text-white mb-2" style={{ letterSpacing: '2px' }}>
              <i className="bi bi-camera-fill text-warning me-2"></i>RAJA STUDIO
            </h4>
            <p className="text-white-50 small leading-relaxed mb-3">
              We capture stories, not just photographs. Dedicated to cinematic storytelling, weddings, portraits, and high-fashion fine art.
            </p>
            <div className="text-white-50 small">
              <i className="bi bi-geo-alt-fill text-warning me-2"></i>Bangalore &bull; Chennai &bull; Destination Dispatches
            </div>
          </div>

          <div className="col-6 col-lg-2 offset-lg-1">
            <h6 className="footer-heading">Navigation</h6>
            <a href="#about" className="footer-link">About Studio</a>
            <a href="#services" className="footer-link">Disciplines</a>
            <a href="#portfolio" className="footer-link">Portfolio</a>
            <a href="#workflow" className="footer-link">Workflow</a>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="footer-heading">Secure Portals</h6>
            <Link to="/login" className="footer-link">Admin Workspace</Link>
            <Link to="/login" className="footer-link">Photographer Suite</Link>
            <Link to="/login" className="footer-link">Editor Darkroom</Link>
            <Link to="/login" className="footer-link">Customer Portal</Link>
          </div>

          <div className="col-lg-3">
            <h6 className="footer-heading">Client Inquiries</h6>
            <p className="text-white-50 small mb-2">Speak directly with studio management:</p>
            <div className="text-white fw-semibold small mb-1">
              <i className="bi bi-telephone-fill text-warning me-2"></i>+91 98765 43210
            </div>
            <div className="text-white fw-semibold small">
              <i className="bi bi-envelope-fill text-warning me-2"></i>inquiries@rajastudio.com
            </div>
          </div>
        </div>

        <div className="border-top border-secondary pt-4 text-center text-white-50 small">
          &copy; {new Date().getFullYear()} Raja Studio Management System. All rights reserved. &bull; Powered by Express + React + MySQL
        </div>
      </div>
    </footer>
  );
}