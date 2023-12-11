import { Component } from "@angular/core"
import { Meta, Title } from "@angular/platform-browser"
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from "@angular/router"
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import {LoadingService} from "./shared/services";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'promo-tourism-system';
  private loadingStartTime: number;

  constructor(private router: Router,
              private loading: LoadingService) { }

  ngOnInit(): void {
    initFlowbite();
    this.subscribeToRouterEvents();
  }

  private subscribeToRouterEvents(): void {
    this.router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  private navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading.show();
    }

    if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
      this.loading.hide();
    }
  }
}
