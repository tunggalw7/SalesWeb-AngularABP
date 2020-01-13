import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { DataTableModule, SharedModule, Paginator, PaginatorModule } from 'primeng/primeng';
import { DataTablesModule } from "angular-datatables";
import { ShareModule } from "@app/main/share/share.module";
import { NgxGalleryModule } from "@node_modules/ngx-gallery";
import { AgmCoreModule } from '@agm/core';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { ProjectDetailRoutingModule } from './project-detail-routing.module';
import { ProjectDetailComponent } from 'app-main/project-detail/project-detail.component';
import { UserManualModalComponent} from "./user-manual-modal.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        ProjectDetailRoutingModule,
        SharedModule,

        DataTablesModule,
        ReactiveFormsModule,
        ShareModule,
        NgxGalleryModule,
        DataTableModule,
        PaginatorModule,
        AngularMultiSelectModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDJCu77lWr6V5WRzA_D4Q9Kp2qmzIiuFcY'
        })
    ],
    declarations: [
        ProjectDetailComponent,
        UserManualModalComponent
    ]
})
export class ProjectDetailModule { }
