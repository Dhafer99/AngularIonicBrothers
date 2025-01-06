import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss'],
  standalone : true ,
  imports: [CommonModule, FormsModule, IonicModule],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddProductModalComponent {
  newProduct = { name: '', price: 0 };

  constructor(private modalController: ModalController) {}

  // Add the product and close the modal
  addProduct() {
   
    
      this.modalController.dismiss(this.newProduct);
   
  }

  // Close the modal without adding a product
  dismiss() {
    this.modalController.dismiss();
  }
}