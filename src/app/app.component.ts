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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'promo-tourism-system';

  ngOnInit(): void {
    initFlowbite();
  }

  loading = true

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
  ) {
    this.router.events.subscribe((e: RouterEvent) => {
      this.navigationInterceptor(e)
    })
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => {
        this.loading = false
      }, 2000)
    }

    if (event instanceof NavigationCancel) {
      setTimeout(() => {
        this.loading = false
      }, 2000)
    }
    if (event instanceof NavigationError) {
      setTimeout(() => {
        this.loading = false
      }, 2000)
    }
  }
}
