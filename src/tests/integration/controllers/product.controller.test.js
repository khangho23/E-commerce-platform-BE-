const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../../app'); // Assuming app.js exports the express app
const { product: ProductModel } = require('../../../models/product.model');

// Mocking the product model
jest.mock('../../../models/product.model');

describe('Product API', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should return product details for a valid product ID', async () => {
    const mockProduct = { _id: '1', name: 'Test Product', price: 100 };

    ProductModel.findById.mockResolvedValue(mockProduct);

    const res = await request(app).get('/api/products/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockProduct);
  });

  it('should return 404 for a non-existent product ID', async () => {
    ProductModel.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/products/nonexistent-id');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Product not found' });
  });

  it('should create a new product', async () => {
    const mockProductData = { name: 'New Product', price: 150, quantity: 5, category: 'Electronics', shop: 'shopId', attributes: {} };
    const mockProduct = { ...mockProductData, _id: '1' };

    ProductModel.create.mockResolvedValue(mockProduct);

    const res = await request(app).post('/api/products').send(mockProductData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(mockProduct);
  });

  it('should update an existing product', async () => {
    const mockProduct = { _id: '1', name: 'Updated Product', price: 200 };

    ProductModel.findByIdAndUpdate.mockResolvedValue(mockProduct);

    const res = await request(app).put('/api/products/1').send({ name: 'Updated Product', price: 200 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockProduct);
  });

  it('should delete an existing product', async () => {
    const mockProduct = { _id: '1', name: 'Deleted Product' };

    ProductModel.findByIdAndDelete.mockResolvedValue(mockProduct);

    const res = await request(app).delete('/api/products/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockProduct);
  });
});