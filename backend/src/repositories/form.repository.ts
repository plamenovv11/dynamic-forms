import prisma from '../prisma';
import { Prisma } from '@prisma/client';

export class FormRepository {
  async findAll() {
    const forms = await prisma.form.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { questions: { where: { isActive: true } } } },
      },
    });
    return forms;
  }

  async findById(id: string) {
    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { orderIndex: 'asc' },
          include: {
            rulesAsSource: true,
            rulesAsTarget: true,
          },
        },
      },
    });
    
    if (form) {
      form.questions = form.questions.map(q => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : null
      }));
    }
    
    return form;
  }

  async create(data: { title: string; description?: string }) {
    return prisma.form.create({ data });
  }

  async update(id: string, data: { title?: string; description?: string }) {
    return prisma.form.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.form.delete({ where: { id } });
  }

  async countActiveQuestions(formId: string) {
    return prisma.question.count({ where: { formId, isActive: true } });
  }

  async createQuestion(data: {
    formId: string;
    label: string;
    type: string;
    options?: any;
    orderIndex: number;
  }) {
    return prisma.question.create({
      data: {
        formId: data.formId,
        label: data.label,
        type: data.type,
        options: data.options ? JSON.stringify(data.options) : null,
        orderIndex: data.orderIndex,
      },
    });
  }

  async updateQuestion(id: string, data: {
    label?: string;
    type?: string;
    options?: any;
    orderIndex?: number;
    isActive?: boolean;
  }) {
    return prisma.question.update({
      where: { id },
      data: {
        ...data,
        options: data.options !== undefined ? (data.options ? JSON.stringify(data.options) : null) : undefined,
      },
    });
  }

  async softDeleteQuestion(id: string) {
    return prisma.question.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
