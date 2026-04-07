import React, { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { motion } from 'framer-motion';

const BannerForm = ({ banner, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    image: banner?.image || '',
    ctaLabel: banner?.ctaLabel || '',
    ctaLink: banner?.ctaLink || '',
    isActive: banner?.isActive ?? true,
    sortOrder: banner?.sortOrder ?? 0,
  });
  const [imagePreview, setImagePreview] = useState(banner?.image || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        image: banner.image || '',
        ctaLabel: banner.ctaLabel || '',
        ctaLink: banner.ctaLink || '',
        isActive: banner.isActive ?? true,
        sortOrder: banner.sortOrder ?? 0,
      });
      setImagePreview(banner.image || '');
    } else {
      setFormData({
        title: '',
        subtitle: '',
        image: '',
        ctaLabel: '',
        ctaLink: '',
        isActive: true,
        sortOrder: 0,
      });
      setImagePreview('');
    }
  }, [banner]);

  const compressImageFile = (file, maxSize = 1600, quality = 0.82) =>
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
      setErrors((prev) => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size must be less than 8MB' }));
      return;
    }

    try {
      const base64String = await compressImageFile(file);
      setFormData((prev) => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
      setErrors((prev) => ({ ...prev, image: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, image: 'Failed to process image. Please try another file.' }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (name === 'image') {
      setImagePreview(value);
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.title.trim()) nextErrors.title = 'Banner title is required';
    if (!formData.image.trim()) nextErrors.image = 'Banner image is required';
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

    if (banner) {
      onCancel();
    } else {
      setFormData({
        title: '',
        subtitle: '',
        image: '',
        ctaLabel: '',
        ctaLink: '',
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
          <p className="section-kicker" style={{ marginBottom: '8px' }}>{banner ? 'Update banner' : 'Create banner'}</p>
          <h3>{banner ? 'Edit Banner' : 'Add New Banner'}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-grid">
        <div className="admin-form-block">
          <div className="form-group">
            <label>Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label>Subtitle</label>
            <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="form-control" />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>CTA Label</label>
              <input type="text" name="ctaLabel" value={formData.ctaLabel} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>CTA Link</label>
              <input type="text" name="ctaLink" value={formData.ctaLink} onChange={handleChange} className="form-control" placeholder="/shop or https://..." />
            </div>
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
              <span>Active banner</span>
            </label>
          </div>
        </div>

        <div className="admin-form-block">
          <label>Banner Image *</label>
          <div className="admin-upload-area banner-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="admin-preview-image banner-preview" />
            ) : (
              <div className="admin-upload-placeholder">
                <ImagePlus size={26} />
                <p>Drag feel preview area</p>
                <span>Upload a large hero image</span>
              </div>
            )}
          </div>

          <input type="file" accept="image/*" onChange={handleFileUpload} className="form-control" />
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label>Image URL or Base64</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} className="form-control" />
            {errors.image && <p className="field-error">{errors.image}</p>}
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-gold">{banner ? 'Save Changes' : 'Create Banner'}</button>
        </div>
      </form>
    </motion.div>
  );
};

export default BannerForm;
