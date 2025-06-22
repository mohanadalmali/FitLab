// src/pages/ContactPage.jsx

import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { createContact } from '../services/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      await createContact(form);
      setStatus({ loading: false, success: 'Mesajınız başarıyla gönderildi!', error: '' });
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus({ loading: false, success: '', error: 'Mesaj gönderilirken bir hata oluştu.' });
    }
  };

  return (
    <Container fluid style={{ 
      background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)', // Daha soft, modern gri-mavi gradyan
      minHeight: '100vh', 
      padding: '4rem 1rem',
      display: 'flex', // İçeriği ortalamak için
      alignItems: 'center', // Dikeyde ortala
      justifyContent: 'center' // Yatayda ortala
    }}>
      <div style={{ 
        maxWidth: '650px', // Genişlik biraz artırıldı
        margin: '0 auto', 
        background: '#ffffff', 
        borderRadius: '1.5rem', // Daha fazla yuvarlaklık
        boxShadow: '0 12px 30px rgba(0,0,0,0.1)', // Yumuşak, modern bir gölge
        padding: '3rem' // Padding artırıldı
      }}>
        <h2 style={{ textAlign: 'center', color: '#334e68', marginBottom: '1.5rem', fontSize: '2.5rem', fontWeight: 700 }}> {/* Başlık rengi ve boyutu */}
          Bizimle İletişime Geçin
        </h2>
        <p style={{ textAlign: 'center', color: '#627d98', marginBottom: '2.5rem', fontSize: '1.1rem' }}> {/* Metin rengi ve boyutu */}
          Herhangi bir sorunuz, geri bildiriminiz veya işbirliği teklifiniz için lütfen aşağıdaki formu doldurun. En kısa sürede size geri döneceğiz.
        </p>

        {status.error && <Alert variant="danger">{status.error}</Alert>}
        {status.success && <Alert variant="success">{status.success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, color: '#4a6580' }}>Adınız Soyadınız</Form.Label> {/* Label stili */}
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tam adınızı girin"
              required
              style={{ borderRadius: '0.75rem', padding: '0.8rem 1rem', border: '1px solid #ced4da' }} // Yuvarlaklık ve padding
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, color: '#4a6580' }}>E-posta Adresiniz</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ornek@email.com"
              required
              style={{ borderRadius: '0.75rem', padding: '0.8rem 1rem', border: '1px solid #ced4da' }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: 600, color: '#4a6580' }}>Mesajınız</Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              rows={6} // Satır sayısı artırıldı
              value={form.message}
              onChange={handleChange}
              placeholder="Mesajınızı buraya yazın..."
              required
              style={{ borderRadius: '0.75rem', padding: '0.8rem 1rem', border: '1px solid #ced4da' }}
            />
          </Form.Group>

          <div style={{ textAlign: 'center' }}>
            <Button 
              type="submit" 
              variant="primary" // Bootstrap'in varsayılan primary rengi
              size="lg" 
              disabled={status.loading}
              style={{ borderRadius: '2rem', padding: '0.75rem 2.5rem', fontWeight: 600, boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)' }} // Gölge eklendi
            >
              {status.loading 
                ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> 
                : 'Mesaj Gönder' // Buton metni
              }
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}