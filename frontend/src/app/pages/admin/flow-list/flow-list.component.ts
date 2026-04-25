import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlowService } from '../../../services/flow.service';
import { FormService } from '../../../services/form.service';
import { Flow, Form } from '../../../models/models';

@Component({
  selector: 'app-flow-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="action-bar">
        <h1 class="page-title" style="margin:0">Flows</h1>
        <a routerLink="/admin/flows/new" class="fd-button fd-button--emphasized">+ New Flow</a>
      </div>
      <div *ngIf="error" style="color:red;margin-bottom:1rem">{{error}}</div>
      <div *ngIf="flows.length === 0" style="color:#666;text-align:center;padding:3rem">
        No flows yet. Create your first flow.
      </div>
      <div class="form-grid">
        <div *ngFor="let fl of flows" class="question-card">
          <div class="question-header">
            <div>
              <strong>{{fl.title}}</strong>
              <div style="font-size:0.8rem;color:#666;margin-top:2px">{{fl.description}}</div>
              <div style="margin-top:0.4rem">
                <span class="tag">{{fl._count?.flowForms ?? 0}} forms</span>
              </div>
            </div>
            <div style="display:flex;gap:0.5rem">
              <a [routerLink]="['/admin/flows', fl.id]" class="fd-button fd-button--compact">Edit</a>
              <button class="fd-button fd-button--compact fd-button--negative" (click)="deleteFlow(fl.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FlowListComponent implements OnInit {
  flows: Flow[] = [];
  error = '';

  constructor(private flowService: FlowService) {}

  ngOnInit() { this.load(); }

  load() {
    this.flowService.getFlows().subscribe({
      next: (f) => this.flows = f,
      error: () => this.error = 'Failed to load flows',
    });
  }

  deleteFlow(id: string) {
    if (!confirm('Delete this flow?')) return;
    this.flowService.deleteFlow(id).subscribe({ next: () => this.load() });
  }
}
