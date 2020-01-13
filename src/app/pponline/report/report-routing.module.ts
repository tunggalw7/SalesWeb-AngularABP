import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReportOrderComponent} from "@app/pponline/report/report-order/report-order.component";
import {ReportPaymentComponent} from "@app/pponline/report/report-payment/report-payment.component";
import {ReportRefundComponent} from "@app/pponline/report/report-refund/report-refund.component";
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
      {
          path: '',
          children: [
              { path: 'reportOrder', component: ReportOrderComponent, data: { permission: 'Pages.Tenant.SalesWeb.BackOffice.Report.ReportOrder' } },
              { path: 'reportPayment', component: ReportPaymentComponent, data: { permission: 'Pages.Tenant.SalesWeb.BackOffice.Report.ReportPayment' } },
              { path: 'reportRefund', component: ReportRefundComponent, data: { permission: 'Pages.Tenant.SalesWeb.BackOffice.Report.ReportRefund' } }
          ]
      },
  ])],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
