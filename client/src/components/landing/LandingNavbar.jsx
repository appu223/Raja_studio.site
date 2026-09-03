import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <Link to="/" className="landing-brand" data-cursor="STUDIO">
          <i className="bi bi-camera-fill text-warning"></i>
          <span>RAJA STUDIO</span>
        </Link>

        {/* Desktop Links */}
        <nav className="d-none d-lg-flex align-items-center gap-4">
          <ul className="landing-nav-links">
            <li><a href="#about" className="landing-nav-link" data-cursor="ABOUT">About</a></li>
            <li><a href="#services" className="landing-nav-link" data-cursor="EXPLORE">Services</a></li>
            <li><a href="#portfolio" className="landing-nav-link" data-cursor="VIEW">Portfolio</a></li>
            <li><a href="#workflow" className="landing-nav-link" data-cursor="STORY">Workflow</a></li>
            <li><a href="#contact" className="landing-nav-link" data-cursor="TALK">Contact</a></li>
          </ul>

          <div className="d-flex align-items-center gap-3 ms-3">
            <Link to="/login" className="btn btn-sm text-white-50 text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
              <i className="bi bi-lock-fill me-1"></i>Portal Login
            </Link>
            <Link to="/customer/new-booking" className="btn-cinematic-primary" data-cursor="SESSION">
              Book Session
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          className="btn btn-outline-light d-lg-none py-1 px-2 border-secondary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-5`}></i>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="d-lg-none bg-dark border-top border-secondary p-4 mt-3 rounded-2 shadow-lg">
          <div className="d-flex flex-column gap-3">
            <a href="#about" className="text-white text-decoration-none fw-semibold" onClick={() => setMobileMenuOpen(false)}>About Studio</a>
            <a href="#services" className="text-white text-decoration-none fw-semibold" onClick={() => setMobileMenuOpen(false)}>Services Catalog</a>
            <a href="#portfolio" className="text-white text-decoration-none fw-semibold" onClick={() => setMobileMenuOpen(false)}>Featured Portfolio</a>
            <a href="#workflow" className="text-white text-decoration-none fw-semibold" onClick={() => setMobileMenuOpen(false)}>Production Workflow</a>
            <hr className="border-secondary my-1" />
            <Link to="/login" className="btn btn-outline-light w-100 btn-sm">
              <i className="bi bi-person-circle me-2"></i>Studio Staff & Client Login
            </Link>
            <Link to="/customer/new-booking" className="btn-cinematic-primary w-100 text-center">
              Book a Session
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}