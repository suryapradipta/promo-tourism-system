import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  HeaderComponent
} from "./pages/customer/dashboard/header/header.component";
import {
  SignInComponent
} from "./pages/customer/menus/auth/sign-in/sign-in.component";
import {
  DashboardComponent
} from "./pages/customer/dashboard/dashboard.component";
import {
  MinistryDashboardComponent
} from "./pages/ministry/ministry-dashboard/ministry-dashboard.component";
import {
  RegisterMerchantComponent
} from "./pages/customer/menus/register-merchant/register-merchant.component";

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'ministry-dashboard', component: MinistryDashboardComponent},
  {path: 'register-merchant', component: RegisterMerchantComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
