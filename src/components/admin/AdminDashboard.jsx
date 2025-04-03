// src/components/admin/AdminDashboard.jsx
import { useState } from 'react';
import { Tab, Nav, Container, Row, Col } from 'react-bootstrap';
import AdminSubmissionsList from './AdminSubmissionsList';
import AdminStatistics from './AdminStatistics';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('submissions');

  return (
    <Container className={`py-4 ${styles.dashboardContainer}`}>
      <h1 className={styles.dashboardTitle}>Panel de Administrador</h1>
      
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className={`flex-column ${styles.sideNav}`}>
              <Nav.Item>
                <Nav.Link eventKey="submissions" className={styles.navLink}>
                  Productos Pendientes
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="stats" className={styles.navLink}>
                  Estadísticas de la Plataforma
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="submissions">
                <AdminSubmissionsList />
              </Tab.Pane>
              <Tab.Pane eventKey="stats">
                <AdminStatistics />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AdminDashboard;