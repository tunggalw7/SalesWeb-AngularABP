import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HistoryRoutingModule} from './history-routing.module';
import {HistoryRefundComponent} from './history-refund/history-refund.component';
import {ShareModule} from "@app/pponline/share/share.module";
import {
    ButtonModule, CheckboxModule, DataTableModule, DropdownModule, EditorModule, PaginatorModule,
    SpinnerModule
} from "primeng/primeng";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalModule, TabsModule, TooltipModule} from "ngx-bootstrap";
import {AppCommonModule} from "@app/shared/common/app-common.module";
import {UtilsModule} from "@shared/utils/utils.module";
import {EasyPieChartModule} from "ng2modules-easypiechart";
import {ServiceProxyModule} from "@shared/service-proxies/service-proxy.module";
import {CountoModule} from '@node_modules/angular2-counto';
import {OrderPpComponent } from "@app/pponline/history/order-pp/order-pp.component";
import {RouterModule, Routes} from "@angular/router";
import { OrderPPModalComponent } from '@app/pponline/history/order-pp/order-pp-modal.component';

const routes: Routes = [

];

@NgModule({
    imports: [
        CommonModule,
        HistoryRoutingModule,
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
        SpinnerModule
    ],
    declarations: [
        HistoryRefundComponent,
        OrderPpComponent,
        OrderPPModalComponent
    ]
})
export class HistoryModule {
}
