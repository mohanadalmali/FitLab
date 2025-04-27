import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ id, title, image, summary }) => {
  return (
    <div className="col-12 mb-4">  {/* Kartların üst üste yığılması için col-12 kullanıldı */}
      <div className="card h-100 shadow-sm">
        <img
          src={image}
          className="card-img-top"
          alt={title}
          style={{ height: '250px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{summary}</p>
          <Link to={`/blog/${id}`} className="btn btn-footer mt-auto">
            Devamını Oku
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
