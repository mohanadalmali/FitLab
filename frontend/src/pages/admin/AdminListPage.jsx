// src/pages/AdminListPage.jsx

import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Button, Container, Modal, Form } from 'react-bootstrap';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../services/api';

export default function AdminListPage() {
  const [admins, setAdmins]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [modalMode, setModalMode]   = useState('create');
  const [currentAdmin, setCurrentAdmin] = useState({
    admin_id: null,
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    profile_picture: ''
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const res = await getAdmins();
      setAdmins(res.data);
    } catch {
      setError('Yöneticiler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Bu yöneticiyi silmek istediğinize emin misiniz?')) return;
    try {
      await deleteAdmin(id);
      setAdmins(prev => prev.filter(a => a.admin_id !== id));
    } catch {
      alert('Silme işlemi başarısız oldu.');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentAdmin({
      admin_id: null,
      username: '',
      password: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      profile_picture: ''
    });
    setShowModal(true);
  };

  const openEditModal = admin => {
    setModalMode('edit');
    setCurrentAdmin({
      admin_id: admin.admin_id,
      username: admin.username,
      password: '',
      first_name: admin.first_name,
      last_name: admin.last_name,
      phone_number: admin.phone_number,
      profile_picture: admin.profile_picture || ''
    });
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    try {
      const payload = {
        username: currentAdmin.username,
        ...(currentAdmin.password && { password: currentAdmin.password }),
        first_name: currentAdmin.first_name,
        last_name: currentAdmin.last_name,
        phone_number: currentAdmin.phone_number,
        profile_picture: currentAdmin.profile_picture
      };
      if (modalMode === 'create') {
        await createAdmin(payload);
      } else {
        await updateAdmin(currentAdmin.admin_id, payload);
      }
      setShowModal(false);
      loadAdmins();
    } catch {
      alert('İşlem başarısız oldu.');
    }
  };

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (error)   return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;

  return (
    <Container>
      <h3 className="mt-4">Yöneticiler</h3>
      <Button className="mb-3" onClick={openCreateModal}>Yeni Yönetici Ekle</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kullanıcı Adı</th>
            <th>İsim</th>
            <th>Soyisim</th>
            <th>Telefon</th>
            <th>Profil Resmi</th>
            <th>Oluşturulma</th>
            <th>Güncellenme</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(a => (
            <tr key={a.admin_id}>
              <td>{a.admin_id}</td>
              <td>{a.username}</td>
              <td>{a.first_name}</td>
              <td>{a.last_name}</td>
              <td>{a.phone_number}</td>
              <td>
                {a.profile_picture ? (
                  <img
                    src={a.profile_picture}
                    alt=""
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : <span>Yok</span>}
              </td>
              <td>{new Date(a.created_at).toLocaleString()}</td>
              <td>{a.updated_at ? new Date(a.updated_at).toLocaleString() : '-'}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openEditModal(a)}
                >
                  Düzenle
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(a.admin_id)}
                >
                  Sil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' ? 'Yeni Yönetici Ekle' : 'Yöneticiyi Düzenle'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Kullanıcı Adı</Form.Label>
              <Form.Control
                type="text"
                value={currentAdmin.username}
                onChange={e =>
                  setCurrentAdmin({ ...currentAdmin, username: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                placeholder={modalMode === 'edit' ? 'Boş bırakılırsa değişmez' : ''}
                value={currentAdmin.password}
                onChange={e =>
                  setCurrentAdmin({ ...currentAdmin, password: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>İsim</Form.Label>
              <Form.Control
                type="text"
                value={currentAdmin.first_name}
                onChange={e =>
                  setCurrentAdmin({ ...currentAdmin, first_name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Soyisim</Form.Label>
              <Form.Control
                type="text"
                value={currentAdmin.last_name}
                onChange={e =>
                  setCurrentAdmin({ ...currentAdmin, last_name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                value={currentAdmin.phone_number}
                onChange={e =>
                  setCurrentAdmin({ ...currentAdmin, phone_number: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profil Resmi URL</Form.Label>
              <Form.Control
                type="text"
                value={currentAdmin.profile_picture}
                onChange={e =>
                  setCurrentAdmin({ ...currentAdmin, profile_picture: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            {modalMode === 'create' ? 'Ekle' : 'Güncelle'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
