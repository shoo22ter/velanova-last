import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SettingsForm = ({ settings, onSubmit }) => {
  const [formData, setFormData] = useState({
    supportEmail: settings?.supportEmail || '',
    supportPhone: settings?.supportPhone || '',
    addressLine1: settings?.addressLine1 || '',
    addressLine2: settings?.addressLine2 || '',
    city: settings?.city || '',
    region: settings?.region || '',
    country: settings?.country || '',
    hoursWeekday: settings?.hoursWeekday || '',
    hoursSaturday: settings?.hoursSaturday || '',
    hoursSunday: settings?.hoursSunday || '',
  });

  useEffect(() => {
    setFormData({
      supportEmail: settings?.supportEmail || '',
      supportPhone: settings?.supportPhone || '',
      addressLine1: settings?.addressLine1 || '',
      addressLine2: settings?.addressLine2 || '',
      city: settings?.city || '',
      region: settings?.region || '',
      country: settings?.country || '',
      hoursWeekday: settings?.hoursWeekday || '',
      hoursSaturday: settings?.hoursSaturday || '',
      hoursSunday: settings?.hoursSunday || '',
    });
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="admin-form-card">
      <div className="admin-form-head">
        <div>
          <p className="section-kicker" style={{ marginBottom: '8px' }}>Site settings</p>
          <h3>Contact & Business Hours</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-block">
          <div className="grid grid-2">
            <div className="form-group">
              <label>Support Email</label>
              <input type="email" name="supportEmail" value={formData.supportEmail} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Support Phone</label>
              <input type="text" name="supportPhone" value={formData.supportPhone} onChange={handleChange} className="form-control" />
            </div>
          </div>

          <div className="form-group">
            <label>Address Line 1</label>
            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Address Line 2</label>
            <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="form-control" />
          </div>

          <div className="grid grid-3">
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Region</label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-control" />
            </div>
          </div>

          <div className="grid grid-3">
            <div className="form-group">
              <label>Weekday Hours</label>
              <input type="text" name="hoursWeekday" value={formData.hoursWeekday} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Saturday Hours</label>
              <input type="text" name="hoursSaturday" value={formData.hoursSaturday} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Sunday Hours</label>
              <input type="text" name="hoursSunday" value={formData.hoursSunday} onChange={handleChange} className="form-control" />
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-gold">Save Settings</button>
        </div>
      </form>
    </motion.div>
  );
};

export default SettingsForm;
