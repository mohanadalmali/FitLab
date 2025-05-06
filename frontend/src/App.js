// import React, { useEffect, useState } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Homepage from './pages/HomePage';
import DietPage from './pages/DietPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DietDetailPage from './pages/DietDetailPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ExercisePage from './pages/ExercisePage';
import ExerciseDetail from './pages/ExerciseDetailPage';
import './App.css';


function App() {
  // state hook ile mesajı tutmak için
  // const [message, setMessage] = useState('');

  // // useEffect ile API'den veri çekmek
  // useEffect(() => {
  //   fetch('/api/example')  // Flask API endpoint'ine istek gönder
  //     .then((response) => response.json())  // JSON olarak çözümle
  //     .then((data) => setMessage(data.message));  // Gelen mesajı state'e ekle
  // }, []);  // sadece component ilk render edildiğinde çalışacak

  return (
    <Router>
      
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/diet" element={<DietPage />} />
          <Route path="/diet/:id" element={<DietDetailPage />} />
          <Route path="/exercise" element={<ExercisePage />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
