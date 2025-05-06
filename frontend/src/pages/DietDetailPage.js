import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

// Veritabanına uygun sahte diyet verileri
const diets = [
  {
    diet_id: 1,
    plan_name: "Ketojenik Diyet",
    description: "Karbonhidratı minimuma indirerek vücudu yağ yakımına teşvik eder.",
    calories: 1800,
    goal: "lose_weight",
    image: "https://source.unsplash.com/800x400/?keto",
    created_at: "2025-04-01",
    updated_at: "2025-04-10"
  },
  {
    diet_id: 2,
    plan_name: "Akdeniz Diyeti",
    description: "Zeytinyağı, sebze ve balık ağırlıklı dengeli beslenme planı.",
    calories: 2200,
    goal: "maintain_weight",
    image: "https://source.unsplash.com/800x400/?mediterranean",
    created_at: "2025-03-15",
    updated_at: "2025-03-20"
  },
  {
    diet_id: 3,
    plan_name: "Vegan Diyeti",
    description: "Tamamen bitkisel kaynaklı ve dengeli bir diyet türü.",
    calories: 2000,
    goal: "lose_weight",
    image: "https://source.unsplash.com/800x400/?vegan",
    created_at: "2025-04-05",
    updated_at: "2025-04-07"
  }
];

// goal değerini kullanıcıya uygun metne çeviren fonksiyon
const formatGoal = (goal) => {
  switch (goal) {
    case "lose_weight":
      return "Kilo Vermek";
    case "gain_weight":
      return "Kilo Almak";
    case "maintain_weight":
      return "Kilosunu Korumak";
    default:
      return "Hedef Belirtilmedi";
  }
};

const DietDetailPage = () => {
  const { id } = useParams();
  const diet = diets.find(d => d.diet_id === parseInt(id));
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToProfile = () => {
    setIsAdded(true);
  };

  if (!diet) {
    return (
      <div className="container py-5">
        <h2 className="text-danger">Diyet bulunamadı</h2>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0 rounded-4">
            <img src={diet.image} alt={diet.plan_name} className="card-img-top rounded-top-4" />
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-3">{diet.plan_name}</h3>
              <p className="card-text mb-3">{diet.description}</p>

              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item">Kalori: <strong>{diet.calories} kcal</strong></li>
                <li className="list-group-item">Hedef: <strong>{formatGoal(diet.goal)}</strong></li>
                <li className="list-group-item">Oluşturulma: {diet.created_at}</li>
                <li className="list-group-item">Güncellenme: {diet.updated_at}</li>
              </ul>

              <div className="d-grid">
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleAddToProfile}
                  disabled={isAdded}
                >
                  {isAdded ? "✅ Profilinizde" : "➕ Diyet Planını Profilime Ekle"}
                </button>
              </div>

              {isAdded && (
                <Alert variant="success" className="mt-4 text-center">
                  Diyet planı başarıyla profilinize eklendi!
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietDetailPage;
