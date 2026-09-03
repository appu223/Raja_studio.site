import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.intro-reveal-text', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="editorial-section" id="about" ref={sectionRef}>
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-7">
            <span className="badge bg-warning text-dark text-uppercase px-2 py-1 mb-3 intro-reveal-text">
              The Philosophy
            </span>
            <h2 className="editorial-giant-heading intro-reveal-text">
              We Don't Just Take Photos. <br />
              <span className="text-warning" style={{ fontStyle: 'italic' }}>We Build Time Capsules.</span>
            </h2>
          </div>

          <div className="col-lg-5">
            <div className="ps-lg-4 border-start border-secondary intro-reveal-text">
              <p className="text-white-50 leading-relaxed mb-4">
                Founded with a devotion to cinematic purity, Raja Studio captures raw intimacy, spontaneous joy, and high-fashion aesthetics. Every session is treated as an art commission — from pre-shoot moodboards and bespoke lighting to meticulous color grading.
              </p>
              <div className="row g-3 text-white">
                <div className="col-6">
                  <h3 className="fw-bold text-warning mb-0 font-monospace">10+</h3>
                  <small className="text-muted text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '1px' }}>Years Experience</small>
                </div>
                <div className="col-6">
                  <h3 className="fw-bold text-warning mb-0 font-monospace">500+</h3>
                  <small className="text-muted text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '1px' }}>Curated Sessions</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}