// src/components/vendor/ProductRequestList.jsx
import { useState, useEffect } from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import api from '../../api';
import { BASE_URL } from '../../api';
import styles from './VendorDashboard.module.css';
import Spinner from '../ui/Spinner';

const ProductRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get('/vendor-requests/');
        setRequests(response.data);
        setError('');
      } catch (err) {
        console.error('Error al obtener solicitudes:', err);
        setError('No se pudieron cargar las solicitudes. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className={`${styles.statusBadge} ${styles.pendingBadge}`}>
            <FaClock className="me-1" /> Pendiente
          </Badge>
        );
      case 'approved':
        return (
          <Badge className={`${styles.statusBadge} ${styles.approvedBadge}`}>
            <FaCheckCircle className="me-1" /> Aprobado
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className={`${styles.statusBadge} ${styles.rejectedBadge}`}>
            <FaTimesCircle className="me-1" /> Rechazado
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Spinner loading={loading} />;
  }

  if (error) {
    return (
      <Card className={styles.errorCard}>
        <Card.Body>
          <Card.Title>Error</Card.Title>
          <Card.Text>{error}</Card.Text>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Intentar nuevamente
          </button>
        </Card.Body>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className={styles.formCard}>
        <Card.Body className="text-center p-4">
          <Card.Title>No hay solicitudes</Card.Title>
          <Card.Text>
            Aún no has enviado ninguna solicitud para publicar productos.
          </Card.Text>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.href = '#/vendor/dashboard/newProduct'}
          >
            Crear nueva solicitud
          </button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <h3 className={styles.sectionTitle}>Mis solicitudes de productos</h3>
      
      <Row>
        {requests.map(request => (
          <Col key={request.id} md={6} className="mb-4">
            <Card className={styles.statsCard}>
              <div style={{ 
                height: '150px', 
                overflow: 'hidden',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                backgroundColor: '#1e1e1e'
              }}>
                <img 
                  src={`${BASE_URL}${request.image}`} 
                  alt={request.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain' 
                  }}
                />
              </div>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title>{request.name}</Card.Title>
                  {getStatusBadge(request.status)}
                </div>
                <Card.Text>
                  Precio: ${parseFloat(request.price).toFixed(2)}
                </Card.Text>
                <Card.Text>
                  Comisión: {request.commission_rate}% (${parseFloat(request.platform_benefit).toFixed(2)})
                </Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    Solicitud creada: {new Date(request.created_at).toLocaleDateString()}
                  </small>
                </Card.Text>
                
                {request.admin_notes && request.status === 'rejected' && (
                  <Card.Footer className="bg-danger bg-opacity-25 mt-2 p-2 rounded">
                    <strong>Motivo de rechazo:</strong> {request.admin_notes}
                  </Card.Footer>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductRequestList;