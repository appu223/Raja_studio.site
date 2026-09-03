import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Disable on reduced motion or touch devices
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 992) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xTo = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });

    const handleMouseMove = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setIsHovered(true);
        setCursorText(target.getAttribute('data-cursor') || '');
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className={`custom-cursor-ring ${isHovered ? 'active-hover' : ''}`}>
        {cursorText}
      </div>
    </>
  );
}