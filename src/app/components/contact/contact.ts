import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MagneticButtonDirective } from '../../directives/magnetic-button.directive';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MagneticButtonDirective
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  contactForm: FormGroup;
  isSending = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private emailService: EmailService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.contactForm.valid && !this.isSending) {
      this.isSending = true;

      try {
        const success = await this.emailService.sendEmail(this.contactForm.value);

        if (success) {
          this.snackBar.open('Message sent successfully! I\'ll get back to you soon.', 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
          this.contactForm.reset();
        } else {
          this.showError();
        }
      } catch {
        this.showError();
      } finally {
        this.isSending = false;
      }
    }
  }

  private showError(): void {
    this.snackBar.open(
      'Failed to send message. Please email me directly at khan.arshad3008@gmail.com',
      'Close',
      {
        duration: 8000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      }
    );
  }
}
