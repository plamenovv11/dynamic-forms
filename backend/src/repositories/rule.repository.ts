import prisma from '../prisma';

export class RuleRepository {
  async findAll() {
    const rules = await prisma.rule.findMany({
      include: {
        sourceQuestion: { select: { id: true, label: true, formId: true, type: true, options: true } },
        targetQuestion: { select: { id: true, label: true, formId: true, type: true } },
      },
    });
    
    return rules.map(r => ({
      ...r,
      sourceQuestion: {
        ...r.sourceQuestion,
        options: r.sourceQuestion.options ? JSON.parse(r.sourceQuestion.options) : null
      }
    }));
  }

  async create(data: {
    sourceQuestionId: string;
    targetQuestionId: string;
    conditionValue: string;
    action?: string;
  }) {
    return prisma.rule.create({
      data: {
        sourceQuestionId: data.sourceQuestionId,
        targetQuestionId: data.targetQuestionId,
        conditionValue: data.conditionValue,
        action: data.action ?? 'ENABLE',
      },
      include: {
        sourceQuestion: { select: { id: true, label: true, formId: true } },
        targetQuestion: { select: { id: true, label: true, formId: true } },
      },
    });
  }

  async delete(id: string) {
    return prisma.rule.delete({ where: { id } });
  }
}
