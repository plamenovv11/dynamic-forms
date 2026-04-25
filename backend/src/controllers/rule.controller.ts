import { Request, Response } from 'express';
import { RuleRepository } from '../repositories/rule.repository';

export class RuleController {
  private ruleRepository: RuleRepository;

  constructor() {
    this.ruleRepository = new RuleRepository();
  }

  getRules = async (_req: Request, res: Response) => {
    try {
      const rules = await this.ruleRepository.findAll();
      res.json(rules);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch rules', details: err });
    }
  };

  createRule = async (req: Request, res: Response) => {
    const { sourceQuestionId, targetQuestionId, conditionValue, action } = req.body;
    if (!sourceQuestionId || !targetQuestionId || conditionValue === undefined) {
      return res.status(400).json({ error: 'sourceQuestionId, targetQuestionId, and conditionValue are required' });
    }
    try {
      const rule = await this.ruleRepository.create({
        sourceQuestionId,
        targetQuestionId,
        conditionValue,
        action,
      });
      res.status(201).json(rule);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create rule', details: err });
    }
  };

  deleteRule = async (req: Request, res: Response) => {
    try {
      await this.ruleRepository.delete(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete rule', details: err });
    }
  };
}
