import { Link } from 'react-router-dom';

export default function ServicesSection() {
  const serviceList = [
    { num: '01', name: 'Candid Wedding Photography', tag: 'Traditional & Candid Coverage', duration: 'Full Day Event' },
    { num: '02', name: 'Editorial Studio Portraits', tag: 'High-Fashion & Corporate Headshots', duration: '90 - 180 Mins' },
    { num: '03', name: '4K Aerial Drone Cinematography', tag: 'Certified Drone Pilot Footage', duration: 'Multi-Location' },
    { num: '04', name: 'Luxury Handcrafted Albums', tag: '300 DPI Fine-Art Prints & Velvet Leather', duration: 'Custom Bound' },
    { num: '05', name: 'Pre-Wedding & Destination Shoots', tag: 'Cinematic Storytelling on Location', duration: 'Multi-Day Dispatch' },
  ];

  return (
    <section className="editorial-section" id="services">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
          <div>
            <span className="text-uppercase text-warning small fw-bold" style={{ letterSpacing: '3px' }}>
              Bespoke Catalog
            </span>
            <h2 className="editorial-giant-heading mb-0">Our Disciplines</h2>
          </div>
          <Link to="/customer/new-booking" className="btn-cinematic-outline mt-3 mt-md-0" data-cursor="CUSTOM">
            Request Custom Package
          </Link>
        </div>

        <div className="services-list-container">
          {serviceList.map((srv) => (
            <Link
              to="/customer/new-booking"
              key={srv.num}
              className="service-row-item"
              data-cursor="SELECT"
            >
              <div className="d-flex align-items-center gap-4">
                <span className="service-num">{srv.num}</span>
                <h3 className="service-name">{srv.name}</h3>
              </div>
              <div className="d-flex align-items-center gap-4">
                <span className="service-meta d-none d-md-inline">{srv.tag}</span>
                <i className="bi bi-arrow-up-right fs-4 text-warning"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}