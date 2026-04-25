import { Router } from 'express';
import { FormController } from '../controllers/form.controller';

const router = Router();
const formController = new FormController();

router.get('/', formController.getForms);
router.get('/:id', formController.getFormById);
router.post('/', formController.createForm);
router.put('/:id', formController.updateForm);
router.delete('/:id', formController.deleteForm);

router.post('/:id/questions', formController.createQuestion);
router.put('/questions/:questionId', formController.updateQuestion);
router.delete('/questions/:questionId', formController.deleteQuestion);

export default router;
