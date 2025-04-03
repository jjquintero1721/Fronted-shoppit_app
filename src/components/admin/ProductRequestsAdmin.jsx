// src/components/admin/ProductRequestsAdmin.jsx
import { useState, useEffect } from 'react';
import { Card, Badge, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { FaClock, FaCheckCircle, FaTimesCircle, FaFilter, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../api';
import { BASE_URL } from '../../api';
import styles from './AdminDashboard.module.css';
import Spinner from '../ui/Spinner';
import { toast } from 'react-toastify';

const ProductRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  
  // Modal para rechazo
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);
  
  // Estado para aprobación
  const [approveLoading, setApproveLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/requests/?status=${statusFilter}`);
      setRequests(response.data);
      setFilteredRequests(response.data);
      setError('');
    } catch (err) {
      console.error('Error al obtener solicitudes:', err);
      setError('No se pudieron cargar las solicitudes. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setApproveLoading(true);
      const response = await api.post(`/admin/requests/approve/${requestId}/`);
      toast.success('Solicitud aprobada correctamente');
      
      // Actualizar la lista de solicitudes
      setRequests(prev => prev.filter(req => req.id !== requestId));
      setFilteredRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      console.error('Error al aprobar solicitud:', err);
      toast.error('Error al aprobar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setApproveLoading(false);
    }
  };

  const openRejectModal = (requestId) => {
    setRejectRequestId(requestId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    try {
      setRejectLoading(true);
      await api.post(`/admin/requests/reject/${rejectRequestId}/`, {
        notes: rejectReason
      });
      
      toast.success('Solicitud rechazada correctamente');
      
      // Actualizar la lista de solicitudes
      setRequests(prev => prev.filter(req => req.id !== rejectRequestId));
      setFilteredRequests(prev => prev.filter(req => req.id !== rejectRequestId));
      
      // Cerrar el modal
      setShowRejectModal(false);
    } catch (err) {
      console.error('Error al rechazar solicitud:', err);
      toast.error('Error al rechazar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setRejectLoading(false);
    }
  };

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
            onClick={() => fetchRequests()}
          >
            Intentar nuevamente
          </button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <div className={styles.filterSection}>
        <Row>
          <Col md={12} className="d-flex align-items-center">
            <FaFilter className="me-2" />
            <h5 className="mb-0 me-3">Filtrar por estado:</h5>
            <Form.Select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
              <option value="">Todos</option>
            </Form.Select>
          </Col>
        </Row>
      </div>
      
      {filteredRequests.length === 0 ? (
        <div className={styles.noRequestsMessage}>
          <h4>No hay solicitudes {statusFilter !== '' ? `con estado "${statusFilter}"` : ''}</h4>
          <p>
            {statusFilter === 'pending' 
              ? 'No hay solicitudes pendientes por revisar en este momento.'
              : 'No se encontraron solicitudes con los filtros seleccionados.'}
          </p>
        </div>
      ) : (
        <>
          <h3 className={styles.sectionTitle}>
            Solicitudes {statusFilter === 'pending' ? 'pendientes' : statusFilter === 'approved' ? 'aprobadas' : statusFilter === 'rejected' ? 'rechazadas' : ''}
          </h3>
          
          {filteredRequests.map(request => (
            <Card key={request.id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <h5 className={styles.requestTitle}>{request.name}</h5>
                {getStatusBadge(request.status)}
              </div>
              
              <Card.Body className={styles.requestBody}>
                <Row>
                  <Col md={4}>
                    <div className={styles.requestImageContainer}>
                      <img 
                        src={`${BASE_URL}${request.image}`} 
                        alt={request.name}
                        className={styles.requestImage}
                      />
                    </div>
                    <p><strong>Categoría:</strong> {request.category}</p>
                    <p><strong>Vendedor:</strong> {request.vendor_name}</p>
                    <p><strong>Fecha:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
                  </Col>
                  
                  <Col md={4}>
                    <h6>Detalles económicos:</h6>
                    <p><strong>Precio:</strong> ${parseFloat(request.price).toFixed(2)}</p>
                    <p><strong>Comisión:</strong> {request.commission_rate}%</p>
                    <div className={styles.benefitTag}>
                      <FaMoneyBillWave className="me-1" /> 
                      Beneficio para la plataforma: ${parseFloat(request.platform_benefit).toFixed(2)}
                    </div>
                  </Col>
                  
                  <Col md={4}>
                    <h6>Descripción:</h6>
                    <p>{request.description}</p>
                    
                    {request.status === 'pending' && (
                      <div className="d-grid gap-2 mt-3">
                        <Button 
                          className={styles.approveBtn}
                          onClick={() => handleApprove(request.id)}
                          disabled={approveLoading}
                        >
                          <FaCheckCircle className="me-1" /> Aprobar solicitud
                        </Button>
                        
                        <Button 
                          className={styles.rejectBtn}
                          onClick={() => openRejectModal(request.id)}
                        >
                          <FaTimesCircle className="me-1" /> Rechazar solicitud
                        </Button>
                      </div>
                    )}
                    
                    {request.status === 'rejected' && request.admin_notes && (
                      <div className="mt-3">
                        <h6>Motivo de rechazo:</h6>
                        <p className="text-danger">{request.admin_notes}</p>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
      
      {/* Modal de rechazo */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: '#2a2a2a', color: 'white' }}>
          <Modal.Title>Rechazar solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#2a2a2a', color: 'white' }}>
          <Form>
            <Form.Group>
              <Form.Label>Motivo del rechazo:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Proporciona un motivo para el rechazo de la solicitud..."
                required
              />
              <Form.Text className="text-muted">
                Esta información será visible para el vendedor.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#2a2a2a' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowRejectModal(false)}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleReject}
            disabled={rejectLoading || !rejectReason.trim()}
          >
            {rejectLoading ? 'Procesando...' : 'Rechazar solicitud'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductRequestsAdmin;