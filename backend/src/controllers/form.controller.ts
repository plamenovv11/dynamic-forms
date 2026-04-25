import { Request, Response } from 'express';
import { FormRepository } from '../repositories/form.repository';

export class FormController {
  private formRepository: FormRepository;

  constructor() {
    this.formRepository = new FormRepository();
  }

  getForms = async (_req: Request, res: Response) => {
    try {
      const forms = await this.formRepository.findAll();
      res.json(forms);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch forms', details: err });
    }
  };

  getFormById = async (req: Request, res: Response) => {
    try {
      const form = await this.formRepository.findById(req.params.id as string);
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }
      res.json(form);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch form', details: err });
    }
  };

  createForm = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    try {
      const form = await this.formRepository.create({ title, description });
      res.status(201).json(form);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create form', details: err });
    }
  };

  updateForm = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    try {
      const form = await this.formRepository.update(req.params.id as string, { title, description });
      res.json(form);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update form', details: err });
    }
  };

  deleteForm = async (req: Request, res: Response) => {
    try {
      await this.formRepository.delete(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete form', details: err });
    }
  };

  createQuestion = async (req: Request, res: Response) => {
    const { label, type, options, orderIndex } = req.body;
    if (!label || !type) {
      return res.status(400).json({ error: 'label and type are required' });
    }
    try {
      let idx = orderIndex;
      if (idx === undefined) {
        idx = await this.formRepository.countActiveQuestions(req.params.id as string);
      }
      const question = await this.formRepository.createQuestion({
        formId: req.params.id as string,
        label,
        type,
        options,
        orderIndex: idx,
      });
      res.status(201).json(question);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create question', details: err });
    }
  };

  updateQuestion = async (req: Request, res: Response) => {
    const { label, type, options, orderIndex, isActive } = req.body;
    try {
      const question = await this.formRepository.updateQuestion(req.params.questionId as string, {
        label, type, options, orderIndex, isActive
      });
      res.json(question);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update question', details: err });
    }
  };

  deleteQuestion = async (req: Request, res: Response) => {
    try {
      const question = await this.formRepository.softDeleteQuestion(req.params.questionId as string);
      res.json(question);
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete question', details: err });
    }
  };
}
