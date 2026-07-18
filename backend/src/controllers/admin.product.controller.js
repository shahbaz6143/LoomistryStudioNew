const Product = require('../models/product.model');
const { generateSlug } = require('../utils/helpers');
const { deleteAsset, getPublicIdFromUrl } = require('../services/cloudinary.service');

/**
 * Get all products for admin (with pagination, search)
 * GET /api/admin/products
 */
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, isActive } = req.query;

    const filter = {};
    if (search) {
      filter.$text = { $search: search };
    }
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get single product for editing
 * GET /api/admin/products/:id
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Create a new product
 * POST /api/admin/products
 */
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      images,
      video,
      category,
      collections,
      fixedSizes,
      customSizePrice,
      colors,
      variations,
      material,
      shape,
      stock,
      isActive,
    } = req.body;

    // Generate slug from title
    let slug = generateSlug(title);

    // Check slug uniqueness
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await Product.create({
      title,
      slug,
      description,
      images: images || [],
      video: video || null,
      category,
      collections: collections || [],
      fixedSizes: fixedSizes || [],
      customSizePrice: customSizePrice || null,
      colors: colors || [],
      variations: variations || [],
      material,
      shape: shape || 'rectangle',
      stock: stock || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'error', message: 'Product with this slug already exists' });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Update a product
 * PUT /api/admin/products/:id
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If title changed, regenerate slug
    if (updateData.title) {
      const newSlug = generateSlug(updateData.title);
      const existing = await Product.findOne({ slug: newSlug, _id: { $ne: id } });
      updateData.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Delete a product (admin only)
 * DELETE /api/admin/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    // Delete images from Cloudinary
    for (const imageUrl of product.images) {
      const publicId = getPublicIdFromUrl(imageUrl);
      if (publicId) {
        await deleteAsset(publicId, 'image').catch(() => {});
      }
    }

    // Delete video from Cloudinary
    if (product.video) {
      const videoPublicId = getPublicIdFromUrl(product.video);
      if (videoPublicId) {
        await deleteAsset(videoPublicId, 'video').catch(() => {});
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Toggle product active/inactive
 * PATCH /api/admin/products/:id/toggle
 */
const toggleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      status: 'success',
      message: `Product ${product.isActive ? 'activated' : 'deactivated'}`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProduct,
};
