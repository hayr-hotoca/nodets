import { DivisionService } from '../modules/division/division.service';
import { DivisionRepository } from '../modules/division/division.repository';
import { AppError } from '../shared/utils/app-error';

jest.mock('../modules/division/division.repository');

describe('DivisionService', () => {
  let divisionService: DivisionService;
  let divisionRepo: jest.Mocked<DivisionRepository>;

  beforeEach(() => {
    divisionRepo = new DivisionRepository() as jest.Mocked<DivisionRepository>;
    divisionService = new DivisionService(divisionRepo);
  });

  describe('list', () => {
    it('should return paginated divisions', async () => {
      const mockDivisions = [
        { id: 1, code: 'D1', name: 'Division 1', unit_id: 1, created_at: new Date(), updated_at: new Date() },
      ];
      divisionRepo.findAll.mockResolvedValue({ rows: mockDivisions, total: 1 });

      const result = await divisionService.list({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockDivisions);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe('getById', () => {
    it('should return a division if found', async () => {
      const mockDivision = { id: 1, code: 'D1', name: 'Division 1', unit_id: 1, created_at: new Date(), updated_at: new Date() };
      divisionRepo.findById.mockResolvedValue(mockDivision);

      const result = await divisionService.getById(1);

      expect(result).toEqual(mockDivision);
    });

    it('should throw AppError if not found', async () => {
      divisionRepo.findById.mockResolvedValue(null);

      await expect(divisionService.getById(1)).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a division if code is unique', async () => {
      const dto = { code: 'D1', name: 'Division 1', unit_id: 1 };
      const mockDivision = { id: 1, ...dto, created_at: new Date(), updated_at: new Date() };
      
      divisionRepo.findByCode.mockResolvedValue(null);
      divisionRepo.create.mockResolvedValue(mockDivision);

      const result = await divisionService.create(dto);

      expect(result).toEqual(mockDivision);
    });

    it('should throw conflict error if code exists', async () => {
      const dto = { code: 'D1', name: 'Division 1', unit_id: 1 };
      divisionRepo.findByCode.mockResolvedValue({ id: 2, ...dto, created_at: new Date(), updated_at: new Date() } as any);

      await expect(divisionService.create(dto)).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update a division', async () => {
      const dto = { name: 'Updated Name' };
      const mockDivision = { id: 1, code: 'D1', name: 'Division 1', unit_id: 1, created_at: new Date(), updated_at: new Date() };
      const updatedDivision = { ...mockDivision, ...dto };

      divisionRepo.findById.mockResolvedValue(mockDivision);
      divisionRepo.update.mockResolvedValue(updatedDivision);

      const result = await divisionService.update(1, dto);

      expect(result).toEqual(updatedDivision);
    });
  });

  describe('delete', () => {
    it('should delete a division', async () => {
      divisionRepo.findById.mockResolvedValue({ id: 1 } as any);
      divisionRepo.delete.mockResolvedValue(true);

      await divisionService.delete(1);

      expect(divisionRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
