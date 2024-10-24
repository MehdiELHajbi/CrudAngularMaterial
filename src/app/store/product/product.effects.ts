import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import * as ProductActions from './product.actions';

@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      mergeMap(() =>
        this.dataService.getProducts().pipe(
          map(products => ProductActions.loadProductsSuccess({ products })),
          catchError(error => of(ProductActions.loadProductsFailure({ error: error.message })))
        )
      )
    )
  );

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.addProduct),
      mergeMap(action => {
        this.dataService.addProduct(action.product);
        return of(ProductActions.addProductSuccess({ product: action.product }));
      })
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      mergeMap(action => {
        this.dataService.updateProduct(action.product);
        return of(ProductActions.updateProductSuccess({ product: action.product }));
      })
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      mergeMap(action => {
        this.dataService.deleteProduct(action.id);
        return of(ProductActions.deleteProductSuccess({ id: action.id }));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private dataService: DataService
  ) {}
}