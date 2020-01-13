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
import { FormValidationStyleDirective } from "@app/sales-portal/share/form-validation-style.directive";

import { UploadFileDirective } from "@app/sales-portal/share/upload-file.directive";
import { ControlMessageComponentQ } from "@app/sales-portal/share/control-message.component";
import { FormControlStyleComponent } from "@app/sales-portal/share/form-control-style.component";
import { InputMaskDirective } from "@app/sales-portal/share/input-mask.directive";
import { PriceFormatDirective } from '@app/sales-portal/share/price-format.directive';
import { TrimValueAccessor } from '@app/sales-portal/share/trim-value-accessor.directive';
// import { DropimageComponent } from '@app/sales-portal/share/dropimage/dropimage.component';
import { ExampleDdlComponent } from '@app/sales-portal/share/rnd/example-ddl.component';
import { ExampleLangDdlComponent } from '@app/sales-portal/share/rnd/example-lang-ddl.component';
import { ExampleComplexDdlComponent } from '@app/sales-portal/share/rnd/example-complex-ddl.component';
import { DatePickerSelectedDirective } from '@app/sales-portal/share/date-picker.component';
import { DatePickerDirective } from '@app/sales-portal/share/datepicker.directive';

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
        InputMaskDirective,
        FormValidationStyleDirective,
        UploadFileDirective, ControlMessageComponentQ,
        FormValidationStyleDirective,
        FormControlStyleComponent,
        PriceFormatDirective,
        TrimValueAccessor,
        // DropimageComponent,
        ExampleDdlComponent,
        ExampleLangDdlComponent,
        ExampleComplexDdlComponent,
        DatePickerSelectedDirective,
        DatePickerDirective
    ],
    exports: [
        InputMaskDirective,
        FormValidationStyleDirective,
        UploadFileDirective,
        ControlMessageComponentQ,
        FormControlStyleComponent,
        PriceFormatDirective,
        TrimValueAccessor,
        // DropimageComponent,
        ExampleDdlComponent,
        ExampleLangDdlComponent,
        ExampleComplexDdlComponent,
        DatePickerSelectedDirective,
        DatePickerDirective
    ]
})

export class ShareModule {
}
