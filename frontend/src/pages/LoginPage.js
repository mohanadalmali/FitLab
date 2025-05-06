import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
    // Burada backend'e giriş verilerini gönderebilirsiniz
  };

  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center">
        <Col md={6} className="login-form-wrapper">
          <h2 className="text-center mb-4 login-title">Giriş Yap</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Kullanıcı Adı</Form.Label>
              <Form.Control
                type="text"
                placeholder="Kullanıcı adınızı girin"
                name="username"
                value={formData.username}
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

            <Button variant="primary" type="submit" className="w-100 mt-4">
              Giriş Yap
            </Button>
          </Form>

          <div className="mt-3 text-center">
            <span>Hesabınız yok mu? </span>
            <Link to="http://localhost:3000/signup">Kayıt Olun</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
