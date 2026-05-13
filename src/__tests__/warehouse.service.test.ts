import { WarehouseService } from '../modules/warehouse/warehouse.service';
import { WarehouseRepository } from '../modules/warehouse/warehouse.repository';
import { AppError } from '../shared/utils/app-error';

jest.mock('../modules/warehouse/warehouse.repository');

describe('WarehouseService', () => {
  let warehouseService: WarehouseService;
  let warehouseRepo: jest.Mocked<WarehouseRepository>;

  beforeEach(() => {
    warehouseRepo = new WarehouseRepository() as jest.Mocked<WarehouseRepository>;
    warehouseService = new WarehouseService(warehouseRepo);
  });

  describe('list', () => {
    it('should return paginated warehouses', async () => {
      const mockWarehouses = [
        { 
          id: 1, 
          code: 'W1', 
          name: 'Warehouse 1', 
          location: null, 
          address: null, 
          manager_name: null, 
          is_active: true, 
          created_at: new Date(), 
          updated_at: new Date() 
        },
      ];
      warehouseRepo.findAll.mockResolvedValue({ rows: mockWarehouses, total: 1 });

      const result = await warehouseService.list({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockWarehouses);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe('getById', () => {
    it('should return a warehouse if found', async () => {
      const mockWarehouse = { 
        id: 1, 
        code: 'W1', 
        name: 'Warehouse 1', 
        location: null, 
        address: null, 
        manager_name: null, 
        is_active: true, 
        created_at: new Date(), 
        updated_at: new Date() 
      };
      warehouseRepo.findById.mockResolvedValue(mockWarehouse);

      const result = await warehouseService.getById(1);

      expect(result).toEqual(mockWarehouse);
    });

    it('should throw AppError if not found', async () => {
      warehouseRepo.findById.mockResolvedValue(null);

      await expect(warehouseService.getById(1)).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a warehouse if code is unique', async () => {
      const dto = { code: 'W1', name: 'Warehouse 1' };
      const mockWarehouse = { 
        id: 1, 
        ...dto, 
        location: null, 
        address: null, 
        manager_name: null, 
        is_active: true, 
        created_at: new Date(), 
        updated_at: new Date() 
      };
      
      warehouseRepo.findByCode.mockResolvedValue(null);
      warehouseRepo.create.mockResolvedValue(mockWarehouse);

      const result = await warehouseService.create(dto);

      expect(result).toEqual(mockWarehouse);
    });

    it('should throw conflict error if code exists', async () => {
      const dto = { code: 'W1', name: 'Warehouse 1' };
      warehouseRepo.findByCode.mockResolvedValue({ id: 2, ...dto } as any);

      await expect(warehouseService.create(dto)).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update a warehouse', async () => {
      const dto = { name: 'Updated Name' };
      const mockWarehouse = { 
        id: 1, 
        code: 'W1', 
        name: 'Warehouse 1', 
        location: null, 
        address: null, 
        manager_name: null, 
        is_active: true, 
        created_at: new Date(), 
        updated_at: new Date() 
      };
      const updatedWarehouse = { ...mockWarehouse, ...dto };

      warehouseRepo.findById.mockResolvedValue(mockWarehouse);
      warehouseRepo.update.mockResolvedValue(updatedWarehouse);

      const result = await warehouseService.update(1, dto);

      expect(result).toEqual(updatedWarehouse);
    });
  });

  describe('delete', () => {
    it('should delete a warehouse', async () => {
      warehouseRepo.findById.mockResolvedValue({ id: 1 } as any);
      warehouseRepo.delete.mockResolvedValue(true);

      await warehouseService.delete(1);

      expect(warehouseRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
