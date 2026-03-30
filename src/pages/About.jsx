import React from 'react';
import { Link } from 'react-router-dom';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';

const About = () => {
  return (
    <PageTransition>
      <div className="page-shell page-top-space white-main">
        <section className="section-padding surface-white">
          <div className="container">
            <ScrollReveal>
              <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
                <p className="section-kicker">Our Story</p>
                <h1 className="section-title" style={{ textAlign: 'left' }}>About Velanova</h1>
              </div>
            </ScrollReveal>

            <div style={{ maxWidth: '800px' }}>
              <ScrollReveal>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Luxury Care Redefined</h2>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '16px', color: 'var(--color-dark-gray)' }}>
                    Velanova was founded on a simple belief: that luxury skincare, body care, and hair rituals should be accessible, effective, and beautifully crafted. We combine nature's finest ingredients with modern science to create products that elevate your daily routine.
                  </p>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '16px', color: 'var(--color-dark-gray)' }}>
                    Every product is carefully formulated to deliver radiant, healthy results without compromise. From our signature Radiant Skin Elixir infused with 24k gold flakes to our Velvet Body Oil with rare Moroccan argan, each item represents our commitment to excellence.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div style={{ marginBottom: '32px', background: '#f8f8f8', padding: '24px', borderRadius: '16px' }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Our Mission</h2>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--color-dark-gray)' }}>
                    To empower individuals with premium, nature-inspired beauty and wellness products that transform daily rituals into moments of luxury. We believe everyone deserves to feel radiant, confident, and cared for.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Why Velanova?</h2>
                  <ul style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--color-dark-gray)', paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '12px' }}><strong>Premium Ingredients:</strong> We source the finest botanical extracts, rare oils, and luxe formulations from around the world.</li>
                    <li style={{ marginBottom: '12px' }}><strong>Science-Backed:</strong> Each product is developed with advanced skincare science and dermatological expertise.</li>
                    <li style={{ marginBottom: '12px' }}><strong>Elegant Design:</strong> From packaging to presentation, every detail reflects our luxury aesthetic.</li>
                    <li style={{ marginBottom: '12px' }}><strong>Sustainable Practices:</strong> We are committed to ethical sourcing and environmentally conscious production.</li>
                    <li><strong>Customer-Focused:</strong> Your satisfaction and radiance are at the heart of everything we do.</li>
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #eee' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Ready to Experience Luxury?</h3>
                  <Link to="/shop" className="btn btn-primary">Explore Our Collection</Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default About;
