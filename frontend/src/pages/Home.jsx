import React, { useEffect, useRef, useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import AppointmentForm from '../components/AppointmentForm';
import './Home.css';

const Home = () => {
  const revealRefs = useRef([]);
  revealRefs.current = [];
  const [content, setContent] = useState(null);

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    // Fetch dynamic content
    const fetchContent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/content`);
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error fetching content", error);
      }
    };
    fetchContent();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    // Wait a tick for refs to populate after render
    setTimeout(() => {
      revealRefs.current.forEach((ref) => {
        observer.observe(ref);
      });
    }, 100);

    return () => observer.disconnect();
  }, [content]);

  if (!content) {
    return (
      <div className="home-page" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)', color: 'var(--color-text)'}}>
        <div style={{width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--color-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem'}}></div>
        <p style={{fontSize: '1.2rem', fontWeight: '500'}}>Connecting to server...</p>
        <p style={{fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '300px', textAlign: 'center', marginTop: '0.5rem'}}>Please wait up to 50 seconds if the free database is waking up.</p>
        <style>
          {`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className="home-page">
      <HeroSlider />
      
      {/* Design Philosophy Section */}
      <section className="philosophy-section">
        <div className="philosophy-container">
          <div className="philosophy-text" ref={addToRefs}>
            <span className="section-number">01</span>
            <p className="section-subtitle">OUR PHILOSOPHY</p>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: content.philosophyTitle.replace('\n', '<br/>') }}></h2>
            <div className="luxury-divider-left"></div>
            <p className="section-description">{content.philosophyText}</p>
          </div>
          <div className="philosophy-image" ref={addToRefs}>
            <div className="image-wrapper">
              <img src={content.philosophyImageUrl} alt="Minimalist luxury interior" />
            </div>
            <div className="image-accent-block"></div>
          </div>
        </div>
      </section>



      {/* Services Overview */}
      <section className="services-section">
        <div className="services-header" ref={addToRefs}>
          <span className="section-number">02</span>
          <p className="section-subtitle">EXPERTISE</p>
          <h2 className="section-title">Bespoke Services</h2>
        </div>
        
        <div className="services-grid">
          {content.services && content.services.map((service, index) => (
            <div className="service-card" ref={addToRefs} key={index}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-line"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="founder-bg-text">VISIONARY</div>
        <div className="founder-container">
          <div className="founder-text-column" ref={addToRefs}>
            <span className="section-number">03</span>
            <p className="section-subtitle">THE VISIONARY</p>
            <h2 className="section-title">Meet Our<br/>Principal Designer</h2>
            <div className="luxury-divider-left"></div>
            <p className="section-description">{content.founderMessage}</p>
            <div className="signature">{content.founderName}</div>
          </div>
          <div className="founder-image-column" ref={addToRefs}>
            <div className="founder-portrait-wrapper">
              <img src={content.founderImageUrl} alt={content.founderName} />
              <div className="founder-gold-frame"></div>
            </div>
          </div>
        </div>
      </section>

      <AppointmentForm />
    </div>
  );
};

export default Home;
