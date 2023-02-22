import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { catchError, throwError } from "rxjs";

import { ErrorComponent } from "./error/error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = error.error.message
            ? error.error.message
            : 'An unknow error occured!';

          this.dialog.open(ErrorComponent, { data: { message: errorMessage } });

          return throwError(() => error);
        })
      );
  }
}
