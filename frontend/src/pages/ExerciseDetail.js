import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

// Örnek egzersiz verileri (gerçekte bunlar props veya API'den gelmeli)
const exerciseData = {
  squat: {
    title: "Squat",
    image: "/images/squat.jpg",
    description: "Squat, alt vücut kaslarını güçlendiren mükemmel bir egzersizdir.",
    muscleGroup: "Bacaklar, Kalça",
    difficulty: "Orta",
    reps: "3 Set x 12 Tekrar"
  },
  pushup: {
    title: "Push-Up",
    image: "/images/pushup.jpg",
    description: "Push-Up, üst vücut gücünü artıran klasik bir egzersizdir.",
    muscleGroup: "Göğüs, Omuz, Triceps",
    difficulty: "Kolay",
    reps: "3 Set x 15 Tekrar"
  },
  // Diğer egzersizler...
};

const ExerciseDetail = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const exercise = exerciseData[exerciseId];

  if (!exercise) {
    return <div className="text-center mt-5">Egzersiz bulunamadı.</div>;
  }

  return (
    <div className="exercise-detail-page">
      {/* Hero Banner */}
      <div className="hero-banner" style={{ backgroundImage: `url(${exercise.image})` }}>
        <div className="overlay">
          <h1>{exercise.title}</h1>
        </div>
      </div>

      {/* İçerik */}
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6}>
            <img src={exercise.image} alt={exercise.title} className="img-fluid rounded shadow" />
          </Col>
          <Col md={6}>
            <h2>{exercise.title}</h2>
            <p className="lead">{exercise.description}</p>
            <ul className="list-unstyled">
              <li><strong>Kası Çalıştırır:</strong> {exercise.muscleGroup}</li>
              <li><strong>Zorluk:</strong> {exercise.difficulty}</li>
              <li><strong>Tavsiye Edilen Tekrar:</strong> {exercise.reps}</li>
            </ul>
            <Button variant="danger" className="mt-3" onClick={() => navigate(-1)}>← Geri Dön</Button>
          </Col>
        </Row>
      </Container>

      <style>{`
        .exercise-detail-page {
          font-family: 'Segoe UI', sans-serif;
          color: #333;
        }

        .hero-banner {
          position: relative;
          height: 300px;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }

        .hero-banner .overlay {
          background: rgba(0,0,0,0.6);
          padding: 2rem 3rem;
          border-radius: 1rem;
        }

        .hero-banner h1 {
          color: white;
          font-size: 3rem;
          font-weight: bold;
          text-transform: uppercase;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        }

        .lead {
          font-size: 1.2rem;
          margin-top: 1rem;
        }

        ul li {
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .hero-banner h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ExerciseDetail;
