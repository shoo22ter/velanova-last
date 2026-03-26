import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageTransition, ScrollReveal } from '../components/ScrollReveal';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Successfully ${isLogin ? 'logged in' : 'registered'}! (Demo)`);
    navigate('/');
  };

  return (
    <PageTransition>
      <div className="container section-padding" style={{ paddingTop: '150px', minHeight: '80vh', display: 'flex', justifyContent: 'center' }}>
        <ScrollReveal style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--color-white)', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 className="text-center" style={{ marginBottom: '30px' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" required={!isLogin} />
              </div>
            )}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" required />
            </div>
            <button type="submit" className="btn btn-black btn-full" style={{ marginTop: '20px', backgroundColor: 'var(--color-black)', color: 'var(--color-white)', width: '100%', padding: '12px' }}>
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>
          <p className="text-center" style={{ marginTop: '20px', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: 'var(--color-gold)', cursor: 'pointer', fontWeight: '500' }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register' : 'Sign In'}
            </span>
          </p>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
};
export default Login;
