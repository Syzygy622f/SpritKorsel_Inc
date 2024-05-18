import { Component, Inject, OnInit, inject } from '@angular/core';
import { product } from '../../models/Product';
import { CommonModule, DOCUMENT } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface ProductWithAmount extends product {
  quantity: number;
  totalPrice: number;
}

interface idAndAmount {
  id: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  productsArray: ProductWithAmount[] = [];
  product: ProductWithAmount | null = null;
  identifere: idAndAmount[] = [];
  http = inject(HttpClient);

  constructor(@Inject(DOCUMENT) private document: Document) {
    const localStorage = document.defaultView?.localStorage;
    if (localStorage) {
      // Retrieve the item from localStorage
      const itemstring = localStorage.getItem('ToCart');

      // Check if the item exists
      if (itemstring) {
        try {
          const itemObject = JSON.parse(itemstring);
          if (Array.isArray(itemObject)) {
            itemObject.forEach((item: idAndAmount) => {
              this.identifere.push({ id: item.id, quantity: item.quantity });
            });
          }
        } catch (error) {
          console.error('Error parsing item from localStorage:', error);
        }
      }
    }
  }

  async ngOnInit() {
    this.identifere.forEach(async (identity) => {
      const product = await this.getDetails(identity.id);
      const productWithAmount: ProductWithAmount = {
       ...product,
        quantity: identity.quantity,
        totalPrice: product.price * identity.quantity, // Calculate totalPrice here
      };
      this.productsArray.push(productWithAmount);
    });

    // Sum up all totalPrices after all products have been processed
    const totalSum = this.productsArray.reduce((sum, product) => sum + product.totalPrice, 0);
  }

  public async getDetails(id: number): Promise<product> {
    // Note the addition of : Promise<product> to indicate the return type
    try {
      const response = await firstValueFrom(
        this.http.get<product>(`https://localhost:7289/api/Customer/${id}`)
      );
      return response; // Return the response directly
    } catch (error) {
      console.error('Error fetching product details:', error);
      // Handle the error appropriately
      throw error; // Optionally, re-throw the error if you want to handle it outside this method
    }
  }
}
