import { Router } from 'express';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { UnitRepository } from './unit.repository';
import { validate } from '../../shared/middlewares/validate.middleware';
import { CreateUnitSchema, UpdateUnitSchema, ListUnitQuerySchema } from './unit.types';

const router = Router();
const controller = new UnitController(new UnitService(new UnitRepository()));

router.get('/', validate(ListUnitQuerySchema, 'query'), controller.list);
router.get('/:id', controller.getById);
router.post('/', validate(CreateUnitSchema), controller.create);
router.put('/:id', validate(UpdateUnitSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
