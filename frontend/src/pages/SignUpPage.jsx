import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUpPage() {
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    birth_date: '',
    gender: 'Male',
    weight: '',
    height: '',
    goal: 'lose_weight',
    activity_level: 'sedentary',
    profile_picture: ''
  });
  const [status, setStatus] = useState({ loading: false, error: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });
    try {
      await register(form);      // POST /auth/register
      navigate('/login');        // kayıt sonrası login sayfasına yönlendir
    } catch (err) {
      setStatus({ loading: false, error: 'Kayıt sırasında bir hata oluştu.' });
    }
  };

  return (
    <Container fluid style={{
      background: 'linear-gradient(135deg, #2a9d8f, #e9c46a)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#2a9d8f', marginBottom: '1.5rem' }}>
          Kayıt Ol
        </h2>

        {status.error && <Alert variant="danger">{status.error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Kullanıcı Adı</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>İsim</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Soyisim</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>E-posta</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Şifre</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Doğum Tarihi</Form.Label>
            <Form.Control
              type="date"
              name="birth_date"
              value={form.birth_date}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cinsiyet</Form.Label>
            <Form.Select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="Male">Erkek</option>
              <option value="Female">Kadın</option>
              <option value="Other">Diğer</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Kilo (kg)</Form.Label>
            <Form.Control
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              step="0.1"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Boy (cm)</Form.Label>
            <Form.Control
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              step="0.1"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hedef</Form.Label>
            <Form.Select
              name="goal"
              value={form.goal}
              onChange={handleChange}
            >
              <option value="lose_weight">Kilo Vermek</option>
              <option value="gain_weight">Kilo Almak</option>
              <option value="maintain_weight">Korumak</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Aktivite Seviyesi</Form.Label>
            <Form.Select
              name="activity_level"
              value={form.activity_level}
              onChange={handleChange}
            >
              <option value="sedentary">Sedanter</option>
              <option value="lightly_active">Hafif Aktif</option>
              <option value="moderately_active">Orta Aktif</option>
              <option value="very_active">Çok Aktif</option>
              <option value="super_active">Aşırı Aktif</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Profil Resmi URL</Form.Label>
            <Form.Control
              type="text"
              name="profile_picture"
              value={form.profile_picture}
              onChange={handleChange}
            />
          </Form.Group>

          <div style={{ textAlign: 'center' }}>
            <Button
              type="submit"
              variant="dark"
              size="lg"
              disabled={status.loading}
              style={{ borderRadius: '2rem', padding: '0.75rem 2rem' }}
            >
              {status.loading
                ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                : 'Kayıt Ol'
              }
            </Button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span>Zaten hesabın var mı? </span>
            <Link to="/login" style={{ color: '#2a9d8f', fontWeight: '500' }}>
              Giriş Yap
            </Link>
          </div>
        </Form>
      </div>
    </Container>
  );
}
