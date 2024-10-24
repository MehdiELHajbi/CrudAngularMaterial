import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.state';

export const selectProductState = createFeatureSelector<ProductState>('products');

export const selectAllProducts = createSelector(
  selectProductState,
  state => state.products
);

export const selectProductLoading = createSelector(
  selectProductState,
  state => state.loading
);

export const selectProductError = createSelector(
  selectProductState,
  state => state.error
);

export const selectSelectedProduct = createSelector(
  selectProductState,
  state => state.selectedProduct
);

export const selectProductsLoaded = createSelector(
  selectProductState,
  state => state.products.length > 0
);