import { ProductState } from './product/product.state';
import { OrderState } from './order/order.state';

export interface AppState {
  products: ProductState;
  orders: OrderState;
}