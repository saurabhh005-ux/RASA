const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const sharp = require('sharp');
// Removed local uploads logic

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFields = upload.fields([
  { name: 'bannerImageFile', maxCount: 1 },
  { name: 'relatedImageFiles', maxCount: 10 }
]);

// Helper function to process banner image (16:9 cinematic) - Base64 encoded
const processBannerImage = async (file) => {
  if (!file) return null;
  
  const buffer = await sharp(file.buffer)
    .resize(2000, 1125, {
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy
    })
    .toFormat('jpeg')
    .jpeg({ quality: 80 }) // Increased compression slightly to save DB space
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
};

// Helper function to process related images (max width 1200px) - Base64 encoded
const processRelatedImage = async (file) => {
  if (!file) return null;
  
  const buffer = await sharp(file.buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
};

// GET /api/projects - Fetch all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error fetching projects' });
  }
});

// GET /api/projects/:id - Fetch single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Server error fetching project' });
  }
});

// POST /api/projects - Create a new project
router.post('/', authMiddleware, uploadFields, async (req, res) => {
  try {
    let finalBannerUrl = req.body.bannerImage; 
    let relatedImagesMeta = [];
    try {
      if (req.body.relatedImagesMeta) {
        relatedImagesMeta = JSON.parse(req.body.relatedImagesMeta);
      }
    } catch (e) { console.error('JSON parse error', e); }

    if (req.files && req.files['bannerImageFile']) {
      finalBannerUrl = await processBannerImage(req.files['bannerImageFile'][0]);
    }

    let newUploadUrls = [];
    if (req.files && req.files['relatedImageFiles']) {
      newUploadUrls = await Promise.all(
        req.files['relatedImageFiles'].map(file => processRelatedImage(file))
      );
    }

    let finalRelatedImages = [];
    relatedImagesMeta.forEach(meta => {
      if (meta.type === 'existing' && meta.url) {
        finalRelatedImages.push({ url: meta.url, caption: meta.caption || '' });
      } else if (meta.type === 'new' && meta.fileIndex !== undefined) {
        const url = newUploadUrls[meta.fileIndex];
        if (url) {
          finalRelatedImages.push({ url, caption: meta.caption || '' });
        }
      }
    });

    const projectData = {
      ...req.body,
      bannerImage: finalBannerUrl,
      relatedImages: finalRelatedImages
    };

    const newProject = new Project(projectData);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Server error creating project' });
  }
});

// PUT /api/projects/:id - Update an existing project
router.put('/:id', authMiddleware, uploadFields, async (req, res) => {
  try {
    let finalBannerUrl = req.body.bannerImage;
    let relatedImagesMeta = [];
    try {
      if (req.body.relatedImagesMeta) {
        relatedImagesMeta = JSON.parse(req.body.relatedImagesMeta);
      }
    } catch (e) { console.error('JSON parse error', e); }

    if (req.files && req.files['bannerImageFile']) {
      finalBannerUrl = await processBannerImage(req.files['bannerImageFile'][0]);
    }

    let newUploadUrls = [];
    if (req.files && req.files['relatedImageFiles']) {
      newUploadUrls = await Promise.all(
        req.files['relatedImageFiles'].map(file => processRelatedImage(file))
      );
    }

    let finalRelatedImages = [];
    relatedImagesMeta.forEach(meta => {
      if (meta.type === 'existing' && meta.url) {
        finalRelatedImages.push({ url: meta.url, caption: meta.caption || '' });
      } else if (meta.type === 'new' && meta.fileIndex !== undefined) {
        const url = newUploadUrls[meta.fileIndex];
        if (url) {
          finalRelatedImages.push({ url, caption: meta.caption || '' });
        }
      }
    });

    const projectData = { 
      ...req.body,
      relatedImages: finalRelatedImages 
    };
    if (finalBannerUrl) {
      projectData.bannerImage = finalBannerUrl;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, projectData, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error updating project' });
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Server error deleting project' });
  }
});

module.exports = router;
