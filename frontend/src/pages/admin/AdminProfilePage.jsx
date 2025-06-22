// src/pages/admin/AdminProfilePage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Card } from 'react-bootstrap';
import { getAdminProfile } from '../../services/api';

export default function AdminProfilePage() {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const res = await getAdminProfile();
        setAdmin(res.data);
      } catch (err) {
        setError('Profil bilgileri yüklenemedi.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-5 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <Container>
      <h3 className="mb-4">Profilim</h3>
      <Card>
        <Card.Body>
          <p><strong>ID:</strong> {admin.admin_id}</p>
          <p><strong>Kullanıcı Adı:</strong> {admin.username}</p>
          <p><strong>İsim:</strong> {admin.first_name || '-'}</p>
          <p><strong>Soyisim:</strong> {admin.last_name || '-'}</p>
          <p><strong>Telefon:</strong> {admin.phone_number || '-'}</p>
          {admin.profile_picture && (
            <p>
              <strong>Profil Resmi:</strong><br/>
              <img
                src={admin.profile_picture}
                alt="Profil"
                width={100}
                height={100}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            </p>
          )}
          <p><strong>Oluşturulma:</strong> {new Date(admin.created_at).toLocaleString()}</p>
          <p><strong>Güncellenme:</strong> {admin.updated_at ? new Date(admin.updated_at).toLocaleString() : '-'}</p>
        </Card.Body>
      </Card>
    </Container>
  );
}
