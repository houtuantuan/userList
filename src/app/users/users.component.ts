import { Component, OnInit, signal } from '@angular/core';
import { UserApiService } from '../user-api.service';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Interface representing a column in the table.
 */
interface Column {
  key: string;
  label: string;
  clickable: boolean;
}

/**
 * UsersComponent displays a list of users in a table and allows navigation to user details.
 */
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  /**
   * Signal containing the list of users.
   */
  users = this.userService.users;

  /**
   * Columns to be displayed in the table.
   */
  displayedColumns: Column[] = [
    { key: 'email', label: 'E-Mail', clickable: true },
    { key: 'name', label: 'Name', clickable: false },
  ];

  constructor(private userService: UserApiService, private router: Router) {}

  /**
   * Angular lifecycle hook that is called after component initialization.
   */
  ngOnInit(): void {
    if (this.users().length === 0) {
      this.userService.getUsers();
    }
  }

  /**
   * Get the keys of the displayed columns.
   * @returns {string[]} Array of column keys.
   */
  get displayedColumnKeys(): string[] {
    return this.displayedColumns.map((column) => column.key);
  }

  /**
   * Handle user selection and navigate to user details.
   * @param {number} id - The ID of the selected user.
   */
  public onUserSelect(id: number): void {
    this.router.navigateByUrl(`/users/${id}`);
  }
}
