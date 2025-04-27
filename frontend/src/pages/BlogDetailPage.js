import React from 'react';
import { useParams } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: "Sporun Ruh Sağlığına Faydaları",
    image: "https://source.unsplash.com/featured/?mental-health,exercise",
    content: "Sporun ruh sağlığına olan etkisi oldukça büyüktür. Endorfin salgılanması, stresin azalması..."
  },
  {
    id: 2,
    title: "Günlük Su Tüketimi Neden Önemlidir?",
    image: "https://source.unsplash.com/featured/?water,health",
    content: "Vücudumuzun büyük bir kısmı sudan oluşur. Su içmek sindirim, metabolizma, enerji gibi süreçlerde çok önemlidir..."
  },
  {
    id: 3,
    title: "Sağlıklı Atıştırmalıklar",
    image: "https://source.unsplash.com/featured/?snacks,healthy",
    content: "Sağlıklı yaşam için çiğ kuruyemişler, yoğurt, meyve gibi atıştırmalıklar ideal seçeneklerdir..."
  }
];

const BlogDetailPage = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id));

  if (!post) {
    return <div className="container"><h2>Blog yazısı bulunamadı.</h2></div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">{post.title}</h2>
      <img src={post.image} alt={post.title} className="img-fluid rounded mb-4" />
      <p>{post.content}</p>
    </div>
  );
};

export default BlogDetailPage;
