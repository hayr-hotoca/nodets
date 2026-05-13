import { Router } from 'express';
import { DivisionController } from './division.controller';
import { DivisionService } from './division.service';
import { DivisionRepository } from './division.repository';
import { validate } from '../../shared/middlewares/validate.middleware';
import { CreateDivisionSchema, UpdateDivisionSchema, ListDivisionQuerySchema } from './division.types';

const router = Router();
const controller = new DivisionController(new DivisionService(new DivisionRepository()));

router.get('/', validate(ListDivisionQuerySchema, 'query'), controller.list);
router.get('/:id', controller.getById);
router.post('/', validate(CreateDivisionSchema), controller.create);
router.put('/:id', validate(UpdateDivisionSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
