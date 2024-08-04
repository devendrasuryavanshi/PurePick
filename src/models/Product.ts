import mongoose from 'mongoose';

const productScanSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productType: {
    type: String, // e.g., "food" or "body care"
    required: true,
  },
  scanDate: {
    type: Date,
    default: Date.now,
  },
  safetyResult: {
    type: String, // e.g., "safe", "unsafe"
    required: true,
  },
  comparisonResults: {
    type: [String], // Array of product IDs or names for comparison
    default: [],
  },
  feedback: {
    type: String,
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const ProductScan = mongoose.model('ProductScan', productScanSchema);

export default ProductScan;