import { Component } from '@angular/core';
import { LoadingService } from '../../shared/services';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent {
  loadingState$ = this.loadingService.getLoadingState();

  constructor(private loadingService: LoadingService) {}
}
