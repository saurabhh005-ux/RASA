const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: String,
  description: String
});

const contentSchema = new mongoose.Schema({
  founderName: { type: String, default: 'A. Sterling' },
  founderMessage: { type: String, default: 'With over two decades of defining ultra-luxury living spaces globally, our founder believes that true luxury is deeply personal. It\'s an alchemy of rare materials, masterful craftsmanship, and an intuitive understanding of how space influences human emotion.' },
  founderImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800' },
  
  philosophyTitle: { type: String, default: 'The Art of Spatial Elegance' },
  philosophyText: { type: String, default: 'At RASA, we believe that true luxury whispers rather than shouts. Our designs are a study in restraint, balance, and the uncompromising selection of the world\'s finest materials. We curate environments that resonate with deep personal meaning while maintaining an immaculate architectural integrity.' },
  philosophyImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1000' },
  
  parallaxQuote: { type: String, default: '"Elegance is not about being noticed, it\'s about being remembered."' },
  parallaxAuthor: { type: String, default: 'Giorgio Armani' },
  parallaxImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000' },
  
  contactSubtitle: { type: String, default: 'Let us help you bring your vision to life.' },
  phoneNumber: { type: String, default: '+1 (800) 123-4567\nMon-Fri, 9am - 6pm EST' },
  emailAddress: { type: String, default: 'inquiries@rasadesign.com\npress@rasadesign.com' },
  
  callLink: { type: String, default: '+18001234567' },
  whatsappLink: { type: String, default: 'https://wa.me/18001234567' },
  instagramLink: { type: String, default: 'https://instagram.com/rasadesign' },

  services: {
    type: [serviceSchema],
    default: [
      {
        title: 'Luxury Interior Design',
        description: 'Comprehensive spatial planning and architectural detailing, crafting environments that resonate with deep personal meaning and uncompromising luxury.'
      },
      {
        title: 'Lavish Painting',
        description: 'Bespoke color curation and artisanal application techniques that transform walls into expansive canvases of mood and elegance.'
      },
      {
        title: 'Wall Textures',
        description: 'Tactile, custom-crafted surface designs—from authentic Venetian plaster to bespoke accents—that introduce profound depth and dimension.'
      },
      {
        title: 'Wood Polishing',
        description: 'Masterful restoration and finishing of fine woods, bringing out deep, rich grains to add enduring warmth and heritage to your spaces.'
      },
      {
        title: 'Wood Finishes',
        description: 'Exquisite, handcrafted wood treatments and lacquers that elevate standard millwork into striking, statement architectural elements.'
      },
      {
        title: 'Waterproof Ceiling',
        description: 'Advanced, seamless ceiling treatments that provide absolute structural protection without compromising on pristine architectural aesthetics.'
      }
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
