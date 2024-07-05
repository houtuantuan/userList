import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../user-api.service';
import { User } from '../models/user-model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Column {
  key: string;
  label: string;
  clickable: boolean
}
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule,CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  displayedColumns: Column[] = [{ key: 'email', label: 'E-Mail', clickable: true },
  { key: 'name', label: 'Name', clickable: false }

  ];
  dataSource = new MatTableDataSource<User>;

  constructor(private userService: UserApiService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.dataSource.data = data;
        console.log(this.dataSource.data)
      },
      error: (error: any) => {
        console.error('Error fetching users', error);
      },
      complete: () => {
        console.log('User fetching complete');
      }
    });

  }
  get displayedColumnKeys(): string[] {
    return this.displayedColumns.map(column => column.key);
  }
  public onUserSelect(id: number): void {
    this.router.navigateByUrl(`/users/${id}`);
  }
}

