// src/components/vendor/NewProductForm.jsx
import { useState } from 'react';
import { Form, Card, Row, Col, Alert } from 'react-bootstrap';
import { FaUpload, FaInfoCircle } from 'react-icons/fa';
import api from '../../api';
import styles from './VendorDashboard.module.css';

const NewProductForm = () => {
  const initialFormState = {
    name: '',
    price: '',
    category: '',
    description: '',
    image: null,
    imagePreview: null,
    commission_rate: 10 // Default commission
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [platformBenefit, setPlatformBenefit] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Recalculate platform benefit when price or commission changes
    if (name === 'price' || name === 'commission_rate') {
      const price = name === 'price' ? parseFloat(value) || 0 : parseFloat(formData.price) || 0;
      const commission = name === 'commission_rate' ? parseFloat(value) || 0 : parseFloat(formData.commission_rate) || 0;
      
      const benefit = (price * commission / 100).toFixed(2);
      setPlatformBenefit(benefit);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!formData.name || !formData.price || !formData.category || !formData.description || !formData.image) {
        throw new Error('Por favor, completa todos los campos obligatorios.');
      }

      // Create FormData for file upload
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('price', formData.price);
      productData.append('category', formData.category);
      productData.append('description', formData.description);
      productData.append('image', formData.image);
      productData.append('commission_rate', formData.commission_rate);

      // Submit request
      const response = await api.post('/product-requests/', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('¡Tu solicitud ha sido enviada con éxito! Recibirás una notificación cuando sea revisada.');
      setFormData(initialFormState);
      setPlatformBenefit(0);
    } catch (err) {
      console.error('Error al enviar solicitud:', err);
      setError(err.response?.data?.error || err.message || 'Error al enviar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className={styles.sectionTitle}>Nueva solicitud de producto</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card className={styles.formCard}>
        <Card.Body className={styles.formBody}>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del producto*</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Introduce el nombre del producto"
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio*</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría*</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Electronicos">Electrónicos</option>
                    <option value="Juegos">Juegos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Comisión de la plataforma (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="commission_rate"
                    value={formData.commission_rate}
                    onChange={handleChange}
                    placeholder="10"
                    step="0.1"
                    min="5"
                    max="30"
                    required
                    disabled // La comisión es fija por ahora
                  />
                  <Form.Text className="text-muted">
                    Comisión estándar del 10% para todos los productos
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción del producto*</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe tu producto..."
                required
              />
            </Form.Group>
            
            <Row className="mb-4">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Imagen del producto*</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!formData.image}
                      className="d-none"
                    />
                    <Form.Control
                      type="text"
                      placeholder="Selecciona una imagen..."
                      value={formData.image ? formData.image.name : ''}
                      readOnly
                    />
                    <label 
                      htmlFor="image" 
                      className="btn btn-secondary"
                    >
                      <FaUpload className="me-2" /> Subir
                    </label>
                  </div>
                  <Form.Text className="text-muted">
                    Formats: JPG, PNG, GIF. Max size: 5MB
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                {formData.imagePreview && (
                  <div 
                    style={{ 
                      width: '100%', 
                      height: '120px', 
                      border: '1px solid #444',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#1e1e1e'
                    }}
                  >
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                )}
              </Col>
            </Row>
            
            <Card className="bg-dark mb-4">
              <Card.Body>
                <Card.Title className="d-flex align-items-center">
                  <FaInfoCircle className="me-2" />
                  Resumen financiero
                </Card.Title>
                <Row>
                  <Col md={4}>
                    <div className="mb-2">Precio de venta:</div>
                    <div className="h4">${parseFloat(formData.price || 0).toFixed(2)}</div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">Comisión de la plataforma:</div>
                    <div className="h4">${platformBenefit}</div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">Tu ganancia:</div>
                    <div className="h4">${(parseFloat(formData.price || 0) - parseFloat(platformBenefit)).toFixed(2)}</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            <div className="d-grid">
              <button 
                type="submit" 
                className={`btn btn-lg ${styles.submitBtn}`} 
                disabled={loading}
              >
                {loading ? 'Enviando solicitud...' : 'Enviar solicitud'}
              </button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewProductForm;