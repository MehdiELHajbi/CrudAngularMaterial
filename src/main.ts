import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { App } from './app/app.component';
import { routes } from './app/app.routes';
import { productReducer } from './app/store/product/product.reducer';
import { orderReducer } from './app/store/order/order.reducer';
import { ProductEffects } from './app/store/product/product.effects';
import { OrderEffects } from './app/store/order/order.effects';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideStore({
      products: productReducer,
      orders: orderReducer
    }),
    provideEffects([ProductEffects, OrderEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
}).catch(err => console.error(err));