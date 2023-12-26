/**
 * This service manages the loading state of the application by providing methods to
 * show and hide loading indicators. It uses RxJS BehaviorSubject to broadcast the
 * current loading state to interested components or services.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  /**
   * Show loading indicator.
   */
  show() {
    this.loadingSubject.next(true);
  }

  /**
   * Hide loading indicator.
   */
  hide() {
    this.loadingSubject.next(false);
  }

  /**
   * Get an Observable representing the current loading state.
   *
   * @returns {Observable<boolean>} - Observable indicating the current loading state.
   */
  getLoadingState(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
