import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
// Define the Product interface
export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Expense {
  _id : string,
  name:string ;
  amount: number ;
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl+'/products'; // Base API URL

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Get a single product by ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Create a new product
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Update an existing product
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // Delete a product
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateQuantity(id: string, quantity: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, { quantity });
  }

  

  recordDailySales(salesData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/sales`, salesData);
  }
  
  getDailySales(date: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/sales?date=${date}`);
  }

 // Create a new product
 createExpense(expense: Expense): Observable<Expense> {
  return this.http.post<Expense>(`${environment.apiUrl}/expense`, expense);
}

  // Get all products
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${environment.apiUrl}/expenses`);
  }

  // Reset an expense (set quantity and amount to 0)
resetExpense(id: string): Observable<Expense> {
  return this.http.patch<Expense>(`${environment.apiUrl}/expenses/${id}`, { quantity: 0, amount: 0 });
}

deleteExpense(id: string): Observable<void> {
   return this.http.delete<void>(`${environment.apiUrl}/expenses/${id}`);
}
  

  
}
