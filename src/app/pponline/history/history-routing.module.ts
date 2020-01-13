import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoryRefundComponent} from "@app/pponline/history/history-refund/history-refund.component";
import {OrderPpComponent} from "@app/pponline/history/order-pp/order-pp.component";

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
      {
          path: '',
          children: [
              { path: 'history-refund', component: HistoryRefundComponent, data: { permission: 'Pages.Tenant.SalesWeb.SalesPortal.History.Refund' } },
              { path: 'orderPp', component: OrderPpComponent, data: { permission: 'Pages.Tenant.SalesWeb.SalesPortal.History.PPOrder' } },

          ]
      },
  ])],
  exports: [RouterModule]
})
export class HistoryRoutingModule { }
