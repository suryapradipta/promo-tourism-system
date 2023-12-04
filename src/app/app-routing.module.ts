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
import { ProductListComponent } from './pages/customer/dashboard/product-list/product-list.component';
import { ProductDetailComponent } from './pages/customer/dashboard/product-detail/product-detail.component';
import { ReceiptComponent } from './pages/customer/dashboard/receipt/receipt.component';
import { ReviewProductComponent } from './pages/customer/menus/review-product/review-product.component';
import { ChangePasswordComponent } from './pages/customer/menus/auth/change-password/change-password.component';
import { ManageProductComponent } from './pages/ministry/ministry-dashboard/menus/manage-product/manage-product.component';
import { AddEditProductComponent } from './pages/ministry/ministry-dashboard/menus/manage-product/add-edit-product/add-edit-product.component';
import { MerchantAnalyticsComponent } from './pages/ministry/ministry-dashboard/menus/merchant-analytics/merchant-analytics.component';
import { MinistryAnalyticsComponent } from './pages/ministry/ministry-dashboard/menus/ministry-analytics/ministry-analytics.component';
import {
  HomeComponent
} from "./pages/ministry/ministry-dashboard/home/home.component";

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'register-merchant', component: RegisterMerchantComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'receipt', component: ReceiptComponent },
  { path: 'review', component: ReviewProductComponent },
  { path: 'change-password', component: ChangePasswordComponent },

  {
    path: 'ministry-dashboard',
    component: MinistryDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'manage-account', component: ManageAccountComponent },
      { path: 'merchant/:id', component: DetailAccountComponent },
      { path: 'manage-product', component: ManageProductComponent },
      { path: 'add-product', component: AddEditProductComponent },
      { path: 'edit-product/:id', component: AddEditProductComponent },
      { path: 'merchant-analytics', component: MerchantAnalyticsComponent },
      { path: 'ministry-analytics', component: MinistryAnalyticsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
