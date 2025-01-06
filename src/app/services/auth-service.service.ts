import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode correctly
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);
  private userEmail = new BehaviorSubject<string | null>(null);

  private apiUrl = environment.apiUrl + '/api'; // Base API URL

  constructor(private http: HttpClient) {
    // Restore authentication state on service initialization
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); // Retrieve email from localStorage
    if (token && email && this.isAuthenticated()) {
      this.userEmail.next(email); // Restore the user's email
      this.authStatus.next(true); // Set auth status to true
    }
  }

  register(email: string, password: string) {
    return this.http.post(this.apiUrl + '/register', { email, password });
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(this.apiUrl + '/login', { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token); // Store token
          localStorage.setItem('email', email);          // Store email
          this.userEmail.next(email);                    // Update BehaviorSubject
          this.authStatus.next(true);                    // Update auth status
        })
      );
  }

  setAuthStatus(status: boolean) {
    this.authStatus.next(status);
  }

  getCurrentUserEmail() {
    return this.userEmail.asObservable();
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(new Date().getTime() / 1000);
      return decodedToken.exp > currentTime; // Check if token is expired
    }
    return false;
  }

  logout() {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('email'); // Remove email
    this.userEmail.next(null);       // Reset user email
    this.authStatus.next(false);     // Update auth status to logged out
  }
}
