import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth-service.service';
import { PdfserviceService } from '../services/pdfservice.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [FormsModule,CommonModule,IonicModule]
})
export class Tab2Page implements OnInit{

  selectedDate: string = '';
  salesData: any | null = null;
  isLoading: boolean = false;

  userEmail : string | null = null;
  constructor(private productService: ProductService,private authService:AuthService,private pdfService:PdfserviceService) {}
  ngOnInit(): void {
    this.authService.getCurrentUserEmail().subscribe((email) => {
      this.userEmail = email;
    });
  }

  loadSales() {
    if (!this.selectedDate) {
      alert('Please select a date!');
      return;
    }

    this.isLoading = true;
    const formattedDate = this.selectedDate.split('T')[0]; // Extract the date part

    this.productService.getDailySales(formattedDate).subscribe(
      (sales) => {
        console.log("sales data " , sales)
        this.salesData = sales;
        this.isLoading = false;
        this.getTotalExpenses();
      },
      (error) => {
        console.error('Error fetching sales data:', error);
        this.salesData = null;
        this.isLoading = false;
        alert('No sales data found for the selected date.');
      }
    );
  }
  getTotalExpenses(): number {
    // Check if salesData and expenses exist before proceeding
    if (this.salesData && this.salesData.expenses) {
      return this.salesData.expenses.reduce(
        (sum: number, expense: any) => sum + (expense.amount || 0),
        0 // Initial value for the sum
      );
    }
    return 0; // Default return value if expenses is null or undefined
  }
  

  downloadPdf() {
    this.pdfService.downloadPdf().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'daySalesReport.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
