import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import * as ProductActions from './product.actions';

@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      mergeMap(() =>
        this.productService.getProducts().pipe(
          map(products => ProductActions.loadProductsSuccess({ products })),
          catchError(error => of(ProductActions.loadProductsFailure({ error: error.message })))
        )
      )
    )
  );

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.addProduct),
      mergeMap(action =>
        this.productService.addProduct(action.product).pipe(
          map(product => ProductActions.addProductSuccess({ product })),
          catchError(error => of(ProductActions.addProductFailure({ error: error.message })))
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      mergeMap(action =>
        this.productService.updateProduct(action.product).pipe(
          map(product => ProductActions.updateProductSuccess({ product })),
          catchError(error => of(ProductActions.updateProductFailure({ error: error.message })))
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      mergeMap(action =>
        this.productService.deleteProduct(action.id).pipe(
          map(() => ProductActions.deleteProductSuccess({ id: action.id })),
          catchError(error => of(ProductActions.deleteProductFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}
}