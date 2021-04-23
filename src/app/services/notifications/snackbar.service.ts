import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarRef } from '@angular/material/snack-bar';

import { SuccessSnackbarComponent } from './snackbar/success-snackbar/success-snackbar.component';
import { WarnSnackbarComponent } from './snackbar/warn-snackbar/warn-snackbar.component';
import { ErrorSnackbarComponent } from './snackbar/error-snackbar/error-snackbar.component';
import { InfoSnackbarComponent } from './snackbar/info-snackbar/info-snackbar.component';
import { ApplicationConfigService } from '../app/application-config.service';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  /** Default duration to show snackbar, in milliseconds */
  DEFUALT_DURATION = 5000;

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

  private _class_mapping = {
    'success': 'snackbar-success',
    'warn': 'snackbar-warn',
    'error': 'snackbar-error',
    'info': 'snackbar-info'
  }

  /** Keep track of which snackbars are rendering */
  private _snackbar_open: MatSnackBarRef<unknown>;

  /** Snackbars to render next */
  private _snackbar_queue = [];

  constructor(private _snackBar: MatSnackBar, private appConfig: ApplicationConfigService) { }

  /** Display a snackbar with given message. By default an
   * info snackbar is shown.
   * @param message The message to render.
   * @param options Addditional options to consider.
   */
  public enqueueSnackBar(message: string, options?: SnackBarOptions): void {

    // If user chose not to view snackbar notifications, then don't enqueue them and instead log to console
    if(!this.appConfig.canViewSnackbarNotification()) {
      options?.type === 'error' ? console.error('[Error] ' + message) : console.log(`[Notice] ` + message);
      return;
    }

    // If invalid snackbar type given, assume info
    let type = this._snackbar_mapping[options?.type] ? options?.type : this.DEFAULT_SNACKBAR_TYPE;

    this._handleEnqueue(this._snackbar_mapping[type],
      {
        data: { message: message },
        duration: options?.duration || this.DEFUALT_DURATION,
        verticalPosition: options?.vertical_pos || this.DEFAULT_VERTICAL_POS,
        horizontalPosition: options?.horizontal_pos || this.DEFUALT_HORIZONTAL_POS,
        panelClass: [this._class_mapping[type]]
      }
    );
  }

  /** Given a snackbar ref, only enqueue  */
  private _handleEnqueue(component: any, options: any) {
    // If not snackbar currently open, then open one
    if(!this._snackbar_open) {
      this._snackbar_open = this._snackBar.openFromComponent(component, options);
      this._snackbar_open.afterDismissed().subscribe(() => this._handleSnackBarClose());
    }
    else { // Otherwise one is already open, then add it to the queue
      this._snackbar_queue.push([component, options]);
    }
  }

  /** When snackbar closes, open the next in queue */
  private _handleSnackBarClose() {
    // If there are more snackbars to open
    if(this._snackbar_queue.length > 0) {
      let args = this._snackbar_queue.shift();
      let component = args[0]
      let options = args[1];

      this._snackbar_open = this._snackBar.openFromComponent(component, options);
      this._snackbar_open.afterDismissed().subscribe(() => this._handleSnackBarClose());
    } else {
      this._snackbar_open = null;
    }
  }
}

type SnackBarOptions = {
  /** Duration, in milliseconds */
  duration?: number,
  vertical_pos?: MatSnackBarVerticalPosition,
  horizontal_pos?: MatSnackBarHorizontalPosition,
  type?: 'success' | 'warn' | 'error' | 'info'
}
