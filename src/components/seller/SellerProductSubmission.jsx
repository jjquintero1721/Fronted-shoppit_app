// src/components/seller/SellerProductSubmission.jsx
import { useState, useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../../api';
import { toast } from 'react-toastify';
import styles from './SellerDashboard.module.css';

const SellerProductSubmission = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    admin_commission: 10, // Default commission percentage
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const fileInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate form
    if (!formData.name || !formData.price || !formData.category || !image) {
      setError('Por favor completa todos los campos obligatorios y sube una imagen.');
      setLoading(false);
      return;
    }
    
    try {
      // Create FormData object for file upload
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', parseFloat(formData.price));
      productData.append('category', formData.category);
      productData.append('image', image);
      productData.append('admin_commission', formData.admin_commission);
      
      // Submit the product
      const response = await api.post('seller/submit_product/', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('¡Producto enviado con éxito! Está pendiente de aprobación por un administrador.');
      toast.success('Producto enviado para aprobación');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        admin_commission: 10,
      });
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err) {
      console.error('Error submitting product:', err);
      setError(err.response?.data?.error || 'Error al enviar el producto. Por favor intenta de nuevo.');
      toast.error('Error al enviar el producto');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Enviar Nuevo Producto</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Nombre del Producto*</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ingresa el nombre del producto"
            required
          />
        </Form.Group>
        
        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ingresa una descripción detallada del producto"
          />
        </Form.Group>
        
        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Precio*</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            min="0"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Ingresa el precio del producto"
            required
          />
        </Form.Group>
        
        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Categoría*</Form.Label>
          <Form.Control
            as="select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una categoría</option>
            <option value="Electronicos">Electrónicos</option>
            <option value="Juegos">Juegos</option>
          </Form.Control>
        </Form.Group>
        
        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Imagen del Producto*</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            required
          />
          <Form.Text className="text-muted">
            Sube una imagen clara y de alta calidad de tu producto.
          </Form.Text>
        </Form.Group>
        
        {imagePreview && (
          <div className="mb-3">
            <p className={styles.formLabel}>Vista previa:</p>
            <img 
              src={imagePreview} 
              alt="Vista previa" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
                display: 'block',
                margin: '0 auto',
                borderRadius: '8px'
              }} 
            />
          </div>
        )}
        
        <div className="d-grid gap-2">
          <Button 
            variant="primary" 
            type="submit" 
            size="lg"
            disabled={loading}
            style={{ backgroundColor: '#6050DC', borderColor: '#6050DC' }}
          >
            {loading ? 'Enviando...' : 'Enviar Producto para Aprobación'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SellerProductSubmission;