import { Router } from 'express';
import { GoodsReceivedNoteController } from './goods-received-note.controller';
import { GoodsReceivedNoteService } from './goods-received-note.service';
import { GoodsReceivedNoteRepository } from './goods-received-note.repository';
import { validate } from '../../shared/middlewares/validate.middleware';
import {
  CreateGoodsReceivedNoteSchema,
  UpdateGoodsReceivedNoteSchema,
  ListGoodsReceivedNoteQuerySchema,
} from './goods-received-note.types';

const router = Router();
const controller = new GoodsReceivedNoteController(
  new GoodsReceivedNoteService(new GoodsReceivedNoteRepository())
);

// Goods Received Notes (Phiếu nhập kho)
router.get(
  '/',
  validate(ListGoodsReceivedNoteQuerySchema, 'query'),
  controller.list
);
router.get('/:id', controller.getById);
router.post('/', validate(CreateGoodsReceivedNoteSchema), controller.create);
router.put('/:id', validate(UpdateGoodsReceivedNoteSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
