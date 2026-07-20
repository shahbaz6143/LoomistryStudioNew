/**
 * Test catalogue marketing email
 * Run: SENDGRID_API_KEY="" node src/scripts/test-catalogue-email.js
 */
require('dotenv').config();
delete process.env.SENDGRID_API_KEY; // Force Ethereal for testing

const { sendCatalogueEmail } = require('../services/catalogue-email.service');
const { getTransporter } = require('../services/email.service');

async function test() {
  try {
    await getTransporter();

    console.log('📧 Sending catalogue marketing email...\n');

    const result = await sendCatalogueEmail({
      to: 'client@example.com',
      campaignName: 'A Cuddle of Comfort',
      catalogueSlug: 'latest',
    });

    if (result.success) {
      console.log('✅ Catalogue email sent!');
      console.log(`   🔗 Preview: ${result.previewUrl}`);
      console.log('   (Open this URL in browser to see the email)\n');
      console.log('📖 Catalogue flipbook page:');
      console.log('   http://localhost:3000/catalogue/latest');
      console.log('   (This is what opens when client clicks "CATALOGUE" button in email)');
    } else {
      console.log('❌ Failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}

test();
