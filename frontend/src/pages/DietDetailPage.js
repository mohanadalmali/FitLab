import React, { useState } from 'react'; // useState hook'unu import ediyoruz
import { useParams } from 'react-router-dom';

// Diyet verileri (gerçek projede bu veriyi API'den çekebilirsin)
const diets = [
  {
    id: 1,
    title: "Ketojenik Diyet",
    image: "https://source.unsplash.com/featured/?keto",
    description: "Düşük karbonhidrat, yüksek yağ içeren bir diyet planı."
  },
  {
    id: 2,
    title: "Akdeniz Diyeti",
    image: "https://source.unsplash.com/featured/?mediterranean",
    description: "Zeytinyağı, sebze ve balık ağırlıklı sağlıklı beslenme planı."
  },
  {
    id: 3,
    title: "Vegan Diyet",
    image: "https://source.unsplash.com/featured/?vegan",
    description: "Hayvansal ürün içermeyen, bitkisel beslenme planı."
  }
];

const DietDetailPage = () => {
  const { id } = useParams();
  const diet = diets.find(d => d.id === parseInt(id));

  // Diyet ekleme durumu
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToProfile = () => {
    // Burada kullanıcı profilini güncelleme işlemi yapılacak
    setIsAdded(true); // Diyeti eklemiş olarak işaretle
    alert('Diyet planı profilinize eklendi!');
  };

  if (!diet) {
    return <div className="container"><h2>Diyet bulunamadı</h2></div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">{diet.title}</h2>
      <img src={diet.image} alt={diet.title} className="img-fluid rounded mb-4" />
      <p>{diet.description}</p>
      
      {/* Diyet ekleme butonu */}
      <button
        className="btn btn-success"
        onClick={handleAddToProfile}
        disabled={isAdded} // Diyet zaten eklenmişse buton devre dışı olacak
      >
        {isAdded ? 'Diyet Profilinizde' : 'Diyet Planını Profilime Ekle'}
      </button>
    </div>
  );
};

export default DietDetailPage;
