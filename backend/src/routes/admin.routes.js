const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProduct,
} = require('../controllers/admin.product.controller');
const { uploadImages, uploadVideoFile } = require('../controllers/upload.controller');
const { uploadImage, uploadVideo } = require('../services/cloudinary.service');
const {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
} = require('../controllers/coupon.controller');

const router = express.Router();

// All admin routes require authentication
router.use(authenticate);

// ─── Product CRUD ────────────────────────────────────────────────────────────

// GET /api/admin/products — list all (admin + editor)
router.get('/products', requireRole('admin', 'editor'), getAllProducts);

// GET /api/admin/products/:id — get single (admin + editor)
router.get('/products/:id', requireRole('admin', 'editor'), getProductById);

// POST /api/admin/products — create (admin + editor)
router.post('/products', requireRole('admin', 'editor'), createProduct);

// PUT /api/admin/products/:id — update (admin + editor)
router.put('/products/:id', requireRole('admin', 'editor'), updateProduct);

// DELETE /api/admin/products/:id — delete (admin only)
router.delete('/products/:id', requireRole('admin'), deleteProduct);

// PATCH /api/admin/products/:id/toggle — toggle active (admin + editor)
router.patch('/products/:id/toggle', requireRole('admin', 'editor'), toggleProduct);

// ─── Coupon CRUD ─────────────────────────────────────────────────────────────

router.get('/coupons', requireRole('admin', 'editor'), getAllCoupons);
router.post('/coupons', requireRole('admin'), createCoupon);
router.put('/coupons/:id', requireRole('admin'), updateCoupon);
router.delete('/coupons/:id', requireRole('admin'), deleteCoupon);
router.patch('/coupons/:id/toggle', requireRole('admin'), toggleCoupon);

// ─── Media Upload ────────────────────────────────────────────────────────────

// POST /api/admin/upload/images — upload multiple images (admin + editor)
router.post(
  '/upload/images',
  requireRole('admin', 'editor'),
  uploadImage.array('images', 10),
  uploadImages
);

// POST /api/admin/upload/video — upload single video (admin + editor)
router.post(
  '/upload/video',
  requireRole('admin', 'editor'),
  uploadVideo.single('video'),
  uploadVideoFile
);

module.exports = router;
