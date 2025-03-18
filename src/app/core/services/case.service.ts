import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Case } from '../models/case.model';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  // In a real application, this would be an API endpoint
  private apiUrl = 'api/cases';

  constructor(private http: HttpClient) { }

  // For demo purposes, we'll use mock data
  // In a real application, these methods would call the API
  getCases(): Observable<Case[]> {
    // This would be: return this.http.get<Case[]>(this.apiUrl);
    return of(this.getMockCases());
  }

  getCase(id: string): Observable<Case> {
    // This would be: return this.http.get<Case>(`${this.apiUrl}/${id}`);
    const cases = this.getMockCases();
    const foundCase = cases.find(c => c.id === id);
    return of(foundCase as Case);
  }

  createCase(caseData: Omit<Case, 'id'>): Observable<Case> {
    // This would be: return this.http.post<Case>(this.apiUrl, caseData);
    const newCase: Case = {
      ...caseData,
      id: this.generateId(),
      createdDate: new Date(),
      updatedDate: new Date()
    };
    return of(newCase);
  }

  updateCase(id: string, caseData: Partial<Case>): Observable<Case> {
    // This would be: return this.http.put<Case>(`${this.apiUrl}/${id}`, caseData);
    const cases = this.getMockCases();
    const index = cases.findIndex(c => c.id === id);
    if (index !== -1) {
      const updatedCase: Case = {
        ...cases[index],
        ...caseData,
        updatedDate: new Date()
      };
      cases[index] = updatedCase;
      return of(updatedCase);
    }
    throw new Error('Case not found');
  }

  deleteCase(id: string): Observable<void> {
    // This would be: return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(undefined);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private getMockCases(): Case[] {
    return [
      {
        id: '1',
        title: 'Login Issue',
        description: 'Customer cannot log into their account',
        status: 'New',
        priority: 'High',
        customerId: '101',
        customerName: 'Acme Corp',
        assignedTo: 'John Smith',
        createdDate: new Date('2025-03-15'),
        updatedDate: new Date('2025-03-15'),
        dueDate: new Date('2025-03-20'),
        tags: ['login', 'authentication']
      },
      {
        id: '2',
        title: 'Billing Question',
        description: 'Customer has questions about their recent invoice',
        status: 'In Progress',
        priority: 'Medium',
        customerId: '102',
        customerName: 'XYZ Industries',
        assignedTo: 'Jane Doe',
        createdDate: new Date('2025-03-14'),
        updatedDate: new Date('2025-03-16'),
        dueDate: new Date('2025-03-21'),
        tags: ['billing', 'invoice']
      },
      {
        id: '3',
        title: 'Feature Request',
        description: 'Customer requesting new reporting feature',
        status: 'On Hold',
        priority: 'Low',
        customerId: '103',
        customerName: 'Global Services Inc',
        createdDate: new Date('2025-03-10'),
        updatedDate: new Date('2025-03-12'),
        tags: ['feature', 'reporting']
      }
    ];
  }
}
