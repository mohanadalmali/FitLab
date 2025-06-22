// src/pages/BlogPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getBlogPosts, getBlogPostImages } from '../services/api';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [imagesMap, setImagesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // console.log("DEBUG(Frontend): BlogPage useEffect çalışıyor."); // Debug loglarını kaldırabiliriz
    Promise.all([getBlogPosts(), getBlogPostImages()])
      .then(([postsRes, imagesRes]) => {
        // console.log("DEBUG(Frontend): getBlogPosts yanıtı:", postsRes.data);
        // console.log("DEBUG(Frontend): getBlogPostImages yanıtı:", imagesRes.data);

        const published = postsRes.data.filter(p => p.status === 'published');
        setPosts(published);

        const map = {};
        imagesRes.data.forEach(img => {
          if (!map[img.post_id]) map[img.post_id] = [];
          map[img.post_id].push(img);
        });
        setImagesMap(map);
        setError('');
      })
      .catch(err => {
        console.error("Blog yazıları veya görseller yüklenirken hata oluştu:", err); // Hata logunu koru
        setError('Blog yazıları veya görseller yüklenirken hata oluştu.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;

  return (
    <Container fluid style={{
      background: 'linear-gradient(135deg, #e0f2f7 0%, #e8f5e9 100%)', // Daha soft ve modern gradyan
      minHeight: '100vh',
      padding: '4rem 2rem'
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '3rem',
          marginBottom: '0.5rem',
          background: 'linear-gradient(45deg, #4db6ac, #80cbc4)', // Daha sakin yeşil tonları
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Blog Yazıları
        </h2>
        <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '800px', margin: '0.5rem auto 0 auto' }}> {/* Metin rengi koyu, genişlik ayarlandı */}
          Sağlıklı yaşam, beslenme ve egzersiz hakkında en güncel bilgiler ve ilham verici içerikler.
        </p>
      </header>

      {/* Blog Postları Izgarası */}
      <Row className="gx-4 gy-5 justify-content-center"> {/* Ortalamak için justify-content-center eklendi */}
        {posts.length > 0 ? (
          posts.map(post => {
            const imgs = imagesMap[post.post_id] || [];
            const firstImg = imgs[0];
            return (
              <Col key={post.post_id} lg={5} md={6} sm={12} className="d-flex"> {/* lg={5} ile daha geniş kartlar */}
                <Card className="flex-fill blog-card" style={{ // flex-fill ile kartlar aynı yüksekliğe sahip
                  borderRadius: '1.25rem', // Daha fazla yuvarlaklık
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)', // Daha hafif bir gölge
                  border: 'none',
                  transition: 'transform .3s ease-out, box-shadow .3s ease-out'
                }}>
                  {firstImg && (
                    <div style={{ height: '280px', overflow: 'hidden' }}> {/* Yükseklik artırıldı */}
                      <img
                        src={firstImg.image_url}
                        alt={firstImg.alt_text}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                  <Card.Body style={{ background: '#fff', padding: '2rem' }}> {/* Padding artırıldı */}
                    <Card.Title style={{
                      color: '#424242', // Başlık rengi daha koyu ve modern
                      fontWeight: 700,
                      marginBottom: '0.75rem', // Boşluk artırıldı
                      fontSize: '1.6rem' // Font boyutu artırıldı
                    }}>
                      {post.title}
                    </Card.Title>
                    <small style={{ color: '#888', display: 'block', marginBottom: '1rem' }}> {/* display:block ile alt satıra geç */}
                      {new Date(post.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })} {/* Tarih formatı güzelleştirildi */}
                    </small>
                    <div className="d-flex justify-content-end">
                      <Button
                        as={Link}
                        to={`/blog/${post.post_id}`}
                        variant="outline-info" // Buton rengi ve tipi değiştirildi
                        className="rounded-pill" // Kapsül buton
                        style={{
                          padding: '0.65rem 2rem', // Padding ayarlandı
                          fontWeight: 600,
                          borderColor: '#4db6ac', // Kenarlık rengi başlıkla uyumlu
                          color: '#4db6ac', // Metin rengi başlıkla uyumlu
                        }}
                      >
                        Yazıyı Oku
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col xs={12} className="text-center">
            <p className="text-muted fs-5">Henüz yayınlanmış blog yazısı bulunmamaktadır.</p>
          </Col>
        )}
      </Row>

      {/* Hover efekti için inline stil */}
      <style>{`
        .blog-card:hover {
          transform: translateY(-12px); /* Biraz daha fazla yükselme */
          box-shadow: 0 20px 40px rgba(0,0,0,0.12); /* Daha büyük ve yaygın gölge */
        }
      `}</style>
    </Container>
  );
}