import React, { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialForm = ({ testimonial, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    quote: testimonial?.quote || '',
    avatar: testimonial?.avatar || '',
    rating: testimonial?.rating ?? 5,
    isActive: testimonial?.isActive ?? true,
    sortOrder: testimonial?.sortOrder ?? 0,
  });
  const [imagePreview, setImagePreview] = useState(testimonial?.avatar || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || '',
        role: testimonial.role || '',
        quote: testimonial.quote || '',
        avatar: testimonial.avatar || '',
        rating: testimonial.rating ?? 5,
        isActive: testimonial.isActive ?? true,
        sortOrder: testimonial.sortOrder ?? 0,
      });
      setImagePreview(testimonial.avatar || '');
    } else {
      setFormData({
        name: '',
        role: '',
        quote: '',
        avatar: '',
        rating: 5,
        isActive: true,
        sortOrder: 0,
      });
      setImagePreview('');
    }
  }, [testimonial]);

  const compressImageFile = (file, maxSize = 800, quality = 0.82) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
          let { width, height } = image;
          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to process image'));
            return;
          }

          ctx.drawImage(image, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        image.onerror = () => reject(new Error('Invalid image file'));
        image.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, avatar: 'Please select a valid image file' }));
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: 'Image size must be less than 6MB' }));
      return;
    }

    try {
      const base64String = await compressImageFile(file);
      setFormData((prev) => ({ ...prev, avatar: base64String }));
      setImagePreview(base64String);
      setErrors((prev) => ({ ...prev, avatar: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, avatar: 'Failed to process image. Please try another file.' }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (name === 'avatar') {
      setImagePreview(value);
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Name is required';
    if (!formData.quote.trim()) nextErrors.quote = 'Quote is required';
    const ratingValue = Number(formData.rating);
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      nextErrors.rating = 'Rating must be between 1 and 5';
    }
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
      rating: Number(formData.rating || 5),
      sortOrder: Number(formData.sortOrder || 0),
    });

    if (testimonial) {
      onCancel();
    } else {
      setFormData({
        name: '',
        role: '',
        quote: '',
        avatar: '',
        rating: 5,
        isActive: true,
        sortOrder: 0,
      });
      setImagePreview('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="admin-form-card">
      <div className="admin-form-head">
        <div>
          <p className="section-kicker" style={{ marginBottom: '8px' }}>{testimonial ? 'Update testimonial' : 'Create testimonial'}</p>
          <h3>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-grid">
        <div className="admin-form-block">
          <div className="form-group">
            <label>Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Role / Title</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Quote *</label>
            <textarea name="quote" value={formData.quote} onChange={handleChange} rows="5" className="form-control" />
            {errors.quote && <p className="field-error">{errors.quote}</p>}
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Rating (1-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="1"
                max="5"
                step="1"
                className="form-control"
              />
              {errors.rating && <p className="field-error">{errors.rating}</p>}
            </div>
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
          </div>

          <label className="admin-check">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
            <span>Active testimonial</span>
          </label>
        </div>

        <div className="admin-form-block">
          <label>Avatar Image</label>
          <div className="admin-upload-area avatar-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="admin-preview-image avatar-preview" />
            ) : (
              <div className="admin-upload-placeholder">
                <ImagePlus size={26} />
                <p>Upload a profile photo</p>
                <span>Optional but adds trust</span>
              </div>
            )}
          </div>

          <input type="file" accept="image/*" onChange={handleFileUpload} className="form-control" />
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label>Avatar URL or Base64</label>
            <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className="form-control" />
            {errors.avatar && <p className="field-error">{errors.avatar}</p>}
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-gold">{testimonial ? 'Save Changes' : 'Create Testimonial'}</button>
        </div>
      </form>
    </motion.div>
  );
};

export default TestimonialForm;
