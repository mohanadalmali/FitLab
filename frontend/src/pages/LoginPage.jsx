// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [status, setStatus] = useState({ loading: false, error: '' });
    const navigate = useNavigate();

    const handleChange = e => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setStatus({ loading: true, error: '' });
        try {
            const res = await login(credentials);
            console.log('👀 Login response object:', res);
            console.log('👀 Login response data:', res.data);

            // Kırmızı: Yeni admin bilgileri de burada çekiliyor
            const { 
                access_token, 
                user_role, 
                user_id,
                admin_username, // Yeni
                admin_first_name, // Yeni
                admin_last_name, // Yeni
                admin_profile_picture // Yeni
            } = res.data; 

            if (access_token && user_role) {
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('user_role', user_role); 
                if (user_id) {
                    localStorage.setItem('user_id', user_id); 
                }

                // Kırmızı: Admin'e özgü bilgileri localStorage'a kaydet
                if (user_role === 'admin') {
                    localStorage.setItem('admin_username', admin_username || '');
                    localStorage.setItem('admin_first_name', admin_first_name || '');
                    localStorage.setItem('admin_last_name', admin_last_name || '');
                    localStorage.setItem('admin_profile_picture', admin_profile_picture || '');
                }

                console.log('✅ Token, Rol ve Admin Bilgileri localStorage’a kaydedildi.');
                console.log('Rol:', user_role);

                if (user_role === 'admin') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/profile', { replace: true });
                }
            } else {
                console.error('❌ "access_token" veya "user_role" bulunamadı. res.data içeriği:', res.data);
                setStatus({ loading: false, error: 'Sunucudan beklenmedik yanıt: token veya rol bilgisi yok.' });
            }
        } catch (err) {
            console.error('❌ Login sırasında hata:', err.response ? err.response.data : err.message);
            const errorMessage = err.response && err.response.data && err.response.data.message
                                 ? err.response.data.message
                                 : 'Giriş başarısız. Kullanıcı adı veya şifre yanlış.';
            setStatus({ loading: false, error: errorMessage });
        }
    };

    return (
        <Container fluid style={{
            background: 'linear-gradient(135deg, #2a9d8f, #e9c46a)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '1rem',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', color: '#2a9d8f', marginBottom: '1.5rem' }}>
                    Giriş Yap
                </h2>

                {status.error && <Alert variant="danger">{status.error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Kullanıcı Adı veya E-posta</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Kullanıcı adınızı veya e-postanızı girin"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Şifre</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Şifrenizi girin"
                            required
                        />
                    </Form.Group>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <Button
                            type="submit"
                            variant="dark"
                            size="lg"
                            disabled={status.loading}
                            style={{ borderRadius: '2rem', padding: '0.75rem 2rem' }}
                        >
                            {status.loading
                                ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                : 'Giriş Yap'
                            }
                        </Button>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span>Hesabın yok mu? </span>
                        <Link to="/signup" style={{ color: '#2a9d8f', fontWeight: '500' }}>
                            Kayıt Ol
                        </Link>
                    </div>
                </Form>
            </div>
        </Container>
    );
}