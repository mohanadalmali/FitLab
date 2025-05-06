import React, { useState } from 'react';
import DietCard from '../components/DietCard';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Container, Row, Col } from 'react-bootstrap';

const diets = [
  {
    id: 1,
    title: "Ketojenik Diyet",
    image: "https://source.unsplash.com/featured/?keto",
    description: "Düşük karbonhidrat, yüksek yağ içeren bir diyet planı."
  },
  {
    id: 2,
    title: "Akdeniz Diyeti",
    image: "https://source.unsplash.com/featured/?mediterranean",
    description: "Zeytinyağı, sebze ve balık ağırlıklı sağlıklı beslenme planı."
  },
  {
    id: 3,
    title: "Vegan Diyet",
    image: "https://source.unsplash.com/featured/?vegan",
    description: "Hayvansal ürün içermeyen, bitkisel beslenme planı."
  }
];

const DietPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDiets = diets.filter(diet =>
    diet.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="mb-4 text-center position-relative py-5" style={{
        background: 'linear-gradient(to right, #43cea2, #185a9d)',
        color: 'white',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderRadius: '10px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)'
      }}>
        Diyet Planları
      </h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Diyet ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredDiets.length > 0 ? (
          filteredDiets.map(diet => (
            <DietCard
              key={diet.id}
              id={diet.id}
              title={diet.title}
              image={diet.image}
              description={diet.description}
            />
          ))
        ) : (
          <p>Aradığınız diyet bulunamadı.</p>
        )}
      </div>

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

      {/* Footer CSS */}
      <style>{`
        .footer-contact {
          background: linear-gradient(to right, #43cea2, #185a9d);
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
      `}</style>
    </div>
  );
};

export default DietPage;
