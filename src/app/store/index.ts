import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { productReducer } from './product/product.reducer';

export const reducers: ActionReducerMap<AppState> = {
  products: productReducer
};