import { Routes } from '@angular/router';
import { HomeSideComponent } from './pages/home-side/home-side.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
    { path: '', component: HomeSideComponent},
    { path: 'products', component: ProductsComponent},
    { path: 'productDetails/:id', component: ProductDetailsComponent},
    { path: 'cart', component: CartComponent}
];
