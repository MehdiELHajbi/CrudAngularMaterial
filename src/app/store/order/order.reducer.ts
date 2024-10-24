import { createReducer, on } from '@ngrx/store';
import { OrderState } from './order.state';
import * as OrderActions from './order.actions';

export const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null
};

export const orderReducer = createReducer(
  initialState,
  on(OrderActions.loadOrders, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OrderActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false
  })),
  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(OrderActions.addOrderSuccess, (state, { order }) => ({
    ...state,
    orders: [...state.orders, order]
  })),
  on(OrderActions.updateOrderSuccess, (state, { order }) => ({
    ...state,
    orders: state.orders.map(o => o.id === order.id ? order : o)
  })),
  on(OrderActions.deleteOrderSuccess, (state, { id }) => ({
    ...state,
    orders: state.orders.filter(o => o.id !== id)
  })),
  on(OrderActions.selectOrder, (state, { order }) => ({
    ...state,
    selectedOrder: order
  }))
);