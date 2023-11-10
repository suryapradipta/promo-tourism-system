import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/customer/dashboard/header/header.component';
import { FooterComponent } from './pages/customer/dashboard/footer/footer.component';
import { PackageComponent } from './pages/customer/dashboard/package/package.component';
import { SignInComponent } from './pages/customer/menus/auth/sign-in/sign-in.component';
import { DashboardComponent } from './pages/customer/dashboard/dashboard.component';
import { CarouselComponent } from './pages/customer/dashboard/carousel/carousel.component';
import { SignUpComponent } from './pages/customer/menus/auth/sign-up/sign-up.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MinistryDashboardComponent } from './pages/ministry/ministry-dashboard/ministry-dashboard.component';
import { RegisterMerchantComponent } from './pages/customer/menus/register-merchant/register-merchant.component';
import { MobileSidebarComponent } from './pages/ministry/ministry-dashboard/mobile-sidebar/mobile-sidebar.component';
import { DesktopSidebarComponent } from './pages/ministry/ministry-dashboard/desktop-sidebar/desktop-sidebar.component';
import { ManageAccountComponent } from './pages/ministry/ministry-dashboard/menus/manage-account/manage-account.component';
import { DetailAccountComponent } from './pages/ministry/ministry-dashboard/menus/manage-account/detail-account/detail-account.component';
import { ProductListComponent } from './pages/customer/dashboard/product-list/product-list.component';
import { AdminDashboardComponent } from './pages/ministry/ministry-dashboard/menus/admin-dashboard/admin-dashboard.component';
import { ProductDetailComponent } from './pages/customer/dashboard/product-detail/product-detail.component';
import { ReviewsComponent } from './pages/customer/dashboard/product-detail/reviews/reviews.component';
import { PaymentComponent } from './pages/customer/menus/payment/payment.component';
import {NgxPayPalModule} from "ngx-paypal";

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
    AdminDashboardComponent,
    ProductDetailComponent,
    ReviewsComponent,
    PaymentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPayPalModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
