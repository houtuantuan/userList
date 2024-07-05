import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { BASE_API_URL } from './utils/constants';
import { User } from './models/user-model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${BASE_API_URL}/users`)
      .pipe(catchError(this.handleError));
  }

  getUserById(id: number): Observable<User> {
    return this.http
      .get<User>(`${BASE_API_URL}/users/${id}`)
      .pipe(catchError(this.handleError));
  }
  updateUser(user: User): Observable<User> {
    return this.http
      .put<User>(`${BASE_API_URL}/users/${user.id}`, user)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error));
  }
}
