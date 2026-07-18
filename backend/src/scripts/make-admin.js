/**
 * Promote a user to admin role
 * 
 * Usage:
 *   node src/scripts/make-admin.js <email>
 * 
 * Example:
 *   node src/scripts/make-admin.js yourname@gmail.com
 * 
 * If no email provided, it promotes the first user in the database.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loomistry-studio';

async function makeAdmin() {
  const email = process.argv[2];

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let user;

    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        console.error(`❌ No user found with email: ${email}`);
        console.log('\nExisting users:');
        const users = await User.find({}, 'name email role authProvider');
        users.forEach((u) => console.log(`   - ${u.email} (${u.role}) via ${u.authProvider}`));
        process.exit(1);
      }
    } else {
      user = await User.findOne();
      if (!user) {
        console.log('❌ No users in database. Sign in first with Google/Facebook/Twitter, then run this script.');
        process.exit(1);
      }
    }

    user.role = 'admin';
    await user.save();

    console.log(`\n✅ User promoted to admin:`);
    console.log(`   Name:     ${user.name}`);
    console.log(`   Email:    ${user.email}`);
    console.log(`   Provider: ${user.authProvider}`);
    console.log(`   Role:     ${user.role}`);
    console.log(`\nYou can now access the CMS at /admin`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeAdmin();
