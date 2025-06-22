// src/pages/BlogDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert, Card } from 'react-bootstrap';
import {
  getBlogPost,
  getBlogPostImages, // DÜZELTME: getBlogPostImagesAdmin yerine public olanı kullanıldı
  getBlogComments   // DÜZELTME: getCommentsAdmin yerine public olanı kullanıldı
} from '../services/api';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log(`DEBUG(Frontend): BlogDetailPage useEffect çalışıyor, ID: ${id}`);
    (async () => {
      try {
        // Promise.all içinde public endpoint'leri kullanıyoruz
        const [pRes, imgRes, cRes] = await Promise.all([
          getBlogPost(id),
          getBlogPostImages(), // Public image endpoint
          getBlogComments()    // Public comments endpoint
        ]);

        console.log("DEBUG(Frontend): Tekil Blog Post yanıtı:", pRes.data);
        console.log("DEBUG(Frontend): Blog Resimleri yanıtı:", imgRes.data);
        console.log("DEBUG(Frontend): Blog Yorumları yanıtı:", cRes.data);

        setPost(pRes.data);
        setImages(imgRes.data.filter(i => i.post_id === +id));
        setComments(cRes.data.filter(c => c.post_id === +id));
        setError(''); // Hata varsa temizle
      } catch (err) {
        console.error("DEBUG(Frontend): Yazı yüklenirken hata oluştu:", err);
        setError('Yazı yüklenirken hata oluştu. Lütfen konsolu kontrol edin.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;

  // post henüz null ise veya post.content yoksa, bu kontrolleri ekleyin
  if (!post) {
      return <Alert variant="warning" className="my-5 text-center">Blog yazısı bulunamadı.</Alert>;
  }

  return (
    <Container fluid style={{
      background: '#f9f9f9',
      minHeight: '100vh',
      padding: '3rem 2rem'
    }}>
      <Card style={{
        maxWidth: '800px',
        margin: '0 auto',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
        border: 'none'
      }}>
        <div style={{
          background: 'linear-gradient(45deg, #2a9d8f, #e9c46a)',
          padding: '2rem'
        }}>
          <h2 style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
            {post.title}
          </h2>
          <small style={{ color: 'rgba(255,255,255,0.8)' }}>
            {new Date(post.created_at).toLocaleDateString()}
          </small>
        </div>

        <Card.Body style={{ background: '#fff', padding: '2rem' }}>
          {images.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <img
                src={images[0].image_url}
                alt={images[0].alt_text}
                style={{
                  width: '100%',
                  borderRadius: '0.5rem',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          <div style={{ lineHeight: 1.8, color: '#333' }}>
            {/* post.content boş olabilir, kontrol edin */}
            {post.content ? post.content.split('\n').map((line, idx) => (
              <p key={idx} style={{ marginBottom: '1rem' }}>{line}</p>
            )) : <p>Bu blog yazısının içeriği bulunmamaktadır.</p>}
          </div>
        </Card.Body>
      </Card>
<br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <h4 style={{
          color: '#2a9d8f',
          borderBottom: '2px solid #e9c46a',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          Yorumlar
        </h4>

        {comments.length === 0 ? (
          <p style={{ color: '#777', textAlign: 'center' }}>Henüz yorum yok.</p>
        ) : (
          comments.map(c => (
            <Card key={c.comment_id} style={{
              marginBottom: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #ddd'
            }}>
              <Card.Body>
                <div style={{ marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                  <strong>Kullanıcı {c.user_id}</strong> &middot; {new Date(c.created_at).toLocaleDateString()}
                </div>
                <div style={{ color: '#333', lineHeight: 1.6 }}>
                  {c.comment}
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
}