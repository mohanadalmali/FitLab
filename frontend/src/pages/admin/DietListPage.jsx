// src/pages/admin/DietListPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Table, Spinner, Alert, Button,
  Container, Modal, Form, Image
} from 'react-bootstrap';
import {
  getAdminDiets,
  createAdminDiet,
  updateAdminDiet,
  deleteAdminDiet
} from '../../services/api';

export default function DietListPage() {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentDiet, setCurrentDiet] = useState({
    diet_id: null,
    plan_name: '',
    description: '',
    calories: 0,
    goal: 'lose_weight',
    photo: ''
  });

  useEffect(() => { loadDiets(); }, []);

  const loadDiets = async () => {
    try {
      const res = await getAdminDiets();
      setDiets(res.data);
    } catch {
      setError('Diyetler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setModalMode('create');
    setCurrentDiet({
      diet_id: null,
      plan_name: '',
      description: '',
      calories: 0,
      goal: 'lose_weight',
      photo: ''
    });
    setShowModal(true);
  };
  const openEdit = diet => {
    setModalMode('edit');
    setCurrentDiet({ ...diet });
    setShowModal(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Silinsin mi?')) return;
    try {
      await deleteAdminDiet(id);
      setDiets(prev => prev.filter(d => d.diet_id !== id));
    } catch {
      alert('Silme başarısız.');
    }
  };

  const handleSubmit = async () => {
    const payload = {
      plan_name: currentDiet.plan_name,
      description: currentDiet.description,
      calories: currentDiet.calories,
      goal: currentDiet.goal,
      photo: currentDiet.photo
    };
    try {
      if (modalMode === 'create') {
        await createAdminDiet(payload);
      } else {
        await updateAdminDiet(currentDiet.diet_id, payload);
      }
      setShowModal(false);
      loadDiets();
    } catch {
      alert('İşlem başarısız.');
    }
  };

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;

  return (
    <Container>
      <h3 className="mt-4">Diyet Planları</h3>
      <Button className="mb-3" onClick={openCreate}>Yeni Diyet Ekle</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Açıklama</th>
            <th>Kalori</th>
            <th>Hedef</th>
            <th>Fotoğraf</th>
            <th>Oluşturulma</th>
            <th>Güncellenme</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {diets.map(d => (
            <tr key={d.diet_id}>
              <td>{d.diet_id}</td>
              <td>{d.plan_name}</td>
              <td>{d.description}</td>
              <td>{d.calories}</td>
              <td>{d.goal}</td>
              <td>
                {d.photo
                  ? <Image src={d.photo} rounded width={50} height={50} />
                  : 'Yok'}
              </td>
              <td>{new Date(d.created_at).toLocaleString()}</td>
              <td>{d.updated_at ? new Date(d.updated_at).toLocaleString() : '-'}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => openEdit(d)}>Düzenle</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(d.diet_id)}>Sil</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'create' ? 'Yeni Diyet Ekle' : 'Diyet Düzenle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Plan Adı</Form.Label>
              <Form.Control
                type="text"
                value={currentDiet.plan_name}
                onChange={e => setCurrentDiet({ ...currentDiet, plan_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as="textarea" rows={3}
                value={currentDiet.description}
                onChange={e => setCurrentDiet({ ...currentDiet, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Kalori</Form.Label>
              <Form.Control
                type="number"
                value={currentDiet.calories}
                onChange={e => setCurrentDiet({ ...currentDiet, calories: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Hedef</Form.Label>
              <Form.Select
                value={currentDiet.goal}
                onChange={e => setCurrentDiet({ ...currentDiet, goal: e.target.value })}
              >
                <option value="lose_weight">Kilo Vermek</option>
                <option value="gain_weight">Kilo Almak</option>
                <option value="maintain_weight">Korumak</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fotoğraf URL</Form.Label>
              <Form.Control
                type="text"
                value={currentDiet.photo || ''}
                onChange={e => setCurrentDiet({ ...currentDiet, photo: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>İptal</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {modalMode === 'create' ? 'Ekle' : 'Güncelle'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
