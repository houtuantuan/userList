import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { BASE_API_URL, DEFAULT_USER } from './utils/constants';
import { User } from './models/user-model';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

/**
 * Service to manage user data and state using signals.
 */
@Injectable({
  providedIn: 'root',
})
export class UserApiService {
   usersSignal = signal<User[]>([]);

  http = inject(HttpClient);

  /**
   * Get the current list of users.
   * @returns {Signal<User[]>} Signal containing the list of users.
   */
  get users(): Signal<User[]> {
     return this.usersSignal;
  }

  /**
   * Fetch users from the API and update the users signal.
   * @returns {void}
   */
  getUsers(): void{
    this.http
      .get<User[]>(`${BASE_API_URL}/users`)
      .pipe(catchError(this.handleError))
      .subscribe((users) => this.usersSignal.set(users));
  }
 
  /**
   * Find a user by ID from the users signal.
   * @param {number} id - The ID of the user to find.
   * @returns {User} The user object if found, otherwise use default empty object.
   */
  getUserById(id: number) {
    if (this.usersSignal().length === 0) {
      // Fetch users if the signal is empty, such as directly opening the user detail page without opening the overview page.
       return this.http.get<User[]>(`${BASE_API_URL}/users`).pipe(
         catchError(this.handleError),
        map((users) => {
           this.usersSignal.set(users);
          return users.find((u) => u.id === id) || DEFAULT_USER;
        })
       );
      
    } else {
      // Find user from the existing signal data
      const user = this.usersSignal().find((u) => u.id === id) || DEFAULT_USER;
      return of(user);
    }
  }

  /**
   * Update a user both locally and on the server.
   * @param {User} user - The user object with updated data.
   * @returns {Observable<User>} Observable of the updated user.
   */
  updateUser(user: User): Observable<User> {
    const users = this.usersSignal();
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      this.usersSignal.set([...users]);
    }
    return this.http
      .put<User>(`${BASE_API_URL}/users/${user.id}`, user)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle HTTP errors.
   * @param {any} error - The error object.
   * @returns {Observable<never>} Observable that throws an error.
   */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
