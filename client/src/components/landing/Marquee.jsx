import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Marquee() {
  const marquee1Ref = useRef(null);
  const marquee2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Forward Track
      gsap.to(marquee1Ref.current, {
        xPercent: -50,
        repeat: -1,
        duration: 22,
        ease: 'none',
      });

      // Reverse Track
      gsap.fromTo(
        marquee2Ref.current,
        { xPercent: -50 },
        {
          xPercent: 0,
          repeat: -1,
          duration: 26,
          ease: 'none',
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const keywords = ['WEDDINGS', 'EDITORIAL', 'PORTRAITURE', 'CINEMATOGRAPHY', 'DRONE 4K', 'FASHION', 'ALBUMS'];

  return (
    <div className="marquee-band">
      <div className="marquee-track mb-2" ref={marquee1Ref}>
        {[...keywords, ...keywords, ...keywords].map((word, i) => (
          <span key={i} className="marquee-text-large">
            {word} <span>&bull;</span>
          </span>
        ))}
      </div>
      <div className="marquee-track" ref={marquee2Ref}>
        {[...keywords, ...keywords, ...keywords].map((word, i) => (
          <span key={`rev-${i}`} className="marquee-text-large" style={{ opacity: 0.45, fontSize: '1.2rem' }}>
            RAJA STUDIO <span>/</span> {word} <span>/</span>
          </span>
        ))}
      </div>
    </div>
  );
}