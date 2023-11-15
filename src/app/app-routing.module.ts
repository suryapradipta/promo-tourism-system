import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './pages/customer/menus/auth/sign-in/sign-in.component';
import { DashboardComponent } from './pages/customer/dashboard/dashboard.component';
import { MinistryDashboardComponent } from './pages/ministry/ministry-dashboard/ministry-dashboard.component';
import { RegisterMerchantComponent } from './pages/customer/menus/register-merchant/register-merchant.component';
import { ManageAccountComponent } from './pages/ministry/ministry-dashboard/menus/manage-account/manage-account.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { SignUpComponent } from './pages/customer/menus/auth/sign-up/sign-up.component';
import { DetailAccountComponent } from './pages/ministry/ministry-dashboard/menus/manage-account/detail-account/detail-account.component';
import { AdminDashboardComponent } from './pages/ministry/ministry-dashboard/menus/admin-dashboard/admin-dashboard.component';
import { ProductListComponent } from './pages/customer/dashboard/product-list/product-list.component';
import { ProductDetailComponent } from './pages/customer/dashboard/product-detail/product-detail.component';
import { ReceiptComponent } from './pages/customer/dashboard/receipt/receipt.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'receipt', component: ReceiptComponent },

  {
    path: 'ministry-dashboard',
    component: MinistryDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'manage-account', component: ManageAccountComponent },
      { path: 'merchant/:id', component: DetailAccountComponent },
    ],
  },

  { path: 'register-merchant', component: RegisterMerchantComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
