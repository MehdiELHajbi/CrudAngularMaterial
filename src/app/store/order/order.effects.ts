import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import * as OrderActions from './order.actions';

@Injectable()
export class OrderEffects {
  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      mergeMap(() =>
        this.dataService.getOrders().pipe(
          map(orders => OrderActions.loadOrdersSuccess({ orders })),
          catchError(error => of(OrderActions.loadOrdersFailure({ error: error.message })))
        )
      )
    )
  );

  addOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.addOrder),
      mergeMap(action => {
        this.dataService.addOrder(action.order);
        return of(OrderActions.addOrderSuccess({ order: action.order }));
      })
    )
  );

  updateOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.updateOrder),
      mergeMap(action => {
        this.dataService.updateOrder(action.order);
        return of(OrderActions.updateOrderSuccess({ order: action.order }));
      })
    )
  );

  deleteOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.deleteOrder),
      mergeMap(action => {
        this.dataService.deleteOrder(action.id);
        return of(OrderActions.deleteOrderSuccess({ id: action.id }));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private dataService: DataService
  ) {}
}