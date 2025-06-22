// src/pages/admin/UserListPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Table, Spinner, Alert, Button,
  Container, Modal, Form, Tabs, Tab,
  Row, Col
} from 'react-bootstrap';
import {
  getUsers, deleteUser, updateUser,
  getUserDietsAdmin, createUserDietAdmin, deleteUserDietAdmin,
  getUserExercisesAdmin, createUserExerciseAdmin, deleteUserExerciseAdmin,
  getUserProgressAdmin, createUserProgressAdmin, updateUserProgressAdmin, deleteUserProgressAdmin,
  getDiets, getExercises
} from '../../services/api';

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showDetail, setShowDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Profil formu
  const [profileForm, setProfileForm] = useState({});

  // Diyet/Egzersiz/Progres verileri
  const [allDiets, setAllDiets] = useState([]);
  const [userDiets, setUserDiets] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [userExercises, setUserExercises] = useState([]);
  const [userProgress, setUserProgress] = useState([]);

  // Progres modal
  const [progForm, setProgForm] = useState({});
  const [showProgModal, setShowProgModal] = useState(false);
  const [progMode, setProgMode] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [uRes, dRes, eRes] = await Promise.all([
          getUsers(), getDiets(), getExercises()
        ]);
        setUsers(uRes.data);
        setAllDiets(dRes.data);
        setAllExercises(eRes.data);
      } catch {
        setError('Yükleme hatası');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openDetail = u => {
    setSelectedUser(u);
    setProfileForm({ ...u, password: '' });
    fetchUserTabs(u.user_id);
    setActiveTab('profile');
    setShowDetail(true);
  };

  const fetchUserTabs = async id => {
    const [dR, eR, pR] = await Promise.all([
      getUserDietsAdmin(id),
      getUserExercisesAdmin(id),
      getUserProgressAdmin(id)
    ]);
    setUserDiets(dR.data);
    setUserExercises(eR.data);
    setUserProgress(pR.data);
  };

  const saveProfile = async () => {
    await updateUser(selectedUser.user_id, profileForm);
    setShowDetail(false);
    setLoading(true);
    const uRes = await getUsers();
    setUsers(uRes.data);
    setLoading(false);
  };

  const handleDeleteUser = async id => {
    if (!window.confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) return;
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u.user_id !== id));
  };

  // Diyet işlemleri
  const addDiet = async dietId => {
    await createUserDietAdmin(selectedUser.user_id, dietId);
    fetchUserTabs(selectedUser.user_id);
  };
  const delDiet = async dietId => {
    await deleteUserDietAdmin(selectedUser.user_id, dietId);
    fetchUserTabs(selectedUser.user_id);
  };

  // Egzersiz işlemleri
  const addExercise = async exId => {
    await createUserExerciseAdmin(selectedUser.user_id, exId);
    fetchUserTabs(selectedUser.user_id);
  };
  const delExercise = async exId => {
    await deleteUserExerciseAdmin(selectedUser.user_id, exId);
    fetchUserTabs(selectedUser.user_id);
  };

  // Progres modal fonksiyonları
  const openCreateProg = () => {
    setProgMode('create');
    setProgForm({ weight: '', BFP: '', muscle_mass: '', notes: '', progress_date: '' });
    setShowProgModal(true);
  };
  const openEditProg = p => {
    setProgMode('edit');
    setProgForm(p);
    setShowProgModal(true);
  };
  const saveProg = async () => {
    if (progMode === 'create') {
      await createUserProgressAdmin(selectedUser.user_id, progForm);
    } else {
      await updateUserProgressAdmin(selectedUser.user_id, progForm.progress_id, progForm);
    }
    setShowProgModal(false);
    fetchUserTabs(selectedUser.user_id);
  };
  const delProg = async id => {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
    await deleteUserProgressAdmin(selectedUser.user_id, id);
    fetchUserTabs(selectedUser.user_id);
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error)   return <Alert variant="danger" className="my-5 text-center">{error}</Alert>;

  return (
    <Container className="py-4">
      <h3>Kullanıcılar</h3>
      <Table striped bordered hover>
        <thead>
          <tr><th>ID</th><th>Kullanıcı Adı</th><th>Ad Soyad</th><th>Email</th><th>İşlemler</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.user_id}>
              <td>{u.user_id}</td>
              <td>{u.username}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td>
                <Button size="sm" variant="info" onClick={() => openDetail(u)}>Detay</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDeleteUser(u.user_id)}>Sil</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedUser && (
        <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Kullanıcı #{selectedUser.user_id} Detay</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs activeKey={activeTab} onSelect={k => setActiveTab(k)} className="mb-3">

              {/* Profil Sekmesi */}
              <Tab eventKey="profile" title="Profil">
                <Form>
                  <Row className="mb-2">
                    <Col>
                      <Form.Group>
                        <Form.Label>Kullanıcı Adı</Form.Label>
                        <Form.Control
                          value={profileForm.username}
                          onChange={e => setProfileForm(f => ({ ...f, username: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Şifre</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Güncellemek için yeni şifre"
                          value={profileForm.password}
                          onChange={e => setProfileForm(f => ({ ...f, password: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col>
                      <Form.Group>
                        <Form.Label>İsim</Form.Label>
                        <Form.Control
                          value={profileForm.first_name}
                          onChange={e => setProfileForm(f => ({ ...f, first_name: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Soyisim</Form.Label>
                        <Form.Control
                          value={profileForm.last_name}
                          onChange={e => setProfileForm(f => ({ ...f, last_name: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={profileForm.email}
                      onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </Form.Group>

                  <Row className="mb-2">
                    <Col>
                      <Form.Group>
                        <Form.Label>Doğum Tarihi</Form.Label>
                        <Form.Control
                          type="date"
                          value={profileForm.birth_date}
                          onChange={e => setProfileForm(f => ({ ...f, birth_date: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Cinsiyet</Form.Label>
                        <Form.Select
                          value={profileForm.gender}
                          onChange={e => setProfileForm(f => ({ ...f, gender: e.target.value }))}
                        >
                          <option value="Male">Erkek</option>
                          <option value="Female">Kadın</option>
                          <option value="Other">Diğer</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col>
                      <Form.Group>
                        <Form.Label>Kilo (kg)</Form.Label>
                        <Form.Control
                          type="number" step="0.1"
                          value={profileForm.weight}
                          onChange={e => setProfileForm(f => ({ ...f, weight: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Boy (cm)</Form.Label>
                        <Form.Control
                          type="number" step="0.1"
                          value={profileForm.height}
                          onChange={e => setProfileForm(f => ({ ...f, height: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col>
                      <Form.Group>
                        <Form.Label>Hedef</Form.Label>
                        <Form.Select
                          value={profileForm.goal}
                          onChange={e => setProfileForm(f => ({ ...f, goal: e.target.value }))}
                        >
                          <option value="lose_weight">Kilo Vermek</option>
                          <option value="gain_weight">Kilo Almak</option>
                          <option value="maintain_weight">Korumak</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Aktivite Seviyesi</Form.Label>
                        <Form.Select
                          value={profileForm.activity_level}
                          onChange={e => setProfileForm(f => ({ ...f, activity_level: e.target.value }))}
                        >
                          <option value="sedentary">Sedanter</option>
                          <option value="lightly_active">Hafif Aktif</option>
                          <option value="moderately_active">Orta Aktif</option>
                          <option value="very_active">Çok Aktif</option>
                          <option value="super_active">Aşırı Aktif</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-2">
                    <Form.Label>Profil Resmi URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileForm.profile_picture}
                      onChange={e => setProfileForm(f => ({ ...f, profile_picture: e.target.value }))}
                    />
                  </Form.Group>

                  <Button onClick={saveProfile}>Kaydet</Button>
                </Form>
              </Tab>

              {/* Diyetler Sekmesi */}
              <Tab eventKey="diets" title="Diyetler">
                <Form.Select onChange={e => addDiet(e.target.value)} className="mb-2">
                  <option value="">-- Diyet Ekle --</option>
                  {allDiets.map(d => (
                    <option key={d.diet_id} value={d.diet_id}>{d.plan_name}</option>
                  ))}
                </Form.Select>
                <Table striped bordered hover>
                  <thead>
                    <tr><th>ID</th><th>Plan Adı</th><th>Atama Tarihi</th><th>Sil</th></tr>
                  </thead>
                  <tbody>
                    {userDiets.map(d => (
                      <tr key={d.diet_id}>
                        <td>{d.diet_id}</td>
                        <td>{d.plan_name}</td>
                        <td>{new Date(d.assigned_at).toLocaleString()}</td>
                        <td>
                          <Button size="sm" variant="danger" onClick={() => delDiet(d.diet_id)}>Sil</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

              {/* Egzersizler Sekmesi */}
              <Tab eventKey="exercises" title="Egzersizler">
                <Form.Select onChange={e => addExercise(e.target.value)} className="mb-2">
                  <option value="">-- Egzersiz Ekle --</option>
                  {allExercises.map(ex => (
                    <option key={ex.exercise_id} value={ex.exercise_id}>{ex.plan_name}</option>
                  ))}
                </Form.Select>
                <Table striped bordered hover>
                  <thead>
                    <tr><th>ID</th><th>Plan Adı</th><th>Atama Tarihi</th><th>Sil</th></tr>
                  </thead>
                  <tbody>
                    {userExercises.map(ex => (
                      <tr key={ex.exercise_id}>
                        <td>{ex.exercise_id}</td>
                        <td>{ex.plan_name}</td>
                        <td>{new Date(ex.assigned_at).toLocaleString()}</td>
                        <td>
                          <Button size="sm" variant="danger" onClick={() => delExercise(ex.exercise_id)}>Sil</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

              {/* Progres Sekmesi */}
              <Tab eventKey="progress" title="Gelişim takipi">
                <Button size="sm" className="mb-2" onClick={openCreateProg}>Yeni Kayıt</Button>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th><th>Kilo</th><th>BFP</th><th>Kas</th>
                      <th>Tarih</th><th>Notlar</th><th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProgress.map(p => (
                      <tr key={p.progress_id}>
                        <td>{p.progress_id}</td>
                        <td>{p.weight}</td>
                        <td>{p.BFP}</td>
                        <td>{p.muscle_mass}</td>
                        <td>{new Date(p.progress_date).toLocaleDateString()}</td>
                        <td>{p.notes}</td>
                        <td>
                          <Button size="sm" variant="warning" onClick={() => openEditProg(p)}>Düzenle</Button>{' '}
                          <Button size="sm" variant="danger" onClick={() => delProg(p.progress_id)}>Sil</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetail(false)}>Kapat</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Progres Ekle/Düzenle Modal */}
      <Modal show={showProgModal} onHide={() => setShowProgModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{progMode === 'create' ? 'Yeni Progres' : 'Progres Düzenle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Kilo</Form.Label>
              <Form.Control
                type="number" step="0.1"
                value={progForm.weight}
                onChange={e => setProgForm(f => ({ ...f, weight: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>BFP</Form.Label>
              <Form.Control
                type="number" step="0.1"
                value={progForm.BFP}
                onChange={e => setProgForm(f => ({ ...f, BFP: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Kas (kg)</Form.Label>
              <Form.Control
                type="number" step="0.1"
                value={progForm.muscle_mass}
                onChange={e => setProgForm(f => ({ ...f, muscle_mass: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tarih</Form.Label>
              <Form.Control
                type="date"
                value={progForm.progress_date}
                onChange={e => setProgForm(f => ({ ...f, progress_date: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Notlar</Form.Label>
              <Form.Control
                as="textarea" rows={3}
                value={progForm.notes}
                onChange={e => setProgForm(f => ({ ...f, notes: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProgModal(false)}>İptal</Button>
          <Button variant="primary" onClick={saveProg}>
            {progMode === 'create' ? 'Ekle' : 'Güncelle'}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
