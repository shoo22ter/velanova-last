import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroSlides } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import './Home.css';
import { PageTransition, ScrollReveal, FadeIn } from '../components/ScrollReveal';

const Home = () => {
  const { products } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);
  const saleProducts = useMemo(
    () => products.filter((product) => product.isOnSale && product.salePrice),
    [products],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <PageTransition>
      <div className="home-page">
        <section className="hero">
          <div className="hero-slider">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="slide-content container">
                  <FadeIn delay={0.18}>
                    <span className="slide-subtitle text-gold">{slide.subtitle}</span>
                  </FadeIn>
                  <ScrollReveal delay={0.32}>
                    <h1 className="slide-title">{slide.title}</h1>
                  </ScrollReveal>
                  <ScrollReveal delay={0.46}>
                    <p className="slide-text">
                      Discover elevated skincare and haircare essentials designed to bring visible care, lasting comfort, and a refined daily ritual.
                    </p>
                  </ScrollReveal>
                  <ScrollReveal delay={0.58}>
                    <div className="hero-actions">
                      <Link to="/shop" className="btn btn-gold">
                        Shop collection
                      </Link>
                      <Link to="/about" className="btn btn-primary hero-dark-btn">
                        Discover Velanova
                      </Link>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-progress-wrap">
            <div className="container hero-progress">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={index === currentSlide ? 'active' : ''}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="home-white-section">

          {saleProducts.length > 0 && (
            <section className="section-padding surface-white">
              <div className="container">
                <div className="section-header">
                  <p className="section-kicker">Limited Time</p>
                  <h2 className="section-title">Limited offers curated for your beauty ritual</h2>
                  <p className="section-copy">
                    Explore selected offers on premium essentials crafted to elevate your daily routine without compromising on quality.
                  </p>
                </div>
                <div className="products-grid">
                  {saleProducts.slice(0, 3).map((product, idx) => (
                    <ScrollReveal key={product.id} delay={idx * 0.08}>
                      <ProductCard product={product} />
                    </ScrollReveal>
                  ))}
                </div>
                <div className="text-center home-section-action">
                  <Link to="/shop" className="btn btn-primary">
                    View all sale items
                  </Link>
                </div>
              </div>
            </section>
          )}

          <section className="section-padding surface-off-white">
            <div className="container">
              <div className="section-header">
                <p className="section-kicker">Featured Selection</p>
                <h2 className="section-title">Bestsellers chosen to elevate everyday rituals</h2>
                <p className="section-copy">
                  Our signature bestsellers bring together elegant textures, refined formulas, and a polished shopping experience designed to feel effortless.
                </p>
              </div>
              <div className="products-grid">
                {featuredProducts.map((product, idx) => (
                  <ScrollReveal key={product.id} delay={idx * 0.08}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center home-section-action">
                <Link to="/shop" className="btn btn-primary">
                  Browse the full collection
                </Link>
              </div>
            </div>
          </section>

          <section className="section-padding surface-white">
            <div className="container story-layout">
              <ScrollReveal>
                <div className="story-content">
                  <p className="section-kicker">Velanova</p>
                  <h2 className="section-title home-story-title">Luxury care, written with a stronger brand story.</h2>
                  <p>
                    Velanova is built around the idea that beauty should feel indulgent, modern, and easy to trust from the very first glance.
                  </p>
                  <p>
                    From the hero message to the product grid, every section now supports a smoother journey that feels more premium, more readable, and more ready for conversion.
                  </p>
                  <Link to="/shop" className="btn btn-outline home-story-btn">
                    Shop the routine
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <div className="story-image">
                  <img
                    src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1200&q=80"
                    alt="Velanova luxury care"
                  />
                </div>
              </ScrollReveal>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
