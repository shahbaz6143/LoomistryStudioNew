const { sendEmail } = require('./email.service');

const SITE_URL = process.env.CLIENT_URL || 'http://localhost:3000';

/**
 * Send catalogue marketing email to international clients
 * Similar to Hafizia's premium email format
 */
const sendCatalogueEmail = async ({ to, clientName, subject, campaignName = 'Artisan Comfort', catalogueSlug = 'latest', coverImage }) => {
  const catalogueUrl = `${SITE_URL}/catalogue/${catalogueSlug}`;
  const viewInBrowserUrl = catalogueUrl;
  const heroImage = coverImage || 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&h=400&fit=crop';
  const greeting = clientName ? `Dear ${clientName},` : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f3f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3f0;">
    <tr>
      <td align="center" style="padding:20px 0;">
        
        <!-- View in Browser -->
        <table width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:16px 0;">
              <a href="${viewInBrowserUrl}" style="color:#888;font-size:12px;font-family:Arial,sans-serif;text-decoration:underline;">View this email in your browser</a>
            </td>
          </tr>
        </table>

        <!-- Main Content -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding:40px 0 20px;">
              <h1 style="margin:0;font-size:28px;font-weight:400;color:#1a1a1a;letter-spacing:2px;font-family:Georgia,serif;">LoomistryStudio</h1>
            </td>
          </tr>

          <!-- Hero Image -->
          <tr>
            <td style="padding:0;">
              <img src="${heroImage}" alt="Handcrafted Rugs" width="600" style="display:block;width:100%;height:auto;">
            </td>
          </tr>

          <!-- Campaign Title -->
          <tr>
            <td align="center" style="padding:48px 40px 16px;">
              <h2 style="margin:0;font-size:36px;font-weight:400;color:#1a1a1a;line-height:1.2;font-family:Georgia,serif;font-style:italic;">
                ${campaignName}
              </h2>
            </td>
          </tr>

          <!-- Description -->
          <tr>
            <td align="center" style="padding:0 60px 32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;font-family:Arial,sans-serif;font-weight:500;">${greeting}</p>
              <p style="margin:0;font-size:15px;color:#555;line-height:1.8;font-family:Arial,sans-serif;">
                Home is more than a place. It's a feeling. A feeling of comfort, calm, and belonging. 
                Discover our latest collection of handcrafted rugs — each one woven with care by master artisans, 
                designed to bring warmth and artistry to every home.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding:8px 0 48px;">
              <a href="${catalogueUrl}" style="display:inline-block;background:#1a1a1a;color:#ffffff;font-size:13px;font-weight:bold;letter-spacing:2px;text-decoration:none;padding:16px 40px;font-family:Arial,sans-serif;text-transform:uppercase;">
                CATALOGUE &#8599;
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e8e4df;margin:0;">
            </td>
          </tr>

          <!-- Collection 1: Earthbound Warmth -->
          <tr>
            <td style="padding:40px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="420" style="vertical-align:top;">
                    <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=420&h=500&fit=crop" alt="Earthbound Warmth" width="420" style="display:block;width:70%;height:auto;">
                  </td>
                  <td width="180" style="vertical-align:middle;padding:20px;background:#f5f3f0;">
                    <p style="margin:0;font-size:14px;color:#1a1a1a;font-weight:bold;writing-mode:vertical-rl;transform:rotate(180deg);font-family:Arial,sans-serif;letter-spacing:2px;">Earthbound Warmth</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Collection 2: Bloom & Balance -->
          <tr>
            <td style="padding:24px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="180" style="vertical-align:middle;padding:20px;background:#f5f3f0;">
                    <p style="margin:0;font-size:14px;color:#1a1a1a;font-weight:bold;writing-mode:vertical-rl;font-family:Arial,sans-serif;letter-spacing:2px;">Bloom &amp; Balance</p>
                  </td>
                  <td width="420" style="vertical-align:top;">
                    <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=420&h=500&fit=crop" alt="Bloom and Balance" width="420" style="display:block;width:100%;height:auto;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Collection 3: Coastal Charm -->
          <tr>
            <td style="padding:24px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="420" style="vertical-align:top;">
                    <img src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=420&h=500&fit=crop" alt="Coastal Charm" width="420" style="display:block;width:70%;height:auto;">
                  </td>
                  <td width="180" style="vertical-align:middle;padding:20px;background:#f5f3f0;">
                    <p style="margin:0;font-size:14px;color:#1a1a1a;font-weight:bold;writing-mode:vertical-rl;transform:rotate(180deg);font-family:Arial,sans-serif;letter-spacing:2px;">Coastal Charm</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Social Links -->
          <tr>
            <td align="center" style="padding:48px 0 24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 12px;">
                    <a href="https://instagram.com/loomistrystudio" style="color:#555;font-size:12px;font-family:Arial,sans-serif;text-decoration:none;">&#9679; Instagram</a>
                  </td>
                  <td style="padding:0 12px;">
                    <a href="https://linkedin.com" style="color:#555;font-size:12px;font-family:Arial,sans-serif;text-decoration:none;">&#9679; LinkedIn</a>
                  </td>
                  <td style="padding:0 12px;">
                    <a href="https://facebook.com" style="color:#555;font-size:12px;font-family:Arial,sans-serif;text-decoration:none;">&#9679; Facebook</a>
                  </td>
                  <td style="padding:0 12px;">
                    <a href="${SITE_URL}" style="color:#555;font-size:12px;font-family:Arial,sans-serif;text-decoration:none;">&#9679; Website</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Unsubscribe -->
          <tr>
            <td align="center" style="padding:0 0 40px;">
              <p style="margin:0;font-size:11px;color:#aaa;font-family:Arial,sans-serif;">
                Manage your email <a href="${SITE_URL}" style="color:#888;text-decoration:underline;">preferences</a> or <a href="${SITE_URL}" style="color:#888;text-decoration:underline;">unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    to,
    subject: subject || `${campaignName} — LoomistryStudio`,
    html,
  });
};

module.exports = { sendCatalogueEmail };
