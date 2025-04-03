// src/components/admin/AdminSubmissionsList.jsx
import { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Spinner, Form, Modal } from 'react-bootstrap';
import api, { BASE_URL } from '../../api';
import { toast } from 'react-toastify';
import styles from './AdminDashboard.module.css';

const AdminSubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [action, setAction] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commission, setCommission] = useState(10);
  
  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);
  
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`admin/submissions/?status=${statusFilter}`);
      setSubmissions(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Error al cargar las solicitudes. Por favor intenta de nuevo.');
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenModal = (submission, actionType) => {
    setSelectedSubmission(submission);
    setAction(actionType);
    setAdminNotes('');
    setCommission(submission.admin_commission || 10);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
    setAction('');
    setAdminNotes('');
  };
  
  const handleSubmitReview = async () => {
    if (!selectedSubmission || !action) return;
    
    try {
      setSubmitting(true);
      
      const requestData = {
        action, 
        admin_notes: adminNotes,
        admin_commission: commission
      };
      
      await api.post(`admin/review_submission/${selectedSubmission.id}/`, requestData);
      
      toast.success(`Producto ${action === 'approve' ? 'aprobado' : 'rechazado'} exitosamente`);
      handleCloseModal();
      fetchSubmissions();
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Error al procesar la solicitud');
    } finally {
      setSubmitting(false);
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
  
  const calculateExpectedCommission = (price, commissionPercentage) => {
    const value = (price * commissionPercentage) / 100;
    return value.toFixed(2);
  };
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando solicitudes...</p>
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
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Productos para Revisión</h2>
        
        <Form.Select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: 'auto' }}
          className={styles.filterDropdown}
        >
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
        </Form.Select>
      </div>
      
      {submissions.length === 0 ? (
        <div className="alert alert-info">
          No hay solicitudes {statusFilter === 'pending' ? 'pendientes' : statusFilter === 'approved' ? 'aprobadas' : 'rechazadas'} en este momento.
        </div>
      ) : (
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
                  <small className="text-muted">Vendedor: {submission.seller_username}</small>
                </div>
                
                <Card.Body>
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
                  <p>
                    <strong>Comisión:</strong> {submission.admin_commission}%
                    <span className="ms-2 text-success">
                      (${calculateExpectedCommission(submission.price, submission.admin_commission)})
                    </span>
                  </p>
                  
                  {submission.description && (
                    <div className="mt-3">
                      <p><strong>Descripción:</strong></p>
                      <p style={{ maxHeight: '100px', overflow: 'auto' }}>{submission.description}</p>
                    </div>
                  )}
                  
                  {statusFilter === 'pending' && (
                    <div className="d-flex mt-3">
                      <Button 
                        variant="success" 
                        className="me-2 flex-grow-1"
                        onClick={() => handleOpenModal(submission, 'approve')}
                      >
                        Aprobar
                      </Button>
                      <Button 
                        variant="danger" 
                        className="flex-grow-1"
                        onClick={() => handleOpenModal(submission, 'reject')}
                      >
                        Rechazar
                      </Button>
                    </div>
                  )}
                  
                  {(statusFilter === 'approved' || statusFilter === 'rejected') && submission.admin_notes && (
                    <div className="mt-3 p-2" style={{ 
                      backgroundColor: statusFilter === 'approved' ? 'rgba(92, 184, 92, 0.1)' : 'rgba(217, 83, 79, 0.1)', 
                      borderRadius: '6px' 
                    }}>
                      <p><strong>Notas del administrador:</strong></p>
                      <p>{submission.admin_notes}</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {/* Review Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title>
            {action === 'approve' ? 'Aprobar Producto' : 'Rechazar Producto'}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className={styles.modalBody}>
          {selectedSubmission && (
            <>
              <h5 className="mb-3">{selectedSubmission.name}</h5>
              <p>Vendedor: {selectedSubmission.seller_username}</p>
              <p>Precio: ${selectedSubmission.price}</p>
              
              {action === 'approve' && (
                <div className={styles.commissionFormGroup}>
                  <div className={styles.commissionLabel}>
                    <span>Comisión de la plataforma:</span>
                    <span className={styles.commissionValue}>{commission}%</span>
                  </div>
                  
                  <Form.Range 
                    min={5}
                    max={30}
                    step={1}
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                    className={styles.commissionSlider}
                  />
                  
                  <div className={styles.commissionInfo}>
                    <span>5%</span>
                    <span>30%</span>
                  </div>
                  
                  <div className="mt-3">
                    <strong>Ingresos estimados por venta:</strong>
                    <p className="mb-0 text-success">
                      ${calculateExpectedCommission(selectedSubmission.price, commission)} por unidad
                    </p>
                  </div>
                </div>
              )}
              
              <Form.Group className="mt-3">
                <Form.Label>
                  {action === 'approve' 
                    ? 'Notas adicionales (opcional)'
                    : 'Motivo del rechazo (requerido)'}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  required={action === 'reject'}
                  placeholder={action === 'approve' 
                    ? 'Añade cualquier nota o comentario para el vendedor...'
                    : 'Explica por qué estás rechazando este producto...'}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button 
            variant={action === 'approve' ? 'success' : 'danger'}
            onClick={handleSubmitReview}
            disabled={action === 'reject' && !adminNotes.trim() || submitting}
          >
            {submitting ? 'Procesando...' : action === 'approve' ? 'Aprobar' : 'Rechazar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminSubmissionsList;