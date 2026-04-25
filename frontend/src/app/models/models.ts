export type QuestionType = 'TEXT' | 'YES_NO' | 'SELECT' | 'MULTI_SELECT' | 'NUMBER';

export interface Rule {
  id: string;
  sourceQuestionId: string;
  targetQuestionId: string;
  conditionValue: string;
  action: 'ENABLE';
  sourceQuestion?: Partial<Question>;
  targetQuestion?: Partial<Question>;
}

export interface Question {
  id: string;
  formId: string;
  label: string;
  type: QuestionType;
  options: string[] | null;
  orderIndex: number;
  isActive: boolean;
  rulesAsSource?: Rule[];
  rulesAsTarget?: Rule[];
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  _count?: { questions: number };
}

export interface FlowForm {
  id: string;
  flowId: string;
  formId: string;
  orderIndex: number;
  form: Form;
}

export interface Flow {
  id: string;
  title: string;
  description?: string;
  flowForms: FlowForm[];
  _count?: { flowForms: number };
}

export interface Answer {
  id: string;
  submissionId: string;
  formId: string;
  questionId: string;
  value: unknown;
  question: Partial<Question>;
}

export interface Submission {
  id: string;
  flowId: string;
  createdAt: string;
  flow: Partial<Flow>;
  answers: Answer[];
}
