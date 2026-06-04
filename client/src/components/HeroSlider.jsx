import React, { useEffect, useState, useCallback } from 'react';

import { Link } from 'react-router-dom';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const API = process.env.REACT_APP_API_URL || 'http://localhost:9999';
const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API}/api/banners`);
        const data = await res.json();
        setSlides(data);
      } catch (e) {
        console.error('Failed to fetch banners:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [slides.length, next]);

  // No banners — show default gradient hero
  if (!loading && slides.length === 0) {
    return (
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
          paddingTop: 100,
          paddingBottom: 60,
        }}
      >
        <div className="absolute rounded-full opacity-20 pointer-events-none"
          style={{ width: 400, height: 400, background: '#fff', top: -100, right: -80, borderRadius: '50%' }} />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block bg-white bg-opacity-20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            New Arrivals 2025
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Style That <span style={{ color: '#fde68a' }}>Speaks For You</span>
          </h1>
          <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 420, margin: '0 auto 32px' }}>
            Discover the latest trends in fashion. Premium quality, affordable prices.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/products" className="btn-white">Shop Now →</Link>
            <Link to="/about" className="btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>Learn More</Link>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="shimmer" style={{ height: 420, marginTop: 64 }} />
    );
  }

  return (
    <section className="relative overflow-hidden" style={{ marginTop: 64, height: 420 }}>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide._id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          {/* Background image */}
          <img
            src={slide.image}
            alt={slide.title || `Slide ${i + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {/* Overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.75) 0%, rgba(99,102,241,0.65) 100%)' }} />

          {/* Text content */}
          {(slide.title || slide.subtitle) && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center px-6 max-w-2xl">
                {slide.title && (
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p className="text-lg mb-6" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {slide.subtitle}
                  </p>
                )}
                <Link to="/products" className="btn-white">Shop Now →</Link>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', backdropFilter: 'blur(4px)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.45)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', backdropFilter: 'blur(4px)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.45)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
          >
            <FaChevronRight size={14} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
