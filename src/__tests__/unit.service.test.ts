import { UnitService } from '../modules/unit/unit.service';
import { UnitRepository } from '../modules/unit/unit.repository';
import { AppError } from '../shared/utils/app-error';

// Mock UnitRepository
jest.mock('../modules/unit/unit.repository');

describe('UnitService', () => {
  let unitService: UnitService;
  let unitRepo: jest.Mocked<UnitRepository>;

  beforeEach(() => {
    unitRepo = new UnitRepository() as jest.Mocked<UnitRepository>;
    unitService = new UnitService(unitRepo);
  });

  describe('getById', () => {
    it('should return a unit if found', async () => {
      const mockUnit = { id: 1, code: 'U1', name: 'Unit 1', created_at: new Date(), updated_at: new Date() };
      unitRepo.findById.mockResolvedValue(mockUnit);

      const result = await unitService.getById(1);

      expect(result).toEqual(mockUnit);
      expect(unitRepo.findById).toHaveBeenCalledWith(1);
    });

    it('should throw AppError if unit not found', async () => {
      unitRepo.findById.mockResolvedValue(null);

      await expect(unitService.getById(1)).rejects.toThrow(AppError);
      await expect(unitService.getById(1)).rejects.toThrow('Không tìm thấy đơn vị với id=1');
    });
  });

  describe('create', () => {
    it('should create a unit if code is unique', async () => {
      const dto = { code: 'U1', name: 'Unit 1' };
      const mockUnit = { id: 1, ...dto, created_at: new Date(), updated_at: new Date() };
      
      unitRepo.findByCode.mockResolvedValue(null);
      unitRepo.create.mockResolvedValue(mockUnit);

      const result = await unitService.create(dto);

      expect(result).toEqual(mockUnit);
      expect(unitRepo.findByCode).toHaveBeenCalledWith('U1');
      expect(unitRepo.create).toHaveBeenCalledWith(dto);
    });

    it('should throw AppError if code already exists', async () => {
      const dto = { code: 'U1', name: 'Unit 1' };
      const existingUnit = { id: 1, ...dto, created_at: new Date(), updated_at: new Date() };
      
      unitRepo.findByCode.mockResolvedValue(existingUnit);

      await expect(unitService.create(dto)).rejects.toThrow(AppError);
      await expect(unitService.create(dto)).rejects.toThrow('Mã đơn vị "U1" đã tồn tại');
    });
  });
});
