import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiSave,
  FiArrowLeft,
  FiTrash2,
  FiPlus,
  FiX,
  FiImage,
} from 'react-icons/fi';
import { productApi } from '../../../services/adminApi';
import { useCategories } from '../../../hooks/useContent';
import type { ProductFormData, ProductVariantFormData } from '../../../types';
import './ProductForm.css';

interface ProductFormProps {
  mode: 'create' | 'edit';
}

const ProductForm: React.FC<ProductFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories from database
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    description: '',
    image: '',
    features: [],
    isActive: true,
    tags: [],
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    seoTitle: '',
    seoDescription: '',
    variants: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (mode === 'edit' && productId) {
      const loadData = async () => {
        if (!productId) return;

        try {
          setIsLoading(true);
          const response = await productApi.getProduct(productId);
          const product = response.data;

          setFormData({
            name: product.name,
            category: product.category,
            description: product.description,
            image: product.image,
            features: product.features || [],
            isActive: product.isActive ?? true,
            tags: product.tags || [],
            weight: product.weight || 0,
            dimensions: product.dimensions || {
              length: 0,
              width: 0,
              height: 0,
            },
            seoTitle: product.seoTitle || '',
            seoDescription: product.seoDescription || '',
            variants: product.variants.map(variant => ({
              size: variant.size,
              price: variant.price,
              unit: variant.unit,
              inStock: variant.inStock,
              stockQuantity: variant.stockQuantity || 0,
              sku: variant.sku || '',
              costPrice: variant.costPrice || 0,
              discountPrice: variant.discountPrice,
            })),
          });

          setImagePreview(product.image);
        } catch (error) {
          console.error('Error loading product:', error);
          alert('Error loading product. Please try again.');
          navigate('/admin/products');
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }
  }, [mode, productId, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Product image is required';
    }

    if (formData.variants.length === 0) {
      newErrors.variants = 'At least one variant is required';
    }

    // Validate variants
    formData.variants.forEach((variant, index) => {
      if (!variant.size.trim()) {
        newErrors[`variant_${index}_size`] = 'Variant size is required';
      }
      if (variant.price <= 0) {
        newErrors[`variant_${index}_price`] = 'Price must be greater than 0';
      }
      if (!variant.unit.trim()) {
        newErrors[`variant_${index}_unit`] = 'Unit is required';
      }
      if (!variant.sku.trim()) {
        newErrors[`variant_${index}_sku`] = 'SKU is required';
      }
      if (variant.costPrice <= 0) {
        newErrors[`variant_${index}_costPrice`] =
          'Cost price must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      if (mode === 'create') {
        await productApi.createProduct(formData);
        alert('Product created successfully!');
      } else if (productId) {
        await productApi.updateProduct(productId, formData);
        alert('Product updated successfully!');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDimensionChange = (
    dimension: 'length' | 'width' | 'height',
    value: number
  ) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value,
      },
    }));
  };

  const handleVariantChange = (
    index: number,
    field: string,
    value: string | number | boolean | undefined
  ) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));

    // Clear variant errors when user starts typing
    const errorKey = `variant_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addVariant = () => {
    const newVariant: ProductVariantFormData = {
      size: '',
      price: 0,
      unit: 'kg',
      inStock: true,
      stockQuantity: 0,
      sku: '',
      costPrice: 0,
      discountPrice: 0,
    };

    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For now, we'll create a local URL
      const reader = new FileReader();
      reader.onload = event => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="product-form">
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}
        >
          <div
            style={{ fontSize: '1.125rem', color: 'var(--color-text-light)' }}
          >
            Loading product...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-form">
      <div className="page-header">
        <h1 className="page-title">
          {mode === 'create' ? 'Add New Product' : 'Edit Product'}
        </h1>
        <p className="page-subtitle">
          {mode === 'create'
            ? 'Create a new product for your catalog'
            : 'Update product information and variants'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-content">
            <div className="form-sections">
              {/* Basic Information */}
              <div className="form-section">
                <div className="section-header">
                  <h2 className="section-title">Basic Information</h2>
                  <p className="section-description">
                    Essential details about your product
                  </p>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">
                      Product Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <div className="input-error">{errors.name}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Category <span className="required">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.category ? 'error' : ''}`}
                      value={formData.category}
                      onChange={e =>
                        handleInputChange('category', e.target.value)
                      }
                      disabled={categoriesLoading}
                    >
                      <option value="">
                        {categoriesLoading
                          ? 'Loading categories...'
                          : 'Select Category'}
                      </option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <div className="input-error">{errors.category}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      value={formData.weight}
                      onChange={e =>
                        handleInputChange('weight', Number(e.target.value))
                      }
                      placeholder="Product weight"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">
                      Description <span className="required">*</span>
                    </label>
                    <textarea
                      className={`form-textarea ${errors.description ? 'error' : ''}`}
                      value={formData.description}
                      onChange={e =>
                        handleInputChange('description', e.target.value)
                      }
                      placeholder="Describe your product..."
                      rows={4}
                    />
                    {errors.description && (
                      <div className="input-error">{errors.description}</div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Product Status</label>
                    <div className="form-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={e =>
                          handleInputChange('isActive', e.target.checked)
                        }
                      />
                      <span className="checkbox-label">
                        Product is active and visible to customers
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Image */}
              <div className="form-section">
                <div className="section-header">
                  <h2 className="section-title">Product Image</h2>
                  <p className="section-description">
                    Upload a high-quality image of your product
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Product Image <span className="required">*</span>
                  </label>
                  <div
                    className={`image-upload ${imagePreview ? 'has-image' : ''}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      style={{ cursor: 'pointer', display: 'block' }}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="image-preview"
                        />
                      ) : (
                        <>
                          <FiImage className="upload-icon" />
                          <div className="upload-text">
                            Upload Product Image
                          </div>
                          <div className="upload-hint">
                            Click to select or drag and drop (PNG, JPG up to
                            5MB)
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                  {errors.image && (
                    <div className="input-error">{errors.image}</div>
                  )}
                </div>
              </div>

              {/* Product Variants */}
              <div className="form-section">
                <div className="section-header">
                  <h2 className="section-title">Product Variants</h2>
                  <p className="section-description">
                    Define different sizes, prices, and stock levels for your
                    product
                  </p>
                </div>

                {formData.variants.map((variant, index) => (
                  <div key={index} className="variant-item">
                    <div className="variant-header">
                      <h3 className="variant-title">Variant {index + 1}</h3>
                      <button
                        type="button"
                        className="variant-remove"
                        onClick={() => removeVariant(index)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">
                          Size <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-input ${errors[`variant_${index}_size`] ? 'error' : ''}`}
                          value={variant.size}
                          onChange={e =>
                            handleVariantChange(index, 'size', e.target.value)
                          }
                          placeholder="e.g., 1 kg, 2 dozen"
                        />
                        {errors[`variant_${index}_size`] && (
                          <div className="input-error">
                            {errors[`variant_${index}_size`]}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Unit <span className="required">*</span>
                        </label>
                        <select
                          className={`form-select ${errors[`variant_${index}_unit`] ? 'error' : ''}`}
                          value={variant.unit}
                          onChange={e =>
                            handleVariantChange(index, 'unit', e.target.value)
                          }
                        >
                          <option value="">Select Unit</option>
                          <option value="kg">Kilogram (kg)</option>
                          <option value="g">Gram (g)</option>
                          <option value="L">Liter (L)</option>
                          <option value="ml">Milliliter (ml)</option>
                          <option value="dozen">Dozen</option>
                          <option value="piece">Piece</option>
                        </select>
                        {errors[`variant_${index}_unit`] && (
                          <div className="input-error">
                            {errors[`variant_${index}_unit`]}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Selling Price (₹) <span className="required">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={`form-input ${errors[`variant_${index}_price`] ? 'error' : ''}`}
                          value={variant.price}
                          onChange={e =>
                            handleVariantChange(
                              index,
                              'price',
                              Number(e.target.value)
                            )
                          }
                          placeholder="0.00"
                        />
                        {errors[`variant_${index}_price`] && (
                          <div className="input-error">
                            {errors[`variant_${index}_price`]}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Cost Price (₹) <span className="required">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={`form-input ${errors[`variant_${index}_costPrice`] ? 'error' : ''}`}
                          value={variant.costPrice}
                          onChange={e =>
                            handleVariantChange(
                              index,
                              'costPrice',
                              Number(e.target.value)
                            )
                          }
                          placeholder="0.00"
                        />
                        {errors[`variant_${index}_costPrice`] && (
                          <div className="input-error">
                            {errors[`variant_${index}_costPrice`]}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Discount Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-input"
                          value={variant.discountPrice || ''}
                          onChange={e =>
                            handleVariantChange(
                              index,
                              'discountPrice',
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          placeholder="0.00"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          SKU <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-input ${errors[`variant_${index}_sku`] ? 'error' : ''}`}
                          value={variant.sku}
                          onChange={e =>
                            handleVariantChange(index, 'sku', e.target.value)
                          }
                          placeholder="e.g., MAN-ALF-1KG"
                        />
                        {errors[`variant_${index}_sku`] && (
                          <div className="input-error">
                            {errors[`variant_${index}_sku`]}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Stock Quantity</label>
                        <input
                          type="number"
                          min="0"
                          className="form-input"
                          value={variant.stockQuantity}
                          onChange={e =>
                            handleVariantChange(
                              index,
                              'stockQuantity',
                              Number(e.target.value)
                            )
                          }
                          placeholder="0"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Stock Status</label>
                        <div className="form-checkbox">
                          <input
                            type="checkbox"
                            checked={variant.inStock}
                            onChange={e =>
                              handleVariantChange(
                                index,
                                'inStock',
                                e.target.checked
                              )
                            }
                          />
                          <span className="checkbox-label">In Stock</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-variant-btn"
                  onClick={addVariant}
                >
                  <FiPlus />
                  Add Variant
                </button>
                {errors.variants && (
                  <div className="input-error">{errors.variants}</div>
                )}
              </div>

              {/* Additional Information */}
              <div className="form-section">
                <div className="section-header">
                  <h2 className="section-title">Additional Information</h2>
                  <p className="section-description">
                    Tags, features, and dimensions for better categorization
                  </p>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Tags</label>
                    <div className="tags-input">
                      {formData.tags.map(tag => (
                        <div key={tag} className="tag-item">
                          <span>{tag}</span>
                          <button
                            type="button"
                            className="tag-remove"
                            onClick={() => removeTag(tag)}
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        className="tag-input"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleTagInput}
                        placeholder="Add tags... (Press Enter to add)"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Length (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      value={formData.dimensions.length}
                      onChange={e =>
                        handleDimensionChange('length', Number(e.target.value))
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Width (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      value={formData.dimensions.width}
                      onChange={e =>
                        handleDimensionChange('width', Number(e.target.value))
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      value={formData.dimensions.height}
                      onChange={e =>
                        handleDimensionChange('height', Number(e.target.value))
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Product Features</label>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <input
                          type="text"
                          className="feature-input"
                          value={feature}
                          onChange={e => updateFeature(index, e.target.value)}
                          placeholder="Enter product feature..."
                        />
                        <button
                          type="button"
                          className="feature-remove"
                          onClick={() => removeFeature(index)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-feature-btn"
                      onClick={addFeature}
                    >
                      <FiPlus />
                      Add Feature
                    </button>
                  </div>
                </div>
              </div>

              {/* SEO Information */}
              <div className="form-section">
                <div className="section-header">
                  <h2 className="section-title">SEO Information</h2>
                  <p className="section-description">
                    Optimize your product for search engines
                  </p>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">SEO Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.seoTitle}
                      onChange={e =>
                        handleInputChange('seoTitle', e.target.value)
                      }
                      placeholder="SEO-friendly title for search engines"
                      maxLength={60}
                    />
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        marginTop: '0.25rem',
                      }}
                    >
                      {formData.seoTitle.length}/60 characters
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">SEO Description</label>
                    <textarea
                      className="form-textarea"
                      value={formData.seoDescription}
                      onChange={e =>
                        handleInputChange('seoDescription', e.target.value)
                      }
                      placeholder="SEO-friendly description for search engines"
                      maxLength={160}
                      rows={3}
                    />
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        marginTop: '0.25rem',
                      }}
                    >
                      {formData.seoDescription.length}/160 characters
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <div className="actions-left">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate('/admin/products')}
              >
                <FiArrowLeft />
                Cancel
              </button>
            </div>

            <div className="actions-right">
              {mode === 'edit' && (
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to delete this product?'
                      )
                    ) {
                      // Handle delete
                    }
                  }}
                >
                  <FiTrash2 />
                  Delete Product
                </button>
              )}
              <button
                type="submit"
                className="primary-button"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="spinner" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave />
                    <span>
                      {mode === 'create' ? 'Create Product' : 'Update Product'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
