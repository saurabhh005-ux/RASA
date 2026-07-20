const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const projectRoutes = require('./routes/projectRoutes');
const contentRoutes = require('./routes/contentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const Project = require('./models/Project');
const Content = require('./models/Content');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase JSON limit for Base64 payloads

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/content', contentRoutes);

// Use MongoDB connection
async function startServer() {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    if (mongoUri) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to Persistent MongoDB');
    } else {
      console.error('ERROR: MONGODB_URI not found in environment variables. Database connection is required.');
      process.exit(1);
    }
    
    // Seed Database
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

async function seedDatabase() {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      console.log('Seeding initial luxury projects...');
      const initialProjects = [
        {
          title: "The Obsidian Penthouse",
          bannerImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000",
          address: "Manhattan, NY",
          details: "A sophisticated dark-themed penthouse overlooking the city skyline. Features matte black finishes, brushed brass accents, and floor-to-ceiling windows.",
          relatedImages: [
            { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000", caption: "Bespoke matte black kitchen with ambient under-lighting." },
            { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000", caption: "Minimalist living area framed by floor-to-ceiling windows." },
            { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000", caption: "Custom brushed brass fixtures in the primary suite." }
          ]
        },
        {
          title: "Villa Rasa",
          bannerImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000",
          address: "Beverly Hills, CA",
          details: "An exquisite estate blending modern minimalism with classic luxury. Italian marble floors, custom gold-leaf fixtures, and expansive indoor-outdoor living spaces.",
          relatedImages: [
            { url: "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&q=80&w=1000", caption: "Expansive indoor-outdoor transition with Italian marble." },
            { url: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1000", caption: "Custom gold-leaf architectural details." },
            { url: "https://images.unsplash.com/photo-1618219740975-d40978bb7378?auto=format&fit=crop&q=80&w=1000", caption: "Serene courtyard integrating natural elements." }
          ]
        },
        {
          title: "Lumina Residences",
          bannerImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000",
          address: "London, UK",
          details: "Contemporary luxury redefined. Featuring bespoke walnut cabinetry, smart home integration, and curated art spaces with museum-quality lighting.",
          relatedImages: [
            { url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1000", caption: "Bespoke walnut cabinetry in the central living space." },
            { url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1000", caption: "Museum-quality lighting highlighting curated art." },
            { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1000", caption: "Smart home integration maintaining sleek aesthetics." }
          ]
        },
        {
          title: "Elysium Manor",
          bannerImage: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&q=80&w=2000",
          address: "Monaco",
          details: "A timeless masterpiece on the coast. Showcasing pristine white marbles, dramatic velvet drapery, and a seamlessly integrated indoor pool pavilion.",
          relatedImages: [
            { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000", caption: "Pristine white marbles contrasting with Mediterranean views." },
            { url: "https://images.unsplash.com/photo-1502005097973-ff5ce860e6a1?auto=format&fit=crop&q=80&w=1000", caption: "Dramatic velvet drapery framing the master suite." },
            { url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1000", caption: "Seamlessly integrated indoor pool pavilion." }
          ]
        },
        {
          title: "The Zenith Estate",
          bannerImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2000",
          address: "Dubai, UAE",
          details: "Unparalleled modern opulence. Featuring soaring 30-foot ceilings, an expansive crystal chandelier center piece, and rich mahogany paneled walls.",
          relatedImages: [
            { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000", caption: "Soaring 30-foot ceilings in the grand hall." },
            { url: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1000", caption: "Expansive crystal chandelier centerpiece." },
            { url: "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?auto=format&fit=crop&q=80&w=1000", caption: "Rich mahogany paneled walls adding deep warmth." }
          ]
        }
      ];
      await Project.insertMany(initialProjects);
      console.log('Project database seeded successfully.');
    }

    const contentCount = await Content.countDocuments();
    if (contentCount === 0) {
      console.log('Seeding initial website content...');
      const initialContent = new Content();
      await initialContent.save();
      console.log('Content database seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

startServer();
