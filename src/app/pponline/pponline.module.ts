import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PponlineRoutingModule} from './pponline-routing.module';
import {TransactionPpComponent} from "@app/pponline/transaction-pp/transaction-pp.component";
import {TransactionSummaryComponent} from "@app/pponline/transaction-pp/transaction-summary.component";


import {DataTableModule} from "@node_modules/primeng/components/datatable/datatable";
import {PaginatorModule} from "@node_modules/primeng/components/paginator/paginator";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalModule, TabsModule, TooltipModule} from "@node_modules/ngx-bootstrap";
import {AppCommonModule} from "@app/shared/common/app-common.module";
import {UtilsModule} from "@shared/utils/utils.module";
import {CountoModule} from "@node_modules/angular2-counto";
import {EasyPieChartModule} from "@node_modules/ng2modules-easypiechart";
import {ServiceProxyModule} from "@shared/service-proxies/service-proxy.module";
import {SpinnerModule} from "@node_modules/primeng/components/spinner/spinner";
import {EditorModule} from "@node_modules/primeng/components/editor/editor";
import {DropdownModule} from "@node_modules/primeng/components/dropdown/dropdown";
import {ButtonModule} from "@node_modules/primeng/components/button/button";
import {CheckboxModule} from "@node_modules/primeng/components/checkbox/checkbox";
import {ShareModule} from "@app/pponline/share/share.module";
import {RouterModule} from "@angular/router";
import {InputSwitchModule} from "@node_modules/primeng/components/inputswitch/inputswitch";
import {MultiSelectModule} from "@node_modules/primeng/components/multiselect/multiselect";
import {SelectButtonModule} from "@node_modules/primeng/components/selectbutton/selectbutton";
// import {DashboardComponent} from "@app/pponline/dashboard/dashboard.component";
import {RefundComponent} from "@app/pponline//refund/refund.component";
import {DatePickerDirective} from "@app/pponline/share/datepicker.directive";
import {DropimageComponent} from "@app/pponline/share/dropimage/dropimage.component";
import {PaymentCheckingComponent} from "@app/pponline/payment-checking/payment-checking.component";
import {PaymentCheckingModalComponent} from "@app/pponline/payment-checking/payment-checking-modal.component";
import {CustomerListComponent} from "@app/pponline/customer-list/customer-list.component";
import {ScriptLoaderService} from "@shared/common/_services/script-loader.service";
import {TokenService} from "@node_modules/abp-ng2-module/dist/src/auth/token.service";
import {DropzoneModule} from "ngx-dropzone-wrapper";
import {OjkModalComponent} from "@app/pponline/transaction-pp/ojk-modal.component";
import { PaymentCheckingBFModalComponent } from './payment-checking/payment-checking-BF-modal.component';

@NgModule({
    imports: [
        CommonModule,
        PponlineRoutingModule,
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
        DropzoneModule,
    ],
    declarations: [
        // DashboardComponent,
        RefundComponent,
        DatePickerDirective,
        DropimageComponent,
        PaymentCheckingComponent,
        PaymentCheckingModalComponent,
        PaymentCheckingBFModalComponent,
        CustomerListComponent,
        TransactionPpComponent,
        TransactionSummaryComponent,
        OjkModalComponent
    ],
    providers: [
        ScriptLoaderService,
        TokenService
    ]
})
export class PponlineModule {
}
