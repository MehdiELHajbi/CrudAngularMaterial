import { createReducer, on } from '@ngrx/store';
import { ProductState } from './product.state';
import * as ProductActions from './product.actions';

export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null
};

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(ProductActions.addProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product]
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map(p => p.id === product.id ? product : p)
  })),
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter(p => p.id !== id)
  })),
  on(ProductActions.selectProduct, (state, { product }) => ({
    ...state,
    selectedProduct: product
  }))
);