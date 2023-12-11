import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/customer/dashboard/header/header.component';
import { FooterComponent } from './pages/customer/dashboard/footer/footer.component';
import { PackageComponent } from './pages/customer/dashboard/hero/package/package.component';
import { SignInComponent } from './pages/customer/menus/auth/sign-in/sign-in.component';
import { DashboardComponent } from './pages/customer/dashboard/dashboard.component';
import { CarouselComponent } from './pages/customer/dashboard/carousel/carousel.component';
import { SignUpComponent } from './pages/customer/menus/auth/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MinistryDashboardComponent } from './pages/ministry/ministry-dashboard/ministry-dashboard.component';
import { RegisterMerchantComponent } from './pages/customer/menus/register-merchant/register-merchant.component';
import { MobileSidebarComponent } from './pages/ministry/ministry-dashboard/mobile-sidebar/mobile-sidebar.component';
import { DesktopSidebarComponent } from './pages/ministry/ministry-dashboard/desktop-sidebar/desktop-sidebar.component';
import { ManageAccountComponent } from './pages/ministry/ministry-dashboard/menus/manage-account/manage-account.component';
import { DetailAccountComponent } from './pages/ministry/ministry-dashboard/menus/manage-account/detail-account/detail-account.component';
import { ProductListComponent } from './pages/customer/dashboard/product-list/product-list.component';
import { ProductDetailComponent } from './pages/customer/dashboard/product-detail/product-detail.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { ReceiptComponent } from './pages/customer/dashboard/receipt/receipt.component';
import { MobileMenuComponent } from './pages/customer/dashboard/header/mobile-menu/mobile-menu.component';
import { HeroComponent } from './pages/customer/dashboard/hero/hero.component';
import { ReviewProductComponent } from './pages/customer/menus/review-product/review-product.component';
import { ChangePasswordComponent } from './pages/customer/menus/auth/change-password/change-password.component';
import { ManageProductComponent } from './pages/ministry/ministry-dashboard/menus/manage-product/manage-product.component';
import { AddEditProductComponent } from './pages/ministry/ministry-dashboard/menus/manage-product/add-edit-product/add-edit-product.component';
import { MerchantAnalyticsComponent } from './pages/ministry/ministry-dashboard/menus/merchant-analytics/merchant-analytics.component';
import { MinistryAnalyticsComponent } from './pages/ministry/ministry-dashboard/menus/ministry-analytics/ministry-analytics.component';
import {AuthInterceptor} from "./shared/services";
import { HomeComponent } from './pages/ministry/ministry-dashboard/home/home.component';
import { LoadingComponent } from './pages/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PackageComponent,
    SignInComponent,
    DashboardComponent,
    CarouselComponent,
    SignUpComponent,
    MinistryDashboardComponent,
    RegisterMerchantComponent,
    MobileSidebarComponent,
    DesktopSidebarComponent,
    ManageAccountComponent,
    DetailAccountComponent,
    ProductListComponent,
    ProductDetailComponent,
    ReceiptComponent,
    MobileMenuComponent,
    HeroComponent,
    ReviewProductComponent,
    ChangePasswordComponent,
    ManageProductComponent,
    AddEditProductComponent,
    MerchantAnalyticsComponent,
    MinistryAnalyticsComponent,
    HomeComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPayPalModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
