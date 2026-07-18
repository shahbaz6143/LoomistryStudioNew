/**
 * Detect user's region based on IP for pricing
 * GET /api/geo/detect
 */
const detectRegion = async (req, res) => {
  try {
    // Get IP from request (handle proxies)
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    ip = ip.split(',')[0].trim();

    // localhost / development — default to India
    if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') {
      return res.status(200).json({
        status: 'success',
        data: {
          country: 'IN',
          currency: 'INR',
          symbol: '₹',
          isIndia: true,
        },
      });
    }

    // Use free ip-api.com service for GeoIP lookup
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode`);
    const geo = await response.json();

    if (geo.status === 'success') {
      const isIndia = geo.countryCode === 'IN';
      return res.status(200).json({
        status: 'success',
        data: {
          country: geo.countryCode,
          countryName: geo.country,
          currency: isIndia ? 'INR' : 'USD',
          symbol: isIndia ? '₹' : '$',
          isIndia,
        },
      });
    }

    // Fallback to INR if detection fails
    res.status(200).json({
      status: 'success',
      data: {
        country: 'IN',
        currency: 'INR',
        symbol: '₹',
        isIndia: true,
      },
    });
  } catch (error) {
    // On error, default to INR
    res.status(200).json({
      status: 'success',
      data: {
        country: 'IN',
        currency: 'INR',
        symbol: '₹',
        isIndia: true,
      },
    });
  }
};

module.exports = { detectRegion };
