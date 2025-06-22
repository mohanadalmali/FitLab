// src/pages/ProfilePage.jsx

import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  Card,
  Badge,
  Table
} from 'react-bootstrap';
import {
  getProfile,
  updateProfile,
  getUserDietsAdmin,
  createUserDietAdmin,
  deleteUserDietAdmin,
  getUserExercisesAdmin,
  createUserExerciseAdmin,
  deleteUserExerciseAdmin,
  getUserProgressAdmin,
  createUserProgressAdmin,
  updateUserProgressAdmin,
  deleteUserProgressAdmin,
  getDiets,
  getExercises
} from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Diyet, egzersiz, progress verileri
  const [allDiets, setAllDiets] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [userDiets, setUserDiets] = useState([]);
  const [userExercises, setUserExercises] = useState([]);
  const [userProgress, setUserProgress] = useState([]);

  // Seçilen yeni diyet/egzersiz ID’leri
  const [chosenDietId, setChosenDietId] = useState('');
  const [chosenExerciseId, setChosenExerciseId] = useState('');

  // Progress formu state
  const [progressForm, setProgressForm] = useState({
    progress_id: null,
    weight: '',
    BFP: '',
    muscle_mass: '',
    notes: '',
    progress_date: ''
  });
  const [isEditingProgress, setIsEditingProgress] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      try {
        // 1) Profil
        const resProfile = await getProfile();
        if (!mounted) return;
        setProfile(resProfile.data);

        // 2) Tüm diyet ve egzersiz planlarını al (dropdown ve detaylar için)
        const [resDiets, resExercises] = await Promise.all([
          getDiets(),
          getExercises()
        ]);
        if (!mounted) return;
        setAllDiets(resDiets.data);
        setAllExercises(resExercises.data);

        // 3) Kullanıcının ataması ve progress verilerini al
        const userId = resProfile.data.user_id;
        const [resUserDiets, resUserExercises, resUserProgress] = await Promise.all([
          getUserDietsAdmin(userId),
          getUserExercisesAdmin(userId),
          getUserProgressAdmin(userId)
        ]);
        if (!mounted) return;
        setUserDiets(resUserDiets.data);
        setUserExercises(resUserExercises.data);
        setUserProgress(resUserProgress.data);
      } catch {
        navigate('/login');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => { mounted = false; };
  }, [navigate]);

  // Profil alan değişiklikleri
  const handleProfileChange = e => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  // Profil kaydetme
  const handleProfileSave = async () => {
    setSavingProfile(true);
    try {
      await updateProfile(profile);
      setErrorProfile('');
      setIsEditingProfile(false);
      alert('Profil başarıyla güncellendi');
    } catch {
      setErrorProfile('Profil güncellenirken hata oluştu');
    } finally {
      setSavingProfile(false);
    }
  };

  // Diyet ekleme
  const handleAddDiet = async () => {
    if (!chosenDietId) return;
    try {
      await createUserDietAdmin(profile.user_id, chosenDietId);
      const res = await getUserDietsAdmin(profile.user_id);
      setUserDiets(res.data);
      setChosenDietId('');
    } catch (err) {
      console.error('Diyet ekleme hatası:', err);
    }
  };

  // Diyet silme
  const handleDeleteDiet = async dietId => {
    try {
      await deleteUserDietAdmin(profile.user_id, dietId);
      const res = await getUserDietsAdmin(profile.user_id);
      setUserDiets(res.data);
    } catch (err) {
      console.error('Diyet silme hatası:', err);
    }
  };

  // Egzersiz ekleme
  const handleAddExercise = async () => {
    if (!chosenExerciseId) return;
    try {
      await createUserExerciseAdmin(profile.user_id, chosenExerciseId);
      const res = await getUserExercisesAdmin(profile.user_id);
      setUserExercises(res.data);
      setChosenExerciseId('');
    } catch (err) {
      console.error('Egzersiz ekleme hatası:', err);
    }
  };

  // Egzersiz silme
  const handleDeleteExercise = async exerciseId => {
    try {
      await deleteUserExerciseAdmin(profile.user_id, exerciseId);
      const res = await getUserExercisesAdmin(profile.user_id);
      setUserExercises(res.data);
    } catch (err) {
      console.error('Egzersiz silme hatası:', err);
    }
  };

  // Progress formu reset
  const resetProgressForm = () => {
    setProgressForm({
      progress_id: null,
      weight: '',
      BFP: '',
      muscle_mass: '',
      notes: '',
      progress_date: ''
    });
    setIsEditingProgress(false);
  };

  // Progress alan değişiklikleri
  const handleProgressChange = e => {
    const { name, value } = e.target;
    setProgressForm(p => ({ ...p, [name]: value }));
  };

  // Progress ekleme / güncelleme
  const handleSaveProgress = async () => {
    const payload = {
      weight: progressForm.weight,
      BFP: progressForm.BFP,
      muscle_mass: progressForm.muscle_mass,
      notes: progressForm.notes,
      progress_date: progressForm.progress_date
    };
    try {
      if (isEditingProgress) {
        await updateUserProgressAdmin(profile.user_id, progressForm.progress_id, payload);
      } else {
        await createUserProgressAdmin(profile.user_id, payload);
      }
      const res = await getUserProgressAdmin(profile.user_id);
      setUserProgress(res.data);
      resetProgressForm();
    } catch (err) {
      console.error('Progress kaydetme hatası:', err);
    }
  };

  // Progress düzenleme için formu doldurma
  const handleEditProgress = p => {
    setProgressForm({
      progress_id: p.progress_id,
      weight: p.weight,
      BFP: p.BFP,
      muscle_mass: p.muscle_mass,
      notes: p.notes,
      progress_date: p.progress_date.slice(0, 10) // YYYY-MM-DD
    });
    setIsEditingProgress(true);
  };

  // Progress silme
  const handleDeleteProgress = async progressId => {
    try {
      await deleteUserProgressAdmin(profile.user_id, progressId);
      const res = await getUserProgressAdmin(profile.user_id);
      setUserProgress(res.data);
    } catch (err) {
      console.error('Progress silme hatası:', err);
    }
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto my-5" />;
  }
  if (!profile) return null;

  // Diyet/egzersiz ID üzerinden tam objeyi bulma yardımcıları
  const findDietById = id => allDiets.find(d => d.diet_id === id) || {};
  const findExerciseById = id => allExercises.find(e => e.exercise_id === id) || {};

  return (
    <Container className="py-4">
      {/* ───────── Profil Bilgileri ───────── */}
      {!isEditingProfile ? (
        <Card className="mb-5 shadow-sm">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4} className="text-center">
                {profile.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt="Profil"
                    className="rounded-circle"
                    style={{ width: '140px', height: '140px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary"
                    style={{ width: '140px', height: '140px' }}
                  />
                )}
              </Col>
              <Col md={8}>
                <h4 className="mb-2">
                  {profile.first_name} {profile.last_name}
                </h4>
                <p className="mb-1"><strong>Kullanıcı Adı:</strong> {profile.username}</p>
                <p className="mb-1"><strong>E-posta:</strong> {profile.email}</p>
                {profile.birth_date && (
                  <p className="mb-1">
                    <strong>Doğum Tarihi:</strong>{' '}
                    {new Date(profile.birth_date).toLocaleDateString()}
                  </p>
                )}
                <p className="mb-1"><strong>Cinsiyet:</strong> {profile.gender}</p>
                {profile.weight != null && (
                  <p className="mb-1"><strong>Kilo:</strong> {profile.weight} kg</p>
                )}
                {profile.height != null && (
                  <p className="mb-1"><strong>Boy:</strong> {profile.height} cm</p>
                )}
                <p className="mb-1">
                  <strong>Hedef:</strong>{' '}
                  {profile.goal === 'lose_weight'
                    ? 'Kilo Vermek'
                    : profile.goal === 'gain_weight'
                    ? 'Kilo Almak'
                    : 'Korumak'}
                </p>
                <p className="mb-3">
                  <strong>Aktivite Seviyesi:</strong> {profile.activity_level}
                </p>
                <Button variant="primary" onClick={() => setIsEditingProfile(true)}>
                  Düzenle
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-5 shadow-sm">
          <Card.Header as="h5" className="bg-white">Profil Bilgilerimi Düzenle</Card.Header>
          <Card.Body>
            {errorProfile && <Alert variant="danger">{errorProfile}</Alert>}
            <Form>
              <Row>
                {[
                  { label: 'Profil Resmi URL', name: 'profile_picture', type: 'text', md: 12 },
                  { label: 'İsim', name: 'first_name', type: 'text', md: 6 },
                  { label: 'Soyisim', name: 'last_name', type: 'text', md: 6 },
                  { label: 'E-posta', name: 'email', type: 'email', md: 6 },
                  { label: 'Şifre (yeniden giriniz)', name: 'password', type: 'password', md: 6 },
                  { label: 'Doğum Tarihi', name: 'birth_date', type: 'date', md: 6 },
                  {
                    label: 'Cinsiyet',
                    name: 'gender',
                    type: 'select',
                    options: ['Male', 'Female', 'Other'],
                    md: 6
                  },
                  { label: 'Kilo (kg)', name: 'weight', type: 'number', md: 6 },
                  { label: 'Boy (cm)', name: 'height', type: 'number', md: 6 },
                  {
                    label: 'Hedef',
                    name: 'goal',
                    type: 'select',
                    options: ['lose_weight', 'gain_weight', 'maintain_weight'],
                    md: 6
                  },
                  {
                    label: 'Aktivite Seviyesi',
                    name: 'activity_level',
                    type: 'select',
                    options: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'super_active'],
                    md: 6
                  }
                ].map(f => (
                  <Col md={f.md} key={f.name} className="mb-3">
                    <Form.Group>
                      <Form.Label>{f.label}</Form.Label>
                      {f.type === 'select' ? (
                        <Form.Select
                          name={f.name}
                          value={profile[f.name] || f.options[0]}
                          onChange={handleProfileChange}
                        >
                          {f.options.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </Form.Select>
                      ) : (
                        <Form.Control
                          type={f.type}
                          name={f.name}
                          value={profile[f.name] || ''}
                          onChange={handleProfileChange}
                          step={f.type === 'number' ? '0.1' : undefined}
                        />
                      )}
                    </Form.Group>
                  </Col>
                ))}
              </Row>
              <Button variant="primary" onClick={handleProfileSave} disabled={savingProfile}>
                {savingProfile ? <Spinner animation="border" size="sm" /> : 'Kaydet'}
              </Button>{' '}
              <Button variant="outline-secondary" onClick={() => setIsEditingProfile(false)}>
                İptal
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* ───────── Diyet ve Egzersiz Planları ───────── */}
      <Row className="mb-5 gx-4 gy-4">
        {/* Diyet Planları */}
        <Col md={6}>
          <Form className="d-flex align-items-center mb-3">
            <Form.Select
              className="me-2"
              value={chosenDietId}
              onChange={e => setChosenDietId(e.target.value)}
            >
              <option value="">Diyet Planı Seçin…</option>
              {allDiets.map(d => (
                <option key={d.diet_id} value={d.diet_id}>
                  {d.plan_name}
                </option>
              ))}
            </Form.Select>
            <Button variant="success" onClick={handleAddDiet} disabled={!chosenDietId}>
              Ekle
            </Button>
          </Form>
          <Row className="g-3">
            {userDiets.map(d => {
              const full = findDietById(d.diet_id);
              return (
                <Col md={12} key={d.diet_id}>
                  <Card className="shadow-sm">
                    <Card.Img
                      variant="top"
                      src={full.photo || '/placeholder-diet.jpg'}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Badge
                        bg="primary"
                        className="mb-2 px-2 py-1"
                        style={{ fontSize: '0.85rem', borderRadius: '1.5rem' }}
                      >
                        {full.goal === 'lose_weight'
                          ? 'Kilo Vermek'
                          : full.goal === 'gain_weight'
                          ? 'Kilo Almak'
                          : 'Korumak'}
                      </Badge>
                      <Card.Title className="h6">{full.plan_name}</Card.Title>
                      <Card.Text style={{ color: '#555', marginBottom: '0.5rem' }}>
                        {full.description}
                      </Card.Text>
                      <div>
                        <small className="text-muted d-block">
                          Kalori: {full.calories}
                        </small>
                        <small className="text-muted d-block">
                          Oluşturulma: {full.created_at ? new Date(full.created_at).toLocaleDateString() : '-'}
                        </small>
                        <small className="text-muted d-block">
                          Güncellenme: {full.updated_at ? new Date(full.updated_at).toLocaleDateString() : '-'}
                        </small>
                        <small className="d-block mb-2">
                          Atama: {new Date(d.assigned_at).toLocaleDateString()}
                        </small>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteDiet(d.diet_id)}
                      >
                        Sil
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
            {userDiets.length === 0 && (
              <Col>
                <Alert variant="info" className="text-center">
                  Henüz diyet planınız yok
                </Alert>
              </Col>
            )}
          </Row>
        </Col>

        {/* Egzersiz Planları */}
        <Col md={6}>
          <Form className="d-flex align-items-center mb-3">
            <Form.Select
              className="me-2"
              value={chosenExerciseId}
              onChange={e => setChosenExerciseId(e.target.value)}
            >
              <option value="">Egzersiz Planı Seçin…</option>
              {allExercises.map(ez => (
                <option key={ez.exercise_id} value={ez.exercise_id}>
                  {ez.plan_name}
                </option>
              ))}
            </Form.Select>
            <Button variant="success" onClick={handleAddExercise} disabled={!chosenExerciseId}>
              Ekle
            </Button>
          </Form>
          <Row className="g-3">
            {userExercises.map(ez => {
              const full = findExerciseById(ez.exercise_id);
              return (
                <Col md={12} key={ez.exercise_id}>
                  <Card className="shadow-sm">
                    <Card.Img
                      variant="top"
                      src={full.photo || '/placeholder-exercise.jpg'}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Badge
                        bg="warning"
                        text="dark"
                        className="mb-2 px-2 py-1"
                        style={{ fontSize: '0.85rem', borderRadius: '1.5rem' }}
                      >
                        {full.intensity === 'beginner'
                          ? 'Başlangıç'
                          : full.intensity === 'intermediate'
                          ? 'Orta'
                          : 'İleri'}
                      </Badge>
                      <Card.Title className="h6">{full.plan_name}</Card.Title>
                      <Card.Text style={{ color: '#555', marginBottom: '0.5rem' }}>
                        {full.description}
                      </Card.Text>
                      <div>
                        <small className="text-muted d-block">
                          Oluşturulma: {full.created_at ? new Date(full.created_at).toLocaleDateString() : '-'}
                        </small>
                        <small className="text-muted d-block">
                          Güncellenme: {full.updated_at ? new Date(full.updated_at).toLocaleDateString() : '-'}
                        </small>
                        <small className="d-block mb-2">
                          Atama: {new Date(ez.assigned_at).toLocaleDateString()}
                        </small>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteExercise(ez.exercise_id)}
                      >
                        Sil
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
            {userExercises.length === 0 && (
              <Col>
                <Alert variant="info" className="text-center">
                  Henüz egzersiz planınız yok
                </Alert>
              </Col>
            )}
          </Row>
        </Col>
      </Row>

      {/* ───────── Progress Tracking ───────── */}
      <Card className="mb-5 shadow-sm">
        <Card.Header as="h5" className="bg-white">İlerlemem</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row className="g-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Tarih</Form.Label>
                  <Form.Control
                    type="date"
                    name="progress_date"
                    value={progressForm.progress_date}
                    onChange={handleProgressChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Kilo (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    name="weight"
                    step="0.1"
                    value={progressForm.weight}
                    onChange={handleProgressChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>BFP (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="BFP"
                    step="0.1"
                    value={progressForm.BFP}
                    onChange={handleProgressChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Kas (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    name="muscle_mass"
                    step="0.1"
                    value={progressForm.muscle_mass}
                    onChange={handleProgressChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Notlar</Form.Label>
                  <Form.Control
                    type="text"
                    name="notes"
                    value={progressForm.notes}
                    onChange={handleProgressChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="primary" onClick={handleSaveProgress}>
                  {isEditingProgress ? 'Güncelle' : 'Ekle'}
                </Button>
                {isEditingProgress && (
                  <Button
                    variant="outline-secondary"
                    className="ms-2"
                    onClick={resetProgressForm}
                  >
                    İptal
                  </Button>
                )}
              </Col>
            </Row>
          </Form>

          <Table
            striped
            bordered
            hover
            responsive
            className="align-middle mb-0"
          >
            <thead className="table-light">
              <tr>
                <th>Tarih</th>
                <th>Kilo</th>
                <th>BFP</th>
                <th>Kas</th>
                <th>Notlar</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {userProgress.map(p => (
                <tr key={p.progress_id}>
                  <td>{p.progress_date}</td>
                  <td>{p.weight}</td>
                  <td>{p.BFP}</td>
                  <td>{p.muscle_mass}</td>
                  <td>{p.notes}</td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditProgress(p)}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteProgress(p.progress_id)}
                    >
                      Sil
                    </Button>
                  </td>
                </tr>
              ))}
              {userProgress.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Henüz ilerleme kaydınız yok
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
