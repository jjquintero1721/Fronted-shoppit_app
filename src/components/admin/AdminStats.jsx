// src/components/admin/AdminStats.jsx
import { useState, useEffect } from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';
import { FaUsers, FaUserTie, FaBoxOpen, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../api';
import styles from './AdminDashboard.module.css';
import Spinner from '../ui/Spinner';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/statistics/');
        setStats(response.data);
        setError('');
      } catch (err) {
        console.error('Error al obtener estadísticas:', err);
        setError('No se pudieron cargar las estadísticas. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  if (!stats) {
    return (
      <Card className={styles.statsCard}>
        <Card.Body>
          <Card.Title>Sin datos</Card.Title>
          <Card.Text>
            No hay datos estadísticos disponibles en este momento.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <div className={styles.statsSection}>
        <h3 className={styles.sectionTitle}>Resumen de la plataforma</h3>
        
        <Row>
          <Col md={4}>
            <Card className={styles.statsCard}>
              <Card.Body className="text-center p-4">
                <FaUsers size={30} color="#6050DC" className="mb-3" />
                <div className={styles.statsValue}>{stats.total_users}</div>
                <div className={styles.statsLabel}>Usuarios registrados</div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className={styles.statsCard}>
              <Card.Body className="text-center p-4">
                <FaUserTie size={30} color="#6050DC" className="mb-3" />
                <div className={styles.statsValue}>{stats.total_vendors}</div>
                <div className={styles.statsLabel}>Vendedores</div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className={styles.statsCard}>
              <Card.Body className="text-center p-4">
                <FaBoxOpen size={30} color="#6050DC" className="mb-3" />
                <div className={styles.statsValue}>{stats.total_products}</div>
                <div className={styles.statsLabel}>Productos publicados</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      
      <div className={styles.statsSection}>
        <h3 className={styles.sectionTitle}>Ventas y comisiones</h3>
        
        <Row>
          <Col md={6}>
            <Card className={styles.statsCard}>
              <Card.Body className="text-center p-4">
                <FaMoneyBillWave size={30} color="#28a745" className="mb-3" />
                <div className={styles.earningsValue}>${parseFloat(stats.total_sales).toFixed(2)}</div>
                <div className={styles.statsLabel}>Ventas totales</div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className={styles.statsCard}>
              <Card.Body className="text-center p-4">
                <FaMoneyBillWave size={30} color="#6050DC" className="mb-3" />
                <div className={styles.statsValue}>${parseFloat(stats.total_commission).toFixed(2)}</div>
                <div className={styles.statsLabel}>Comisiones generadas</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      
      <div className={styles.statsSection}>
        <h3 className={styles.sectionTitle}>Solicitudes pendientes</h3>
        
        <Row>
          <Col>
            <Card className={styles.statsCard}>
              <Card.Body className="d-flex align-items-center p-4">
                <FaClipboardList size={40} color="#ffc107" className="me-3" />
                <div>
                  <div className={styles.statsValue}>{stats.pending_requests}</div>
                  <div className={styles.statsLabel}>
                    Solicitudes de productos pendientes de revisión
                  </div>
                </div>
                {stats.pending_requests > 0 && (
                  <button 
                    className="btn btn-primary ms-auto"
                    onClick={() => document.getElementById('requestsTab').click()}
                  >
                    Ver solicitudes
                  </button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      
      {stats.recent_requests && stats.recent_requests.length > 0 && (
        <div className={styles.statsSection}>
          <h3 className={styles.sectionTitle}>Solicitudes recientes</h3>
          
          <Table responsive variant="dark" hover>
            <thead>
              <tr>
                <th>Vendedor</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Comisión</th>
                <th>Beneficio</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_requests.map(request => (
                <tr key={request.id}>
                  <td>{request.vendor_name}</td>
                  <td>{request.name}</td>
                  <td>${parseFloat(request.price).toFixed(2)}</td>
                  <td>{request.commission_rate}%</td>
                  <td>${parseFloat(request.platform_benefit).toFixed(2)}</td>
                  <td>{new Date(request.created_at).toLocaleDateString()}</td>
                  <td>
                    <span 
                      className={`badge ${
                        request.status === 'pending' 
                          ? 'bg-warning text-dark' 
                          : request.status === 'approved' 
                            ? 'bg-success' 
                            : 'bg-danger'
                      }`}
                    >
                      {request.status === 'pending' 
                        ? 'Pendiente' 
                        : request.status === 'approved' 
                          ? 'Aprobada' 
                          : 'Rechazada'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminStats;