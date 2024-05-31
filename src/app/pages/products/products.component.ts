import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { product } from '../../models/Product';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  public products: product[] | null = null;
  http = inject(HttpClient);

  ngOnInit(): void {
    this.getproducts();
  }

  public async getproducts() {

    await this.http
    .get<product[]>(`https://localhost:7289/api/Customer`)
    .subscribe((response) => {

       this.products = response
    });
    }

}
