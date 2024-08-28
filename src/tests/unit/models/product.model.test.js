const mongoose = require('mongoose');
const { product: ProductModel } = require('../../../models/product.model');
const slugify = require('slugify');

describe('ProductModel', () => {
  beforeAll(async () => {
    // Kết nối với MongoDB memory server hoặc mock database
    await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Đóng kết nối và xóa database
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should have the necessary fields', async () => {
    const productData = {
      name: 'Test Product',
      thumb: 'thumb.jpg',
      price: 100,
      quantity: 10,
      category: 'Electronics',
      shop: new mongoose.Types.ObjectId(),
      attributes: {},
    };
    
    const product = new ProductModel(productData);
    await product.save();

    const savedProduct = await ProductModel.findOne({ name: 'Test Product' });
    
    expect(savedProduct.name).toBe(productData.name);
    expect(savedProduct.thumb).toBe(productData.thumb);
    expect(savedProduct.price).toBe(productData.price);
    expect(savedProduct.quantity).toBe(productData.quantity);
    expect(savedProduct.category).toBe(productData.category);
    expect(savedProduct.shop.toString()).toBe(productData.shop.toString());
    expect(savedProduct.attributes).toEqual(productData.attributes);
    expect(savedProduct.slug).toBe(slugify(productData.name, { lower: true }));
  });

  it('should set default values correctly', async () => {
    const productData = {
      name: 'Test Product with Defaults',
      thumb: 'thumb.jpg',
      price: 100,
      quantity: 10,
      category: 'Electronics',
      shop: new mongoose.Types.ObjectId(),
      attributes: {},
    };

    const product = new ProductModel(productData);
    await product.save();

    const savedProduct = await ProductModel.findOne({ name: 'Test Product with Defaults' });

    expect(savedProduct.isDraft).toBe(true);
    expect(savedProduct.isPublished).toBe(false);
    expect(savedProduct.rating).toBe(0);
    expect(savedProduct.variation).toEqual([]);
  });

  it('should enforce rating limits', async () => {
    const productData = {
      name: 'Test Product with Rating',
      thumb: 'thumb.jpg',
      price: 100,
      quantity: 10,
      category: 'Electronics',
      shop: new mongoose.Types.ObjectId(),
      attributes: {},
      rating: 4.7
    };

    const product = new ProductModel(productData);
    await product.save();

    const savedProduct = await ProductModel.findOne({ name: 'Test Product with Rating' });

    expect(savedProduct.rating).toBe(4);
  });
});