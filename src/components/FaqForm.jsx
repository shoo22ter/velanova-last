import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FaqForm = ({ faq, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    isActive: faq?.isActive ?? true,
    sortOrder: faq?.sortOrder ?? 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question || '',
        answer: faq.answer || '',
        isActive: faq.isActive ?? true,
        sortOrder: faq.sortOrder ?? 0,
      });
    } else {
      setFormData({
        question: '',
        answer: '',
        isActive: true,
        sortOrder: 0,
      });
    }
  }, [faq]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.question.trim()) nextErrors.question = 'Question is required';
    if (!formData.answer.trim()) nextErrors.answer = 'Answer is required';
    if (formData.sortOrder !== '' && Number(formData.sortOrder) < 0) {
      nextErrors.sortOrder = 'Sort order must be 0 or higher';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      sortOrder: Number(formData.sortOrder || 0),
    });

    if (faq) {
      onCancel();
    } else {
      setFormData({
        question: '',
        answer: '',
        isActive: true,
        sortOrder: 0,
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="admin-form-card">
      <div className="admin-form-head">
        <div>
          <p className="section-kicker" style={{ marginBottom: '8px' }}>{faq ? 'Update FAQ' : 'Create FAQ'}</p>
          <h3>{faq ? 'Edit FAQ' : 'Add New FAQ'}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-block">
          <div className="form-group">
            <label>Question *</label>
            <input type="text" name="question" value={formData.question} onChange={handleChange} className="form-control" />
            {errors.question && <p className="field-error">{errors.question}</p>}
          </div>

          <div className="form-group">
            <label>Answer *</label>
            <textarea name="answer" value={formData.answer} onChange={handleChange} rows="5" className="form-control" />
            {errors.answer && <p className="field-error">{errors.answer}</p>}
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                min="0"
                step="1"
                className="form-control"
              />
              {errors.sortOrder && <p className="field-error">{errors.sortOrder}</p>}
            </div>
            <label className="admin-check">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
              <span>Active FAQ</span>
            </label>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-gold">{faq ? 'Save Changes' : 'Create FAQ'}</button>
        </div>
      </form>
    </motion.div>
  );
};

export default FaqForm;
