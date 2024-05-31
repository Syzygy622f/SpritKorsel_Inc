import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { product } from '../../models/Product';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product: product | null = null;
  productId: number = 0;
  http = inject(HttpClient);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.getDetails(this.productId);
    this.attachSaveButtonListener();
  }

  public async getDetails(id: number) {
    try {
      const response = await firstValueFrom(
        this.http.get<product>(`https://localhost:7289/api/Customer/${id}`)
      );
      console.log('response', response);
      this.product = response;
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  }

  public saveLocalStorage() {
    let inputValue = (document.getElementById('Amount') as HTMLInputElement)
      .value;
    const newItem = { id: this.product?.id, quantity: inputValue };

    let cartItems = localStorage.getItem('ToCart');
    let cartArray = cartItems ? JSON.parse(cartItems) : [];

    cartArray.push(newItem);

    localStorage.setItem('ToCart', JSON.stringify(cartArray));
    console.log('added to localstorage');
  }

  public attachSaveButtonListener() {
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
      saveButton.addEventListener('click', () => this.saveLocalStorage());
    }
  }
}
