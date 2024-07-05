import { Component, inject, Inject } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
@Component({
  selector: 'app-user-detail-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,MatButtonModule,MatCard
  ],
  templateUrl: './user-detail-dialog.component.html',
  styleUrl: './user-detail-dialog.component.css',
})
export class UserDetailDialogComponent {
  userForm: FormGroup;
  readonly dialogRef = inject(MatDialogRef<UserDetailDialogComponent>);
  data = inject<User>(MAT_DIALOG_DATA);

  constructor(private fb: FormBuilder, private userService: UserApiService) {
    this.userForm = this.fb.group({
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
  onSubmit(): void {
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
  onNoClick(): void {
    this.dialogRef.close();
  }
}
