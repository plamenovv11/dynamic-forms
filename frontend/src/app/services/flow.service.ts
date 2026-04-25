import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flow } from '../models/models';

const BASE = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class FlowService {
  constructor(private http: HttpClient) {}

  getFlows(): Observable<Flow[]> {
    return this.http.get<Flow[]>(`${BASE}/flows`);
  }

  getFlow(id: string): Observable<Flow> {
    return this.http.get<Flow>(`${BASE}/flows/${id}`);
  }

  createFlow(data: { title: string; description?: string; formIds: string[] }): Observable<Flow> {
    return this.http.post<Flow>(`${BASE}/flows`, data);
  }

  updateFlow(id: string, data: { title: string; description?: string; formIds: string[] }): Observable<Flow> {
    return this.http.put<Flow>(`${BASE}/flows/${id}`, data);
  }

  deleteFlow(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/flows/${id}`);
  }
}
