import { Router } from 'express';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from './warehouse.repository';
import { validate } from '../../shared/middlewares/validate.middleware';
import { CreateWarehouseSchema, UpdateWarehouseSchema, ListWarehouseQuerySchema } from './warehouse.types';

const router = Router();
const controller = new WarehouseController(new WarehouseService(new WarehouseRepository()));

router.get('/',    validate(ListWarehouseQuerySchema, 'query'), controller.list);
router.get('/:id', controller.getById);
router.post('/',   validate(CreateWarehouseSchema), controller.create);
router.put('/:id', validate(UpdateWarehouseSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
