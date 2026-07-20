import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Gallery.css';

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/projects`);
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="gallery-loading">Curating gallery...</div>;
  }

  if (projects.length === 0) {
    return <div className="gallery-loading">No projects found.</div>;
  }

  return (
    <div className="gallery-masonry-page fade-in">
      <div className="gallery-header">
        <p className="gallery-subtitle">PORTFOLIO</p>
        <h1 className="gallery-title">Curated Spaces</h1>
      </div>

      <div className="masonry-container">
        {projects.map((project) => (
          <div 
            key={project._id} 
            className="masonry-card"
            onClick={() => navigate(`/projects/${project._id}`)}
          >
            <div className="masonry-image-wrapper">
              <img src={project.bannerImage} alt={project.title} loading="lazy" />
              <div className="masonry-overlay">
                <span className="masonry-view-text">Explore</span>
              </div>
            </div>
            <div className="masonry-info">
              <h3>{project.title}</h3>
              <p>{project.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
