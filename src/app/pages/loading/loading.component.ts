/**
 * This Angular component is responsible for displaying a loading indicator based on the
 * loading state provided by the LoadingService.
 */
import { Component } from '@angular/core';
import { LoadingService } from '../../shared/services';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent {
  loadingState$ = this.loadingService.getLoadingState();

  /**
   * @constructor
   * @param {LoadingService} loadingService - Service providing the loading state.
   */
  constructor(private loadingService: LoadingService) {}
}
