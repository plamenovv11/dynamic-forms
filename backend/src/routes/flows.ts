import { Router } from 'express';
import { FlowController } from '../controllers/flow.controller';

const router = Router();
const flowController = new FlowController();

router.get('/', flowController.getFlows);
router.get('/:id', flowController.getFlowById);
router.post('/', flowController.createFlow);
router.put('/:id', flowController.updateFlow);
router.delete('/:id', flowController.deleteFlow);

export default router;
