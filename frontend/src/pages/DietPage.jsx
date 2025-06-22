// src/pages/DietPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getDiets } from '../services/api';
import CalorieCalculator from '../components/CalorieCalculator';

export default function DietPage() {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCalculator, setOpenCalculator] = useState(false);

  useEffect(() => {
    getDiets()
      .then(res => setDiets(res.data))
      .catch(() => setError('Diyet planları yüklenirken hata oluştu.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;

  return (
    <Container 
      fluid 
      className="py-5" 
      style={{ backgroundColor: '#e0f7fa', minHeight: '100vh' }} // Modernize edilmiş açık mint yeşili arka plan
    >
      <header className="text-center mb-5">
        <h2 className="display-4 text-info">Diyet Planları</h2> {/* Başlık rengi info (açık mavi) yapıldı */}
      </header>

      <Row className="mb-4">
        <Col className="text-end">
          <Button
            onClick={() => setOpenCalculator(!openCalculator)}
            aria-controls="calorie-calculator-collapse"
            aria-expanded={openCalculator}
            variant="outline-info" // Buton rengi info yapıldı
          >
            {openCalculator ? 'Kalori Hesaplayıcıyı Kapat' : 'Kalori Hesaplayıcıyı Aç'}
          </Button>
        </Col>
      </Row>

      <Collapse in={openCalculator}>
        <div id="calorie-calculator-collapse">
          <Row className="mb-5">
            <Col lg={6} md={8} sm={12} className="mx-auto">
              <CalorieCalculator />
            </Col>
          </Row>
        </div>
      </Collapse>

      <Row className="gx-4 gy-5">
        {diets.map(d => (
          <Col key={d.diet_id} lg={4} md={6} sm={12}>
            <Card className="h-100 shadow-sm border-0 rounded-4 card-hover"> {/* Köşe yuvarlaklığı artırıldı */}
              <Card.Img
                variant="top"
                src={d.photo || '/placeholder-diet.jpg'}
                className="rounded-top-4" // Köşe yuvarlaklığı Card ile uyumlu hale getirildi
                style={{ height: '220px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column justify-content-end">
                <div className="d-flex justify-content-center mb-2">
                  <Badge 
                    bg={
                      d.goal === 'lose_weight' ? 'success' : 
                      d.goal === 'gain_weight' ? 'warning' : 
                      'secondary' // Korumak için daha nötr bir renk
                    } 
                    className="px-3 py-2 text-wrap"
                    style={{ minWidth: '150px', fontSize: '0.95rem' }}
                  >
                    {d.goal === 'lose_weight' ? 'Kilo Vermek' : d.goal === 'gain_weight' ? 'Kilo Almak' : 'Korumak'}
                  </Badge>
                </div>
                
                <Card.Title className="mb-3 text-center" style={{ fontWeight: '600' }}>{d.plan_name}</Card.Title>
                
                <Button
                  as={Link}
                  to={`/diet/${d.diet_id}`}
                  variant="info" // Buton rengi info yapıldı
                  className="mt-auto rounded-pill" // Daha modern bir buton için rounded-pill eklendi
                >
                  Detayları Gör
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <style>{`
        .card-hover { transition: transform .3s ease-out, box-shadow .3s ease-out; } /* Transition daha yumuşak */
        .card-hover:hover { transform: translateY(-10px); box-shadow: 0 16px 32px rgba(0,0,0,0.1); } /* Daha belirgin ama yumuşak gölge */
        .rounded-top-4 { border-top-left-radius: 1rem; border-top-right-radius: 1rem; } /* Daha fazla yuvarlaklık */
      `}</style>
    </Container>
  );
}