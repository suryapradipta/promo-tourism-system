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
    RegisterMerchantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
