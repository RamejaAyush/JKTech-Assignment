import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private storage: Storage | null = null;
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = window.sessionStorage;
    }
    const token = this.getToken();
    console.log('AuthService: initial token', token);
    this.loggedInSubject.next(!!token);
  }

  getToken(): string | null {
    if (this.storage) {
      const token = this.storage.getItem('token');
      console.log('AuthService.getToken():', token);
      return token;
    }
    return null;
  }

  setToken(token: string): void {
    if (this.storage) {
      this.storage.setItem('token', token);
      console.log('AuthService.setToken() called with:', token);
      this.loggedInSubject.next(true);
    }
  }

  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      console.log('AuthService.isLoggedIn(): no token found');
      this.loggedInSubject.next(false);
      return of(false);
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<{ status: boolean; user?: any }>(`${this.apiUrl}/auth/mine`, {
        headers,
      })
      .pipe(
        map((response) => {
          const loggedIn = response.status && !!response.user;
          console.log('AuthService.isLoggedIn() API returned:', loggedIn);
          this.loggedInSubject.next(loggedIn);
          return loggedIn;
        }),
        catchError((error) => {
          console.error('AuthService.isLoggedIn() error:', error);
          this.loggedInSubject.next(false);
          return of(false);
        })
      );
  }

  logout(): void {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get(`${this.apiUrl}/auth/logout`, { headers }).subscribe({
      next: () => {
        if (this.storage) {
          this.storage.removeItem('token');
        }
        console.log('AuthService.logout(): token removed');
        this.loggedInSubject.next(false);
      },
      error: (err) => {
        console.error('Logout error', err);
      },
    });
  }
}
