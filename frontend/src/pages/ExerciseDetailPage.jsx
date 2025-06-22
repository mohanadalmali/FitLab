// src/pages/ExerciseDetailPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { getExercises } from '../services/api';

export default function ExerciseDetailPage() {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getExercises()
      .then(res => {
        const found = res.data.find(e => e.exercise_id === +id);
        if (!found) throw new Error('Not found');
        setExercise(found);
      })
      .catch(() => setError('Egzersiz planı bulunamadı.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="danger" className="my-5 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <Container
      fluid
      className="py-5"
      style={{ backgroundColor: '#f0f8ff', minHeight: '100vh' }}
    >
      <Card
        className="mx-auto shadow-lg border-0 rounded-4"
        style={{ maxWidth: '720px', backgroundColor: '#ffffff' }}
      >
        <Card.Img
          variant="top"
          src={exercise.photo || '/placeholder-exercise.jpg'}
          className="rounded-top-4"
          style={{ height: '350px', objectFit: 'cover' }}
        />
        <Card.Body className="p-5">
          <Badge
            bg="warning"
            text="dark"
            className="mb-3 px-3 py-2"
            style={{ fontSize: '0.95rem', borderRadius: '2rem' }}
          >
            {exercise.intensity === 'beginner'
              ? 'Başlangıç'
              : exercise.intensity === 'intermediate'
              ? 'Orta'
              : 'İleri'}
          </Badge>
          <h3 className="mb-4" style={{ fontWeight: '700' }}>
            {exercise.plan_name}
          </h3>
          {exercise.description.split('\n').map((line, idx) => (
            <p key={idx} style={{ lineHeight: '1.6', color: '#555555' }}>
              {line}
            </p>
          ))}

          <div className="text-end mt-4">
            <small className="text-muted">
              Oluşturulma: {new Date(exercise.created_at).toLocaleDateString()} &nbsp;|&nbsp;
              Güncellenme: {new Date(exercise.updated_at).toLocaleDateString()}
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

/* Inline Styles */
<style>{`
  .rounded-top-4 { border-top-left-radius: 1rem; border-top-right-radius: 1rem; }
`}</style>
