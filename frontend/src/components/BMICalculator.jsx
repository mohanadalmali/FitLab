// src/components/BMICalculator.jsx
import React, { useState } from 'react';
import { Form, Button, Card,Alert } from 'react-bootstrap';

export default function BMICalculator() {
    const [weight, setWeight] = useState(''); // kg cinsinden
    const [height, setHeight] = useState(''); // cm cinsinden
    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');
    const [error, setError] = useState('');

    const calculateBMI = (e) => {
        e.preventDefault();
        setError('');
        setBmi(null); // Önceki sonuçları temizle
        setBmiCategory(''); // Önceki kategori sonuçlarını temizle

        if (!weight || !height) {
            setError('Lütfen kilonuzu ve boyunuzu girin.');
            return;
        }

        const w = parseFloat(weight);
        const h = parseFloat(height);

        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
            setError('Lütfen geçerli sayılar girin (pozitif olmalı).');
            return;
        }

        // Boyu cm'den metreye çevir
        const heightInMeters = h / 100;
        // VKİ hesapla: kilo (kg) / (boy (m) * boy (m))
        const calculatedBmi = w / (heightInMeters * heightInMeters);

        setBmi(calculatedBmi.toFixed(2)); // İki ondalık basamağa yuvarla

        // VKİ kategorisini belirle
        if (calculatedBmi < 18.5) {
            setBmiCategory('Zayıf');
        } else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) {
            setBmiCategory('Normal Kilolu');
        } else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) {
            setBmiCategory('Fazla Kilolu');
        } else if (calculatedBmi >= 30 && calculatedBmi <= 34.9) {
            setBmiCategory('Obez (Sınıf I)');
        } else if (calculatedBmi >= 35 && calculatedBmi <= 39.9) {
            setBmiCategory('Obez (Sınıf II)');
        } else {
            setBmiCategory('Aşırı Obez (Sınıf III)');
        }
    };

    return (
        <Card className="shadow-sm border-0 rounded-3 p-4 mb-5">
            <Card.Body>
                <h4 className="card-title text-success mb-4">Vücut Kitle İndeksi (VKİ) Hesaplayıcı</h4>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={calculateBMI}>
                    <Form.Group controlId="bmiWeight" className="mb-3">
                        <Form.Label>Kilo (kg)</Form.Label>
                        <Form.Control
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Kilonuzu kg cinsinden girin"
                            min="1"
                            step="0.1"
                        />
                    </Form.Group>
                    <Form.Group controlId="bmiHeight" className="mb-4">
                        <Form.Label>Boy (cm)</Form.Label>
                        <Form.Control
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Boyunuzu cm cinsinden girin"
                            min="1"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100">
                        VKİ Hesapla
                    </Button>
                </Form>

                {(bmi && bmiCategory) && (
                    <div className="mt-4 text-center">
                        <hr />
                        <h5 className="text-secondary">Sonuçlarınız:</h5>
                        <Alert variant="success" className="p-3">
                            <p className="mb-1">VKİ Değeriniz: <strong>{bmi}</strong></p>
                            <p className="mb-0">Kategoriniz: <strong>{bmiCategory}</strong></p>
                        </Alert>
                        <p className="text-muted small">Bu değerler kişisel sağlık durumunuz için bir göstergedir.</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}