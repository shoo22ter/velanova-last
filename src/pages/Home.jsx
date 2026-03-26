import React from 'react';
import { Link } from 'react-router-dom';
import { heroSlides, products } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import './Home.css';

import { PageTransition, ScrollReveal, FadeIn } from '../components/ScrollReveal';

const Home = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <PageTransition>
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-slider">
            {heroSlides.map((slide, index) => (
              <div key={slide.id} className={`slide ${index === 0 ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.image})` }}>
                <div className="slide-content container">
                  <FadeIn delay={0.2}>
                    <span className="slide-subtitle text-gold">{slide.subtitle}</span>
                  </FadeIn>
                  <ScrollReveal delay={0.4}>
                    <h1 className="slide-title">{slide.title}</h1>
                  </ScrollReveal>
                  <ScrollReveal delay={0.6}>
                    <Link to="/shop" className="btn btn-primary mt-4">Explore Collection</Link>
                  </ScrollReveal>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Section */}
        <section className="section-padding container">
          <ScrollReveal>
            <div className="section-title">
              <span className="text-gold" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '10px' }}>Discover</span>
              <h2>Our Bestsellers</h2>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-4">
            {featuredProducts.map((product, idx) => (
              <ScrollReveal key={product.id} delay={idx * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal delay={0.4}>
            <div className="text-center" style={{ marginTop: '50px' }}>
              <Link to="/shop" className="btn btn-outline">View All Products</Link>
            </div>
          </ScrollReveal>
        </section>

        {/* About Section */}
        <section className="about-section bg-black section-padding">
          <div className="container about-container" style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
            <ScrollReveal delay={0.2} style={{ flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1615397323136-23bca4621eb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="About Velanova" style={{ width: '100%', borderRadius: '4px' }} />
            </ScrollReveal>
            
            <div style={{ flex: 1, color: 'var(--color-white)' }}>
              <ScrollReveal delay={0.4}>
                <h2 className="text-gold mb-3" style={{ fontSize: '2.5rem' }}>The Velanova Philosophy</h2>
                <p className="mb-4" style={{ color: 'var(--color-light-gray)' }}>
                  We believe that true beauty radiates from within. Our meticulously crafted treatments combine the rarest botanical ingredients with cutting-edge science to deliver a luxurious, transformative experience for your body and hair.
                </p>
                <Link to="/about" className="btn btn-outline btn-gold-outline" style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}>Read Our Story</Link>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};
export default Home;
