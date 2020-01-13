import * as ngCommon from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RecaptchaModule } from 'ng-recaptcha';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AbpModule } from '@abp/abp.module';
import { AppMainRoutingModule } from './app-main-routing.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CommonModule } from '@shared/common/common.module';
import { IndexComponent } from 'app-main/index/index.component';
import { AutologinComponent } from 'app-main/autologin/autologin.component';
import { TabsModule, TooltipModule } from "ngx-bootstrap";
import { EasyPieChartModule } from "ng2modules-easypiechart";
import { DataTableModule } from "primeng/primeng";
import { FileUploadModule } from "ng2-file-upload";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DataTablesModule } from "angular-datatables";
import { MultiSelectModule } from 'primeng/primeng';

import { OnlineBookingStatusComponent } from './online-booking-status/online-booking-status.component';
import { SiteplanDetailComponent } from './siteplan-detail/siteplan-detail.component';
// import { BookingUnitComponent } from '@requirelogin_or_not/booking-unit/booking-unit-selection.component';
import { RequireLoginOrNotModule } from '@requirelogin_or_not/requirelogin-or-not.module';

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
        AppMainRoutingModule,
        TabsModule,
        TooltipModule,
        EasyPieChartModule,
        DataTableModule,
        FileUploadModule,
        DropzoneModule,
        DataTablesModule,
        ReactiveFormsModule,
        MultiSelectModule,

        RequireLoginOrNotModule
    ],
    declarations: [
        IndexComponent,
        AutologinComponent,
        OnlineBookingStatusComponent,
        SiteplanDetailComponent,
        // BookingUnitComponent
    ],
    providers: [
        ScriptLoaderService
    ]
})
export class AppMainModule {

}
