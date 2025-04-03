// src/components/seller/SellerStatistics.jsx
import { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert, Card, Table } from 'react-bootstrap';
import api from '../../api';
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './SellerDashboard.module.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SellerStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchStatistics();
  }, []);
  
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await api.get('seller/statistics/');
      setStats(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Error al cargar tus estadísticas. Por favor intenta de nuevo.');
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };
  
  // Prepare chart data if statistics are available
  const prepareChartData = () => {
    if (!stats || !stats.sales_by_date) return null;
    
    // Sort dates
    const dates = Object.keys(stats.sales_by_date).sort();
    const salesData = dates.map(date => stats.sales_by_date[date]);
    
    return {
      labels: dates,
      datasets: [
        {
          label: 'Ventas ($)',
          data: salesData,
          borderColor: '#6050DC',
          backgroundColor: 'rgba(96, 80, 220, 0.5)',
          tension: 0.3,
        },
      ],
    };
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventas diarias',
        color: '#e0e0e0',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#e0e0e0',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#e0e0e0',
        },
      },
    },
  };
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando tus estadísticas...</p>
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
        No hay estadísticas disponibles. Esto puede deberse a que aún no has realizado ninguna venta.
      </Alert>
    );
  }
  
  const chartData = prepareChartData();
  
  return (
    <div>
      <h2 className="mb-4">Estadísticas de Ventas</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Ventas Totales</h3>
            <div className={styles.statValue}>
              ${stats.total_sales?.toFixed(2) || '0.00'}
            </div>
            <div className={styles.statSubtext}>
              Ingresos de todos tus productos
            </div>
          </div>
        </Col>
        
        <Col md={4}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Productos Vendidos</h3>
            <div className={styles.statValue}>
              {stats.total_items_sold || 0}
            </div>
            <div className={styles.statSubtext}>
              Unidades totales vendidas
            </div>
          </div>
        </Col>
        
        <Col md={4}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Promedio por Venta</h3>
            <div className={styles.statValue}>
              ${stats.total_items_sold ? (stats.total_sales / stats.total_items_sold).toFixed(2) : '0.00'}
            </div>
            <div className={styles.statSubtext}>
              Valor promedio por unidad vendida
            </div>
          </div>
        </Col>
      </Row>
      
      {chartData && (
        <Card className="mb-4" style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '10px' }}>
          <Card.Body>
            <Line data={chartData} options={chartOptions} />
          </Card.Body>
        </Card>
      )}
      
      {stats.top_products && stats.top_products.length > 0 && (
        <Card style={{ backgroundColor: '#2a2a2a', borderRadius: '10px' }}>
          <Card.Header style={{ backgroundColor: '#333', color: '#fff', fontWeight: '500' }}>
            Productos Más Vendidos
          </Card.Header>
          <Card.Body>
            <Table responsive striped hover variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Unidades Vendidas</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_products.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product[0]}</td>
                    <td>{product[1]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default SellerStatistics;