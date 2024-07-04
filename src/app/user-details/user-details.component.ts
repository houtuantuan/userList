import { Component } from '@angular/core';
import { User } from '../models/user-model';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '../user-api.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  user: User | undefined;

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
          this.user = data;
        },
        error: (error: any) => {
          console.error('Error fetching user details', error);
        }
      });
    }
  }
}
