import { Request, Response, NextFunction } from 'express';
import { DivisionService } from './division.service';
import { sendSuccess, sendList, sendCreated, sendNoContent } from '../../shared/utils/api-response';
import { CreateDivisionDto, UpdateDivisionDto, ListDivisionQuery } from './division.types';

export class DivisionController {
  constructor(private readonly service: DivisionService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { data, pagination } = await this.service.list(req.query as ListDivisionQuery);
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
      const data = await this.service.create(req.body as CreateDivisionDto);
      sendCreated(res, data);
    } catch (err) { next(err); }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body as UpdateDivisionDto);
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
