import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const float1Ref = useRef(null);
  const float2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.from('.hero-eyebrow', { opacity: 0, y: -20, duration: 0.9, delay: 0.2 })
        .from('.hero-word', { opacity: 0, y: 60, rotationZ: 2, stagger: 0.15, duration: 1.1 }, '-=0.5')
        .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
        .from('.hero-cta-group', { opacity: 0, y: 20, duration: 0.8 }, '-=0.5')
        .from([float1Ref.current, float2Ref.current], { opacity: 0, scale: 0.85, duration: 1.2, stagger: 0.2 }, '-=0.8');

      // Subtle continuous parallax on floating images
      gsap.to(float1Ref.current, { y: '-=15', rotation: -2, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(float2Ref.current, { y: '+=20', rotation: 2, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-viewport" ref={containerRef}>
      {/* Background Video Layer with Fallback Poster */}
      <div className="hero-video-wrapper">
        <video
          className="hero-video-element"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"
        >
          {/* Automatically checks local video if placed in public/videos/hero.mp4 */}
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-at-a-wedding-41808-large.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>

      {/* Floating Editorial Photo Accent 1 */}
      <div className="hero-floating-card floating-pos-1" ref={float1Ref}>
        <img
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop"
          alt="Wedding Editorial Story"
        />
      </div>

      {/* Floating Editorial Photo Accent 2 */}
      <div className="hero-floating-card floating-pos-2" ref={float2Ref}>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
          alt="Portrait Session"
        />
      </div>

      {/* Hero Narrative Copy */}
      <div className="hero-content">
        <div className="hero-eyebrow">
          <i className="bi bi-camera me-2"></i>Raja Studio &bull; Visual Stories
        </div>
        <h1 className="hero-title" ref={headlineRef}>
          <span className="d-block hero-word">Capture</span>
          <span className="d-block hero-word text-warning" style={{ fontStyle: 'italic' }}>The Soul</span>
          <span className="d-block hero-word">Of The Moment.</span>
        </h1>
        <p className="hero-subtitle">
          Photography that transcends standard frames — immortalizing weddings, editorial portraits, and high-fashion narratives with timeless cinematic elegance.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3 hero-cta-group">
          <a href="#portfolio" className="btn-cinematic-primary" data-cursor="EXPLORE">
            Explore Portfolio <i className="bi bi-arrow-right ms-1"></i>
          </a>
          <Link to="/customer/new-booking" className="btn-cinematic-outline" data-cursor="RESERVE">
            Book A Session
          </Link>
        </div>
      </div>
    </section>
  );
}