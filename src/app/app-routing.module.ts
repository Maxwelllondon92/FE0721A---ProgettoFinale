import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { CustomerComponent } from './customer/customer.component';
import { EditCustomerComponent } from './customer/edit-customer/edit-customer.component';
import { EditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path:'',redirectTo:'/customer',pathMatch:'full'},
  {path:"user",component:UserComponent,canActivate:[AuthGuard]},
  {path:"customer",component:CustomerComponent,canActivate:[AuthGuard]},
  {path:"customer/addCustomer",component:EditCustomerComponent,canActivate:[AuthGuard]},
  {path:"customer/editCustomer/:id",component:EditCustomerComponent,canActivate:[AuthGuard]},
  {path:"invoice",component:InvoiceComponent,canActivate:[AuthGuard]},
  {path:"customer/:id",component:InvoiceComponent,canActivate:[AuthGuard]},
  {path:"customer/:customerId/addInvoice",component:EditInvoiceComponent,canActivate:[AuthGuard]},
  {path:"customer/:customerId/editInvoice/:invoiceId",component:EditInvoiceComponent,canActivate:[AuthGuard]},
  {path:"auth",component:AuthComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
