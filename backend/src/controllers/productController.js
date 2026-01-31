import Product from "../models/product.js";

// @desc    Create new product
// @route   POST /api/products
// @access  Protected (later admin)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;

    if (!name || !description || !price || !image) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Invalid product ID" });
  }
};
