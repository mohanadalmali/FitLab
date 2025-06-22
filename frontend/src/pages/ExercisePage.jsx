// src/pages/ExercisePage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getExercises } from '../services/api';
import BMICalculator from '../components/BMICalculator';

export default function ExercisePage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openBMICalculator, setOpenBMICalculator] = useState(false);

  useEffect(() => {
    getExercises()
      .then(res => setExercises(res.data))
      .catch(() => setError('Egzersiz planları yüklenirken hata oluştu.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;

  return (
    <Container 
      fluid 
      className="py-5" 
      style={{ backgroundColor: '#e8eaf6', minHeight: '100vh' }} // Modernize edilmiş açık mor arka plan
    >
      <header className="text-center mb-5">
        <h2 className="display-4 text-primary">Egzersiz Planları</h2> {/* Başlık rengi primary (mavi) yapıldı */}
      </header>

      <Row className="mb-4">
        <Col className="text-end">
          <Button
            onClick={() => setOpenBMICalculator(!openBMICalculator)}
            aria-controls="bmi-calculator-collapse"
            aria-expanded={openBMICalculator}
            variant="outline-primary" // Buton rengi primary yapıldı
          >
            {openBMICalculator ? 'VKİ Hesaplayıcıyı Kapat' : 'VKİ Hesaplayıcıyı Aç'}
          </Button>
        </Col>
      </Row>

      <Collapse in={openBMICalculator}>
        <div id="bmi-calculator-collapse">
          <Row className="mb-5">
            <Col lg={6} md={8} sm={12} className="mx-auto">
              <BMICalculator />
            </Col>
          </Row>
        </div>
      </Collapse>

      <Row className="gx-4 gy-5">
        {exercises.map(ex => (
          <Col key={ex.exercise_id} lg={4} md={6} sm={12}>
            <Card className="h-100 shadow-sm border-0 rounded-4 card-hover"> {/* Köşe yuvarlaklığı artırıldı */}
              <Card.Img
                variant="top"
                src={ex.photo || '/placeholder-exercise.jpg'}
                className="rounded-top-4" // Köşe yuvarlaklığı Card ile uyumlu hale getirildi
                style={{ height: '220px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column justify-content-end">
                <div className="d-flex justify-content-center mb-2">
                  <Badge 
                    bg={
                      ex.intensity === 'beginner' ? 'primary' : 
                      ex.intensity === 'intermediate' ? 'warning' : 
                      'danger' 
                    } 
                    className="px-3 py-2 text-wrap"
                    style={{ minWidth: '150px', fontSize: '0.95rem' }}
                  >
                    {ex.intensity === 'beginner' ? 'Başlangıç' : ex.intensity === 'intermediate' ? 'Orta' : 'İleri'}
                  </Badge>
                </div>
                
                <Card.Title className="mb-3 text-center" style={{ fontWeight: '600' }}>{ex.plan_name}</Card.Title>
                
                <Button
                  as={Link}
                  to={`/exercise/${ex.exercise_id}`}
                  variant="primary" // Buton rengi primary yapıldı
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
        .card-hover { transition: transform .3s ease-out, box-shadow .3s ease-out; }
        .card-hover:hover { transform: translateY(-10px); box-shadow: 0 16px 32px rgba(0,0,0,0.1); }
        .rounded-top-4 { border-top-left-radius: 1rem; border-top-right-radius: 1rem; }
      `}</style>
    </Container>
  );
}