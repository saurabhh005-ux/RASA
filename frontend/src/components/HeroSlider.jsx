import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroSlider.css';

const HeroSlider = () => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/projects');
        const data = await response.json();
        setProjects(data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [projects.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  if (loading) {
    return <div className="hero-loading">Loading luxury...</div>;
  }

  if (projects.length === 0) {
    return <div className="hero-loading">No projects found.</div>;
  }

  const currentProject = projects[currentIndex];

  return (
    <div className="hero-slider">
      {projects.map((project, index) => (
        <div 
          key={project._id} 
          className={`hero-slide ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${project.bannerImage})` }}
          onClick={() => navigate(`/projects/${project._id}`)}
        >
          <div className="hero-overlay"></div>
        </div>
      ))}
      
      <div className="hero-content">
        <p className="hero-subtitle">FEATURED PROJECT</p>
        <h1 className="hero-title">{currentProject.title}</h1>
        <p className="hero-location">{currentProject.address}</p>
        <button 
          className="btn-primary" 
          onClick={() => navigate(`/projects/${currentProject._id}`)}
        >
          View Project
        </button>
      </div>

      <div className="hero-controls">
        <button className="control-btn" onClick={prevSlide}><ChevronLeft size={32} /></button>
        <div className="hero-indicators">
          {projects.map((_, index) => (
            <span 
              key={index} 
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
        <button className="control-btn" onClick={nextSlide}><ChevronRight size={32} /></button>
      </div>
    </div>
  );
};

export default HeroSlider;
