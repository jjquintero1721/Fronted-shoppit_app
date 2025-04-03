// src/components/seller/SellerSubmissionsList.jsx
import { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import api, { BASE_URL } from '../../api';
import { toast } from 'react-toastify';
import styles from './SellerDashboard.module.css';

const SellerSubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchSubmissions();
  }, []);
  
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('seller/submissions/');
      setSubmissions(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Error al cargar tus productos. Por favor intenta de nuevo.');
      toast.error('Error al cargar tus productos');
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className={`${styles.statusBadge} ${styles.statusPending}`}>Pendiente</Badge>;
      case 'approved':
        return <Badge className={`${styles.statusBadge} ${styles.statusApproved}`}>Aprobado</Badge>;
      case 'rejected':
        return <Badge className={`${styles.statusBadge} ${styles.statusRejected}`}>Rechazado</Badge>;
      default:
        return <Badge className={styles.statusBadge}>Desconocido</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando tus productos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <Button 
          variant="outline-danger"
          size="sm"
          className="ms-3"
          onClick={fetchSubmissions}
        >
          Reintentar
        </Button>
      </div>
    );
  }
  
  if (submissions.length === 0) {
    return (
      <div className="text-center my-5">
        <h3>No tienes productos enviados</h3>
        <p className="text-muted">Usa la pestaña "Publicar Nuevo Producto" para comenzar a vender.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="mb-4">Mis Productos</h2>
      <Button 
        variant="outline-primary" 
        className="mb-4" 
        onClick={fetchSubmissions}
        style={{ borderColor: '#6050DC', color: '#6050DC' }}
      >
        Actualizar Lista
      </Button>
      
      <Row>
        {submissions.map(submission => (
          <Col md={6} lg={4} key={submission.id} className="mb-4">
            <Card className={styles.submissionCard}>
              <div className={styles.cardHeader}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={{ maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {submission.name}
                  </h5>
                  {getStatusBadge(submission.status)}
                </div>
              </div>
              
              <Card.Body className={styles.cardBody}>
                <div className="text-center mb-3">
                  <img 
                    src={`${BASE_URL}${submission.image}`} 
                    alt={submission.name}
                    className={styles.productImage} 
                  />
                </div>
                
                <p><strong>Precio:</strong> ${submission.price}</p>
                <p><strong>Categoría:</strong> {submission.category}</p>
                <p><strong>Fecha de envío:</strong> {new Date(submission.submitted_at).toLocaleDateString()}</p>
                
                {submission.status === 'rejected' && submission.admin_notes && (
                  <div className="mt-3 p-2" style={{ backgroundColor: 'rgba(217, 83, 79, 0.1)', borderRadius: '6px' }}>
                    <p><strong>Motivo de rechazo:</strong></p>
                    <p>{submission.admin_notes}</p>
                  </div>
                )}
                
                {submission.status === 'approved' && submission.admin_notes && (
                  <div className="mt-3 p-2" style={{ backgroundColor: 'rgba(92, 184, 92, 0.1)', borderRadius: '6px' }}>
                    <p><strong>Notas del administrador:</strong></p>
                    <p>{submission.admin_notes}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SellerSubmissionsList;