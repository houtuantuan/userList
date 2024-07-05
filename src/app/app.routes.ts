import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserDetailsComponent } from './user-details/user-details.component';

export const routes: Routes = [

    { path: '', component: UsersComponent },
    { path: 'users/:id', component: UserDetailsComponent },
];
