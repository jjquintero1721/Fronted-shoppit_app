// src/components/admin/AdminStatistics.jsx
import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../../api';
import styles from './AdminDashboard.module.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchStatistics();
  }, []);
  
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await api.get('admin/statistics/');
      setStats(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching admin statistics:', err);
      setError('Error al cargar las estadísticas. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const prepareSellerChartData = () => {
    if (!stats || !stats.top_sellers || stats.top_sellers.length === 0) return null;
    
    // Take the top 5 sellers for the chart
    const topFiveSellers = stats.top_sellers.slice(0, 5);
    
    // Prepare data for the chart
    return {
      labels: topFiveSellers.map(seller => seller[0]),
      datasets: [
        {
          label: 'Ventas por Vendedor',
          data: topFiveSellers.map(seller => seller[1]),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e0e0e0',
        },
      },
      title: {
        display: true,
        text: 'Distribución de Ventas por Vendedor',
        color: '#e0e0e0',
        font: {
          size: 16,
        },
      },
    },
  };
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando estadísticas de la plataforma...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }
  
  if (!stats) {
    return (
      <Alert variant="info">
        No hay estadísticas disponibles en este momento.
      </Alert>
    );
  }
  
  const sellerChartData = prepareSellerChartData();
  
  return (
    <div>
      <h2 className="mb-4">Estadísticas de la Plataforma</h2>
      
      <Row className="mb-4">
        <Col md={3}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Ventas Totales</h3>
            <div className={styles.statValue}>
              ${stats.total_platform_sales?.toFixed(2) || '0.00'}
            </div>
            <div className={styles.statSubtext}>
              Ingresos totales de la plataforma
            </div>
          </div>
        </Col>
        
        <Col md={3}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Vendedores</h3>
            <div className={styles.statValue}>
              {stats.total_sellers || 0}
            </div>
            <div className={styles.statSubtext}>
              Vendedores activos
            </div>
          </div>
        </Col>
        
        <Col md={3}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Productos Pendientes</h3>
            <div className={styles.statValue}>
              {stats.pending_submissions_count || 0}
            </div>
            <div className={styles.statSubtext}>
              Esperando aprobación
            </div>
          </div>
        </Col>
        
        <Col md={3}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Venta Promedio</h3>
            <div className={styles.statValue}>
              ${stats.total_sellers > 0 
                ? (stats.total_platform_sales / stats.total_sellers).toFixed(2) 
                : '0.00'
              }
            </div>
            <div className={styles.statSubtext}>
              Por vendedor
            </div>
          </div>
        </Col>
      </Row>
      
      <Row>
        {sellerChartData && (
          <Col md={6}>
            <Card className="mb-4" style={{ backgroundColor: '#2a2a2a', borderRadius: '10px' }}>
              <Card.Body>
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Doughnut data={sellerChartData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
        
        {stats.top_sellers && stats.top_sellers.length > 0 && (
          <Col md={6}>
            <Card style={{ backgroundColor: '#2a2a2a', borderRadius: '10px' }}>
              <Card.Header style={{ backgroundColor: '#333', color: '#fff' }}>
                Vendedores con Mayores Ventas
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover variant="dark">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Vendedor</th>
                      <th>Ventas Totales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.top_sellers.map((seller, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{seller[0]}</td>
                        <td>${seller[1].toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default AdminStatistics;