import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportRoutingModule} from "@app/pponline/report/report-routing.module";
import {
    ButtonModule,
    CheckboxModule,
    DataTableModule,
    DropdownModule,
    EditorModule,
    InputSwitchModule,
    MultiSelectModule,
    PaginatorModule,
    SelectButtonModule,
    SpinnerModule
} from "primeng/primeng";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalModule, TabsModule, TooltipModule} from "ngx-bootstrap";
import {AppCommonModule} from "@app/shared/common/app-common.module";
import {UtilsModule} from "@shared/utils/utils.module";
import {EasyPieChartModule} from "ng2modules-easypiechart";
import {ServiceProxyModule} from "@shared/service-proxies/service-proxy.module";
import {ShareModule} from "@app/pponline/share/share.module";
import {RouterModule, Routes} from "@angular/router";
import {CountoModule} from '@node_modules/angular2-counto';
import {ReportOrderComponent} from "@app/pponline/report/report-order/report-order.component";
import {ReportPaymentComponent} from "@app/pponline/report/report-payment/report-payment.component";
import { ReportRefundComponent } from "@app/pponline/report/report-refund/report-refund.component";
const routes: Routes = [];


@NgModule({
    imports: [
        CommonModule,
        ReportRoutingModule,
        DataTableModule,
        PaginatorModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        ReactiveFormsModule,
        CountoModule,
        EasyPieChartModule,
        ServiceProxyModule,
        SpinnerModule,
        EditorModule,
        DropdownModule,
        ButtonModule,
        CheckboxModule,
        ShareModule,
        RouterModule,
        InputSwitchModule,
        MultiSelectModule,
        SelectButtonModule,
    ],
    declarations: [
        ReportOrderComponent,
        ReportPaymentComponent,
        ReportRefundComponent,

    ]
})
export class ReportModule {
}
