import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  
  platformModules = [
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
  }

  onSubmit(): void {
    if (this.caseForm.invalid) {
      this.markFormGroupTouched(this.caseForm);
      return;
    }

    this.submitting = true;
    const formValue = this.caseForm.value;
    
    // Create the case object
    const newCase = {
      title: formValue.subject,
      description: formValue.description,
      status: 'New',
      priority: 'Medium',
      customerId: 'new-customer',
      customerName: formValue.name,
      createdDate: new Date(),
      updatedDate: new Date(),
      tags: [formValue.platformModule],
      // Store additional info in a custom field
      customerEmail: formValue.email
    };

    this.caseService.createCase(newCase).subscribe({
      next: (result) => {
        this.submitting = false;
        this.snackBar.open('Case created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/cases']);
      },
      error: (error) => {
        this.submitting = false;
        this.snackBar.open('Error creating case. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        console.error('Error creating case:', error);
      }
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
