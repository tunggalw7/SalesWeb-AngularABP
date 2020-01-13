import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { EasyPieChartModule } from 'ng2modules-easypiechart';

import { SpinnerModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { FormValidationStyleDirective } from "@app/fitur/share/form-validation-style.directive"
import { ControlMessageComponent } from "@app/fitur/share/control-message.component";
import { UploadFileDirective } from "@app/fitur/share/upload-file.directive";
import { DatePickerSelectedDirective } from "@app/fitur/share/date-picker.component";

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
        EasyPieChartModule,
        SpinnerModule,
        EditorModule,
        DropdownModule,
        ButtonModule
    ],
    declarations: [
        FormValidationStyleDirective,
        ControlMessageComponent,
        UploadFileDirective,

        DatePickerSelectedDirective
    ],
    exports: [
        FormValidationStyleDirective,
        ControlMessageComponent,
        UploadFileDirective,

        DatePickerSelectedDirective
    ]
})

export class ShareModule {
}
