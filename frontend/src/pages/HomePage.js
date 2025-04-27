import React from "react";
import { Container, Navbar, Nav, Button, Row, Col, Card } from "react-bootstrap";
import {FaDumbbell, FaAppleAlt, FaRegNewspaper, FaPhoneAlt, FaUser, FaSignInAlt, FaInstagram, FaTwitter,
  FaFacebookF, FaYoutube,
} from "react-icons/fa";


export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div>
        {/* Navbar */}
    <Navbar expand="lg" className="shadow-sm custom-navbar">
      <Container>
        <Navbar.Brand href="/"><strong>FitLab</strong></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="http://localhost:3000/diet">
              <FaAppleAlt className="me-2" /> Diyet Planları
            </Nav.Link>
            <Nav.Link href="http://localhost:3000/exercise">
              <FaDumbbell className="me-2" /> Egzersiz Planları
            </Nav.Link>
            <Nav.Link href="http://localhost:3000/blog">
              <FaRegNewspaper className="me-2" /> Blog
            </Nav.Link>
            <Nav.Link href="http://localhost:3000/contact">
              <FaPhoneAlt className="me-2" /> İletişim
            </Nav.Link>
            <Nav.Link href="http://localhost:3000/login">
              <FaSignInAlt className="me-2" /> Giriş Yap
            </Nav.Link>
            <Nav.Link href="http://localhost:3000/signup">
              <FaUser className="me-2" /> Kayıt Ol
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

        {/* Hero Section */}
        <Container className="text-center my-5">
          <h1>Sağlıklı Yaşam İçin FitLab</h1>
          <p className="lead">Kişiye özel diyet ve egzersiz planları ile hedefinize ulaşın.</p>
        </Container>

        {/* Content Section */}
        <Container className="my-5">
          <Row>
            {/* Diet Plans Card */}
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-lg rounded-3 overflow-hidden">
                <Card.Img variant="top" src="https://images.unsplash.com/photo-1740987769844-24d2103fd191?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Diyet Planları" />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-bold">Diyet Planları</Card.Title>
                    <Card.Text className="text-muted">
                      Size uygun özel diyet planlarıyla sağlıklı beslenmeye adım atın.
                    </Card.Text>
                  </div>
                  <Button variant="outline-success" className="mt-3">İncele</Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Exercise Plans Card */}
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-lg rounded-3 overflow-hidden">
                <Card.Img variant="top" src="https://images.unsplash.com/photo-1434682705430-390b9de53750?q=80&w=1405&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Egzersiz Planları" />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-bold">Egzersiz Planları</Card.Title>
                    <Card.Text className="text-muted">
                      Hedefinize göre egzersiz programları ile daha aktif olun.
                    </Card.Text>
                  </div>
                  <Button variant="outline-warning" className="mt-3">İncele</Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Blog Card */}
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-lg rounded-3 overflow-hidden">
                <Card.Img variant="top" src="https://plus.unsplash.com/premium_photo-1681401646535-f148373d5ef3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Blog" />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-bold">Blog</Card.Title>
                    <Card.Text className="text-muted">
                      Sağlıklı yaşam hakkında ipuçları ve öneriler için blog yazılarımıza göz atın.
                    </Card.Text>
                  </div>
                  <Button variant="outline-primary" className="mt-3">Oku</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Only Images Section */}
          <Row className="mt-5">
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-lg rounded-3 d-flex">
                <Card.Img variant="top" src="https://images.unsplash.com/photo-1693996046514-0406d0773a7d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Sağlıklı Yaşam" className="w-100 h-100 object-fit-cover" />
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-lg rounded-3 d-flex">
                <Card.Img variant="top" src="https://images.unsplash.com/photo-1589579234091-4b2ffe39b26f?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Fitness Egzersizleri" className="w-100 h-100 object-fit-cover" />
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-lg rounded-3 d-flex">
                <Card.Img variant="top" src="https://images.unsplash.com/photo-1743779665801-ae26f2d84525?q=80&w=1527&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Sağlıklı Tarifler" className="w-100 h-100 object-fit-cover" />
              </Card>
            </Col>
          </Row>

        </Container>

      {/* Footer */}
      <footer className="footer-contact py-5 text-white mt-5">
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

          {/* Sosyal Medya Bağlantıları */}
          <div className="social-media-links text-center mt-4">
            <h5>Sosyal Medyada Bizi Takip Edin</h5>
            <div className="d-flex justify-content-center">
              <a href="https://facebook.com" className="mx-3 text-white">
                <FaFacebookF size={24} />
              </a>
              <a href="https://instagram.com" className="mx-3 text-white">
                <FaInstagram size={24} />
              </a>
              <a href="https://twitter.com" className="mx-3 text-white">
                <FaTwitter size={24} />
              </a>
              <a href="https://youtube.com" className="mx-3 text-white">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>

          <div className="text-center small mt-4 border-top pt-3 text-light opacity-75">
            © 2025 FitLab | Sağlıklı yaşa, güçlü ol!
          </div>
        </Container>
      </footer>
      <style>{`
        

        .footer-contact {
          background: linear-gradient(to right,rgb(0, 0, 0),rgb(93, 91, 91));
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
        .social-media-links a:hover {
          color: #ff416c;
        }
        .custom-navbar {
          background: linear-gradient(to right, rgb(0, 0, 0), rgb(93, 91, 91)) !important;
          border-radius: 0.5rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .custom-navbar .navbar-brand {
          font-size: 1.8rem;
          color: white;
          font-weight: bold;
          transition: color 0.3s;
        }

        .custom-navbar .navbar-brand:hover {
          color: #43cea2; /* Hover rengi */
        }

        .custom-navbar .nav-link {
          color: white !important;
          font-size: 1.1rem;
          padding: 10px 15px;
          transition: color 0.3s, transform 0.3s;
        }

        .custom-navbar .nav-link:hover {
          color: #43cea2 !important;
          transform: scale(1.05);
        }

        .custom-navbar .nav-link .me-2 {
          transition: transform 0.3s;
        }

        .custom-navbar .nav-link:hover .me-2 {
          transform: translateX(5px);
        }
      `}</style> 
      </div>
    </div>
  );
}
