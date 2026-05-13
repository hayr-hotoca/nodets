import { GoodsReceivedNoteService } from '../modules/goods-received-note/goods-received-note.service';
import { GoodsReceivedNoteRepository } from '../modules/goods-received-note/goods-received-note.repository';
import { AppError } from '../shared/utils/app-error';

// Mock GoodsReceivedNoteRepository
jest.mock('../modules/goods-received-note/goods-received-note.repository');

describe('GoodsReceivedNoteService', () => {
  let grnService: GoodsReceivedNoteService;
  let grnRepo: jest.Mocked<GoodsReceivedNoteRepository>;

  beforeEach(() => {
    grnRepo = new GoodsReceivedNoteRepository() as jest.Mocked<GoodsReceivedNoteRepository>;
    grnService = new GoodsReceivedNoteService(grnRepo);
  });

  describe('getById', () => {
    it('should return a GRN if found', async () => {
      const mockGRN = { 
        id: 1, 
        receipt_date: '2023-10-24', 
        warehouse_id: 1,
        debit_amount: 100,
        credit_amount: 100,
        created_at: new Date(),
        updated_at: new Date()
      };
      grnRepo.findById.mockResolvedValue(mockGRN as any);

      const result = await grnService.getById(1);

      expect(result).toEqual(mockGRN);
      expect(grnRepo.findById).toHaveBeenCalledWith(1);
    });

    it('should throw AppError if GRN not found', async () => {
      grnRepo.findById.mockResolvedValue(null);

      await expect(grnService.getById(1)).rejects.toThrow(AppError);
      await expect(grnService.getById(1)).rejects.toThrow('Không tìm thấy phiếu nhập kho với id=1');
    });
  });

  describe('create', () => {
    it('should create a GRN', async () => {
      const dto = {
        receipt_date: '2023-10-24',
        warehouse_id: 1,
        products: [{ product_id: 1, qty_actual: 10, qty_document: 10, unit_price: 50 }]
      };
      const mockGRN = { id: 1, ...dto, created_at: new Date(), updated_at: new Date() };
      
      grnRepo.create.mockResolvedValue(mockGRN as any);

      const result = await grnService.create(dto as any);

      expect(result).toEqual(mockGRN);
      expect(grnRepo.create).toHaveBeenCalledWith(dto);
    });
  });
});
