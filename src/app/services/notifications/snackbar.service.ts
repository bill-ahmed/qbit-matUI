import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';

import { SuccessSnackbarComponent } from './snackbar/success-snackbar/success-snackbar.component';
import { WarnSnackbarComponent } from './snackbar/warn-snackbar/warn-snackbar.component';
import { ErrorSnackbarComponent } from './snackbar/error-snackbar/error-snackbar.component';
import { InfoSnackbarComponent } from './snackbar/info-snackbar/info-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  /** Default duration to show snackbar, in milliseconds */
  DEFUALT_DURATION = 3000;

  DEFAULT_VERTICAL_POS = 'bottom' as MatSnackBarVerticalPosition
  DEFUALT_HORIZONTAL_POS = 'right' as MatSnackBarHorizontalPosition

  DEFAULT_SNACKBAR_TYPE = 'info';

  /** What component to render for a given snackbar. */
  private _snackbar_mapping = {
    'success': SuccessSnackbarComponent,
    'warn': WarnSnackbarComponent,
    'error': ErrorSnackbarComponent,
    'info': InfoSnackbarComponent
  }


  constructor(private _snackBar: MatSnackBar) { }

  /** Display a snackbar with given message. By default an
   * info snackbar is shown.
   * @param message The message to render.
   * @param options Addditional options to consider.
   */
  public enqueueSnackBar(message: string, options?: SnackBarOptions): void {

    // If invalid snackbar type given, assume info
    let type = this._snackbar_mapping[options?.type] ? options?.type : this.DEFAULT_SNACKBAR_TYPE;

    this._snackBar.openFromComponent(this._snackbar_mapping[type],
      {
        data: { message: message },
        duration: options?.duration || this.DEFUALT_DURATION,
        verticalPosition: options?.vertical_pos || this.DEFAULT_VERTICAL_POS,
        horizontalPosition: options?.horizontal_pos || this.DEFUALT_HORIZONTAL_POS
      }
    );

  }
}

type SnackBarOptions = {
  /** Duration, in milliseconds */
  duration?: number,
  vertical_pos?: MatSnackBarVerticalPosition,
  horizontal_pos?: MatSnackBarHorizontalPosition,
  type?: 'success' | 'warn' | 'error' | 'info'
}
