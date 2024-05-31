import { Component, Inject, OnInit, inject } from '@angular/core';
import { product } from '../../models/Product';
import { CommonModule, registerLocaleData } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import localeDa from '@angular/common/locales/da';
import { idAndAmount } from '../../models/IdAndAmount';

interface ProductWithAmount extends product {
  quantity: number;
  totalPrice: number;
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

  constructor() {
    const localStorage = document.defaultView?.localStorage;
    if (localStorage) {
      const itemString = localStorage.getItem('ToCart');

      if (itemString) {
        try {
          const itemObject = JSON.parse(itemString);
          if (Array.isArray(itemObject)) {
            itemObject.forEach((item: idAndAmount) => {
              this.identifere.push({ id: item.id, quantity: item.quantity });
            });
          }
        } catch (error) {
          console.error('Error parsing item from localStorage:', error);
        }
      }

      registerLocaleData(localeDa);
    }
  }

  async ngOnInit() {
    this.identifere.forEach(async (identity) => {
      const product = await this.getDetails(identity.id);
      const productWithAmount: ProductWithAmount = {
        ...product,
        quantity: identity.quantity,
        totalPrice: product.price * identity.quantity,
      };
      this.productsArray.push(productWithAmount);
    });

    const totalSum = this.productsArray.reduce(
      (sum, product) => sum + product.totalPrice,
      0
    );
  }

  public async getDetails(id: number): Promise<product> {
    try {
      const response = await firstValueFrom(
        this.http.get<product>(`https://localhost:7289/api/Customer/${id}`)
      );
      return response;
    } catch (error) {
      console.error('Error fetching product details:', error);

      throw error;
    }
  }

  public async removeitem(id: number) {
    let itemsString = localStorage.getItem('ToCart');
    if (itemsString) {
      const items = JSON.parse(itemsString);
      if (Array.isArray(items)) {
        const itemIdToRemove = id;
        const filteredItems = items.filter(
          (item) => item.id !== itemIdToRemove
        );
        localStorage.setItem('ToCart', JSON.stringify(filteredItems));
      }
    }
  }
}
