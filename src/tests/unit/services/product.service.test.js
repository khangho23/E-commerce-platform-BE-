const ProductService = require('../../../services/product.service');
const { product: ProductModel } = require('../../../models/product.model');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Mocking the product model
jest.mock('../../../models/product.model');

describe('ProductService', () => {
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

  describe('getProductById', () => {
    it('should return product details when given a valid product ID', async () => {
      const mockProduct = { _id: '1', name: 'Test Product', price: 100 };
      ProductModel.findById.mockResolvedValue(mockProduct);

      const productService = new ProductService();
      const product = await productService.getProductById('1');

      expect(product).toEqual(mockProduct);
      expect(ProductModel.findById).toHaveBeenCalledWith('1');
    });

    it('should throw an error when the product ID does not exist', async () => {
      ProductModel.findById.mockResolvedValue(null);

      const productService = new ProductService();

      await expect(productService.getProductById('nonexistent-id')).rejects.toThrow('Product not found');
      expect(ProductModel.findById).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const mockProductData = { name: 'New Product', price: 150, quantity: 5, category: 'Electronics', shop: 'shopId', attributes: {} };
      const mockProduct = { ...mockProductData, _id: '1' };
      ProductModel.create.mockResolvedValue(mockProduct);

      const productService = new ProductService();
      const product = await productService.createProduct(mockProductData);

      expect(product).toEqual(mockProduct);
      expect(ProductModel.create).toHaveBeenCalledWith(mockProductData);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const mockProduct = { _id: '1', name: 'Updated Product', price: 200 };
      ProductModel.findByIdAndUpdate.mockResolvedValue(mockProduct);

      const productService = new ProductService();
      const product = await productService.updateProduct('1', { name: 'Updated Product', price: 200 });

      expect(product).toEqual(mockProduct);
      expect(ProductModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'Updated Product', price: 200 }, { new: true });
    });
  });

  describe('deleteProduct', () => {
    it('should delete an existing product', async () => {
      const mockProduct = { _id: '1', name: 'Deleted Product' };
      ProductModel.findByIdAndDelete.mockResolvedValue(mockProduct);

      const productService = new ProductService();
      const product = await productService.deleteProduct('1');

      expect(product).toEqual(mockProduct);
      expect(ProductModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});