import React, { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'Skin',
    customCategory: '',
    price: product?.price || '',
    salePrice: product?.salePrice || '',
    stock: product?.stock ?? 0,
    stockAlertLevel: product?.stockAlertLevel ?? 5,
    image: product?.image || '',
    description: product?.description || '',
    isNew: product?.isNew || false,
    isOnSale: product?.isOnSale || false,
  });

  const [imagePreview, setImagePreview] = useState(product?.image || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: ['Skin', 'Body', 'Hair'].includes(product.category) ? product.category : 'Custom',
        customCategory: ['Skin', 'Body', 'Hair'].includes(product.category) ? '' : (product.category || ''),
        price: product.price || '',
        salePrice: product.salePrice || '',
        stock: product.stock ?? 0,
        stockAlertLevel: product.stockAlertLevel ?? 5,
        image: product.image || '',
        description: product.description || '',
        isNew: product.isNew || false,
        isOnSale: product.isOnSale || false,
      });
      setImagePreview(product.image || '');
    } else {
      setFormData({
        name: '',
        category: 'Skin',
        customCategory: '',
        price: '',
        salePrice: '',
        stock: 0,
        stockAlertLevel: 5,
        image: '',
        description: '',
        isNew: false,
        isOnSale: false,
      });
      setImagePreview('');
    }
  }, [product]);

  const compressImageFile = (file, maxSize = 1200, quality = 0.82) =>
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) nextErrors.price = 'Valid price is required';
    if (!formData.image.trim()) nextErrors.image = 'Please upload a product image';
    if (!formData.description.trim()) nextErrors.description = 'Description is required';
    if (formData.category === 'Custom' && !formData.customCategory.trim()) {
      nextErrors.customCategory = 'Please enter a custom category';
    }
    if (formData.stock === '' || Number(formData.stock) < 0) {
      nextErrors.stock = 'Stock must be 0 or higher';
    }
    if (formData.stockAlertLevel === '' || Number(formData.stockAlertLevel) < 0) {
      nextErrors.stockAlertLevel = 'Stock alert level must be 0 or higher';
    }
    if (formData.salePrice && parseFloat(formData.salePrice) >= parseFloat(formData.price)) {
      nextErrors.salePrice = 'Sale price must be less than regular price';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalCategory = formData.category === 'Custom'
      ? formData.customCategory.trim()
      : formData.category;

    onSubmit({
      ...formData,
      category: finalCategory,
      customCategory: '',
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : '',
      stock: Number(formData.stock),
      stockAlertLevel: Number(formData.stockAlertLevel),
    });

    if (product) {
      onCancel();
    } else {
      setFormData({
        name: '',
        category: 'Skin',
        customCategory: '',
        price: '',
        salePrice: '',
        stock: 0,
        stockAlertLevel: 5,
        image: '',
        description: '',
        isNew: false,
        isOnSale: false,
      });
      setImagePreview('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="admin-form-card">
      <div className="admin-form-head">
        <div>
          <p className="section-kicker" style={{ marginBottom: '8px' }}>{product ? 'Update product' : 'Create product'}</p>
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-grid">
        <div className="admin-form-block">
          <div className="form-group">
            <label>Product Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-control">
                <option value="Skin">Skin</option>
                <option value="Body">Body</option>
                <option value="Hair">Hair</option>
                <option value="Custom">Custom Category</option>
              </select>
              {formData.category === 'Custom' && (
                <>
                  <input
                    type="text"
                    name="customCategory"
                    value={formData.customCategory}
                    onChange={handleChange}
                    placeholder="Type category name"
                    className="form-control"
                    style={{ marginTop: '10px' }}
                  />
                  {errors.customCategory && <p className="field-error">{errors.customCategory}</p>}
                </>
              )}
            </div>

            <div className="form-group">
              <label>Price ($) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" className="form-control" />
              {errors.price && <p className="field-error">{errors.price}</p>}
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Sale Price ($)</label>
              <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} step="0.01" min="0" className="form-control" />
              {errors.salePrice && <p className="field-error">{errors.salePrice}</p>}
            </div>
            <div className="form-group">
              <label>Stock *</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} step="1" min="0" className="form-control" />
              {errors.stock && <p className="field-error">{errors.stock}</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Low Stock Alert Level *</label>
            <input
              type="number"
              name="stockAlertLevel"
              value={formData.stockAlertLevel}
              onChange={handleChange}
              step="1"
              min="0"
              className="form-control"
            />
            {errors.stockAlertLevel && <p className="field-error">{errors.stockAlertLevel}</p>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="6" className="form-control" />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>

          <div className="admin-checkbox-row">
            <label className="admin-check">
              <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} />
              <span>Mark as new</span>
            </label>
            <label className="admin-check">
              <input type="checkbox" name="isOnSale" checked={formData.isOnSale} onChange={handleChange} />
              <span>Mark as on sale</span>
            </label>
          </div>
        </div>

        <div className="admin-form-block">
          <label>Product Image *</label>
          <div className="admin-upload-area">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="admin-preview-image" />
            ) : (
              <div className="admin-upload-placeholder">
                <ImagePlus size={26} />
                <p>Drag feel preview area</p>
                <span>Upload a large clean product image</span>
              </div>
            )}
          </div>

          <input type="file" accept="image/*" onChange={handleFileUpload} className="form-control" />
          {errors.image && <p className="field-error">{errors.image}</p>}
        </div>

        <div className="admin-form-actions">
          <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-gold">{product ? 'Save Changes' : 'Create Product'}</button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;
