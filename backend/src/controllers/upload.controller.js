/**
 * Handle image uploads — returns Cloudinary URLs
 * POST /api/admin/upload/images
 */
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No files uploaded' });
    }

    const urls = req.files.map((file) => file.path);

    res.status(200).json({
      status: 'success',
      message: `${urls.length} image(s) uploaded successfully`,
      data: urls,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Handle video upload — returns Cloudinary URL
 * POST /api/admin/upload/video
 */
const uploadVideoFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No video uploaded' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Video uploaded successfully',
      data: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { uploadImages, uploadVideoFile };
