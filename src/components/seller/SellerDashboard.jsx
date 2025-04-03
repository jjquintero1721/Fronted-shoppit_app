// src/components/seller/SellerDashboard.jsx
import { useState } from 'react';
import { Tab, Nav, Container, Row, Col } from 'react-bootstrap';
import SellerProductSubmission from './SellerProductSubmission';
import SellerSubmissionsList from './SellerSubmissionsList';
import SellerStatistics from './SellerStatistics';
import styles from './SellerDashboard.module.css';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('submissions');

  return (
    <Container className={`py-4 ${styles.dashboardContainer}`}>
      <h1 className={styles.dashboardTitle}>Panel de Vendedor</h1>
      
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className={`flex-column ${styles.sideNav}`}>
              <Nav.Item>
                <Nav.Link eventKey="submissions" className={styles.navLink}>
                  Mis Productos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="submit" className={styles.navLink}>
                  Publicar Nuevo Producto
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="stats" className={styles.navLink}>
                  Estadísticas de Ventas
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="submissions">
                <SellerSubmissionsList />
              </Tab.Pane>
              <Tab.Pane eventKey="submit">
                <SellerProductSubmission />
              </Tab.Pane>
              <Tab.Pane eventKey="stats">
                <SellerStatistics />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default SellerDashboard;