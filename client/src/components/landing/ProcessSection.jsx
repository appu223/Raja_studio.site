export default function ProcessSection() {
  const steps = [
    { num: '01', title: 'Consult & Discover', desc: 'We align with your creative vision, preferred aesthetics, venue logistics, and schedule.' },
    { num: '02', title: 'Bespoke Planning', desc: 'Moodboards, gear dispatch allocation (prime lenses, drones, lighting rigs), and timeline checklists.' },
    { num: '03', title: 'Cinematic Capture', desc: 'On-stage and on-location execution by specialized lead photographers and cinema crew.' },
    { num: '04', title: 'Darkroom Color Grading', desc: 'Individual raw frame curation, custom skin-tone profiling, and master retouches.' },
    { num: '05', title: 'Secure Digital Delivery', desc: 'Instant access through encrypted online photo galleries, PDF proofs, and WhatsApp dispatch.' },
  ];

  return (
    <section className="editorial-section" id="workflow">
      <div className="container">
        <div className="mb-5">
          <span className="text-uppercase text-warning small fw-bold" style={{ letterSpacing: '3px' }}>
            Precision & Craft
          </span>
          <h2 className="editorial-giant-heading">The Studio Journey</h2>
        </div>

        <div className="row g-3">
          {steps.map((st) => (
            <div className="col-md" key={st.num}>
              <div className="timeline-step-card" data-cursor="PHASE">
                <div className="timeline-step-digit">{st.num}</div>
                <h5 className="fw-bold text-white mb-2">{st.title}</h5>
                <p className="text-white-50 small mb-0 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}