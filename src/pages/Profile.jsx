import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, Mail, PencilLine, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, logout } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const profileStats = useMemo(
    () => [
      { label: 'Account Status', value: 'Active Member' },
      { label: 'Profile Completion', value: '100%' },
      { label: 'Security Level', value: 'Standard+' },
    ],
    []
  );

  const initials = useMemo(() => {
    const fullName = user?.fullName?.trim() || 'User';
    const tokens = fullName.split(' ').filter(Boolean);
    return tokens.slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'U';
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSuccessMsg('Profile updated successfully!');
    setIsEditing(false);
    window.setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCancelEdit = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <PageTransition>
        <div className="page-shell page-top-space white-main empty-state">
          <div className="container">
            <div className="card">
              <h2>Access Denied</h2>
              <p className="muted profile-auth-note">You need to be logged in to view your profile.</p>
              <Link to="/login" className="btn btn-primary">Go to Login</Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="page-shell page-top-space white-main profile-page">
        <section className="section-padding surface-white">
          <div className="container">
            <ScrollReveal>
              <div className="profile-hero">
                <p className="section-kicker">Account Center</p>
                <h1 className="section-title">Your Profile</h1>
                <p className="profile-hero-subtitle">
                  Manage personal information, keep your account secure, and maintain a clean
                  professional profile across Velanova.
                </p>
              </div>
            </ScrollReveal>

            <div className="profile-layout">
              <ScrollReveal>
                <aside className="profile-summary-card">
                  <div className="profile-avatar">{initials}</div>
                  <h3>{user.fullName}</h3>
                  <p>{user.email}</p>

                  <div className="profile-chip-row">
                    <span><ShieldCheck size={14} /> Verified</span>
                    <span><CalendarDays size={14} /> Member</span>
                    <span>{(user?.role || 'customer').toUpperCase()}</span>
                  </div>

                  <div className="profile-stats-grid">
                    {profileStats.map((item) => (
                      <div key={item.label} className="profile-stat-box">
                        <p>{item.label}</p>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </aside>
              </ScrollReveal>

              <div className="profile-main-stack">
                <ScrollReveal delay={0.04}>
                  <div className="profile-card">
                    <div className="profile-card-head">
                      <h3>Profile Information</h3>
                      {!isEditing && (
                        <button type="button" className="btn btn-outline profile-edit-btn" onClick={() => setIsEditing(true)}>
                          <PencilLine size={16} />
                          Edit Profile
                        </button>
                      )}
                    </div>

                    {successMsg && <div className="profile-success-alert">✓ {successMsg}</div>}

                    {!isEditing ? (
                      <div className="profile-info-grid">
                        <div className="profile-info-item">
                          <label><UserRound size={15} /> Full Name</label>
                          <p>{user.fullName}</p>
                        </div>
                        <div className="profile-info-item">
                          <label><Mail size={15} /> Email Address</label>
                          <p>{user.email}</p>
                        </div>
                        <div className="profile-info-item">
                          <label><Phone size={15} /> Phone Number</label>
                          <p>{user.phone || 'Not provided'}</p>
                        </div>
                        <div className="profile-info-item">
                          <label><CalendarDays size={15} /> Member Since</label>
                          <p>{user.createdAt}</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSave} className="profile-form">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            name="fullName"
                            className="form-control"
                            value={formData.fullName}
                            onChange={handleChange}
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
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 555 000 0000"
                          />
                        </div>
                        <div className="profile-form-actions">
                          <button type="submit" className="btn btn-primary">Save Changes</button>
                          <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.08}>
                  <div className="profile-card profile-actions-card">
                    <h3>Account Actions</h3>
                    <p className="muted">Sign out from this device whenever needed.</p>
                    <button type="button" className="btn btn-outline profile-logout-btn" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Profile;
