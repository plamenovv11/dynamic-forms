import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RuleService } from '../../../services/rule.service';
import { FormService } from '../../../services/form.service';
import { Rule, Form, Question, QuestionType } from '../../../models/models';

@Component({
  selector: 'app-rule-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Rule Builder</h1>
      <p class="text-muted-dark mb-15">
        Rules enable questions dynamically. When a user answers a <strong>source question</strong> with a specific value,
        a <strong>target question</strong> becomes enabled — either on the same form or a subsequent form in the flow.
      </p>

      <div *ngIf="error" class="text-danger mb-1">{{error}}</div>
      <div *ngIf="saved" class="success-banner">✓ Rule created.</div>

      <!-- Create Rule -->
      <div class="question-card mb-2 bg-white">
        <h3 class="mt-0">Create New Rule</h3>

        <!-- Source -->
        <div class="grid-2">
          <div class="fd-form-item">
            <label class="fd-form-label">Source Form</label>
            <select class="fd-select__control w-100 p-04" [(ngModel)]="srcFormId" (ngModelChange)="onSrcFormChange()">
              <option value="">-- Select form --</option>
              <option *ngFor="let f of forms" [value]="f.id">{{f.title}}</option>
            </select>
          </div>
          <div class="fd-form-item">
            <label class="fd-form-label">Source Question</label>
            <select class="fd-select__control w-100 p-04" [(ngModel)]="srcQuestionId" (ngModelChange)="onSrcQuestionChange()" [disabled]="!srcFormId">
              <option value="">-- Select question --</option>
              <option *ngFor="let q of srcQuestions" [value]="q.id">{{q.label}}</option>
            </select>
          </div>
        </div>

        <!-- Condition value -->
        <div class="fd-form-item mb-075" *ngIf="srcQuestionId">
          <label class="fd-form-label">When answer equals *</label>
          <div *ngIf="srcQuestion?.type === 'YES_NO'">
            <select class="fd-select__control w-100 p-04" [(ngModel)]="conditionValue">
              <option value="">-- Select --</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div *ngIf="srcQuestion?.type === 'SELECT' || srcQuestion?.type === 'MULTI_SELECT'">
            <select class="fd-select__control w-100 p-04" [(ngModel)]="conditionValue">
              <option value="">-- Select option --</option>
              <option *ngFor="let opt of srcQuestion?.options" [value]="opt">{{opt}}</option>
            </select>
          </div>
          <div *ngIf="srcQuestion?.type === 'TEXT' || srcQuestion?.type === 'NUMBER'">
            <input class="fd-input w-100" [(ngModel)]="conditionValue" placeholder="Enter expected value" />
          </div>
        </div>

        <!-- Target -->
        <div class="grid-2 mb-1">
          <div class="fd-form-item">
            <label class="fd-form-label">Target Form</label>
            <select class="fd-select__control w-100 p-04" [(ngModel)]="tgtFormId" (ngModelChange)="onTgtFormChange()">
              <option value="">-- Select form --</option>
              <option *ngFor="let f of forms" [value]="f.id">{{f.title}}</option>
            </select>
          </div>
          <div class="fd-form-item">
            <label class="fd-form-label">Target Question (to enable)</label>
            <select class="fd-select__control w-100 p-04" [(ngModel)]="tgtQuestionId" [disabled]="!tgtFormId">
              <option value="">-- Select question --</option>
              <option *ngFor="let q of tgtQuestions" [value]="q.id">{{q.label}}</option>
            </select>
          </div>
        </div>

        <button class="fd-button fd-button--emphasized"
          (click)="createRule()"
          [disabled]="!srcQuestionId || !tgtQuestionId || !conditionValue">
          Create Rule
        </button>
      </div>

      <!-- Existing rules -->
      <h2 class="text-11 mb-075">Existing Rules ({{rules.length}})</h2>
      <div *ngIf="rules.length === 0" class="text-muted-light italic mb-1">No rules defined yet.</div>

      <div *ngFor="let r of rules" class="question-card bg-white">
        <div class="question-header">
          <div class="text-09">
            <div class="mb-03">
              <strong>IF</strong>
              <span class="tag mx-4px">{{r.sourceQuestion?.label}}</span>
              (form: <em>{{formTitle(r.sourceQuestion?.formId)}}</em>)
              <strong>= "{{r.conditionValue}}"</strong>
            </div>
            <div>
              <strong>THEN ENABLE</strong>
              <span class="tag mx-4px">{{r.targetQuestion?.label}}</span>
              (form: <em>{{formTitle(r.targetQuestion?.formId)}}</em>)
            </div>
          </div>
          <button class="fd-button fd-button--compact fd-button--negative" (click)="deleteRule(r.id)">Delete</button>
        </div>
      </div>
    </div>
  `,
})
export class RuleBuilderComponent implements OnInit {
  forms: Form[] = [];
  rules: Rule[] = [];
  srcFormId = '';
  srcQuestionId = '';
  tgtFormId = '';
  tgtQuestionId = '';
  conditionValue = '';
  error = '';
  saved = false;

  get srcQuestions(): Question[] {
    return this.forms.find(f => f.id === this.srcFormId)?.questions ?? [];
  }
  get tgtQuestions(): Question[] {
    return this.forms.find(f => f.id === this.tgtFormId)?.questions ?? [];
  }
  get srcQuestion(): Question | undefined {
    return this.srcQuestions.find(q => q.id === this.srcQuestionId);
  }

  constructor(private ruleService: RuleService, private formService: FormService) {}

  ngOnInit() {
    this.formService.getForms().subscribe(forms => {
      // Load each form fully (with questions)
      let loaded = 0;
      if (forms.length === 0) { this.forms = []; return; }
      forms.forEach(f => {
        this.formService.getForm(f.id).subscribe(full => {
          this.forms.push(full);
          if (++loaded === forms.length) {
            // Sort by creation order
            this.forms.sort((a, b) => a.title.localeCompare(b.title));
          }
        });
      });
    });
    this.loadRules();
  }

  loadRules() {
    this.ruleService.getRules().subscribe(r => this.rules = r);
  }

  formTitle(id?: string) {
    if (!id) return '?';
    return this.forms.find(f => f.id === id)?.title ?? id;
  }

  onSrcFormChange() { this.srcQuestionId = ''; this.conditionValue = ''; }
  onSrcQuestionChange() { this.conditionValue = ''; }
  onTgtFormChange() { this.tgtQuestionId = ''; }

  createRule() {
    if (!this.srcQuestionId || !this.tgtQuestionId || !this.conditionValue) return;
    this.ruleService.createRule({
      sourceQuestionId: this.srcQuestionId,
      targetQuestionId: this.tgtQuestionId,
      conditionValue: this.conditionValue,
    }).subscribe({
      next: () => {
        this.saved = true;
        setTimeout(() => this.saved = false, 3000);
        this.srcFormId = ''; this.srcQuestionId = ''; this.tgtFormId = ''; this.tgtQuestionId = ''; this.conditionValue = '';
        this.loadRules();
      },
      error: () => this.error = 'Failed to create rule',
    });
  }

  deleteRule(id: string) {
    if (!confirm('Delete this rule?')) return;
    this.ruleService.deleteRule(id).subscribe({ next: () => this.loadRules() });
  }
}
