import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormService } from '../../../services/form.service';
import { Form } from '../../../models/models';

@Component({
  selector: 'app-form-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './form-list.component.html',
})
export class FormListComponent implements OnInit {
  forms: Form[] = [];
  loading = false;
  error = '';
  showCreate = false;
  newTitle = '';
  newDescription = '';

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.formService.getForms().subscribe({
      next: (f) => { this.forms = f; this.loading = false; },
      error: () => { this.error = 'Failed to load forms'; this.loading = false; },
    });
  }

  createForm() {
    if (!this.newTitle.trim()) return;
    this.formService.createForm({ title: this.newTitle.trim(), description: this.newDescription.trim() || undefined }).subscribe({
      next: () => { this.showCreate = false; this.newTitle = ''; this.newDescription = ''; this.load(); },
      error: () => { this.error = 'Failed to create form'; },
    });
  }

  deleteForm(id: string, e: Event) {
    e.stopPropagation();
    if (!confirm('Delete this form?')) return;
    this.formService.deleteForm(id).subscribe({ next: () => this.load() });
  }
}
