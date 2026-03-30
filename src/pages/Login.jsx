import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', passwordConfirm: '', role: 'customer' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { login, register } = useUser();
  const navigate = useNavigate();

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMsg('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields.');
        return;
      }
      login(formData.email, formData.password, 'customer');
      navigate('/');
    } else {
      // Register validation
      if (!formData.fullName || !formData.email || !formData.password || !formData.passwordConfirm) {
        setError('Please fill in all fields.');
        return;
      }
      if (formData.password !== formData.passwordConfirm) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      
      // Register user
      register(formData.fullName, formData.email, formData.password, 'customer');
      
      // Show success message and switch to login
      setSuccessMsg(`✓ Registration successful! Welcome, ${formData.fullName}. Please sign in with your email.`);
      setError('');
      setFormData({ fullName: '', email: '', password: '', passwordConfirm: '', role: 'customer' });
      
      // Auto-switch to login mode after 2 seconds
      setTimeout(() => {
        setIsLogin(true);
        setSuccessMsg('');
      }, 2000);
    }
  };

  // Toggle between login and register mode
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: '', email: '', password: '', passwordConfirm: '', role: 'customer' });
    setError('');
    setSuccessMsg('');
  };

  return (
    <PageTransition>
      <div className="page-shell page-top-space white-main" style={{ display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
        <section className="section-padding surface-white" style={{ width: '100%' }}>
          <div className="container">
            <ScrollReveal style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ backgroundColor: 'var(--color-white)', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', borderRadius: '20px' }}>
                {/* Header */}
                <h2 className="text-center" style={{ marginBottom: '8px', fontSize: '1.8rem' }}>
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-center muted" style={{ marginBottom: '28px', fontSize: '0.95rem' }}>
                  {isLogin ? 'Sign in to your Velanova account' : 'Join our luxury beauty community'}
                </p>

                {/* Success message */}
                {successMsg && (
                  <div style={{ padding: '12px 14px', marginBottom: '18px', background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: '8px', color: '#2e7d32', fontSize: '0.9rem' }}>
                    {successMsg}
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div style={{ padding: '12px 14px', marginBottom: '18px', background: '#ffe5e5', border: '1px solid #ffb3b3', borderRadius: '8px', color: '#c33', fontSize: '0.9rem' }}>
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="fullName" className="form-control" value={formData.fullName} onChange={handleChange} placeholder="Jane Doe" />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} placeholder="••••••" />
                  </div>
                  {!isLogin && (
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input type="password" name="passwordConfirm" className="form-control" value={formData.passwordConfirm} onChange={handleChange} placeholder="••••••" />
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '24px' }}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                {/* Toggle mode */}
                <p className="text-center" style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--color-dark-gray)' }}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <span
                    style={{ color: 'var(--color-gold)', cursor: 'pointer', fontWeight: 600 }}
                    onClick={toggleMode}
                  >
                    {isLogin ? 'Register here' : 'Sign in here'}
                  </span>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Login;
