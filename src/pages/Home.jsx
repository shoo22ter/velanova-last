import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroSlides } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import { useBanners } from '../context/BannerContext';
import { useTestimonials } from '../context/TestimonialContext';
import { useFaqs } from '../context/FaqContext';
import ProductCard from '../components/ProductCard';
import './Home.css';
import { PageTransition, ScrollReveal, FadeIn } from '../components/ScrollReveal';

const Home = () => {
  const { products } = useProducts();
  const { banners } = useBanners();
  const { testimonials } = useTestimonials();
  const { faqs } = useFaqs();
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);
  const saleProducts = useMemo(
    () => products.filter((product) => product.isOnSale && product.salePrice),
    [products],
  );
  const activeBanners = useMemo(
    () => (Array.isArray(banners) ? banners.filter((banner) => banner.isActive) : []),
    [banners],
  );
  const slides = useMemo(
    () => (activeBanners.length > 0 ? activeBanners : heroSlides),
    [activeBanners],
  );
  const activeTestimonials = useMemo(
    () => (Array.isArray(testimonials) ? testimonials.filter((item) => item.isActive) : []),
    [testimonials],
  );
  const activeFaqs = useMemo(
    () => (Array.isArray(faqs) ? faqs.filter((item) => item.isActive) : []),
    [faqs],
  );

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, slides.length]);

  return (
    <PageTransition>
      <div className="home-page">
        <section className="hero">
          <div className="hero-slider">
            {slides.map((slide, index) => {
              const primaryLabel = slide.ctaLabel || 'Shop collection';
              const primaryLink = slide.ctaLink || '/shop';
              const isExternal = /^https?:\/\//i.test(primaryLink);

              return (
              <div
                key={slide.id || slide.image || index}
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
                      {isExternal ? (
                        <a href={primaryLink} className="btn btn-gold">
                          {primaryLabel}
                        </a>
                      ) : (
                        <Link to={primaryLink} className="btn btn-gold">
                          {primaryLabel}
                        </Link>
                      )}
                      <Link to="/about" className="btn btn-primary hero-dark-btn">
                        Discover Velanova
                      </Link>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
              );
            })}
          </div>

          <div className="hero-progress-wrap">
            <div className="container hero-progress">
              {slides.map((slide, index) => (
                <button
                  key={slide.id || slide.image || index}
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

          {activeTestimonials.length > 0 && (
            <section className="section-padding surface-white">
              <div className="container">
                <div className="section-header">
                  <p className="section-kicker">Client Voices</p>
                  <h2 className="section-title">Loved by clients who crave a premium ritual</h2>
                  <p className="section-copy">
                    Real feedback from customers and industry professionals who trust Velanova for their daily routine.
                  </p>
                </div>

                <div className="testimonials-grid">
                  {activeTestimonials.slice(0, 6).map((testimonial, idx) => (
                    <ScrollReveal key={testimonial.id || idx} delay={idx * 0.06}>
                      <div className="testimonial-card">
                        <div className="testimonial-rating">
                          {'*'.repeat(Math.min(5, Math.max(1, testimonial.rating || 5)))}
                        </div>
                        <p className="testimonial-quote">“{testimonial.quote}”</p>
                        <div className="testimonial-person">
                          {testimonial.avatar && (
                            <img src={testimonial.avatar} alt={testimonial.name} />
                          )}
                          <div>
                            <strong>{testimonial.name}</strong>
                            {testimonial.role && <span>{testimonial.role}</span>}
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeFaqs.length > 0 && (
            <section className="section-padding surface-off-white">
              <div className="container">
                <div className="section-header">
                  <p className="section-kicker">FAQ</p>
                  <h2 className="section-title">Answers to help you shop with confidence</h2>
                  <p className="section-copy">
                    Quick clarifications about our products, policies, and delivery process.
                  </p>
                </div>

                <div className="faq-grid">
                  {activeFaqs.slice(0, 6).map((faq, idx) => (
                    <ScrollReveal key={faq.id || idx} delay={idx * 0.05}>
                      <div className="faq-card">
                        <h4 className="faq-question">{faq.question}</h4>
                        <p className="faq-answer">{faq.answer}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          )}

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
