// src/components/admin/AdminDashboard.jsx
import { useState } from 'react';
import { Tab, Nav, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AdminStats from './AdminStats';
import ProductRequestsAdmin from './ProductRequestsAdmin';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const { isAuthenticated, username, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirigir si el usuario no está autenticado o no es admin
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (!isAdmin) {
    return (
      <Container className="my-5">
        <Card className={styles.errorCard}>
          <Card.Body>
            <Card.Title>Acceso denegado</Card.Title>
            <Card.Text>
              Esta área es solo para administradores. Tu cuenta actual no tiene permisos de administrador.
            </Card.Text>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/')}
            >
              Volver a la tienda
            </button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className={styles.dashboardTitle}>Panel de Administrador</h2>
      <p className={styles.welcomeText}>Bienvenido, {username}. Administra la plataforma desde aquí.</p>
      
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col md={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link 
                  eventKey="stats" 
                  className={styles.navLink}
                  active={activeTab === 'stats'}
                >
                  Estadísticas de la plataforma
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  eventKey="requests" 
                  className={styles.navLink}
                  active={activeTab === 'requests'}
                >
                  Solicitudes de productos
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="stats">
                <AdminStats />
              </Tab.Pane>
              <Tab.Pane eventKey="requests">
                <ProductRequestsAdmin />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AdminDashboard;