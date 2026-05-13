import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { validate } from '../../shared/middlewares/validate.middleware';
import {
  CreateProductSchema, UpdateProductSchema,
  ListProductQuerySchema,
} from './product.types';

const router = Router();
const controller = new ProductController(new ProductService(new ProductRepository()));


// Products
router.get('/',    validate(ListProductQuerySchema, 'query'), controller.list);
router.get('/:id', controller.getById);
router.post('/',   validate(CreateProductSchema), controller.create);
router.put('/:id', validate(UpdateProductSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
