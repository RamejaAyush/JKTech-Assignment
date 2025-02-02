import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  isLoggedIn(): Observable<boolean> {
    return this.http
      .get<{ status: boolean; user?: any }>(`${this.apiUrl}/auth/mine`, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => response.status && !!response.user),
        catchError(() => of(false))
      );
  }

  logout(): void {
    this.http
      .get(`${this.apiUrl}/auth/logout`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          console.log('Logged out successfully', res);
        },
        error: (err) => {
          console.error('Logout error', err);
        },
      });
  }
}
