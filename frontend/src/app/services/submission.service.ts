import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Submission } from '../models/models';

const BASE = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  constructor(private http: HttpClient) {}

  getSubmissions(): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${BASE}/submissions`);
  }

  createSubmission(data: {
    flowId: string;
    answers: { questionId: string; formId: string; value: unknown }[];
  }): Observable<Submission> {
    return this.http.post<Submission>(`${BASE}/submissions`, data);
  }
}
