import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../user-api.service';
import { User } from '../models/user-model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

interface Column {
  key: string;
  label: string;
}
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  displayedColumns: Column[] = [{ key: 'email', label: 'E-Mail' },
  { key: 'name', label: 'Name' }

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

