import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';


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
    profilePicture: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Container fluid className="sign-up-container">
      <Row className="justify-content-center">
        <Col md={6} className="sign-up-form-wrapper">
          <h2 className="text-center mb-4 sign-up-title">Kayıt Ol</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Kullanıcı Adı</Form.Label>
              <Form.Control
                type="text"
                placeholder="Kullanıcı adı girin"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="firstName">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Adınızı girin"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="lastName">
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Soyadınızı girin"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                placeholder="E-posta adresinizi girin"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                placeholder="Şifrenizi girin"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
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

            <Form.Group controlId="gender">
              <Form.Label>Cinsiyet</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Erkek</option>
                <option value="Female">Kadın</option>
                <option value="Other">Diğer</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="weight">
              <Form.Label>Ağırlık (kg)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Kilonuzu girin"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="height">
              <Form.Label>Boy (cm)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Boyunuzu girin"
                name="height"
                value={formData.height}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="goal">
              <Form.Label>Hedef</Form.Label>
              <Form.Control
                as="select"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
              >
                <option value="lose_weight">Kilo Kaybı</option>
                <option value="gain_weight">Kilo Artışı</option>
                <option value="maintain_weight">Kilo Koruma</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="activityLevel">
              <Form.Label>Aktivite Seviyesi</Form.Label>
              <Form.Control
                as="select"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
              >
                <option value="sedentary">Hareketsiz</option>
                <option value="lightly_active">Hafif Aktif</option>
                <option value="moderately_active">Orta Düzey Aktif</option>
                <option value="very_active">Çok Aktif</option>
                <option value="super_active">Süper Aktif</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="profilePicture">
              <Form.Label>Profil Resmi</Form.Label>
              <Form.Control
                type="file"
                name="profilePicture"
                onChange={(e) => setFormData({ ...formData, profilePicture: e.target.files[0] })}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-4">
              Kayıt Ol
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;

