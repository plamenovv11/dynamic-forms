import { Router } from 'express';
import { SubmissionController } from '../controllers/submission.controller';

const router = Router();
const submissionController = new SubmissionController();

router.get('/', submissionController.getSubmissions);
router.get('/:id', submissionController.getSubmissionById);
router.post('/', submissionController.createSubmission);

export default router;
