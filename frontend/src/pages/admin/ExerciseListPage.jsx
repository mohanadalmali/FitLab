import React, { useEffect, useState } from 'react';
import {
  Table, Spinner, Alert, Button,
  Container, Modal, Form, Image
} from 'react-bootstrap';
import {
  getAdminExercises,
  createAdminExercise,
  updateAdminExercise,
  deleteAdminExercise
} from '../../services/api';

export default function ExerciseListPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('create');
  const [current, setCurrent] = useState({
    exercise_id: null,
    plan_name: '',
    description: '',
    intensity: 'beginner',
    photo: ''
  });

  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const res = await getAdminExercises();
      setExercises(res.data);
    } catch {
      setError('Egzersizler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setMode('create');
    setCurrent({ exercise_id: null, plan_name: '', description: '', intensity: 'beginner', photo: '' });
    setShowModal(true);
  };
  const openEdit = ex => { setMode('edit'); setCurrent(ex); setShowModal(true); };

  const handleDelete = async id => {
    if (!window.confirm('Silinsin mi?')) return;
    try {
      await deleteAdminExercise(id);
      setExercises(prev => prev.filter(e => e.exercise_id !== id));
    } catch {
      alert('Silme başarısız.');
    }
  };

  const handleSubmit = async () => {
    const payload = {
      plan_name: current.plan_name,
      description: current.description,
      intensity: current.intensity,
      photo: current.photo
    };
    try {
      if (mode === 'create') await createAdminExercise(payload);
      else await updateAdminExercise(current.exercise_id, payload);
      setShowModal(false);
      load();
    } catch {
      alert('İşlem başarısız.');
    }
  };

  if (loading) return <div className="text-center my-5"><Spinner animation="border"/></div>;
  if (error) return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;

  return (
    <Container>
      <h3 className="mt-4">Egzersiz Planları</h3>
      <Button className="mb-3" onClick={openCreate}>Yeni Egzersiz Ekle</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Plan Adı</th>
            <th>Açıklama</th>
            <th>Düzey</th>
            <th>Fotoğraf</th>
            <th>Oluşturulma</th>
            <th>Güncellenme</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map(e => (
            <tr key={e.exercise_id}>
              <td>{e.exercise_id}</td>
              <td>{e.plan_name}</td>
              <td>{e.description}</td>
              <td>{e.intensity}</td>
              <td>
                {e.photo
                  ? <Image src={e.photo} rounded width={50} height={50} />
                  : 'Yok'}
              </td>
              <td>{new Date(e.created_at).toLocaleString()}</td>
              <td>{e.updated_at ? new Date(e.updated_at).toLocaleString() : '-'}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => openEdit(e)}>Düzenle</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(e.exercise_id)}>Sil</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{mode === 'create' ? 'Yeni Egzersiz' : 'Egzersiz Düzenle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Plan Adı</Form.Label>
              <Form.Control type="text" value={current.plan_name} onChange={e => setCurrent({ ...current, plan_name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control as="textarea" rows={3} value={current.description} onChange={e => setCurrent({ ...current, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Düzey</Form.Label>
              <Form.Select value={current.intensity} onChange={e => setCurrent({ ...current, intensity: e.target.value })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fotoğraf URL</Form.Label>
              <Form.Control type="text" value={current.photo} onChange={e => setCurrent({ ...current, photo: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>İptal</Button>
          <Button variant="primary" onClick={handleSubmit}>{mode === 'create' ? 'Ekle' : 'Güncelle'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
