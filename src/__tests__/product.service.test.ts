import { ProductService } from '../modules/product/product.service';
import { ProductRepository } from '../modules/product/product.repository';
import { AppError } from '../shared/utils/app-error';

jest.mock('../modules/product/product.repository');

describe('ProductService', () => {
  let productService: ProductService;
  let productRepo: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    productRepo = new ProductRepository() as jest.Mocked<ProductRepository>;
    productService = new ProductService(productRepo);
  });

  describe('list', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { 
          id: 1, 
          code: 'P1', 
          name: 'Product 1', 
          description: null, 
          calculation_unit: 'Cái', 
          created_at: new Date(), 
          updated_at: new Date() 
        },
      ];
      productRepo.findAll.mockResolvedValue({ rows: mockProducts, total: 1 });

      const result = await productService.list({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockProducts);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe('getById', () => {
    it('should return a product if found', async () => {
      const mockProduct = { 
        id: 1, 
        code: 'P1', 
        name: 'Product 1', 
        description: null, 
        calculation_unit: 'Cái', 
        created_at: new Date(), 
        updated_at: new Date() 
      };
      productRepo.findById.mockResolvedValue(mockProduct);

      const result = await productService.getById(1);

      expect(result).toEqual(mockProduct);
    });

    it('should throw AppError if not found', async () => {
      productRepo.findById.mockResolvedValue(null);

      await expect(productService.getById(1)).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a product if code is unique', async () => {
      const dto = { code: 'P1', name: 'Product 1' };
      const mockProduct = { 
        id: 1, 
        ...dto, 
        description: null, 
        calculation_unit: null, 
        created_at: new Date(), 
        updated_at: new Date() 
      };
      
      productRepo.findByCode.mockResolvedValue(null);
      productRepo.create.mockResolvedValue(mockProduct);

      const result = await productService.create(dto);

      expect(result).toEqual(mockProduct);
    });

    it('should throw conflict error if code exists', async () => {
      const dto = { code: 'P1', name: 'Product 1' };
      productRepo.findByCode.mockResolvedValue({ id: 2, ...dto } as any);

      await expect(productService.create(dto)).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto = { name: 'Updated Name' };
      const mockProduct = { 
        id: 1, 
        code: 'P1', 
        name: 'Product 1', 
        description: null, 
        calculation_unit: null, 
        created_at: new Date(), 
        updated_at: new Date() 
      };
      const updatedProduct = { ...mockProduct, ...dto };

      productRepo.findById.mockResolvedValue(mockProduct);
      productRepo.update.mockResolvedValue(updatedProduct);

      const result = await productService.update(1, dto);

      expect(result).toEqual(updatedProduct);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      productRepo.findById.mockResolvedValue({ id: 1 } as any);
      productRepo.delete.mockResolvedValue(true);

      await productService.delete(1);

      expect(productRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
