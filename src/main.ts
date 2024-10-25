import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Routes, provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { NavigationComponent } from './app/layout/navigation/navigation.component';
import { ProductsComponent } from './app/products/products.component';
import { OrdersComponent } from './app/orders/orders.component';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { reducers } from './app/store';
import { ProductEffects } from './app/store/product/product.effects';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'settings', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavigationComponent],
  template: '<app-navigation></app-navigation>'
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideStore(reducers),
    provideEffects([ProductEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
});