/**
 * Seed test clients and catalogue for testing bulk email
 * Run: node src/scripts/seed-clients.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Client = require('../models/client.model');
const Catalogue = require('../models/catalogue.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loomistry-studio';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Seed test clients
    await Client.deleteMany({});
    const clients = await Client.insertMany([
      { name: 'Shahbaz Khan', email: 'shahbaz.appsquadz@gmail.com', company: 'Appsquadz', country: 'India', phone: '+91 9999999999' },
      { name: 'Mumtaj Ahmed', email: 'mumtaj@directresourcegroup.com', company: 'Direct Resource Group', country: 'UAE' },
      { name: 'David Miller', email: 'david.miller@example.com', company: 'HomeStyle Inc', country: 'USA' },
      { name: 'Sophie Laurent', email: 'sophie@maisonrugs.fr', company: 'Maison Rugs', country: 'France' },
      { name: 'Ravi Patel', email: 'ravi@rugimports.in', company: 'Rug Imports', country: 'India' },
    ]);
    console.log('Added ' + clients.length + ' test clients');

    // Seed a test catalogue
    await Catalogue.deleteMany({});
    const cat = await Catalogue.create({
      title: 'A Cuddle of Comfort',
      slug: 'a-cuddle-of-comfort',
      description: 'Our latest handcrafted rug collection for modern homes.',
      coverImage: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600',
      pages: [
        'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
      ],
    });
    console.log('Created catalogue: ' + cat.title + ' (' + cat.pages.length + ' pages)');

    console.log('\nHow to test:');
    console.log('  1. Go to http://localhost:3000/admin/clients');
    console.log('  2. You will see 5 test clients in the table');
    console.log('  3. Check the Select All checkbox (or pick specific clients)');
    console.log('  4. Click "Send Email (N)" button');
    console.log('  5. In the modal: select "A Cuddle of Comfort" catalogue');
    console.log('  6. Add a subject like: "New Rug Collection 2024"');
    console.log('  7. Click Send');
    console.log('');
    console.log('  Flipbook: http://localhost:3000/catalogue/a-cuddle-of-comfort');
    console.log('');
    console.log('  NOTE: For emails to deliver, verify loomistrystudio@gmail.com');
    console.log('  in SendGrid: https://app.sendgrid.com/settings/sender_auth/senders');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
