import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { 
    AdminServiceProxy,
    MyCommissionSPServiceProxy,
    GetListProjectNameResultDto,
    GetListTermOfPaymentResultDto,
    MyProfileSPServiceProxy,
    CreateKeyFeatureInputDto, 
    UpdateKeyFeaturesInputDto,
    GetListAllProjectResultDto
 } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export class info {
    keyfeature: any
    status: any
}

@Component({
    selector: 'filterCommissionModal',
    templateUrl: './filter-commission-modal.component.html',
})

export class FilterCommissionComponent extends AppComponentBase {

    @ViewChild('filterCommissionModal') modal: ModalDirective;
    @ViewChild('ActiveStartDate') activeStartDate: ElementRef;
    @ViewChild('ActiveEndDate') activeEndDate: ElementRef;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    _projectList: GetListProjectNameResultDto[];
    _termOfPayment: GetListTermOfPaymentResultDto[];
    _termOfPaymentList: any = [];
    _statusList: any = [];
    _summaryList: any = [];
    _products: any;
    

    scmCode;
    statusId;
    termId;
    memberCode;
    // memberCode = "118886810126";

    projectFilters;
    termFilters;
    statusFilters;
    summaryFilters;
    specDateFilters;

    projectFilter: Boolean = false;
    termFilter: Boolean = false;
    statusFilter: Boolean = false;
    summaryFilter: Boolean = false;
    specDateFilter: Boolean = false;

    locationType;
    locationProject;
    locationData: any = [];
    model: any = [];
    methodStatus;

    keyfeatureForm: FormGroup;
    form_control: info = new info;
    form_builder_model = {
        'keyfeature': [null, Validators.compose([Validators.required])],
        'status': [null, Validators.compose([Validators.required])]
    }

    constructor(
        injector: Injector,
        private _adminServiceProxy: AdminServiceProxy,
        private _appSessionService: AppSessionService,
        private _mycommissionSPServiceProxy: MyCommissionSPServiceProxy,
        private _myProfileSPServerProxy: MyProfileSPServiceProxy,
        private _fb: FormBuilder
    ) {
        super(injector);
        this.keyfeatureForm = _fb.group(this.form_builder_model);
        this.form_control = this.r_control();
    }

    show(): void {
        this.modal.show();
        this.memberCode = this._appSessionService.user.userName;
        this.getMyProductList(this.memberCode);
        this.getListStatus();
        this.getListSummary();
        
    }

    projectLoading = false;
    getMyProductList(memberCode) {
        this.projectLoading = true;
        this._myProfileSPServerProxy.getMyProductList(memberCode)
        .finally(() => {
            $('.project').selectpicker('refresh');
            this.projectLoading = false;
        }).subscribe(result => {
            let scmCode = result.scmCode;
            this.getListProjectResult(scmCode);
        });
    }

    getListProjectResult(scmCode) {
        this._mycommissionSPServiceProxy.getListProjectResult(scmCode)
        .subscribe(result => {
            this._projectList = result;
        });
    }

    onChangeProject(id): void{
        if(id != undefined) {
          this.getListTerm(id);
        }
      }    

    termLoading = false;
    getListTerm(projectId){
        this.termLoading = true;
        this._mycommissionSPServiceProxy.getListTermOfPaymentResult(projectId)
        .finally(() => {
            $('.term').selectpicker('refresh');
            this.termLoading = false;
        }).subscribe(result => {
            this._termOfPayment = result;
        });
    }

    statusLoading = false;
    getListStatus() {
        this.statusLoading = true;
        this._mycommissionSPServiceProxy.getListStatusOLBooking()
        ._finally(() => {
            $('status').selectpicker('refresh');
            this.statusLoading = false;
        }).subscribe(result => {
            this._statusList = result;
        });
    }

    summaryLoading = false;
    getListSummary() {
        this.summaryLoading = true;
        this._summaryList = [
            { "summaryCode": "D", "summaryName": "Daily" },
            { "summaryCode": "W", "summaryName": "Weekly" },
            { "summaryCode": "M", "summaryName": "Monthly" },
            { "summaryCode": "Y", "summaryName": "Yearly" }
        ];
        
        setTimeout(() => {
            $('.summary').selectpicker('refresh');
            this.summaryLoading = false;
        }, 3000);
    }

    isWeekly: Boolean = false;
    onChangeSummary(obj) {
        if (obj.target.value === "W") this.isWeekly = true;
        else this.isWeekly = false;
    }

    keyfeatureLoading: boolean = false;
    save(): void {
        this.keyfeatureLoading = true;

        let filters = {
            "projectId": this.projectFilters,
            "termId": this.termFilters,
            "statusId": this.statusFilters,
            "startDate": null,
            "endDate": null
        };

        setTimeout(() => {
            this.close();
            this.modalSave.emit(filters);
            this.keyfeatureLoading = false;
        }, 3000);
    }

    close(): void {
        this.keyfeatureForm.reset();
        this.modal.hide();
    }

    r_control() {
        return {
            keyfeature: this.keyfeatureForm.controls['keyfeature'],
            status: this.keyfeatureForm.controls['status']
        }
    }
}
