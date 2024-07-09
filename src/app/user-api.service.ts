import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { BASE_API_URL, DEFAULT_USER } from './utils/constants';
import { User } from './models/user-model';

/**
 * Service to manage user data and state using signals.
 */
@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private usersSignal = signal<User[]>([]);

  private http = inject(HttpClient);

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
  public fetchUsers(): void {
    this.http
      .get<User[]>(`${BASE_API_URL}/users`)
      .pipe(catchError(this.handleError))
      .subscribe((users) => this.usersSignal.set(users));
  }

  /**
   * Find a user by ID from the users signal.
   * @param {number} id - The ID of the user to find.
   * @returns {Observable<User>} The user object if found, otherwise use default empty object.
   */
  public getUserById(id: number): Observable<User> {
    return of(this.usersSignal()).pipe(
      switchMap(users => {
        if (users.length === 0) {
          return this.http.get<User[]>(`${BASE_API_URL}/users`).pipe(
            map(fetchedUsers => {
              this.usersSignal.set(fetchedUsers);
              return fetchedUsers.find(u => u.id === id) || DEFAULT_USER;
            })
          );
        } else {
          return of(users.find(u => u.id === id) || DEFAULT_USER);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update a user both locally and on the server.
   * @param {User} user - The user object with updated data.
   * @returns {Observable<User>} Observable of the updated user.
   */
  public updateUser(user: User): Observable<User> {
    return this.http
      .put<User>(`${BASE_API_URL}/users/${user.id}`, user)
      .pipe(
        map(updatedUser => {
          const users = this.usersSignal();
          const index = users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            users[index] = updatedUser;
            this.usersSignal.set([...users]);
          }
          return updatedUser;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors.
   * @param {any} error - The error object.
   * @returns {Observable<never>} Observable that throws an error.
   */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error.message, error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
