// src/pages/admin/ContactListPage.jsx
import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Button, Container, Modal, Form } from 'react-bootstrap';
import { getContacts, createContact, updateContact, deleteContact } from '../../services/api';

export default function ContactListPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('create'); // 'create' or 'edit'
  const [current, setCurrent] = useState({
    contact_id: null,
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getContacts();
      setContacts(res.data);
    } catch {
      setError('İletişimler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setMode('create');
    setCurrent({ contact_id: null, name: '', email: '', message: '' });
    setShowModal(true);
  };

  const openEdit = c => {
    setMode('edit');
    setCurrent(c);
    setShowModal(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Bu iletişimi silmek istediğinize emin misiniz?')) return;
    try {
      await deleteContact(id);
      setContacts(prev => prev.filter(x => x.contact_id !== id));
    } catch {
      alert('Silme işlemi başarısız oldu.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (mode === 'create') {
        await createContact({
          name: current.name,
          email: current.email,
          message: current.message
        });
      } else {
        await updateContact(current.contact_id, {
          name: current.name,
          email: current.email,
          message: current.message
        });
      }
      setShowModal(false);
      load();
    } catch {
      alert('İşlem başarısız oldu.');
    }
  };

  if (loading) {
    return <div className="text-center my-5"><Spinner animation="border" /></div>;
  }
  if (error) {
    return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;
  }

  return (
    <Container>
      <h3 className="mt-4">İletişimler</h3>
      <Button className="mb-3" onClick={openCreate}>
        Yeni İletişim
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>İsim</th><th>Email</th><th>Mesaj</th><th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c.contact_id}>
              <td>{c.contact_id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.message}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => openEdit(c)}>
                  Düzenle
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(c.contact_id)}>
                  Sil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{mode === 'create' ? 'Yeni İletişim' : 'İletişimi Düzenle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="contactName">
              <Form.Label>İsim</Form.Label>
              <Form.Control
                type="text"
                value={current.name}
                onChange={e => setCurrent({ ...current, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={current.email}
                onChange={e => setCurrent({ ...current, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactMessage">
              <Form.Label>Mesaj</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={current.message}
                onChange={e => setCurrent({ ...current, message: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {mode === 'create' ? 'Ekle' : 'Güncelle'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
