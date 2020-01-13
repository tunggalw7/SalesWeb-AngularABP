import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { MainRoutingModule } from './main-routing.module';
// import { CountoModule } from '@node_modules/angular2-counto';
import { EasyPieChartModule } from 'ng2modules-easypiechart';
import { DataTableModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { BookingModalDetailComponent } from './booking-history/booking-modal-detail.component';
import { RegisterCustomerComponent } from './register-customer/register-customer.component';
import { UpdateCustomerComponent } from './update-customer/update-customer.component';
import { DatePickerSelectedDirective } from 'app/main/share/datepicker-selected.directive';
import { DatePickerDirective } from 'app/main/share/datepicker.directive';
import { InputMaskDirective } from 'app/main/share/input-mask.directive';

import { FileSelectDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropimageComponent } from './dropimage/dropimage.component';
// import { BookingUnitComponent } from '@requirelogin_or_not/booking-unit/booking-unit-selection.component';
import { VerifyComponent } from './booking-unit/booking-unit-verify.component';
import { ConfirmComponent } from './booking-unit/booking-unit-confirm.component';
import { FinishConfirmComponent } from './booking-unit/booking-unit-finish.component';
import { CartComponent } from './cart/cart.component';
import { DiagrammaticComponent } from "@app/main/diagrammatic/diagrammatic.component";
import { DiagrammaticDetailModalComponent } from "@app/main/diagrammatic/diagrammatic-detail-modal.component";
import { DetailDiagrammaticComponent, RoundPipe } from "@app/main/diagrammatic/detail-diagramatic/detail-diagrammatic.component";
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { ShareModule } from "@app/main/share/share.module";
import { TokenService } from "abp-ng2-module/dist/src/auth/token.service";
import { PPNoModalComponent } from '@app/main/diagrammatic/ppno-modal.component';
import { DurationComponent } from "../myduration/myduration.component";
import { CountdownModule } from "ngx-countdown";
import { AccordionModule } from "primeng/primeng";

import { RequireLoginOrNotModule } from '@requirelogin_or_not/requirelogin-or-not.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        // CountoModule,
        EasyPieChartModule,
        DataTableModule,
        ReactiveFormsModule,
        FileUploadModule,
        DropzoneModule,
        DataTablesModule,
        MultiSelectModule,
        ShareModule,
        CountdownModule,
        AccordionModule,

        RequireLoginOrNotModule
    ],
    declarations: [
        DashboardComponent,
        BookingHistoryComponent,
        BookingModalDetailComponent,
        DatePickerDirective,
        RegisterCustomerComponent,
        UpdateCustomerComponent,
        InputMaskDirective,
        DropimageComponent,
        // BookingUnitComponent,
        VerifyComponent,
        ConfirmComponent,
        CartComponent,
        DiagrammaticComponent,
        DetailDiagrammaticComponent,
        DiagrammaticDetailModalComponent,
        PPNoModalComponent,
        FinishConfirmComponent,
        DurationComponent,
        RoundPipe,
    ],
    providers: [
        ScriptLoaderService,
        TokenService
    ]
})
export class MainModule {
}
