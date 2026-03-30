import React, { useState } from 'react';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all fields.');
      return;
    }

    // Show success message
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <PageTransition>
      <div className="page-shell page-top-space white-main">
        <section className="section-padding surface-white">
          <div className="container">
            <ScrollReveal>
              <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
                <p className="section-kicker">Get In Touch</p>
                <h1 className="section-title" style={{ textAlign: 'left' }}>Contact Us</h1>
              </div>
            </ScrollReveal>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '1000px' }}>
              {/* Contact Info */}
              <ScrollReveal>
                <div>
                  <h2 style={{ fontSize: '1.3rem', marginBottom: '24px' }}>Get in touch with our team</h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-dark-gray)', marginBottom: '28px' }}>
                    Have questions about our products? Need support with an order? We'd love to hear from you. Reach out and we'll respond as soon as possible.
                  </p>

                  <div style={{ marginBottom: '28px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Email</h3>
                    <a href="mailto:support@velanova.com" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontSize: '1.05rem' }}>
                      support@velanova.com
                    </a>
                  </div>

                  <div style={{ marginBottom: '28px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Phone</h3>
                    <a href="tel:81541606" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontSize: '1.05rem' }}>
                      81541606
                    </a>
                  </div>

                  <div style={{ marginBottom: '28px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Address</h3>
                    <p style={{ color: 'var(--color-dark-gray)', fontSize: '1rem' }}>
                      Beirut, Lebanon<br />
                      Middle East
                    </p>
                  </div>

                  <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Business Hours</h3>
                    <p style={{ color: 'var(--color-dark-gray)', fontSize: '0.95rem', marginBottom: '6px' }}>
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p style={{ color: 'var(--color-dark-gray)', fontSize: '0.95rem', marginBottom: '6px' }}>
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                    <p style={{ color: 'var(--color-dark-gray)', fontSize: '0.95rem' }}>
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Contact Form */}
              <ScrollReveal delay={0.1}>
                <div style={{ backgroundColor: '#f8f8f8', padding: '32px', borderRadius: '16px' }}>
                  {submitted && (
                    <div style={{ padding: '14px 16px', marginBottom: '20px', background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: '8px', color: '#2e7d32', fontSize: '0.9rem' }}>
                      ✓ Thank you for your message! We'll get back to you shortly.
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Subject</label>
                      <input
                        type="text"
                        name="subject"
                        className="form-control"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Message</label>
                      <textarea
                        name="message"
                        className="form-control"
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">
                      Send Message
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Contact;
