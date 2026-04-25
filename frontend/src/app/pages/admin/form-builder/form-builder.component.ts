import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormService } from '../../../services/form.service';
import { Form, Question, QuestionType } from '../../../models/models';

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'TEXT', label: 'Freeform Text' },
  { value: 'YES_NO', label: 'Yes / No' },
  { value: 'SELECT', label: 'Select (single)' },
  { value: 'MULTI_SELECT', label: 'Multi-Select' },
  { value: 'NUMBER', label: 'Number' },
];

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="flex-row items-center gap-1 mb-15">
        <a routerLink="/admin/forms" class="fd-button fd-button--compact">← Back</a>
        <h1 class="page-title m-0">{{form?.title || 'Form Builder'}}</h1>
      </div>

      <div *ngIf="error" class="text-danger mb-1">{{error}}</div>

      <!-- Form meta edit -->
      <div class="question-card mb-15">
        <h3 class="mt-0">Form Details</h3>
        <div class="fd-form-item mb-05">
          <label class="fd-form-label">Title *</label>
          <input class="fd-input" [(ngModel)]="title" />
        </div>
        <div class="fd-form-item mb-075">
          <label class="fd-form-label">Description</label>
          <input class="fd-input" [(ngModel)]="description" />
        </div>
        <button class="fd-button fd-button--emphasized" (click)="saveForm()">Save Details</button>
      </div>

      <!-- Questions -->
      <div class="action-bar">
        <h2 class="m-0 text-11">Questions</h2>
        <button class="fd-button fd-button--emphasized" (click)="startAddQuestion()">+ Add Question</button>
      </div>

      <div *ngIf="questions.length === 0" class="text-muted text-center p-2">
        No questions yet. Add your first question.
      </div>

      <div *ngFor="let q of questions; let i = index" class="question-card">
        <div *ngIf="editingId !== q.id">
          <div class="question-header">
            <div class="flex-1">
              <div class="font-semibold">{{i+1}}. {{q.label}}</div>
              <div class="flex-row gap-05 flex-wrap mt-03">
                <span class="tag">{{typeLabel(q.type)}}</span>
                <span *ngIf="q.options?.length" class="tag">{{q.options?.length}} options</span>
                <span *ngIf="(q.rulesAsSource?.length ?? 0) > 0" class="rule-badge">{{q.rulesAsSource?.length}} rule(s) →</span>
                <span *ngIf="(q.rulesAsTarget?.length ?? 0) > 0" class="rule-badge rule-target-badge">← {{q.rulesAsTarget?.length}} trigger(s)</span>
              </div>
              <div *ngIf="q.options?.length" class="text-08 text-muted-dark mt-03">
                Options: {{q.options?.join(', ')}}
              </div>
            </div>
            <div class="flex-row gap-05">
              <button class="fd-button fd-button--compact" (click)="startEdit(q)">Edit</button>
              <button class="fd-button fd-button--compact fd-button--negative" (click)="deleteQuestion(q.id)">Remove</button>
            </div>
          </div>
        </div>

        <!-- Inline editor -->
        <div *ngIf="editingId === q.id">
          <div class="fd-form-item mb-05">
            <label class="fd-form-label">Question label *</label>
            <input class="fd-input" [(ngModel)]="editLabel" />
          </div>
          <div class="fd-form-item mb-05">
            <label class="fd-form-label">Type</label>
            <select class="fd-select__control w-100 p-04" [(ngModel)]="editType" (ngModelChange)="onTypeChange()">
              <option *ngFor="let t of questionTypes" [value]="t.value">{{t.label}}</option>
            </select>
          </div>
          <div *ngIf="editType === 'SELECT' || editType === 'MULTI_SELECT'" class="mb-05">
            <label class="fd-form-label">Options</label>
            <div *ngFor="let opt of editOptions; let oi=index" class="option-row">
              <input class="fd-input flex-1" [(ngModel)]="editOptions[oi]" placeholder="Option {{oi+1}}" />
              <button class="fd-button fd-button--compact fd-button--negative" (click)="removeOption(oi)">×</button>
            </div>
            <button class="fd-button fd-button--compact mt-025" (click)="addOption()">+ Add option</button>
          </div>
          <div class="flex-row gap-05 mt-075">
            <button class="fd-button fd-button--emphasized" (click)="saveQuestion(q)">Save</button>
            <button class="fd-button" (click)="cancelEdit()">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Add new question inline -->
      <div *ngIf="addingNew" class="question-card new-question-box">
        <h4 class="mt-0">New Question</h4>
        <div class="fd-form-item mb-05">
          <label class="fd-form-label">Question label *</label>
          <input class="fd-input" [(ngModel)]="editLabel" placeholder="e.g. What is your name?" />
        </div>
        <div class="fd-form-item mb-05">
          <label class="fd-form-label">Type</label>
          <select class="fd-select__control w-100 p-04" [(ngModel)]="editType" (ngModelChange)="onTypeChange()">
            <option *ngFor="let t of questionTypes" [value]="t.value">{{t.label}}</option>
          </select>
        </div>
        <div *ngIf="editType === 'SELECT' || editType === 'MULTI_SELECT'" class="mb-05">
          <label class="fd-form-label">Options</label>
          <div *ngFor="let opt of editOptions; let oi=index" class="option-row">
            <input class="fd-input flex-1" [(ngModel)]="editOptions[oi]" placeholder="Option {{oi+1}}" />
            <button class="fd-button fd-button--compact fd-button--negative" (click)="removeOption(oi)">×</button>
          </div>
          <button class="fd-button fd-button--compact mt-025" (click)="addOption()">+ Add option</button>
        </div>
        <div class="flex-row gap-05 mt-075">
          <button class="fd-button fd-button--emphasized" (click)="saveNewQuestion()" [disabled]="!editLabel.trim()">Add Question</button>
          <button class="fd-button" (click)="cancelEdit()">Cancel</button>
        </div>
      </div>
    </div>
  `,
})
export class FormBuilderComponent implements OnInit {
  form: Form | null = null;
  questions: Question[] = [];
  title = '';
  description = '';
  error = '';
  editingId: string | null = null;
  addingNew = false;
  editLabel = '';
  editType: QuestionType = 'TEXT';
  editOptions: string[] = [];
  questionTypes = QUESTION_TYPES;

  constructor(private route: ActivatedRoute, private router: Router, private formService: FormService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.loadForm(id);
    }
  }

  loadForm(id: string) {
    this.formService.getForm(id).subscribe({
      next: (f) => {
        this.form = f;
        this.title = f.title;
        this.description = f.description ?? '';
        this.questions = f.questions;
      },
      error: () => this.error = 'Failed to load form',
    });
  }

  saveForm() {
    if (!this.title.trim()) return;
    const data = { title: this.title.trim(), description: this.description.trim() || undefined };
    if (this.form) {
      this.formService.updateForm(this.form.id, data).subscribe({
        next: (f) => { this.form = { ...this.form!, ...f }; },
        error: () => this.error = 'Save failed',
      });
    }
  }

  typeLabel(t: QuestionType) {
    return QUESTION_TYPES.find(x => x.value === t)?.label ?? t;
  }

  startEdit(q: Question) {
    this.editingId = q.id;
    this.addingNew = false;
    this.editLabel = q.label;
    this.editType = q.type;
    this.editOptions = q.options ? [...q.options] : [];
  }

  startAddQuestion() {
    this.addingNew = true;
    this.editingId = null;
    this.editLabel = '';
    this.editType = 'TEXT';
    this.editOptions = [];
  }

  cancelEdit() {
    this.editingId = null;
    this.addingNew = false;
  }

  onTypeChange() {
    if (this.editType !== 'SELECT' && this.editType !== 'MULTI_SELECT') {
      this.editOptions = [];
    }
  }

  addOption() { this.editOptions.push(''); }
  removeOption(i: number) { this.editOptions.splice(i, 1); }

  saveQuestion(q: Question) {
    const payload: Partial<Question> = {
      label: this.editLabel,
      type: this.editType,
      options: this.editOptions.length ? this.editOptions.filter(o => o.trim()) : null,
    };
    this.formService.updateQuestion(q.id, payload).subscribe({
      next: (updated) => {
        const idx = this.questions.findIndex(x => x.id === q.id);
        if (idx >= 0) this.questions[idx] = { ...this.questions[idx], ...updated };
        this.editingId = null;
        // Reload to get fresh rule counts
        this.loadForm(this.form!.id);
      },
      error: () => this.error = 'Update failed',
    });
  }

  saveNewQuestion() {
    if (!this.editLabel.trim() || !this.form) return;
    const payload: Partial<Question> = {
      label: this.editLabel.trim(),
      type: this.editType,
      options: this.editOptions.length ? this.editOptions.filter(o => o.trim()) : null,
    };
    this.formService.addQuestion(this.form.id, payload).subscribe({
      next: () => { this.addingNew = false; this.loadForm(this.form!.id); },
      error: () => this.error = 'Failed to add question',
    });
  }

  deleteQuestion(id: string) {
    if (!confirm('Remove this question? Existing answers will be preserved.')) return;
    this.formService.deleteQuestion(id).subscribe({
      next: () => this.questions = this.questions.filter(q => q.id !== id),
      error: () => this.error = 'Failed to remove question',
    });
  }
}
