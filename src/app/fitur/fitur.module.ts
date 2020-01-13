import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { FiturRoutingModule } from './fitur-routing.module';
import { EasyPieChartModule } from 'ng2modules-easypiechart';
import { DataTableModule, SharedModule, TabViewModule } from 'primeng/primeng';
// import { ShareModule} from "@app/fitur/share/share.module";
import { ShareModule } from "@app/main/share/share.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { InformationComponent } from './information/information.component';
import { LocationComponent } from './location/location.component';
import { SiteplanComponent } from './siteplan/siteplan.component';
import { SiteplanModalDetailComponent } from './siteplan/siteplan-modal-detail.component';
import { SocialComponent } from './social/social.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryModalDetailComponent } from './gallery/gallery-modal-detail.component';
import { LocationModalDetailComponent } from './location/location-modal.component';
import { KeyFeatureComponent } from './information/keyfeature.component';
import { SocialMediaComponent } from './information/socialmedia.component';
import { TowerComponent } from './information/tower.component';
import { DatepickerModule } from "ngx-bootstrap";

import { FileSelectDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropimageComponent } from './dropimage/dropimage.component';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { DatePickerDirective } from './share/datepicker.directive';
import { DatePickerSelectedDirective } from './share/date-picker.component';
import { UnittypeComponent } from './unittype/unittype.component';
import { DataTable } from "primeng/primeng";
import { PaginatorModule } from "primeng/primeng";
import { UnittypeModalAddComponent } from "@app/fitur/unittype/unittype-modal-add.component";
import { ManageProjectComponent } from './manage-project/manage-project.component';
import { ManageProjectModalComponent } from "@app/fitur/manage-project/manage-project-modal.component";
import { SocialModalAddComponent } from "@app/fitur/social/social-modal-add.component";
import { SocialModalEditComponent } from "@app/fitur/social/social-modal-edit.component";
import { PreviewInformationComponent } from "@app/fitur/information/preview-information.component";
import { ProjectDetailsComponent } from "@app/fitur/project-details/project-details.component";
import { TokenService } from "abp-ng2-module/dist/src/auth/token.service";
import { EditorModule } from "primeng/primeng";
import { ManagePromoComponent } from './manage-promo/manage-promo.component';
import { ManagePromoAddEditModalComponent } from "@app/fitur/manage-promo/manage-promo-addedit-modal.component";
import { SetUpProjectModalComponent } from "@app/fitur/manage-project/setupproject-modal.component";
import { PanelModule, MultiSelectModule } from 'primeng/primeng';
import { ProductSetupOBComponent } from '@app/fitur/product-setup-ob/product-setup-ob.component';
import { ProductSetupOBEditModalComponent } from '@app/fitur/product-setup-ob/product-setup-ob-edit-modal.component';
import { ProductSetupPpolComponent } from './product-setup-ppol/product-setup-ppol.component';
import { AddNewProductComponent } from "@app/fitur/add-new-product/add-new-product.component";
import { PriceUnitComponent } from '@app/fitur/add-new-product/price-unittype.component';
import { SetupBatchPPComponent } from '@app/fitur/setup-batch-pp/setup-batch-pp.component';
import { ModalSetupBatchPPComponent } from '@app/fitur/setup-batch-pp/modal-setup-batch-pp.component';
import { CurrencyMaskModule } from "./share/ng2-currency-mask/currency-mask.module";
import { ADConfigComponent } from './ad-config/ad-config.component';
import { CreateOrUpdateAdConfigModalComponent } from './ad-config/modal-ad-config.component';

import { InputMaskDirective } from './share/input-mask.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        FiturRoutingModule,
        EasyPieChartModule,
        DataTableModule,
        ReactiveFormsModule,
        FileUploadModule,
        DropzoneModule,
        DataTablesModule,
        TabViewModule,
        // FroalaEditorModule.forRoot(),
        // FroalaViewModule.forRoot(),
        ShareModule,
        PaginatorModule,
        DatepickerModule,
        EditorModule,
        PanelModule,
        MultiSelectModule,
        // MultiselectDropdownModule,
        CurrencyMaskModule
    ],
    declarations: [
        InformationComponent,
        LocationComponent,
        SiteplanComponent,
        SiteplanModalDetailComponent,
        SocialComponent,
        SocialModalAddComponent,
        GalleryComponent,
        GalleryModalDetailComponent,
        LocationModalDetailComponent,
        KeyFeatureComponent,
        SocialMediaComponent,
        SocialModalEditComponent,
        DropimageComponent,
        TowerComponent,
        DatePickerDirective,
        UnittypeComponent,
        UnittypeModalAddComponent,
        ManageProjectComponent,
        ManageProjectModalComponent,
        PreviewInformationComponent,
        ProjectDetailsComponent,
        ManagePromoAddEditModalComponent,
        ManagePromoComponent,
        ProductSetupOBComponent,
        ProductSetupOBEditModalComponent,
        SetUpProjectModalComponent,
        ProductSetupPpolComponent,
        AddNewProductComponent,
        PriceUnitComponent,
        SetupBatchPPComponent,
        ModalSetupBatchPPComponent,
        ADConfigComponent,
        CreateOrUpdateAdConfigModalComponent,

        InputMaskDirective
    ],
    providers: [
        ScriptLoaderService,
        TokenService
    ]
})
export class FiturModule {
}
