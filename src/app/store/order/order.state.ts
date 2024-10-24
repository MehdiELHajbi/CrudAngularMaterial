import { Order } from '../../models/order.model';

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  selectedOrder: Order | null;
}