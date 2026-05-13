import { Request, Response, NextFunction } from 'express';
import { GoodsReceivedNoteService } from './goods-received-note.service';
import { sendSuccess, sendList, sendCreated, sendNoContent } from '../../shared/utils/api-response';
import { CreateReceiptDto, UpdateReceiptDto, ListReceiptQuery } from './goods-received-note.types';

export class GoodsReceivedNoteController {
  constructor(private readonly service: GoodsReceivedNoteService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { data, pagination } = await this.service.list(req.query as ListReceiptQuery);
      sendList(res, data, pagination);
    } catch (err) { next(err); }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getById(Number(req.params.id));
      sendSuccess(res, data);
    } catch (err) { next(err); }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.create(req.body as CreateReceiptDto);
      sendCreated(res, data);
    } catch (err) { next(err); }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body as UpdateReceiptDto);
      sendSuccess(res, data);
    } catch (err) { next(err); }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.delete(Number(req.params.id));
      sendNoContent(res);
    } catch (err) { next(err); }
  };
}
