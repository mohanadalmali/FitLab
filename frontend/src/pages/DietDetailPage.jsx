// src/pages/DietDetailPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { getDiets } from '../services/api';

export default function DietDetailPage() {
  const { id } = useParams();
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // API'den tüm diyetleri çekip ilgili ID'ye sahip olanı buluruz.
    // Bu yöntem, az sayıda diyet olduğunda işe yarar.
    // Daha büyük uygulamalarda doğrudan getDiet(id) çağrısı yapmak daha verimlidir.
    getDiets()
      .then(res => {
        const found = res.data.find(d => d.diet_id === +id);
        if (!found) throw new Error('Diyet bulunamadı.'); // Hata mesajını özelleştirdik
        setDiet(found);
      })
      .catch(() => setError('Diyet bilgileri yüklenirken hata oluştu veya diyet bulunamadı.')) // Hata mesajını güncelledik
      .finally(() => setLoading(false));
  }, [id]); // id bağımlılığı doğru ayarlanmış

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </Spinner>
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

  // Eğer 'diet' null ise (hata oluşmadı ama bulunamadı gibi edge case'ler için), boş dönebiliriz veya özel bir mesaj gösterebiliriz.
  // Ancak yukarıdaki hata kontrolü genellikle yeterli olacaktır.
  if (!diet) {
    return (
      <Alert variant="warning" className="my-5 text-center">
        Diyet bulunamadı. Lütfen URL'yi kontrol edin.
      </Alert>
    );
  }

  return (
    <Container
      fluid
      className="py-5"
      style={{ backgroundColor: '#eef5f9', minHeight: '100vh' }}
    >
      <Card
        className="mx-auto shadow-lg border-0 rounded-4"
        style={{ maxWidth: '720px', backgroundColor: '#ffffff' }}
      >
        <Card.Img
          variant="top"
          src={diet.photo || '/placeholder-diet.jpg'}
          className="rounded-top-4"
          style={{ height: '350px', objectFit: 'cover' }}
        />
        <Card.Body className="p-5">
          <Badge
            bg="primary"
            className="mb-3 px-3 py-2"
            style={{ fontSize: '0.95rem', borderRadius: '2rem' }}
          >
            {diet.goal === 'lose_weight'
              ? 'Kilo Vermek'
              : diet.goal === 'gain_weight'
              ? 'Kilo Almak'
              : 'Kilo Korumak'} {/* "Korumak" güncellendi */}
          </Badge>
          <h3 className="card-title mb-4" style={{ fontWeight: '700' }}>
            {diet.plan_name}
          </h3>

          {/* Diyetin Kalori Miktarını Gösteren Alan */}
          {/* Bu kısım zaten mevcuttu ve diet objesinde 'calories' alanı varsa gösterecektir. */}
          {diet.calories != null && ( // 'null' ve 'undefined' kontrolü için != null kullandık
            <p className="mb-3" style={{ fontSize: '1.1rem', color: '#333333', fontWeight: 'bold' }}>
              Tahmini Günlük Kalori: <span style={{ color: '#007bff' }}>{diet.calories} kcal</span>
            </p>
          )}

          <div className="mb-4" style={{ lineHeight: '1.6', color: '#555555' }}>
            {diet.description.split('\n').map((line, idx) => (
              // Paragraflar arasında küçük bir boşluk bırakmak için 'mb-2' ekleyebiliriz
              <p key={idx} className={idx < diet.description.split('\n').length - 1 ? 'mb-2' : ''}>{line}</p>
            ))}
          </div>
          <div className="text-end">
            <small className="text-muted">
              Oluşturulma: {new Date(diet.created_at).toLocaleDateString()} &nbsp;|&nbsp;
              Güncellenme: {diet.updated_at ? new Date(diet.updated_at).toLocaleDateString() : 'Henüz güncellenmedi'} {/* Güncellenme yoksa alternatif metin */}
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}