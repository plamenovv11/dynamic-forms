import prisma from '../prisma';

export class SubmissionRepository {
  async findAll() {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        flow: { select: { id: true, title: true } },
        answers: {
          include: {
            question: { select: { id: true, label: true, type: true, formId: true, isActive: true } },
          },
        },
      },
    });
    
    return submissions.map(s => ({
      ...s,
      answers: s.answers.map(a => ({
        ...a,
        value: a.value ? JSON.parse(a.value) : null
      }))
    }));
  }

  async findById(id: string) {
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        flow: true,
        answers: {
          include: {
            question: true,
          },
        },
      },
    });
    
    if (submission) {
      submission.answers = submission.answers.map(a => ({
        ...a,
        value: a.value ? JSON.parse(a.value) : null
      }));
    }
    
    return submission;
  }

  async create(data: {
    flowId: string;
    answers: { questionId: string; formId: string; value: unknown }[];
  }) {
    return prisma.submission.create({
      data: {
        flowId: data.flowId,
        answers: {
          create: data.answers.map(a => ({
            questionId: a.questionId,
            formId: a.formId,
            value: JSON.stringify(a.value),
          })),
        },
      },
      include: {
        flow: { select: { id: true, title: true } },
        answers: {
          include: {
            question: { select: { id: true, label: true, type: true } },
          },
        },
      },
    });
  }
}
