import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';
import { initialProductState, Product } from './product.model';

export const productReducer = createReducer(
  initialProductState,
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    filteredProducts: applyFilter(products, state.filter),
    loading: false
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(ProductActions.addProduct, (state) => ({
    ...state,
    loading: true
  })),
  on(ProductActions.addProductSuccess, (state, { product }) => {
    const products = [...state.products, product];
    return {
      ...state,
      products,
      filteredProducts: applyFilter(products, state.filter),
      loading: false
    };
  }),
  on(ProductActions.addProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: true
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) => {
    const products = state.products.map(p => p.id === product.id ? product : p);
    return {
      ...state,
      products,
      filteredProducts: applyFilter(products, state.filter),
      loading: false
    };
  }),
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: true
  })),
  on(ProductActions.deleteProductSuccess, (state, { id }) => {
    const products = state.products.filter(p => p.id !== id);
    return {
      ...state,
      products,
      filteredProducts: applyFilter(products, state.filter),
      loading: false
    };
  }),
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(ProductActions.setProductFilter, (state, { filter }) => ({
    ...state,
    filter,
    filteredProducts: applyFilter(state.products, filter)
  })),
  on(ProductActions.clearProductFilter, (state) => ({
    ...state,
    filter: null,
    filteredProducts: state.products
  }))
);

function applyFilter(products: Product[], filter: any | null): Product[] {
  if (!filter) return products;

  return products.filter(product => {
    let matches = true;
    
    if (filter.name) {
      matches = matches && product.name.toLowerCase().includes(filter.name.toLowerCase());
    }
    
    if (filter.priceFrom) {
      matches = matches && product.price >= filter.priceFrom;
    }
    
    if (filter.priceTo) {
      matches = matches && product.price <= filter.priceTo;
    }
    
    if (filter.stock) {
      matches = matches && product.stock >= filter.stock;
    }
    
    return matches;
  });
}