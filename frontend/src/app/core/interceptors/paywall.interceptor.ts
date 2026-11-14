import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { PaywallDialogComponent } from './paywall-dialog.component';

export const paywallInterceptor: HttpInterceptorFn = (req, next) => {
  const dialog = inject(MatDialog);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 402) {
        if (dialog.openDialogs.length === 0) {
          dialog.open(PaywallDialogComponent, {
            width: '420px',
            disableClose: false,
          });
        }
      }
      return throwError(() => error);
    }),
  );
};
