// src/components/vendor/VendorDashboard.jsx
import { useState } from 'react';
import { Tab, Nav, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import VendorStats from './VendorStats';
import ProductRequestList from './ProductRequestList';
import NewProductForm from './NewProductForm';
import styles from './VendorDashboard.module.css';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const { isAuthenticated, username, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirigir si el usuario no está autenticado o no es vendedor
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (userRole !== 'vendor') {
    return (
      <Container className="my-5">
        <Card className={styles.errorCard}>
          <Card.Body>
            <Card.Title>Acceso denegado</Card.Title>
            <Card.Text>
              Esta área es solo para vendedores. Tu cuenta actual no tiene permisos de vendedor.
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
      <h2 className={styles.dashboardTitle}>Panel de Vendedor</h2>
      <p className={styles.welcomeText}>Bienvenido, {username}. Administra tus productos y ventas aquí.</p>
      
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
                  Estadísticas de ventas
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  eventKey="requests" 
                  className={styles.navLink}
                  active={activeTab === 'requests'}
                >
                  Mis solicitudes
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  eventKey="newProduct" 
                  className={styles.navLink}
                  active={activeTab === 'newProduct'}
                >
                  Nueva solicitud
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="stats">
                <VendorStats />
              </Tab.Pane>
              <Tab.Pane eventKey="requests">
                <ProductRequestList />
              </Tab.Pane>
              <Tab.Pane eventKey="newProduct">
                <NewProductForm />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default VendorDashboard;