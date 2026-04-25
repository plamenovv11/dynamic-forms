import prisma from '../prisma';

export class FlowRepository {
  async findAll() {
    return prisma.flow.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { flowForms: true } },
      },
    });
  }

  async findById(id: string) {
    const flow = await prisma.flow.findUnique({
      where: { id },
      include: {
        flowForms: {
          orderBy: { orderIndex: 'asc' },
          include: {
            form: {
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
            },
          },
        },
      },
    });
    
    if (flow) {
      flow.flowForms.forEach(ff => {
        ff.form.questions = ff.form.questions.map(q => ({
          ...q,
          options: q.options ? JSON.parse(q.options) : null
        }));
      });
    }

    return flow;
  }

  async create(data: { title: string; description?: string; formIds?: string[] }) {
    return prisma.flow.create({
      data: {
        title: data.title,
        description: data.description,
        flowForms: {
          create: (data.formIds ?? []).map((formId: string, idx: number) => ({
            formId,
            orderIndex: idx,
          })),
        },
      },
      include: { flowForms: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  async update(id: string, data: { title?: string; description?: string; formIds?: string[] }) {
    // Delete all existing flowForms first
    await prisma.flowForm.deleteMany({ where: { flowId: id } });
    
    return prisma.flow.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        flowForms: {
          create: (data.formIds ?? []).map((formId: string, idx: number) => ({
            formId,
            orderIndex: idx,
          })),
        },
      },
      include: { flowForms: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  async delete(id: string) {
    return prisma.flow.delete({ where: { id } });
  }
}
