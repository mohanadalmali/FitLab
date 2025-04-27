import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

// Blog kart bileşeni
const BlogCard = ({ id, title, image, description }) => (
  <div className="col-12 mb-4">
    <div className="card h-100 shadow-sm">
      <img src={image} className="card-img-top" alt={title} style={{ height: '200px', objectFit: 'cover' }} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <Link to={`/blog/${id}`} className="btn btn-footer mt-auto"
          style={{
              background: 'linear-gradient(to right,rgb(92, 210, 79),rgb(115, 156, 111))',
              color: 'white', 
              border: 'none'
            }}>Devamını Oku
          </Link>
      </div>
    </div>
  </div>
);

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts = [
    { id: 1, title: "Kahvaltının Önemi", image: "/images/breakfast.jpg", description: "Güne zinde başlamak için kahvaltının faydaları." },
    { id: 2, title: "Egzersiz ve Uyku", image: "/images/sleep.jpg", description: "İyi bir uyku düzeniyle spor verimini artır!" },
    { id: 3, title: "Protein Kaynakları", image: "/images/protein.jpg", description: "Bitkisel ve hayvansal proteinlerin karşılaştırması." },
  ];

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      {/* Başlık */}
      <h2 className="mb-4 text-center position-relative py-5" style={{
        background: 'linear-gradient(to right,rgb(92, 210, 79),rgb(115, 156, 111))',
        color: 'white',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderRadius: '10px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)'
      }}>
        FitLab Blog
      </h2>

      {/* Arama */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Blog yazısı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Blog Kartları */}
      <div className="row">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <BlogCard
              key={post.id}
              id={post.id}
              title={post.title}
              image={post.image}
              description={post.description}
            />
          ))
        ) : (
          <p>Aradığınız içerik bulunamadı.</p>
        )}
      </div>

      {/* Footer */}
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

      {/* Özel CSS */}
      <style>{`
        .footer-contact {
          background: linear-gradient(to right,rgb(92, 210, 79),rgb(115, 156, 111));
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

export default BlogPage;
