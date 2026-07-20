import React, { useState, useEffect, useRef } from 'react';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const bannerInputRef = useRef(null);
  const relatedInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    bannerImage: '',
    bannerImageFile: null,
    address: '',
    details: '',
    relatedImages: [], // [{ url, caption }]
    relatedImageFiles: [] // [{ file, previewUrl, caption }]
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await fetch(`${import.meta.env.VITE_API_URL || ''}/api/projects/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    
    // Support legacy data where relatedImages might just be strings
    const mappedRelatedImages = (project.relatedImages || []).map(img => {
      if (typeof img === 'string') return { url: img, caption: '' };
      return img;
    });

    setFormData({
      title: project.title,
      bannerImage: project.bannerImage,
      bannerImageFile: null,
      address: project.address,
      details: project.details,
      relatedImages: mappedRelatedImages,
      relatedImageFiles: []
    });
    if (bannerInputRef.current) bannerInputRef.current.value = '';
    if (relatedInputRef.current) relatedInputRef.current.value = '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, bannerImageFile: file }));
  };

  const handleRelatedFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      caption: ''
    }));
    setFormData(prev => ({ 
      ...prev, 
      relatedImageFiles: [...prev.relatedImageFiles, ...newFiles] 
    }));
    if (relatedInputRef.current) relatedInputRef.current.value = '';
  };

  const updateExistingImageCaption = (idx, newCaption) => {
    setFormData(prev => {
      const newImages = [...prev.relatedImages];
      newImages[idx].caption = newCaption;
      return { ...prev, relatedImages: newImages };
    });
  };

  const updateNewImageCaption = (idx, newCaption) => {
    setFormData(prev => {
      const newFiles = [...prev.relatedImageFiles];
      newFiles[idx].caption = newCaption;
      return { ...prev, relatedImageFiles: newFiles };
    });
  };

  const removeExistingRelatedImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      relatedImages: prev.relatedImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const removeNewRelatedFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      relatedImageFiles: prev.relatedImageFiles.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const [errorStatus, setErrorStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorStatus('');
    
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('address', formData.address);
    payload.append('details', formData.details);
    
    // Construct relatedImagesMeta
    const metaArray = [];
    
    formData.relatedImages.forEach(img => {
      metaArray.push({ type: 'existing', url: img.url, caption: img.caption });
    });

    formData.relatedImageFiles.forEach((item, index) => {
      metaArray.push({ type: 'new', fileIndex: index, caption: item.caption });
      payload.append('relatedImageFiles', item.file);
    });

    payload.append('relatedImagesMeta', JSON.stringify(metaArray));

    // Append banner image file or text URL
    if (formData.bannerImageFile) {
      payload.append('bannerImageFile', formData.bannerImageFile);
    } else if (formData.bannerImage) {
      payload.append('bannerImage', formData.bannerImage);
    }

    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      let response;

      if (editingId) {
        response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/projects/${editingId}`, {
          method: 'PUT',
          headers,
          body: payload
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/projects', {
          method: 'POST',
          headers,
          body: payload
        });
      }
      
      if (response.ok) {
        handleCancel();
        fetchProjects();
      } else {
        const data = await response.json();
        setErrorStatus(data.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setErrorStatus('Server connection error');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setErrorStatus('');
    setFormData({ 
      title: '', bannerImage: '', bannerImageFile: null, 
      address: '', details: '', relatedImages: [], relatedImageFiles: [] 
    });
    if (bannerInputRef.current) bannerInputRef.current.value = '';
    if (relatedInputRef.current) relatedInputRef.current.value = '';
  };

  return (
    <div>
      <h2 className="admin-header">Manage Projects</h2>
      
      <div className="admin-card">
        <h3 style={{color: 'var(--color-accent)', marginBottom: '1.5rem'}}>
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h3>
        {errorStatus && <div style={{ color: 'var(--color-error)', marginBottom: '1rem', padding: '1rem', border: '1px solid var(--color-error)', borderRadius: '4px' }}>{errorStatus}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="admin-form-group">
            <label>Project Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          
          <div className="admin-form-group">
            <label>Upload Banner Image (Auto-cropped to 16:9)</label>
            <input type="file" accept="image/*" onChange={handleBannerFileChange} ref={bannerInputRef} style={{padding: '0.5rem 0'}} />
            <div style={{margin: '0.5rem 0', color: 'var(--color-text-muted)', fontSize: '0.8rem'}}>OR</div>
            <input type="text" name="bannerImage" placeholder="Paste Banner Image URL" value={formData.bannerImage} onChange={handleChange} disabled={!!formData.bannerImageFile} />
          </div>
          
          <div className="admin-form-group">
            <label>Location / Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          
          <div className="admin-form-group">
            <label>Project Details (Description)</label>
            <textarea name="details" rows="5" value={formData.details} onChange={handleChange} required></textarea>
          </div>

          <div className="admin-form-group">
            <label>Related Images (Gallery & Captions)</label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              
              {formData.relatedImages.map((img, idx) => (
                <div key={`existing-${idx}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--color-background)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  <img src={img.url} alt="related" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <input 
                      type="text" 
                      placeholder="Write a caption for this image..." 
                      value={img.caption} 
                      onChange={(e) => updateExistingImageCaption(idx, e.target.value)} 
                      style={{ width: '100%', marginBottom: 0 }}
                    />
                  </div>
                  <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeExistingRelatedImage(idx)}>
                    Remove
                  </button>
                </div>
              ))}

              {formData.relatedImageFiles.map((item, idx) => (
                <div key={`new-${idx}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--color-background)', padding: '1rem', borderRadius: '4px', border: '2px dashed var(--color-accent)' }}>
                  <img src={item.previewUrl} alt="new upload" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <input 
                      type="text" 
                      placeholder="Write a caption for this new image..." 
                      value={item.caption} 
                      onChange={(e) => updateNewImageCaption(idx, e.target.value)} 
                      style={{ width: '100%', marginBottom: 0 }}
                    />
                  </div>
                  <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeNewRelatedFile(idx)}>
                    Remove
                  </button>
                </div>
              ))}

            </div>

            <input type="file" accept="image/*" multiple onChange={handleRelatedFilesChange} ref={relatedInputRef} style={{padding: '0.5rem 0', display: 'block'}} />
          </div>
          
          <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
            <button type="submit" className="admin-btn">
              {editingId ? 'Update Project' : 'Create Project'}
            </button>
            {editingId && (
              <button type="button" className="admin-btn admin-btn-danger" onClick={handleCancel}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Banner</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project._id}>
                <td>{project.title}</td>
                <td>
                  <img src={project.bannerImage} alt="banner" style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '2px'}} />
                </td>
                <td>{project.address}</td>
                <td>
                  <button className="admin-btn" style={{padding: '0.4rem 0.8rem', marginRight: '0.5rem'}} onClick={() => handleEdit(project)}>Edit</button>
                  <button className="admin-btn admin-btn-danger" style={{padding: '0.4rem 0.8rem'}} onClick={() => handleDelete(project._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProjects;
