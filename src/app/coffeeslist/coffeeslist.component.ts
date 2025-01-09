import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AddProductModalComponent } from '../components/add-product-modal/add-product-modal.component';
import { ModalController } from '@ionic/angular';
import { Expense, Product, ProductService } from '../services/product.service';
import { AuthService } from '../services/auth-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-coffeeslist',
  templateUrl: './coffeeslist.component.html',
  styleUrls: ['./coffeeslist.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  standalone: true
})




export class CoffeeslistComponent implements OnInit {

  expenses: Expense[] = []; // List of expenses
  newExpenseName: string = ''; // Name of the new expense
  newExpenseAmount: number=0; // Amount of the new expense
  products: Product[] = [];
  userEmail: string | null = null;
  newProduct: Product = {
    _id : '',
    name: '',
    price: 0,
    quantity : 0
  };
 // Load all products
 loadProducts() {
  this.productService.getProducts().subscribe(
    (data) => {

      console.log(data)
      this.products = data;
    },
    (error) => {
      console.error('Error fetching products:', error);
    }
  );
}

 // Load all products
 loadExpenses() {
  this.productService.getExpenses().subscribe(
    (data) => {

     
      this.expenses = data;
      console.log("expenses",this.expenses)
    },
    (error) => {
      console.error('Error fetching products:', error);
    }
  );
}

deleteProductfrom(productId: string) {
 this.productService.deleteProduct(productId).subscribe(
  (data) => {

    this.products = this.products.filter((product) => product._id !== productId);
    console.log(data)
   
  
  },
  (error) => {
    console.error('Error deleting products:', error);
  }

 )
}


 // Add expense to the list and backend
 addExpense(name: string, amount: number): void {
  if (name.trim() && amount > 0) {
    const expense: Expense = {
      name: name.trim(), amount,
      _id: ''
    };

    // Add expense to the local list
    this.expenses.push(expense);

    // Call service to persist expense to backend
    this.productService.createExpense(expense).subscribe(
      (data) => {
        console.log('Expense created:', data);
      },
      (error) => {
        console.error('Error adding expense:', error);
      }
    );

    // Reset input fields
    this.newExpenseName = '';
    this.newExpenseAmount = 0;
  } else {
    console.warn('Invalid expense details');
  }
}
getExpensesTotal(): number {
  return this.expenses.reduce((sum, expense) => sum + expense.amount, 0); // Total expenses
}

getNetTotal(): number {
  return this.getTotalPrice() - this.getExpensesTotal(); // Subtract expenses from total price
}

 // Delete a product
 deleteProduct(id: string) {
  this.productService.deleteProduct(id).subscribe(
    () => {
      this.products = this.products.filter(product => product._id !== id);
    },
    (error) => {
      console.error('Error deleting product:', error);
    }
  );
}///test
deleteExpense(id: string) {
  this.productService.deleteExpense(id).subscribe(
    () => {
      this.expenses = this.expenses.filter(expense => expense._id !== id);
    },
    (error) => {
      console.error('Error deleting product:', error);
    }
  );
}

async openAddProductModal() {
  const modal = await this.modalController.create({
    component: AddProductModalComponent,
  });

  // Handle the modal's result
  modal.onDidDismiss().then((result) => {
    console.log(result);
    if (result.data) {
      const product = { ...result.data, quantity: 1 };

      // Add the product and fetch its ID
      this.addProduct(product);
    }
  });

  await modal.present();
}

addProduct(productData: any) {
  if (productData.name !== '' && productData.price > 0) {
    // Call the service to create the product
    this.productService.createProduct(productData).subscribe(
      (createdProduct) => {
        // Assuming the backend returns the created product with its ID
        console.log('Product created:', createdProduct);

        // Push the new product with its fetched ID to the product list
        this.products.push({ ...createdProduct, quantity: 1 });

        // Reset the form
        this.newProduct = { _id: '', name: '', price: 0, quantity: 0 };
      },
      (error) => {
        console.error('Error creating product:', error);
      }
    );
  } else {
    console.error('Invalid product details');
  }
}



  constructor(private modalController: ModalController,private productService:ProductService,private authService:AuthService,private router:Router) {}

  increment(product: Product) {
    product.quantity++;

    console.log(product._id)
    this.productService.updateQuantity(product._id, product.quantity).subscribe(
      () => {
        console.log('Quantity incremented successfully');
      },
      (error) => {
        console.error('Error incrementing quantity:', error);
      }
    );
  }
  
  decrement(product: Product) {
    if (product.quantity > 0) {
      product.quantity--;
      this.productService.updateQuantity(product._id, product.quantity).subscribe(
        () => {
          console.log('Quantity decremented successfully');
        },
        (error) => {
          console.error('Error decrementing quantity:', error);
        }
      );
    }
  }
// Close the modal without adding a product
dismiss() {
  this.modalController.dismiss();
}



  getTotalPrice(): number {

    return this.products.reduce((sum, product) => sum + product.quantity * product.price, 0);

  }

  submitSales() {
    const salesData = {
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      email: this.userEmail,
      products: this.products.map(product => ({
        productId: product._id,
        name: product.name,
        quantity: product.quantity,
        price: product.price
      })),
      expenses: this.expenses.map(expense => ({
        expenseId: expense._id,
        name: expense.name,
        amount: expense.amount
    
      }))
    };
  
    this.productService.recordDailySales(salesData).subscribe(
      () => {
        console.log('Sales recorded successfully');
        // Optionally, clear the product list or reset quantities
        this.products.forEach(product => (product.quantity = 0));
       // Clear expenses from frontend
      this.expenses = [];
      },
      (error) => {
        console.error('Error recording sales:', error);
      }
    );
  }

  loadSales(date: string) {
    this.productService.getDailySales(date).subscribe(
      (sales) => {
        console.log('Sales data:', sales);
      },
      (error) => {
        console.error('Error fetching sales data:', error);
      }
    );
  }
  

  
  ngOnInit() {

    
    this.loadProducts();
    this.loadExpenses();
    this.authService.getCurrentUserEmail().subscribe((email) => {
      this.userEmail = email;
    });
  }

  logout() {
   this.authService.logout()
   this.router.navigate(['/login']);
  }
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(today.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
  
}
