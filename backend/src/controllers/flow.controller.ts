import { Request, Response } from 'express';
import { FlowRepository } from '../repositories/flow.repository';

export class FlowController {
  private flowRepository: FlowRepository;

  constructor() {
    this.flowRepository = new FlowRepository();
  }

  getFlows = async (_req: Request, res: Response) => {
    try {
      const flows = await this.flowRepository.findAll();
      res.json(flows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch flows', details: err });
    }
  };

  getFlowById = async (req: Request, res: Response) => {
    try {
      const flow = await this.flowRepository.findById(req.params.id as string);
      if (!flow) {
        return res.status(404).json({ error: 'Flow not found' });
      }
      res.json(flow);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch flow', details: err });
    }
  };

  createFlow = async (req: Request, res: Response) => {
    const { title, description, formIds } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    try {
      const flow = await this.flowRepository.create({ title, description, formIds });
      res.status(201).json(flow);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create flow', details: err });
    }
  };

  updateFlow = async (req: Request, res: Response) => {
    const { title, description, formIds } = req.body;
    try {
      const flow = await this.flowRepository.update(req.params.id as string, { title, description, formIds });
      res.json(flow);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update flow', details: err });
    }
  };

  deleteFlow = async (req: Request, res: Response) => {
    try {
      await this.flowRepository.delete(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete flow', details: err });
    }
  };
}
