import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { SalesPortalRoutingModule } from '@app/sales-portal/sales-portal-routing.module';

import { CountoModule } from '@node_modules/angular2-counto';
import { EasyPieChartModule } from 'ng2modules-easypiechart';
import { ShareModule } from '@app/sales-portal/share/share.module';
import { DataTableModule, PaginatorModule, FileUploadModule } from 'primeng/primeng';
import { TokenService } from "abp-ng2-module/dist/src/auth/token.service";

import { DashboardComponent } from '@app/sales-portal/dashboard/dashboard.component';
import { TaskListComponent } from '@app/sales-portal/task-list/task-list.component';
import { MyCommissionComponent } from '@app/sales-portal/my-commission/my-commission.component';
import { FilterCommissionComponent } from '@app/sales-portal/my-commission/filter-commission-modal.component';
import { DetailCommissionComponent } from '@app/sales-portal/my-commission/detail-commission-modal.component';
import { RequirementDetailComponent } from '@app/sales-portal/requirement-detail/requirement-detail.component';
import { CustomerComponent } from '@app/sales-portal/customer/customer.component';
import { AddPotentialCustomerComponent } from '@app/sales-portal/customer/add-potential-customer.component';
import { ProfileComponent } from '@app/sales-portal/profile/profile.component';
import { DropimageComponent } from "@app/sales-portal/share/dropimage/dropimage.component";
import { DropzoneModule } from 'ngx-dropzone-wrapper';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        SalesPortalRoutingModule,
        CountoModule,
        EasyPieChartModule,
        DataTableModule,
        PaginatorModule,
        FileUploadModule,
        DropzoneModule,
        ShareModule
    ],
    declarations: [
        DashboardComponent,
        TaskListComponent,
        MyCommissionComponent,
        FilterCommissionComponent,
        DetailCommissionComponent,
        RequirementDetailComponent,
        CustomerComponent,
        AddPotentialCustomerComponent,
        ProfileComponent,
        DropimageComponent
    ],
    providers: [
        // ScriptLoaderService,
        TokenService
    ]
})
export class SalesPortal { }
