import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form, Question } from '../models/models';

const BASE = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class FormService {
  constructor(private http: HttpClient) {}

  getForms(): Observable<Form[]> {
    return this.http.get<Form[]>(`${BASE}/forms`);
  }

  getForm(id: string): Observable<Form> {
    return this.http.get<Form>(`${BASE}/forms/${id}`);
  }

  createForm(data: { title: string; description?: string }): Observable<Form> {
    return this.http.post<Form>(`${BASE}/forms`, data);
  }

  updateForm(id: string, data: { title: string; description?: string }): Observable<Form> {
    return this.http.put<Form>(`${BASE}/forms/${id}`, data);
  }

  deleteForm(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/forms/${id}`);
  }

  addQuestion(formId: string, data: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${BASE}/forms/${formId}/questions`, data);
  }

  updateQuestion(questionId: string, data: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${BASE}/forms/questions/${questionId}`, data);
  }

  deleteQuestion(questionId: string): Observable<Question> {
    return this.http.delete<Question>(`${BASE}/forms/questions/${questionId}`);
  }
}
