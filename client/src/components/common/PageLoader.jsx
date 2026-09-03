import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`cinematic-preloader ${isLoaded ? 'loaded' : ''}`}>
      <div className="text-center">
        <h2 className="text-white fw-bold mb-1" style={{ letterSpacing: '8px', fontSize: '1.4rem' }}>
          RAJA STUDIO
        </h2>
        <span className="text-uppercase text-white-50 small" style={{ letterSpacing: '4px', fontSize: '0.65rem' }}>
          Visual Stories
        </span>
        <div className="mt-4" style={{ width: '120px', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 auto' }}>
          <div
            style={{
              width: isLoaded ? '100%' : '30%',
              height: '100%',
              backgroundColor: '#e5a93c',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}