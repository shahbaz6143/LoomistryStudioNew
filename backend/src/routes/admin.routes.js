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
const {
  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
  updateTracking,
  getOrderStats,
} = require('../controllers/admin.order.controller');
const {
  getAllReviews,
  moderateReview,
  deleteReview,
} = require('../controllers/review.controller');

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

// ─── Order Management ────────────────────────────────────────────────────────

router.get('/orders/stats', requireRole('admin', 'editor'), getOrderStats);
router.get('/orders', requireRole('admin', 'editor'), getAllOrders);
router.get('/orders/:id', requireRole('admin', 'editor'), getOrderDetail);
router.put('/orders/:id/status', requireRole('admin'), updateOrderStatus);
router.put('/orders/:id/tracking', requireRole('admin', 'editor'), updateTracking);

// ─── Abandoned Cart Trigger ──────────────────────────────────────────────────

router.post('/abandoned-carts/check', requireRole('admin'), async (req, res) => {
  const { checkAbandonedCarts } = require('../services/abandoned-cart.service');
  const result = await checkAbandonedCarts();
  res.status(200).json({ status: 'success', data: result });
});

// ─── Reviews (Moderation) ────────────────────────────────────────────────────

router.get('/reviews', requireRole('admin', 'editor'), getAllReviews);
router.put('/reviews/:id', requireRole('admin'), moderateReview);
router.delete('/reviews/:id', requireRole('admin'), deleteReview);

// ─── Catalogues ──────────────────────────────────────────────────────────────

const {
  getAllCatalogues,
  createCatalogue,
  updateCatalogue,
  deleteCatalogue,
  sendCatalogueToClients,
} = require('../controllers/catalogue.controller');

router.get('/catalogues', requireRole('admin', 'editor'), getAllCatalogues);
router.post('/catalogues', requireRole('admin', 'editor'), createCatalogue);
router.put('/catalogues/:id', requireRole('admin', 'editor'), updateCatalogue);
router.delete('/catalogues/:id', requireRole('admin'), deleteCatalogue);
router.post('/catalogues/:id/send', requireRole('admin', 'editor'), sendCatalogueToClients);

// ─── Client Contacts ─────────────────────────────────────────────────────────

const {
  getAllClients,
  addClient,
  addBulkClients,
  updateClient,
  deleteClient,
  sendBulkEmail,
} = require('../controllers/client.controller');

router.get('/clients', requireRole('admin', 'editor'), getAllClients);
router.post('/clients', requireRole('admin', 'editor'), addClient);
router.post('/clients/bulk', requireRole('admin', 'editor'), addBulkClients);
router.put('/clients/:id', requireRole('admin', 'editor'), updateClient);
router.delete('/clients/:id', requireRole('admin'), deleteClient);
router.post('/clients/send-email', requireRole('admin', 'editor'), sendBulkEmail);

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
