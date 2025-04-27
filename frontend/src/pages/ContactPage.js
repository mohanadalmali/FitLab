import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ContactPage = () => {
  return (
    <div className="container-fluid p-0 m-0">
      <h2 className="mb-4 text-center position-relative py-5" style={{
        background: 'linear-gradient(to right,rgb(92, 210, 79),rgb(163, 180, 147))',
        color: 'white',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderRadius: '10px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)'
      }}>
        İletişim
      </h2>

      <Container className="my-5">
        <Row>
          <Col md={6}>
            <h3>Bizimle İletişime Geçin</h3>
            <p>Herhangi bir sorunuz varsa, bizimle iletişime geçmekten çekinmeyin. Sizinle konuşmak için sabırsızlanıyoruz!</p>
            
            <Form>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Ad Soyad</Form.Label>
                <Form.Control type="text" placeholder="Adınızı ve soyadınızı girin" />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>E-posta Adresi</Form.Label>
                <Form.Control type="email" placeholder="E-posta adresinizi girin" />
              </Form.Group>

              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Label>Mesajınız</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="Mesajınızı buraya yazın" />
              </Form.Group>

              <Button variant="danger" type="submit" className="mt-2">
                Gönder
              </Button>
            </Form>
          </Col>

          <Col md={6}>
            <h3>İletişim Bilgileri</h3>
            <p>FitLab'a ulaşmak için aşağıdaki bilgileri kullanabilirsiniz.</p>
            <ul className="list-unstyled">
              <li><strong>Telefon:</strong> +90 555 123 45 67</li>
              <li><strong>E-posta:</strong> info@fitlab.com</li>
              <li><strong>Adres:</strong> İstiklal Caddesi No:123, İstanbul, Türkiye</li>
            </ul>
            
            <h4>Takip Edin</h4>
            <ul className="list-unstyled">
              <li><a href="https://www.facebook.com/fitlab" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://www.instagram.com/fitlab" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.twitter.com/fitlab" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            </ul>
          </Col>
        </Row>
      </Container>

      {/* Tam sayfa Footer */}
      <footer className="footer-contact py-5 text-white">
        <Container>
          <Row className="gy-4 justify-content-between">
            <Col md={4}>
              <h5>FitLab</h5>
              <p>Sağlıklı yaşam için bizimle ilerleyin. En iyi diyet ve egzersiz planları burada.</p>
            </Col>
            <Col md={4}>
              <h5>Hızlı Linkler</h5>
              <ul className="list-unstyled">
                <li><a href="http://localhost:3000" className="text-white text-decoration-none">Ana Sayfa</a></li>
                <li><a href="http://localhost:3000/diet" className="text-white text-decoration-none">Diyet Planları</a></li>
                <li><a href="http://localhost:3000/exercise" className="text-white text-decoration-none">Egzersiz Planları</a></li>
                <li><a href="http://localhost:3000/contact" className="text-white text-decoration-none">İletişim</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Bize Ulaşın</h5>
              <p><strong>Email:</strong> info@fitlab.com</p>
              <p><strong>Telefon:</strong> +90 555 123 45 67</p>
              <p><strong>Adres:</strong> İstanbul, Türkiye</p>
            </Col>
          </Row>

          <div className="text-center small mt-4 border-top pt-3 text-light opacity-75">
            © 2025 FitLab | Sağlıklı yaşa, güçlü ol!
          </div>
        </Container>
      </footer>

      {/* Footer stili */}
      <style>{`
        .footer-contact {
          background: linear-gradient(to right,rgb(92, 210, 79),rgb(163, 180, 147));
          border-top-left-radius: 2rem;
          border-top-right-radius: 2rem;
        }
        .footer-contact h5 {
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .footer-contact ul li {
          margin-bottom: 0.5rem;
        }
        .footer-contact a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
