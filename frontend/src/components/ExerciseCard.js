// ExerciseCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const ExerciseCard = ({ id, title, image, description }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 border-0 shadow rounded-4 overflow-hidden">
        <img
          src={image}
          className="card-img-top"
          alt={title}
          style={{ height: '220px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title fw-bold">{title}</h5>
          <p className="card-text text-muted small">{description}</p>
          <Link to={`/exercise/${id}`} className="btn btn-outline-primary mt-auto rounded-pill">
            Detayları Gör
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
