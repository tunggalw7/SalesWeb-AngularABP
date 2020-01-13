import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {AppCommonModule} from "@app/shared/common/app-common.module";
import {UtilsModule} from '@shared/utils/utils.module';
import {CountoModule} from '@node_modules/angular2-counto';
import {EasyPieChartModule} from 'ng2modules-easypiechart';
import {SpinnerModule, EditorModule, DropdownModule, ButtonModule} from 'primeng/primeng';

import {InputMaskDirective} from "@app/pponline/share/input-mask.directive";
import {FormControlStyleComponent} from "@app/pponline/share/form-control-style.component";
import {ControlMessageComponent} from "@app/pponline/share/control-message.component";
// import {CurrencyMaskModule, CurrencyMaskDirective}
import {PriceFormatDirective} from "@app/pponline/share/price-format.directive";
import {TrimValueAccessor} from "@app/pponline/share/trim-value-accessor.directive";
import {UploadFileDirective} from "@app/pponline/share/upload-file.directive";
// import {ExampleDdlComponent} from "app-pp/main/share/rnd/example-ddl.component";
// import {ExampleComplexDdlComponent} from "app-pp/main/share/rnd/example-complex-ddl.component";
// import {ExampleLangDdlComponent} from "app-pp/main/share/rnd/example-lang-ddl.component";
import {FormValidationStyleDirective} from "@app/pponline/share/form-validation-style.directive";

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        ModalModule, TabsModule, TooltipModule,
        AppCommonModule,
        UtilsModule,
        CountoModule,
        EasyPieChartModule,
        SpinnerModule, EditorModule, DropdownModule, ButtonModule,
        // CurrencyMaskModule
    ],
    declarations: [
        InputMaskDirective,
        PriceFormatDirective,
        TrimValueAccessor,
        UploadFileDirective,
        FormValidationStyleDirective,
        FormControlStyleComponent,
        ControlMessageComponent,
        // ExampleDdlComponent,
        // ExampleLangDdlComponent,
        // ExampleComplexDdlComponent,
    ],
    exports: [
        InputMaskDirective,
        PriceFormatDirective,
        TrimValueAccessor,
        UploadFileDirective,
        // CurrencyMaskDirective,
        FormValidationStyleDirective,
        FormControlStyleComponent,
        ControlMessageComponent,
        // ExampleDdlComponent,
        // ExampleLangDdlComponent,
        // ExampleComplexDdlComponent,
    ]
})

export class ShareModule {
}
