import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AdminServiceProxy, UpdateTowerDetailInputDto, GetTowerDetailEditResultDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import * as _ from 'lodash';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export class info {
    activeStartDate: any
    activeEndDate: any
    status: any
    pp: any
}

@Component({
    selector: 'towerModal',
    templateUrl: './tower.component.html',
})

export class TowerComponent extends AppComponentBase {
    @ViewChild('ActiveStartDate') activeStartDate: ElementRef;
    @ViewChild('ActiveEndDate') activeEndDate: ElementRef;
    @ViewChild('towerModal') modal: ModalDirective;

    @ViewChild(DropzoneComponent) dropzonRef: DropzoneComponent;
    @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    projectId;
    towerId;
    towerName;
    towerCode;

    public activeStartDatePicker: any;
    public activeEndDatePicker: any;
    model: UpdateTowerDetailInputDto = new UpdateTowerDetailInputDto;
    // model: GetTowerDetailEditResultDto = new GetTowerDetailEditResultDto;
    towerForm: FormGroup;
    form_control: info = new info;

    form_builder_model = {
        'activeStartDate': [null, Validators.compose([Validators.required])],
        'activeEndDate': [null, Validators.compose([Validators.required])],
        'status': [null, Validators.compose([Validators.required])],
        'pp': [null, Validators.compose([Validators.required])]
    }

    constructor(
        injector: Injector,
        private _script: ScriptLoaderService,
        private _adminServiceProxy: AdminServiceProxy,
        private _fb: FormBuilder
    ) {
        super(injector);
        this.towerForm = _fb.group(this.form_builder_model);
        this.form_control = this.r_control();

        this.activeStartDatePicker = {
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        };
        this.activeEndDatePicker = {
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        };
    }

    show(data?): void {
        this.modal.show();

        if (data.projectId != "" && data.clusterID != "" || 
            data.projectId != undefined && data.clusterID != undefined) {
            
            this.projectId = data.projectId;
            this._adminServiceProxy.getTowerDetailEdit(data.clusterID)
                .subscribe(result => {
                    this.model.towerId = result.towerId;
                    this.towerName = result.clusterName;
                    this.towerCode = result.clusterCode;
                    this.model.activeFrom = result.activeFrom.format('MM/DD/YYYY');
                    this.model.activeTo = result.activeTo.format('MM/DD/YYYY');
                    this.model.isActive = result.isActive;
                    this.model.isRequiredPP = (result.isRequiredRP === null ? false : result.isRequiredRP);
                }, err => {
                    this.message.error(err.message)
                        .done(() => {
                            console.error("getTowerDetailEdit ", err.message);
                        });
                });
        }
    }

    towerLoading: boolean = false;
    save(): void {
        this.towerLoading = true;

        this._adminServiceProxy.updateTowerDetailAsync(this.model)
            .finally(() => {
                setTimeout(() => {
                    this.towerLoading = false;
                }, 0);
            })
            .subscribe(result => {
                this.message.success(this.towerName + " Updated Successfully")
                    .done(() => {
                        this.close();
                        this.modalSave.emit(this.projectId);
                    });
            }, err => {
                this.message.error(err.message)
                    .done(() => {
                        console.error("updateTowerDetailAsync ", err.message);
                    });
            });
    }

    close(): void {
        this.towerForm.reset();
        this.modal.hide();
    }

    r_control() {
        return {
            activeStartDate: this.towerForm.controls['activeStartDate'],
            activeEndDate: this.towerForm.controls['activeEndDate'],
            status: this.towerForm.controls['status'],
            pp: this.towerForm.controls['pp']
        }
    }
}
