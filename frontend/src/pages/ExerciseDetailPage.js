import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

// Veritabanına uygun sahte egzersiz verileri
const exercises = [
  {
    exercise_id: 1,
    name: "Kardiyo Egzersizleri",
    description: "Kalp sağlığını geliştiren ve yağ yakımını hızlandıran egzersizler.",
    duration: "30 dakika",
    calories: 300,
    goal: "lose_weight",
    image: "https://source.unsplash.com/800x400/?cardio",
    created_at: "2025-04-01",
    updated_at: "2025-04-10"
  },
  {
    exercise_id: 2,
    name: "Ağırlık Antrenmanı",
    description: "Kas kütlesi ve güç artırmaya yönelik ağırlık egzersizleri.",
    duration: "45 dakika",
    calories: 350,
    goal: "gain_strength",
    image: "https://source.unsplash.com/800x400/?weightlifting",
    created_at: "2025-03-15",
    updated_at: "2025-03-20"
  },
  {
    exercise_id: 3,
    name: "Esneme ve Yoga",
    description: "Esneklik ve dengeyi artıran, zihni rahatlatan egzersizler.",
    duration: "60 dakika",
    calories: 200,
    goal: "maintain_flexibility",
    image: "https://source.unsplash.com/800x400/?yoga",
    created_at: "2025-04-05",
    updated_at: "2025-04-07"
  }
];

// goal değerini kullanıcıya uygun metne çeviren fonksiyon
const formatGoal = (goal) => {
  switch (goal) {
    case "lose_weight":
      return "Kilo Vermek";
    case "gain_strength":
      return "Güç Kazanmak";
    case "maintain_flexibility":
      return "Esneklik Koruma";
    default:
      return "Hedef Belirtilmedi";
  }
};

const ExerciseDetailPage = () => {
  const { id } = useParams();
  const exercise = exercises.find(ex => ex.exercise_id === parseInt(id));
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToProfile = () => {
    setIsAdded(true);
  };

  if (!exercise) {
    return (
      <div className="container py-5">
        <h2 className="text-danger">Egzersiz bulunamadı</h2>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0 rounded-4">
            <img src={exercise.image} alt={exercise.name} className="card-img-top rounded-top-4" />
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-3">{exercise.name}</h3>
              <p className="card-text mb-3">{exercise.description}</p>

              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item">Süre: <strong>{exercise.duration}</strong></li>
                <li className="list-group-item">Kalori: <strong>{exercise.calories} kcal</strong></li>
                <li className="list-group-item">Hedef: <strong>{formatGoal(exercise.goal)}</strong></li>
                <li className="list-group-item">Oluşturulma: {exercise.created_at}</li>
                <li className="list-group-item">Güncellenme: {exercise.updated_at}</li>
              </ul>

              <div className="d-grid">
                <button
                  className="btn btn-warning btn-lg"
                  onClick={handleAddToProfile}
                  disabled={isAdded}
                >
                  {isAdded ? "✅ Profilinizde" : "➕ Egzersiz Planını Profilime Ekle"}
                </button>
              </div>

              {isAdded && (
                <Alert variant="success" className="mt-4 text-center">
                  Egzersiz planı başarıyla profilinize eklendi!
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
