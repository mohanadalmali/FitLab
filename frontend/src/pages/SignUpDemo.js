import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import api from '../services/api';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    gender: 'Male',
    weight: '',
    height: '',
    goal: 'lose_weight',
    activityLevel: 'sedentary',
    profilePicture: null,
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: e.target.files[0],
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.username) formErrors.username = 'Kullanıcı adı zorunludur';
    if (!formData.email) formErrors.email = 'E-posta zorunludur';
    if (!formData.password) formErrors.password = 'Şifre zorunludur';
    if (!formData.weight) formErrors.weight = 'Ağırlık zorunludur';
    if (!formData.height) formErrors.height = 'Boy zorunludur';
    if (formData.password && formData.password.length < 6)
      formErrors.password = 'Şifre en az 6 karakter olmalıdır';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: 'danger', text: 'Lütfen tüm alanları doğru doldurduğunuzdan emin olun.' });
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await api.post('/api/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ type: 'success', text: 'Kayıt başarılı!' });
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: '',
        gender: 'Male',
        weight: '',
        height: '',
        goal: 'lose_weight',
        activityLevel: 'sedentary',
        profilePicture: null,
      });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Kayıt sırasında bir hata oluştu.' });
    }
  };

  return (
    <Container className="signup-container">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="signup-card shadow">
            <Card.Body>
              <h2 className="text-center text-primary mb-4">Kayıt Ol</h2>
              {message.text && <Alert variant={message.type}>{message.text}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="username">
                      <Form.Label>Kullanıcı Adı</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        isInvalid={!!errors.username}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="firstName">
                      <Form.Label>Ad</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="lastName">
                      <Form.Label>Soyad</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="email">
                      <Form.Label>E-posta</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="password">
                      <Form.Label>Şifre</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="birthDate">
                      <Form.Label>Doğum Tarihi</Form.Label>
                      <Form.Control
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="gender">
                      <Form.Label>Cinsiyet</Form.Label>
                      <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="Male">Erkek</option>
                        <option value="Female">Kadın</option>
                        <option value="Other">Diğer</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="weight">
                      <Form.Label>Ağırlık (kg)</Form.Label>
                      <Form.Control
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        isInvalid={!!errors.weight}
                      />
                      <Form.Control.Feedback type="invalid">{errors.weight}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="height">
                      <Form.Label>Boy (cm)</Form.Label>
                      <Form.Control
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        isInvalid={!!errors.height}
                      />
                      <Form.Control.Feedback type="invalid">{errors.height}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="goal">
                      <Form.Label>Hedef</Form.Label>
                      <Form.Control as="select" name="goal" value={formData.goal} onChange={handleChange}>
                        <option value="lose_weight">Kilo Kaybı</option>
                        <option value="gain_weight">Kilo Artışı</option>
                        <option value="maintain_weight">Kilo Koruma</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="activityLevel">
                      <Form.Label>Aktivite Seviyesi</Form.Label>
                      <Form.Control as="select" name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                        <option value="sedentary">Hareketsiz</option>
                        <option value="lightly_active">Hafif Aktif</option>
                        <option value="moderately_active">Orta Düzey Aktif</option>
                        <option value="very_active">Çok Aktif</option>
                        <option value="super_active">Süper Aktif</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="profilePicture">
                      <Form.Label>Profil Resmi</Form.Label>
                      <Form.Control type="file" name="profilePicture" onChange={handleFileChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit" className="w-100 mt-4">
                  Kayıt Ol
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Özel CSS */}
      <style>{`
      .signup-container {
        margin-top: 50px;
        margin-bottom: 50px;
      }

      .signup-card {
        border-radius: 15px;
        padding: 30px;
        background: linear-gradient(to right, #ffffff, #f0f8ff);
      }

      .signup-card h2 {
        font-weight: 600;
        color: #007bff;
      }

      .form-label {
        font-weight: 500;
      }

      button[type='submit'] {
        background-color: #007bff;
        border: none;
        font-weight: bold;
        padding: 10px 0;
      }

      `}</style>
    </Container>
  );
};

export default SignUpPage;
