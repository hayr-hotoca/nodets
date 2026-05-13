import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { sendSuccess, sendList, sendCreated, sendNoContent } from '../../shared/utils/api-response';
import { ListProductQuery, CreateProductDto, UpdateProductDto } from './product.types';

export class ProductController {
  constructor(private readonly service: ProductService) {}



  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { data, pagination } = await this.service.list(req.query as ListProductQuery);
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
      const data = await this.service.create(req.body as CreateProductDto);
      sendCreated(res, data);
    } catch (err) { next(err); }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body as UpdateProductDto);
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
