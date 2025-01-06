import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root'
})
export class PdfserviceService {

  constructor(private http: HttpClient) {}

  downloadPdf() {
    return this.http.get(environment.apiUrl+'/generate-pdf', {
      responseType: 'blob', // Important for handling files
    });
  }
}
