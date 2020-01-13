import { Component, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AdminServiceProxy, UpdateTowerDetailInputDto, GetTowerDetailEditResultDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import * as _ from 'lodash';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import * as moment from 'moment';

@Component({
    selector: 'previewInformationModal',
    templateUrl: './preview-information.component.html',
})

export class PreviewInformationComponent extends AppComponentBase {
    @ViewChild('previewInformationModal') modal: ModalDirective;

    values: any = [];

    constructor(
        injector: Injector,
        private _script: ScriptLoaderService,
        private _adminServiceProxy: AdminServiceProxy
    ) {
        super(injector);
    }

    // towerLoading: boolean = false;
    show(projectId): void {
        this.modal.show();
        
        if (projectId != "" || projectId != undefined) {
            console.log("projectId ", projectId);
            
            this.getDetailInformation(projectId);
            this.getListTower(projectId);
            this.getListSocial(projectId);
            this.getListKeyFiture(projectId);
            
            // this.projectId = data.projectId;
            // this._adminServiceProxy.getTowerDetailEdit(data.clusterID)
            //     .subscribe(result => {
            //         this.model = result;
            //         this.towerName = result.clusterName;
            //         this.towerCode = result.clusterCode;
            //     }, err => {
            //         this.message.error(err.message)
            //             .done(() => {
            //                 console.error("getTowerDetailEdit ", err.message);
            //             });
            //     });
        }
    }

    getDetailInformation(projectID: number) {
        this._adminServiceProxy.getProjectInformationDetail(projectID)
            .subscribe(result => {
                console.log("getProjectInformationDetail ", result);
                this.values.projectDesc = result.projectDesc;
                this.values.projectDeveloper = result.projectDeveloper;
                this.values.projectWebsite = result.projectWebsite;
                this.values.projectMarketingOffice = result.projectMarketingOffice;
                this.values.projectMarketingPhone = result.projectMarketingPhone;
                // console.log('detail information', result);
            })
    }

    getListTower(projectID: number) {
        this.values.towerDetail = [];
        this._adminServiceProxy.getListTower(projectID)
            .subscribe(result => {
                this.values.towerDetail = result.items;
                console.log("getTowerDetail ", this.values.towerDetail);
            });
    }

    getListSocial(projectID: number): void {
        this._adminServiceProxy.getListSocialMediaProject(projectID)
            .subscribe(result => {
                this.values.socialDetail = result.items;
            });
    }

    getListKeyFiture(projectID: number): void {
        this._adminServiceProxy.getKeyFeatures(projectID)
            .subscribe(result => {
                this.values.keyFeaturesDetail = result.items;
                console.log("getKeyFeatures ", this.values.keyFeaturesDetail);
            });
    }

    close(): void {
        this.modal.hide();
    }
}
