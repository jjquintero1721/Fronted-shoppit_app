// src/components/vendor/VendorStats.jsx
import { useState, useEffect } from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';
import { FaBoxOpen, FaChartLine, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
import api from '../../api';
import styles from './VendorDashboard.module.css';
import Spinner from '../ui/Spinner';

const VendorStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/vendor-sales/');
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

  if (!stats || !stats.products || stats.products.length === 0) {
    return (
      <Card className={styles.formCard}>
        <Card.Body>
          <Card.Title>Sin datos de ventas</Card.Title>
          <Card.Text>
            Aún no tienes ventas registradas. Una vez que vendas productos, aquí podrás ver tus estadísticas.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <h3 className={styles.sectionTitle}>Resumen de ventas</h3>
      
      <Row>
        <Col md={3}>
          <Card className={styles.statsCard}>
            <Card.Body className="text-center p-4">
              <FaBoxOpen size={30} color="#6050DC" className="mb-3" />
              <div className={styles.statsValue}>{stats.total_products}</div>
              <div className={styles.statsLabel}>Productos</div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className={styles.statsCard}>
            <Card.Body className="text-center p-4">
              <FaShoppingCart size={30} color="#6050DC" className="mb-3" />
              <div className={styles.statsValue}>{stats.total_quantity}</div>
              <div className={styles.statsLabel}>Unidades vendidas</div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className={styles.statsCard}>
            <Card.Body className="text-center p-4">
              <FaChartLine size={30} color="#6050DC" className="mb-3" />
              <div className={styles.statsValue}>${parseFloat(stats.total_sales).toFixed(2)}</div>
              <div className={styles.statsLabel}>Ventas totales</div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className={styles.statsCard}>
            <Card.Body className="text-center p-4">
              <FaMoneyBillWave size={30} color="#28a745" className="mb-3" />
              <div className={styles.earningsValue}>${parseFloat(stats.net_earnings).toFixed(2)}</div>
              <div className={styles.statsLabel}>Ganancias netas</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <h3 className={`${styles.sectionTitle} mt-4`}>Desglose por producto</h3>
      
      <Card className={styles.formCard}>
        <Card.Body>
          <Table responsive variant="dark" hover>
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-center">Cantidad</th>
                <th className="text-end">Ventas</th>
                <th className="text-end">Comisión</th>
                <th className="text-end">Ganancias</th>
                <th className="text-center">Última venta</th>
              </tr>
            </thead>
            <tbody>
              {stats.products.map(product => {
                const totalSales = parseFloat(product.total_sales);
                const commission = parseFloat(product.total_commission);
                const earnings = totalSales - commission;
                
                return (
                  <tr key={product.id}>
                    <td>{product.product_name}</td>
                    <td className="text-center">{product.total_quantity}</td>
                    <td className="text-end">${totalSales.toFixed(2)}</td>
                    <td className="text-end">${commission.toFixed(2)}</td>
                    <td className="text-end">${earnings.toFixed(2)}</td>
                    <td className="text-center">
                      {new Date(product.last_updated).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VendorStats;