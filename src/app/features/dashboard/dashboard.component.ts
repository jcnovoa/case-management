import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  caseStats = {
    total: 42,
    new: 12,
    inProgress: 18,
    onHold: 5,
    resolved: 7
  };

  priorityStats = {
    critical: 3,
    high: 8,
    medium: 21,
    low: 10
  };

  recentCases = [
    { id: '1', title: 'Login Issue', status: 'New', priority: 'High', customer: 'Acme Corp' },
    { id: '2', title: 'Billing Question', status: 'In Progress', priority: 'Medium', customer: 'XYZ Industries' },
    { id: '3', title: 'Feature Request', status: 'On Hold', priority: 'Low', customer: 'Global Services Inc' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
