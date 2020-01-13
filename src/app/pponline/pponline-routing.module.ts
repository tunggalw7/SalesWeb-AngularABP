import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TransactionPpComponent} from "@app/pponline/transaction-pp/transaction-pp.component";
import {TransactionSummaryComponent} from "@app/pponline/transaction-pp/transaction-summary.component";
import {PaymentCheckingComponent} from "@app/pponline/payment-checking/payment-checking.component";
import {RefundComponent} from "@app/pponline/refund/refund.component";
import {CustomerListComponent} from "@app/pponline/customer-list/customer-list.component";


const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            children: [
                {path: 'refund', component: RefundComponent, data: {permission: 'Pages.Tenant.SalesWeb.BackOffice.Refund'}},
                {
                    path: 'customer-list',
                    component: CustomerListComponent,
                    // data: {permission: 'Pages.Tenant.SalesWeb.Dashboard'}
                },
                {
                    path: 'history',
                    loadChildren: 'app/pponline/history/history.module#HistoryModule',
                    data: {preload: true} //Lazy load main module
                },
                {
                    path: 'paymentchecking',
                    component: PaymentCheckingComponent,
                    data: {permission: 'Pages.Tenant.SalesWeb.BackOffice.InputPayment'}
                },
                {
                    path: 'report',
                    loadChildren: 'app/pponline/report/report.module#ReportModule',
                    data: {preload: true} //Lazy load main module
                },
                {
                    path: 'transactionpp',
                    component: TransactionPpComponent,
                    data: {permission: 'Pages.Tenant.SalesWeb.PPOnline.BuyPP'}
                },
                {
                    path: 'transaction-summary',
                    component: TransactionSummaryComponent,
                    data: {permission: 'Pages.Tenant.SalesWeb.PPOnline.BuyPP'}
                }
                // ,
                // {
                //     path: 'transaction-summary/:CSCode/:CSName/:PPOrderID',
                //     component: TransactionSummaryComponent,
                //     data: {permission: 'Pages.Tenant.Dashboard'}
                // },

            ]
        },
    ])],
    exports: [RouterModule]
})
export class PponlineRoutingModule {
}
