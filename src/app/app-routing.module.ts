import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
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
import {
  ManageAccountComponent
} from "./pages/ministry/ministry-dashboard/menus/manage-account/manage-account.component";

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'sign-in', component: SignInComponent},
  {
    path: 'ministry-dashboard', component: MinistryDashboardComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'manage-account', component: ManageAccountComponent},
    ],
  },
  {path: 'register-merchant', component: RegisterMerchantComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
