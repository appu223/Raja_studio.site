export default function PortfolioSection() {
  const projects = [
    {
      title: 'The Royal Mysore Palace Nuptials',
      category: 'Wedding Cinematography',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
      colClass: 'col-lg-8',
      height: '520px',
    },
    {
      title: 'Monochrome Editorial Profile',
      category: 'Fine-Art Portrait',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      colClass: 'col-lg-4',
      height: '520px',
    },
    {
      title: 'Sunset Coastline Pre-Wedding',
      category: 'Destination Story',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      colClass: 'col-lg-4',
      height: '420px',
    },
    {
      title: 'Heritage Silk & Jewels Campaign',
      category: 'Fashion & Commercial',
      image: 'https://images.unsplash.com/photo-1609150498870-8b7008262604?q=80&w=1200&auto=format&fit=crop',
      colClass: 'col-lg-8',
      height: '420px',
    },
  ];

  return (
    <section className="editorial-section" id="portfolio">
      <div className="container">
        <div className="mb-5">
          <span className="text-uppercase text-warning small fw-bold" style={{ letterSpacing: '3px' }}>
            Selected Works
          </span>
          <h2 className="editorial-giant-heading">Visual Portfolio</h2>
        </div>

        <div className="row g-4">
          {projects.map((proj, idx) => (
            <div className={proj.colClass} key={idx}>
              <div className="portfolio-card-wrap" style={{ height: proj.height }} data-cursor="VIEW">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="portfolio-img-layer"
                  loading="lazy"
                />
                <div className="portfolio-overlay-info">
                  <span className="badge bg-warning text-dark text-uppercase px-2 py-1 mb-2" style={{ fontSize: '0.65rem' }}>
                    {proj.category}
                  </span>
                  <h4 className="fw-bold text-white mb-0 font-serif">{proj.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}