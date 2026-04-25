import { Request, Response } from 'express';
import { SubmissionRepository } from '../repositories/submission.repository';

export class SubmissionController {
  private submissionRepository: SubmissionRepository;

  constructor() {
    this.submissionRepository = new SubmissionRepository();
  }

  getSubmissions = async (_req: Request, res: Response) => {
    try {
      const submissions = await this.submissionRepository.findAll();
      res.json(submissions);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch submissions', details: err });
    }
  };

  getSubmissionById = async (req: Request, res: Response) => {
    try {
      const submission = await this.submissionRepository.findById(req.params.id as string);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      res.json(submission);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch submission', details: err });
    }
  };

  createSubmission = async (req: Request, res: Response) => {
    const { flowId, answers } = req.body;
    if (!flowId || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'flowId and answers[] are required' });
    }
    try {
      const submission = await this.submissionRepository.create({ flowId, answers });
      res.status(201).json(submission);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create submission', details: err });
    }
  };
}
