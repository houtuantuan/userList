import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user-model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserApiService } from '../../user-api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-detail-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCard,
    MatIcon,
  ],
  templateUrl: './user-detail-dialog.component.html',
  styleUrl: './user-detail-dialog.component.css',
})
export class UserDetailDialogComponent {
  public userForm: FormGroup;
  readonly dialogRef = inject(MatDialogRef<UserDetailDialogComponent>);
  private fb = inject(FormBuilder);
  private userService = inject(UserApiService);
  /**
   * Data passed into the dialog, representing the user to be edited.
   */
  public data = inject<User>(MAT_DIALOG_DATA);

  constructor() {
    this.userForm = this.createForm();
  }

  /**
   * Creates the form group for the user details form.
   * @returns {FormGroup} The form group instance.
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: [this.data.name, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      phone: [this.data.phone, Validators.required],
      address: this.fb.group({
        street: [this.data.address.street, Validators.required],
        suite: [this.data.address.suite, Validators.required],
        city: [this.data.address.city, Validators.required],
        zipcode: [this.data.address.zipcode, Validators.required],
      }),
    });
  }
  /**
   * Submits the form data and updates the user.
   * If the form is valid, the user data is updated via the UserApiService and the dialog is closed.
   */
  public onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser: User = { ...this.data, ...this.userForm.value };
      this.userService.updateUser(updatedUser).subscribe({
        next: (response) => {
          console.log('User updated successfully', response);
          this.dialogRef.close(updatedUser);
        },
        error: (error) => {
          console.error('Error updating user', error);
        },
      });
    }
  }

  /**
   * Closes the dialog without saving any changes.
   */
  public onNoClick(): void {
    this.dialogRef.close();
  }
}
