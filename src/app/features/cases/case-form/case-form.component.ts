import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CaseService } from '../../../core/services/case.service';

@Component({
  selector: 'app-case-form',
  templateUrl: './case-form.component.html',
  styleUrls: ['./case-form.component.scss']
})
export class CaseFormComponent implements OnInit {
  caseForm: FormGroup;
  submitting = false;
  isEditMode = false;
  caseId: string | null = null;
  
  // Define platform modules directly in the component for now
  platformModules: string[] = [
    'Home',
    'Analytics',
    'Evaluations',
    'Playbooks',
    'Work',
    'My Space',
    'Administration'
  ];

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.caseForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.maxLength(500 * 5)]],  // Approx 5 chars per word
      platformModule: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    this.caseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.caseId;
    
    if (this.isEditMode && this.caseId) {
      this.loadCaseData(this.caseId);
    }
  }

  loadCaseData(id: string): void {
    this.caseService.getCase(id).subscribe({
      next: (caseData) => {
        // Populate the form with existing case data
        this.caseForm.patchValue({
          name: caseData.customerName,
          email: caseData.customerEmail || '',
          subject: caseData.title,
          description: caseData.description,
          platformModule: caseData.tags && caseData.tags.length > 0 ? caseData.tags[0] : ''
        });
      },
      error: (error) => {
        this.snackBar.open('Error loading case data', 'Close', {
          duration: 5000
        });
        console.error('Error loading case:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.caseForm.invalid) {
      this.markFormGroupTouched(this.caseForm);
      return;
    }

    this.submitting = true;
    const formValue = this.caseForm.value;
    
    if (this.isEditMode && this.caseId) {
      // Update existing case
      const updateData = {
        title: formValue.subject,
        description: formValue.description,
        customerName: formValue.name,
        updatedDate: new Date(),
        tags: [formValue.platformModule],
        customerEmail: formValue.email
      };
      
      this.caseService.updateCase(this.caseId, updateData).subscribe({
        next: (result) => {
          this.handleSuccess('Case updated successfully!');
        },
        error: (error) => {
          this.handleError('Error updating case. Please try again.');
          console.error('Error updating case:', error);
        }
      });
    } else {
      // Create new case
      const newCase = {
        title: formValue.subject,
        description: formValue.description,
        status: 'New' as 'New' | 'In Progress' | 'On Hold' | 'Resolved' | 'Closed',
        priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
        customerId: 'new-customer',
        customerName: formValue.name,
        createdDate: new Date(),
        updatedDate: new Date(),
        tags: [formValue.platformModule],
        customerEmail: formValue.email
      };
      
      this.caseService.createCase(newCase).subscribe({
        next: (result) => {
          this.handleSuccess('Case created successfully!');
        },
        error: (error) => {
          this.handleError('Error creating case. Please try again.');
          console.error('Error creating case:', error);
        }
      });
    }
  }

  private handleSuccess(message: string): void {
    this.submitting = false;
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
    this.router.navigate(['/cases']);
  }

  private handleError(message: string): void {
    this.submitting = false;
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Character count helpers
  getSubjectCharCount(): number {
    return this.caseForm.get('subject')?.value?.length || 0;
  }

  getDescriptionWordCount(): number {
    const description = this.caseForm.get('description')?.value || '';
    return description.trim() ? description.trim().split(/\s+/).length : 0;
  }

  // Form validation helpers
  getErrorMessage(controlName: string): string {
    const control = this.caseForm.get(controlName);
    
    if (!control || !control.errors) {
      return '';
    }
    
    if (control.errors['required']) {
      return 'This field is required';
    }
    
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    
    if (control.errors['maxlength']) {
      if (controlName === 'subject') {
        return `Subject cannot exceed 150 characters`;
      } else if (controlName === 'description') {
        return `Description cannot exceed 500 words`;
      }
    }
    
    return 'Invalid input';
  }
}
