import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Case } from '../../../core/models/case.model';
import { CaseService } from '../../../core/services/case.service';

@Component({
  selector: 'app-cases-list',
  templateUrl: './cases-list.component.html',
  styleUrls: ['./cases-list.component.scss']
})
export class CasesListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'status', 'priority', 'customerName', 'createdDate', 'actions'];
  dataSource = new MatTableDataSource<Case>([]);
  statusFilter = new FormControl('');
  priorityFilter = new FormControl('');
  
  statusOptions = ['New', 'In Progress', 'On Hold', 'Resolved', 'Closed'];
  priorityOptions = ['Critical', 'High', 'Medium', 'Low'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private caseService: CaseService) { }

  ngOnInit(): void {
    this.loadCases();
    
    // Set up filtering
    this.statusFilter.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    
    this.priorityFilter.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCases(): void {
    this.caseService.getCases().subscribe(cases => {
      this.dataSource.data = cases;
    });
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = (data: Case, filter: string) => {
      const statusMatch = !this.statusFilter.value || data.status === this.statusFilter.value;
      const priorityMatch = !this.priorityFilter.value || data.priority === this.priorityFilter.value;
      return statusMatch && priorityMatch;
    };
    
    // Trigger filter
    this.dataSource.filter = Math.random().toString();
  }

  applySearchFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters(): void {
    this.statusFilter.setValue('');
    this.priorityFilter.setValue('');
    this.dataSource.filter = '';
  }
}
