const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const multer = require('multer');
const sharp = require('sharp');
// Removed local uploads logic

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFields = upload.fields([
  { name: 'founderImageFile', maxCount: 1 },
  { name: 'philosophyImageFile', maxCount: 1 },
  { name: 'parallaxImageFile', maxCount: 1 }
]);

// Helper to process images differently based on section - Base64 encoded
const processContentImage = async (file, type) => {
  if (!file) return null;
  
  let pipeline = sharp(file.buffer);

  if (type === 'founder') {
    // Portrait aspect ratio 3:4, max width 800
    pipeline = pipeline.resize(800, 1067, { fit: 'cover', position: 'entropy' });
  } else if (type === 'philosophy') {
    // Standard slightly wide landscape, max width 1200
    pipeline = pipeline.resize(1200, 900, { fit: 'cover', position: 'entropy' });
  } else if (type === 'parallax') {
    // Cinematic ultra-wide, max width 2500
    pipeline = pipeline.resize(2500, 1406, { fit: 'cover', position: 'entropy' });
  }

  const buffer = await pipeline
    .toFormat('jpeg')
    .jpeg({ quality: 80 }) // Increased compression slightly to save DB space
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
};

// GET /api/content - Fetch global content
router.get('/', async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = new Content();
      await content.save();
    }
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Server error fetching content' });
  }
});

const authMiddleware = require('../middleware/authMiddleware');

// PUT /api/content - Update global content
router.put('/', authMiddleware, uploadFields, async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = new Content();
    }

    // Process uploaded files if any
    if (req.files) {
      if (req.files['founderImageFile']) {
        content.founderImageUrl = await processContentImage(req.files['founderImageFile'][0], 'founder');
      }
      if (req.files['philosophyImageFile']) {
        content.philosophyImageUrl = await processContentImage(req.files['philosophyImageFile'][0], 'philosophy');
      }
      if (req.files['parallaxImageFile']) {
        content.parallaxImageUrl = await processContentImage(req.files['parallaxImageFile'][0], 'parallax');
      }
    }

    // Process text fields from req.body
    const fieldsToUpdate = [
      'founderName', 'founderMessage', 
      'philosophyTitle', 'philosophyText', 
      'parallaxQuote', 'parallaxAuthor',
      'founderImageUrl', 'philosophyImageUrl', 'parallaxImageUrl',
      'contactSubtitle', 'phoneNumber', 'emailAddress',
      'callLink', 'whatsappLink', 'instagramLink'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field];
      }
    });

    // Handle services array (sent as JSON string if via FormData)
    if (req.body.services) {
      try {
        const parsedServices = JSON.parse(req.body.services);
        content.services = parsedServices;
      } catch (e) {
        console.error("Error parsing services:", e);
      }
    }

    await content.save();
    res.json({ message: 'Content updated successfully', content });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Server error updating content' });
  }
});

module.exports = router;
