// src/components/CalorieCalculator.jsx
import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

export default function CalorieCalculator() {
    // Giriş alanları için state değişkenleri
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState(''); // kg cinsinden
    const [height, setHeight] = useState(''); // cm cinsinden
    const [age, setAge] = useState('');       // yıl cinsinden
    const [activityLevel, setActivityLevel] = useState('1.2'); // Varsayılan: Sedanter
    
    // Sonuçlar için state değişkenleri
    const [bmr, setBmr] = useState(null);   // Bazal Metabolizma Hızı
    const [tdee, setTdee] = useState(null); // Toplam Günlük Enerji Harcaması
    const [error, setError] = useState(''); // Doğrulama için hata mesajı

    // Kalori hesaplama fonksiyonu
    const calculateCalories = (e) => {
        e.preventDefault(); // Varsayılan form gönderme davranışını engeller
        setError(''); // Önceki hataları temizler

        // Giriş doğrulama
        if (!gender || !weight || !height || !age) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        const w = parseFloat(weight);
        const h = parseFloat(height);
        const a = parseInt(age);

        if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) {
            setError('Lütfen geçerli sayılar girin.');
            return;
        }

        let calculatedBMR;
        // Mifflin-St Jeor Denklemi ile BMR hesaplaması
        if (gender === 'male') {
            calculatedBMR = (10 * w) + (6.25 * h) - (5 * a) + 5;
        } else { // female
            calculatedBMR = (10 * w) + (6.25 * h) - (5 * a) - 161;
        }

        // Toplam Günlük Enerji Harcamasını (TDEE) hesaplar
        const calculatedTDEE = calculatedBMR * parseFloat(activityLevel);

        // Hesaplanan sonuçları iki ondalık basamağa yuvarlayarak ayarlar
        setBmr(calculatedBMR.toFixed(2));
        setTdee(calculatedTDEE.toFixed(2));
    };

    return (
        <Card className="shadow-sm border-0 rounded-3 p-4 mb-5">
            <Card.Body>
                <h4 className="card-title text-primary mb-4">Kalori İhtiyacı Hesaplayıcı</h4>
                {error && <Alert variant="danger">{error}</Alert>} {/* Hata mesajını gösterir */}
                <Form onSubmit={calculateCalories}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="gender">
                                <Form.Label>Cinsiyet</Form.Label>
                                <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="">Seçin...</option>
                                    <option value="male">Erkek</option>
                                    <option value="female">Kadın</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="age">
                                <Form.Label>Yaş (yıl)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="Yaşınızı girin"
                                    min="1"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="weight">
                                <Form.Label>Kilo (kg)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="Kilonuzu kg cinsinden girin"
                                    min="1"
                                    step="0.1" // Kilo için ondalık girişlere izin verir
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="height">
                                <Form.Label>Boy (cm)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="Boyunuzu cm cinsinden girin"
                                    min="1"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="activityLevel" className="mb-4">
                        <Form.Label>Aktivite Seviyesi</Form.Label>
                        <Form.Select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                            <option value="1.2">Sedanter (Çok az veya hiç egzersiz)</option>
                            <option value="1.375">Hafif Aktif (Hafif egzersiz/spor, 1-3 gün/hafta)</option>
                            <option value="1.55">Orta Derecede Aktif (Orta egzersiz/spor, 3-5 gün/hafta)</option>
                            <option value="1.725">Çok Aktif (Yoğun egzersiz/spor, 6-7 gün/hafta)</option>
                            <option value="1.9">Ekstra Aktif (Çok yoğun egzersiz/iş, günde iki kez antrenman)</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        Hesapla
                    </Button>
                </Form>

                {(bmr && tdee) && ( // Yalnızca BMR ve TDEE hesaplandığında sonuçları gösterir
                    <div className="mt-4 text-center">
                        <hr />
                        <h5 className="text-secondary">Sonuçlarınız:</h5>
                        <Alert variant="success" className="p-3">
                            <p className="mb-1">Bazal Metabolizma Hızınız (BMR): <strong>{bmr} kalori/gün</strong></p>
                            <p className="mb-0">Toplam Günlük Enerji Harcamanız (TDEE): <strong>{tdee} kalori/gün</strong></p>
                        </Alert>
                        <p className="text-muted small">Bu değerler kişisel kalori ihtiyacınız için bir tahmindir.</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}