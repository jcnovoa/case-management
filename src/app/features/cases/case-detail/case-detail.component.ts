import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Case } from '../../../core/models/case.model';
import { CaseService } from '../../../core/services/case.service';

@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.component.html',
  styleUrls: ['./case-detail.component.scss']
})
export class CaseDetailComponent implements OnInit {
  case: Case | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caseService: CaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCase();
  }

  loadCase(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.handleError('Case ID not found');
      return;
    }

    this.caseService.getCase(id).subscribe({
      next: (caseData) => {
        this.case = caseData;
        this.loading = false;
      },
      error: (error) => {
        this.handleError('Error loading case details');
        console.error('Error loading case:', error);
      }
    });
  }

  editCase(): void {
    if (this.case) {
      this.router.navigate(['/cases', this.case.id, 'edit']);
    }
  }

  deleteCase(): void {
    if (!this.case) return;

    if (confirm('Are you sure you want to delete this case?')) {
      this.caseService.deleteCase(this.case.id).subscribe({
        next: () => {
          this.snackBar.open('Case deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/cases']);
        },
        error: (error) => {
          this.snackBar.open('Error deleting case', 'Close', {
            duration: 5000
          });
          console.error('Error deleting case:', error);
        }
      });
    }
  }

  private handleError(message: string): void {
    this.error = true;
    this.loading = false;
    this.snackBar.open(message, 'Close', {
      duration: 5000
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getPriorityClass(priority: string): string {
    return priority.toLowerCase();
  }
}
