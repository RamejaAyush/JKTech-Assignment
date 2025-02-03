import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
    this.loggedInSubject.next(!!token);
  }

  getToken(): string | null {
    if (this.storage) {
      const token = this.storage.getItem('token');
      return token;
    }
    return null;
  }

  setToken(token: string): void {
    if (this.storage) {
      this.storage.setItem('token', token);
      this.loggedInSubject.next(true);
    }
  }

  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.loggedInSubject.next(false);
      return of(false);
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<{ status: boolean; user?: any }>(`/auth/mine`, {
        headers,
      })
      .pipe(
        map((response) => {
          const loggedIn = response.status && !!response.user;
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

  logout(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`/auth/logout`, { headers }).pipe(
      tap(() => {
        if (this.storage) {
          this.storage.removeItem('token');
        }
        this.loggedInSubject.next(false);
        window.location.reload();
      }),
      catchError((error) => {
        console.error('Logout error', error);
        this.storage?.removeItem('token');
        this.loggedInSubject.next(false);
        return of(error);
      })
    );
  }
}
