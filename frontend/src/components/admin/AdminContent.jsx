import React, { useState, useEffect, useRef } from 'react';

const AdminContent = () => {
  const [content, setContent] = useState({
    founderName: '',
    founderMessage: '',
    founderImageUrl: '',
    philosophyTitle: '',
    philosophyText: '',
    philosophyImageUrl: '',
    parallaxQuote: '',
    parallaxAuthor: '',
    parallaxImageUrl: '',
    contactSubtitle: '',
    phoneNumber: '',
    emailAddress: '',
    callLink: '',
    whatsappLink: '',
    instagramLink: '',
    services: []
  });
  
  // File objects
  const [files, setFiles] = useState({
    founderImageFile: null,
    philosophyImageFile: null,
    parallaxImageFile: null
  });

  const [status, setStatus] = useState('');

  // Refs for resetting file inputs
  const founderInputRef = useRef(null);
  const philosophyInputRef = useRef(null);
  const parallaxInputRef = useRef(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/content');
      const data = await response.json();
      if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles.length > 0) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...content.services];
    newServices[index][field] = value;
    setContent(prev => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setContent(prev => ({
      ...prev,
      services: [...prev.services, { title: '', description: '' }]
    }));
  };

  const removeService = (index) => {
    const newServices = content.services.filter((_, idx) => idx !== index);
    setContent(prev => ({ ...prev, services: newServices }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    
    const payload = new FormData();
    
    // Append text fields
    Object.keys(content).forEach(key => {
      if (key === 'services') {
        payload.append('services', JSON.stringify(content.services));
      } else {
        payload.append(key, content[key] || '');
      }
    });

    // Append file fields
    if (files.founderImageFile) payload.append('founderImageFile', files.founderImageFile);
    if (files.philosophyImageFile) payload.append('philosophyImageFile', files.philosophyImageFile);
    if (files.parallaxImageFile) payload.append('parallaxImageFile', files.parallaxImageFile);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/content', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: payload
      });
      if (response.ok) {
        setStatus('Saved successfully!');
        // Clear files state and inputs
        setFiles({ founderImageFile: null, philosophyImageFile: null, parallaxImageFile: null });
        if (founderInputRef.current) founderInputRef.current.value = '';
        if (philosophyInputRef.current) philosophyInputRef.current.value = '';
        if (parallaxInputRef.current) parallaxInputRef.current.value = '';
        
        fetchContent(); // refresh data
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('Failed to save.');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      setStatus('Error occurred.');
    }
  };

  return (
    <div>
      <h2 className="admin-header">Website Content</h2>
      <div className="admin-card">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          
          <h3 style={{color: 'var(--color-accent)', marginBottom: '1rem'}}>Founder Section</h3>
          <div className="admin-form-group">
            <label>Founder Name</label>
            <input type="text" name="founderName" value={content.founderName || ''} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Founder Message</label>
            <textarea name="founderMessage" rows="4" value={content.founderMessage || ''} onChange={handleChange}></textarea>
          </div>
          <div className="admin-form-group">
            <label>Founder Image (Auto-cropped to 3:4 portrait)</label>
            <input type="file" name="founderImageFile" accept="image/*" onChange={handleFileChange} ref={founderInputRef} style={{padding: '0.5rem 0'}} />
            <div style={{margin: '0.5rem 0', color: 'var(--color-text-muted)', fontSize: '0.8rem'}}>OR Paste URL</div>
            <input type="text" name="founderImageUrl" value={content.founderImageUrl || ''} onChange={handleChange} disabled={!!files.founderImageFile} />
          </div>

          <hr style={{borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0'}} />
          
          <h3 style={{color: 'var(--color-accent)', marginBottom: '1rem'}}>Philosophy Section</h3>
          <div className="admin-form-group">
            <label>Philosophy Title</label>
            <input type="text" name="philosophyTitle" value={content.philosophyTitle || ''} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Philosophy Text</label>
            <textarea name="philosophyText" rows="4" value={content.philosophyText || ''} onChange={handleChange}></textarea>
          </div>
          <div className="admin-form-group">
            <label>Philosophy Image (Auto-cropped to 4:3 landscape)</label>
            <input type="file" name="philosophyImageFile" accept="image/*" onChange={handleFileChange} ref={philosophyInputRef} style={{padding: '0.5rem 0'}} />
            <div style={{margin: '0.5rem 0', color: 'var(--color-text-muted)', fontSize: '0.8rem'}}>OR Paste URL</div>
            <input type="text" name="philosophyImageUrl" value={content.philosophyImageUrl || ''} onChange={handleChange} disabled={!!files.philosophyImageFile} />
          </div>

          <hr style={{borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0'}} />
          
          <h3 style={{color: 'var(--color-accent)', marginBottom: '1rem'}}>Contact Section</h3>
          <div className="admin-form-group">
            <label>Contact Subtitle</label>
            <input type="text" name="contactSubtitle" value={content.contactSubtitle || ''} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Phone Number Info (Use Enter for new line)</label>
            <textarea name="phoneNumber" rows="2" value={content.phoneNumber || ''} onChange={handleChange}></textarea>
          </div>
          <div className="admin-form-group">
            <label>Email Addresses (Use Enter for new line)</label>
            <textarea name="emailAddress" rows="2" value={content.emailAddress || ''} onChange={handleChange}></textarea>
          </div>
          <div className="admin-form-group">
            <label>Direct Call Number (e.g., +18001234567)</label>
            <input type="text" name="callLink" value={content.callLink || ''} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>WhatsApp Link (e.g., https://wa.me/18001234567)</label>
            <input type="text" name="whatsappLink" value={content.whatsappLink || ''} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Instagram Link (e.g., https://instagram.com/rasadesign)</label>
            <input type="text" name="instagramLink" value={content.instagramLink || ''} onChange={handleChange} />
          </div>

          <hr style={{borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0'}} />

          <h3 style={{color: 'var(--color-accent)', marginBottom: '1rem'}}>Services Section</h3>
          {content.services && content.services.map((service, index) => (
            <div key={index} style={{marginBottom: '2rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative'}}>
              <button 
                type="button" 
                onClick={() => removeService(index)}
                style={{position: 'absolute', top: '10px', right: '10px', background: 'transparent', color: 'red', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}
              >&times;</button>
              
              <div className="admin-form-group">
                <label>Service Title {index + 1}</label>
                <input type="text" value={service.title} onChange={(e) => handleServiceChange(index, 'title', e.target.value)} required />
              </div>
              <div className="admin-form-group">
                <label>Service Description {index + 1}</label>
                <textarea rows="3" value={service.description} onChange={(e) => handleServiceChange(index, 'description', e.target.value)} required></textarea>
              </div>
            </div>
          ))}
          <button type="button" className="admin-btn" style={{marginBottom: '2rem'}} onClick={addService}>+ Add Service</button>

          <hr style={{borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0'}} />

          <button type="submit" className="admin-btn" style={{background: 'var(--color-accent)', color: 'var(--color-background)'}}>Save All Changes</button>
          {status && <span style={{marginLeft: '1rem', color: 'var(--color-accent)'}}>{status}</span>}
        </form>
      </div>
    </div>
  );
};

export default AdminContent;
