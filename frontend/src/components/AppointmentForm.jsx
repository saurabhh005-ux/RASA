import React, { useState } from 'react';
import './AppointmentForm.css';

const AppointmentForm = ({ standalone = true }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    projectType: 'Interior Designing'
  });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Your appointment request has been received. Our luxury concierges will contact you shortly.');
        setFormData({
          name: '',
          mobile: '',
          email: '',
          projectType: 'Interior Designing'
        });
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setMessage('Failed to connect to the server.');
    }
  };

  const formContent = (
    <div className="appointment-form-wrapper fade-in">
      {status === 'success' ? (
        <div className="success-toast">
          <h3>Thank You</h3>
          <p>{message}</p>
          <button className="btn-primary" onClick={() => setStatus('idle')}>Book Another</button>
        </div>
      ) : (
        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              name="name" 
              placeholder="Full Name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="tel" 
              name="mobile" 
              placeholder="Mobile Number" 
              value={formData.mobile} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <select 
              name="projectType" 
              value={formData.projectType} 
              onChange={handleChange}
              required
            >
              <option value="Interior Designing">Interior Designing</option>
              <option value="Painting">Painting</option>
              <option value="Renovation">Renovation</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {status === 'error' && <div className="error-message">{message}</div>}
          
          <button 
            type="submit" 
            className="btn-primary form-submit" 
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Requesting...' : 'Request Consultation'}
          </button>
        </form>
      )}
    </div>
  );

  if (!standalone) {
    return formContent;
  }

  return (
    <section className="appointment-section" id="appointment">
      <div className="appointment-container">
        <div className="appointment-content fade-in">
          <h2>Book an Appointment</h2>
          <p>Begin your journey towards an extraordinary living space. Schedule a private consultation with our principal designers.</p>
        </div>
        {formContent}
      </div>
    </section>
  );
};

export default AppointmentForm;
