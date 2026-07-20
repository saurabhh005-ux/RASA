import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error('Project not found');
        }
        const data = await response.json();
        setProject(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div className="detail-loading">Loading project details...</div>;
  if (error) return <div className="detail-error">{error}</div>;
  if (!project) return null;

  return (
    <div className="project-detail-page">
      <div 
        className="detail-hero"
        style={{ backgroundImage: `url(${project.bannerImage})` }}
      >
        <div className="detail-overlay"></div>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} /> Back
        </button>
      </div>

      <div className="detail-content-wrapper">
        <div className="detail-header fade-in">
          <p className="detail-address">{project.address}</p>
          <h1 className="detail-title">{project.title}</h1>
        </div>

        <div className="detail-description fade-in">
          <p>{project.details}</p>
        </div>

        {project.relatedImages && project.relatedImages.length > 0 && (
          <div className="detail-gallery fade-in">
            <h3 className="gallery-title">Gallery</h3>
            <div className="detail-masonry-grid">
              {project.relatedImages.map((imgItem, index) => {
                const url = typeof imgItem === 'string' ? imgItem : imgItem.url;
                const caption = typeof imgItem === 'string' ? '' : imgItem.caption;
                
                return (
                  <div key={index} className="detail-masonry-item">
                    <img src={url} alt={`${project.title} detail ${index + 1}`} loading="lazy" />
                    {caption && (
                      <div className="image-caption-overlay">
                        <p>{caption}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
