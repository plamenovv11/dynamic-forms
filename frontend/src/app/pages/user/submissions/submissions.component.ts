import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmissionService } from '../../../services/submission.service';
import { Submission, Answer } from '../../../models/models';

@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submissions.component.html',
})
export class SubmissionsComponent implements OnInit {
  submissions: Submission[] = [];
  error = '';

  constructor(private submissionService: SubmissionService) {}

  ngOnInit() {
    this.submissionService.getSubmissions().subscribe({
      next: (s) => this.submissions = s,
      error: () => this.error = 'Failed to load submissions',
    });
  }

  getFormIds(answers: Answer[]): string[] {
    return [...new Set(answers.map(a => a.formId))];
  }

  answersForForm(answers: Answer[], formId: string): Answer[] {
    return answers.filter(a => a.formId === formId);
  }

  isArray(v: unknown): boolean { return Array.isArray(v); }
  asArray(v: unknown): string[] { return v as string[]; }
}
