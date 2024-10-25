export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
}

export interface ProductFilter {
  name?: string;
  priceFrom?: number;
  priceTo?: number;
  stock?: number;
}

export interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  filter: ProductFilter | null;
  loading: boolean;
  error: string | null;
}

export const initialProductState: ProductState = {
  products: [],
  filteredProducts: [],
  filter: null,
  loading: false,
  error: null
};