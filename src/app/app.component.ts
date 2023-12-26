/**
 * The root component of the application that manages the overall layout and behavior.
 * It initializes the Flowbite library, subscribes to router events to handle navigation loading,
 * and integrates with the LoadingService to display loading indicators during navigation.
 */
import { Component, OnInit } from '@angular/core';
import {
  Event as RouterEvent,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { initFlowbite } from 'flowbite';
import { LoadingService } from './shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'promo-tourism-system';

  /**
   * Constructor function for AppComponent.
   *
   * @constructor
   * @param {Router} router - Angular's router service for managing navigation.
   * @param {LoadingService} loading - Custom service for handling loading indicators.
   */
  constructor(private router: Router, private loading: LoadingService) {}

  /**
   * Initializes the Flowbite library and subscribes to router events.
   */
  ngOnInit(): void {
    initFlowbite();
    this.subscribeToRouterEvents();
  }

  /**
   * Subscribe to router events to handle navigation loading indicators.
   */
  private subscribeToRouterEvents(): void {
    this.router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  /**
   * Handle navigation events to show/hide loading indicators.
   *
   * @param {RouterEvent} event - The router event being intercepted.
   */
  private navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading.show();
    }

    if (
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      this.loading.hide();
    }
  }
}
