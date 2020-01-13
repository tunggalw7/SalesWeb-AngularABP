import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { AppComponentBase } from "@shared/common/app-component-base";
import { DropzoneComponent, DropzoneDirective } from "ngx-dropzone-wrapper";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminServiceProxy, UpdateManageProjectInputDto } from "@shared/service-proxies/service-proxies";
import * as moment from 'moment';

export class updateManageProjectCtrl {
    projectStatus: any
    activeFrom: any
    activeTo: any
}

@Component({
    selector: 'manageProjectModal',
    templateUrl: './manage-project-modal.component.html'
})

export class ManageProjectModalComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;

    @ViewChild('ActiveFromDatePicker') activeFromDatePicker: ElementRef;
    @ViewChild('ActiveToDatePicker') activeToDatePicker: ElementRef;

    active: boolean = false;
    saving: boolean = false;

    projectForm: FormGroup;
    form_ctrl: updateManageProjectCtrl = new updateManageProjectCtrl;
    model: UpdateManageProjectInputDto = new UpdateManageProjectInputDto();
    projectCode;
    projectName;
    finalActiveFromDate;
    finalActiveToDate;

    form_builder_model = {
        'activeFrom': [null, Validators.compose([Validators.required])],
        'activeTo': [null, Validators.compose([Validators.required])],
        'projectStatus': [null, Validators.compose([Validators.required])]
    }

    constructor(injector: Injector,
        private _fb: FormBuilder,
        private _adminServiceProxy: AdminServiceProxy) {
        super(injector);
        // this.form_ctrl = this.r_control();
        this.projectForm = _fb.group(this.form_builder_model);
    }

    show(record: any): void {
        this.getEditProject(record.id);
        this.modal.show();
    }

    getEditProject(manageProjectID) {
        this._adminServiceProxy.getDetailProject(manageProjectID)
            .subscribe(result => {
                this.projectCode = result.projectCode;
                this.projectName = result.projectName;
                this.model.activeFrom = moment(result.activeFrom).format('DD/MM/YYYY');
                this.model.activeTo = moment(result.activeTo).format('DD/MM/YYYY');
                this.finalActiveFromDate = moment(result.activeFrom).format('YYYY-MM-DD');
                this.finalActiveToDate = moment(result.activeTo).format('YYYY-MM-DD');
                this.model.projectStatus = result.projectStatus;
                this.model.manageId = result.id;
                this.model.projectId = result.projectID;
            });
    }

    invalidBirthdate = false;
    onSelectedDate(date, type) {
        let dateInput = moment(date).format('MM/DD/YYYY');
        if (type === "start") {
            this.model.activeFrom = dateInput;
            this.finalActiveFromDate = moment(date).format('YYYY-MM-DD');
        } else { 
            this.model.activeTo = dateInput; 
            this.finalActiveToDate = moment(date).format('YYYY-MM-DD');
        }

        // console.log("activeFrom ", new Date(moment(this.model.activeFrom).format('MM/DD/YYYY')));
        // console.log("activeTo ", new Date(moment(this.model.activeTo).format('MM/DD/YYYY')));

        // if (new Date(moment(this.model.activeFrom).format('MM/DD/YYYY')) > new Date(moment(this.model.activeTo).format('MM/DD/YYYY'))) this.invalidBirthdate = true;
        // else {
        //     this.invalidBirthdate = false;
        //     this.finalBirthDate = moment(date).format('YYYY-MM-DD');
        // }
    }

    save(): void {
        this.saving = true;
        this.model.activeFrom = this.finalActiveFromDate;
        this.model.activeTo = this.finalActiveToDate;

        this._adminServiceProxy.updateManageProject(this.model)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.close();
                this.modalSave.emit(null);
            }, err => {
            });
    }

    close() {
        this.projectForm.reset();
        this.active = false;
        this.modal.hide();
    }

    // r_control() {
    //     return {
    //         projectStatus: this.projectForm.controls['projectStatus'],
    //         activeFrom: this.projectForm.controls['activeFrom'],
    //         activeTo: this.projectForm.controls['activeTo']
    //     }
    // }
}
