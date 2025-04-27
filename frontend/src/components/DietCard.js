import React from 'react';
import { Link } from 'react-router-dom';

const DietCard = ({ id, title, image, description }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img 
          src={image} 
          className="card-img-top" 
          alt={title} 
          style={{ height: '200px', objectFit: 'cover' }} 
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <Link to={`/diet/${id}`} className="btn btn-primary mt-auto">
            Detayları Gör
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DietCard;
