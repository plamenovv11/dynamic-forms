import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlowService } from '../../../services/flow.service';
import { SubmissionService } from '../../../services/submission.service';
import { Flow, FlowForm, Question, Rule } from '../../../models/models';

@Component({
  selector: 'app-flow-runner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './flow-runner.component.html',
})
export class FlowRunnerComponent implements OnInit {
  flow: Flow | null = null;
  currentStep = 0;
  answers: Record<string, unknown> = {};
  submitted = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private flowService: FlowService,
    private submissionService: SubmissionService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.flowService.getFlow(id).subscribe({
      next: (f) => this.flow = f,
      error: () => this.error = 'Failed to load flow',
    });
  }

  get currentFF(): FlowForm | null {
    return this.flow?.flowForms[this.currentStep] ?? null;
  }

  get totalSteps() {
    return this.flow?.flowForms.length ?? 0;
  }

  /** Core rule engine: a question is enabled if it has NO rules targeting it,
   *  OR if at least one rule targeting it is satisfied by the current answers dict. */
  isEnabled(q: Question): boolean {
    const targetRules = q.rulesAsTarget ?? [];
    if (targetRules.length === 0) return true;
    return targetRules.some(r => this.ruleIsSatisfied(r));
  }

  private ruleIsSatisfied(rule: Rule): boolean {
    const srcAnswer = this.answers[rule.sourceQuestionId];
    if (srcAnswer === undefined || srcAnswer === null || srcAnswer === '') return false;
    // For multi-select, check if conditionValue is included in the array
    if (Array.isArray(srcAnswer)) {
      return srcAnswer.includes(rule.conditionValue);
    }
    return String(srcAnswer) === rule.conditionValue;
  }

  isChecked(qId: string, opt: string): boolean {
    const val = this.answers[qId];
    return Array.isArray(val) && (val as string[]).includes(opt);
  }

  toggleMulti(qId: string, opt: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const current = (this.answers[qId] as string[]) ?? [];
    this.answers[qId] = checked ? [...current, opt] : current.filter(o => o !== opt);
  }

  prevStep() { if (this.currentStep > 0) this.currentStep--; }
  nextStep() { if (this.currentStep < this.totalSteps - 1) this.currentStep++; }

  submit() {
    if (!this.flow) return;
    // Collect all answers for ALL forms, only for enabled questions
    const answersPayload: { questionId: string; formId: string; value: unknown }[] = [];
    for (const ff of this.flow.flowForms) {
      for (const q of ff.form.questions) {
        if (this.isEnabled(q) && this.answers[q.id] !== undefined && this.answers[q.id] !== '') {
          answersPayload.push({ questionId: q.id, formId: ff.formId, value: this.answers[q.id] });
        }
      }
    }
    this.submissionService.createSubmission({ flowId: this.flow.id, answers: answersPayload }).subscribe({
      next: () => this.submitted = true,
      error: () => this.error = 'Failed to save submission',
    });
  }
}
