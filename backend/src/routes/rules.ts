import { Router } from 'express';
import { RuleController } from '../controllers/rule.controller';

const router = Router();
const ruleController = new RuleController();

router.get('/', ruleController.getRules);
router.post('/', ruleController.createRule);
router.delete('/:id', ruleController.deleteRule);

export default router;
