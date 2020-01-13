import * as ngCommon from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RecaptchaModule } from 'ng-recaptcha';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AbpModule } from '@abp/abp.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CommonModule } from '@shared/common/common.module';
import { TabsModule, TooltipModule } from "ngx-bootstrap";
import { EasyPieChartModule } from "ng2modules-easypiechart";
import { DataTableModule } from "primeng/primeng";
import { FileUploadModule } from "ng2-file-upload";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DataTablesModule } from "angular-datatables";
import { MultiSelectModule } from 'primeng/primeng';

import { BookingUnitComponent } from '@requirelogin_or_not/booking-unit/booking-unit-selection.component';

import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        RecaptchaModule.forRoot(),
        ModalModule.forRoot(),
        AbpModule,
        CommonModule,
        UtilsModule,
        ServiceProxyModule,
        TabsModule,
        TooltipModule,
        EasyPieChartModule,
        DataTableModule,
        FileUploadModule,
        DropzoneModule,
        DataTablesModule,
        ReactiveFormsModule,
        MultiSelectModule
    ],
    declarations: [
        BookingUnitComponent
    ],
    providers: [
        ScriptLoaderService
    ]
})
export class RequireLoginOrNotModule {

}
