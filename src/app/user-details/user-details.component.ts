import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserApiService } from '../user-api.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserDetailDialogComponent } from '../dialog/user-detail-dialog/user-detail-dialog.component';
import { User } from '../models/user-model';
import { DEFAULT_USER } from '../utils/constants';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {
  user: User = DEFAULT_USER;

  /**
   * Instance of MatDialog used to open dialog components.
   */
  readonly dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  userService = inject(UserApiService);
  router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(+userId);
    }
  }

  /**
   * Loads the user data based on the user ID.
   * @param userId - The ID of the user to load.
   */
  loadUser(userId: number): void {
    this.userService.getUserById(userId).subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Opens the dialog to edit user details.
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(UserDetailDialogComponent, {
      data: this.user,
      height: 'fit-content',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.user = result; // Update the signal with the new user data
      }
    });
  }

  /**
   * Navigates back to the user list.
   */
  goBackToList(): void {
    this.router.navigate(['/']);
  }
}
