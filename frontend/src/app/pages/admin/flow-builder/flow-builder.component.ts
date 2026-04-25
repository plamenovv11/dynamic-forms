import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlowService } from '../../../services/flow.service';
import { FormService } from '../../../services/form.service';
import { Flow, Form } from '../../../models/models';

@Component({
  selector: 'app-flow-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="flex-row items-center gap-1 mb-15">
        <a routerLink="/admin/flows" class="fd-button fd-button--compact">← Back</a>
        <h1 class="page-title m-0">{{isNew ? 'Create Flow' : 'Edit Flow'}}</h1>
      </div>

      <div *ngIf="error" class="text-danger mb-1">{{error}}</div>
      <div *ngIf="saved" class="success-banner">✓ Flow saved successfully.</div>

      <!-- Flow metadata -->
      <div class="question-card mb-15">
        <div class="fd-form-item mb-05">
          <label class="fd-form-label">Flow Title *</label>
          <input class="fd-input" [(ngModel)]="title" placeholder="e.g. Customer Onboarding" />
        </div>
        <div class="fd-form-item">
          <label class="fd-form-label">Description</label>
          <input class="fd-input" [(ngModel)]="description" placeholder="Optional description" />
        </div>
      </div>

      <!-- Form ordering -->
      <h2 class="text-11 mb-075">Forms in this Flow (in order)</h2>
      <p class="text-muted-dark text-0875 mb-1">
        Select forms and arrange their order. Users will fill them sequentially.
      </p>

      <!-- Selected forms (ordered) -->
      <div *ngFor="let fId of selectedFormIds; let i=index" class="flow-step bg-white border-ccc rounded-8 mb-05 p-075">
        <span class="step-number">{{i+1}}</span>
        <div class="flex-1">
          <strong>{{formTitle(fId)}}</strong>
        </div>
        <div class="flex-row gap-05">
          <button class="fd-button fd-button--compact" [disabled]="i===0" (click)="moveUp(i)">↑</button>
          <button class="fd-button fd-button--compact" [disabled]="i===selectedFormIds.length-1" (click)="moveDown(i)">↓</button>
          <button class="fd-button fd-button--compact fd-button--negative" (click)="removeForm(i)">×</button>
        </div>
      </div>

      <div *ngIf="selectedFormIds.length === 0" class="text-muted-light italic mb-1">No forms added yet.</div>

      <!-- Add a form -->
      <div class="flex-row gap-05 mb-15 flex-wrap">
        <select class="fd-select__control p-04 min-w-220" [(ngModel)]="formToAdd">
          <option value="">-- Select a form to add --</option>
          <option *ngFor="let f of availableForms" [value]="f.id">{{f.title}}</option>
        </select>
        <button class="fd-button" (click)="addForm()" [disabled]="!formToAdd">+ Add Form</button>
      </div>

      <div class="flex-row gap-05">
        <button class="fd-button fd-button--emphasized" (click)="save()" [disabled]="!title.trim()">
          {{isNew ? 'Create Flow' : 'Save Changes'}}
        </button>
        <a routerLink="/admin/flows" class="fd-button">Cancel</a>
      </div>
    </div>
  `,
})
export class FlowBuilderComponent implements OnInit {
  flow: Flow | null = null;
  allForms: Form[] = [];
  selectedFormIds: string[] = [];
  title = '';
  description = '';
  formToAdd = '';
  error = '';
  saved = false;
  isNew = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flowService: FlowService,
    private formService: FormService,
  ) {}

  ngOnInit() {
    this.formService.getForms().subscribe(f => this.allForms = f);
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isNew = false;
      this.flowService.getFlow(id).subscribe({
        next: (fl) => {
          this.flow = fl;
          this.title = fl.title;
          this.description = fl.description ?? '';
          this.selectedFormIds = fl.flowForms.map(ff => ff.formId);
        },
        error: () => this.error = 'Failed to load flow',
      });
    }
  }

  get availableForms() {
    return this.allForms.filter(f => !this.selectedFormIds.includes(f.id));
  }

  formTitle(id: string) {
    return this.allForms.find(f => f.id === id)?.title ?? id;
  }

  addForm() {
    if (!this.formToAdd) return;
    this.selectedFormIds.push(this.formToAdd);
    this.formToAdd = '';
  }

  removeForm(i: number) { this.selectedFormIds.splice(i, 1); }
  moveUp(i: number) { [this.selectedFormIds[i-1], this.selectedFormIds[i]] = [this.selectedFormIds[i], this.selectedFormIds[i-1]]; }
  moveDown(i: number) { [this.selectedFormIds[i+1], this.selectedFormIds[i]] = [this.selectedFormIds[i], this.selectedFormIds[i+1]]; }

  save() {
    const data = { title: this.title.trim(), description: this.description.trim() || undefined, formIds: this.selectedFormIds };
    if (this.isNew) {
      this.flowService.createFlow(data).subscribe({
        next: (fl) => this.router.navigate(['/admin/flows', fl.id]),
        error: () => this.error = 'Failed to create flow',
      });
    } else {
      this.flowService.updateFlow(this.flow!.id, data).subscribe({
        next: () => { this.saved = true; setTimeout(() => this.saved = false, 3000); },
        error: () => this.error = 'Failed to save flow',
      });
    }
  }
}
