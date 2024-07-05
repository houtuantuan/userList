import { Component, inject, signal } from '@angular/core';
import { User } from '../models/user-model';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '../user-api.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UserDetailDialogComponent } from '../dialog/user-detail-dialog/user-detail-dialog.component';
@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  user = signal<User | null>(null);
  readonly dialog = inject(MatDialog);

  constructor(
    private route: ActivatedRoute,
    private userService: UserApiService
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    console.log(`User ID from route: ${userId}`);
    if (userId) {
      this.userService.getUserById(+userId).subscribe({
        next: (data: User) => {
          this.user.set(data);
          console.log(this.user)
        },
        error: (error: any) => {
          console.error('Error fetching user details', error);
        }
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UserDetailDialogComponent, {
      data: this.user(),
      height:'50vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.user.set(result); // Update the signal with the new user data
        console.log('The dialog was closed with result:', result);
      }
    });
  }
}
