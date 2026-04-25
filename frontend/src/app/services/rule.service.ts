import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rule } from '../models/models';

const BASE = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class RuleService {
  constructor(private http: HttpClient) {}

  getRules(): Observable<Rule[]> {
    return this.http.get<Rule[]>(`${BASE}/rules`);
  }

  createRule(data: { sourceQuestionId: string; targetQuestionId: string; conditionValue: string }): Observable<Rule> {
    return this.http.post<Rule>(`${BASE}/rules`, data);
  }

  deleteRule(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/rules/${id}`);
  }
}
