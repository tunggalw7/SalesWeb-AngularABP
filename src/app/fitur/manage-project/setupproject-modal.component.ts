import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { AppComponentBase } from "@shared/common/app-component-base";
import { DropzoneComponent, DropzoneDirective } from "ngx-dropzone-wrapper";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminServiceProxy, UpdateManageProjectInputDto } from "@shared/service-proxies/service-proxies";
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';

export class updateManageProjectCtrl {
    projectStatus: any
    activeFrom: any
    activeTo: any
}

@Component({
    selector: 'setupProjectModal',
    templateUrl: './setupproject-modal.component.html'
})

export class SetUpProjectModalComponent extends AppComponentBase {
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
        private _adminServiceProxy: AdminServiceProxy,
        private _router: Router) {
        super(injector);
        // this.form_ctrl = this.r_control();
        this.projectForm = _fb.group(this.form_builder_model);
    }

    show(): void {
        this.modal.show();
    }
    
    gotoProject(type){
        this._router.navigate(['/app/fitur/project-details/']);
    }

    close() {
        this.projectForm.reset();
        this.active = false;
        this.modal.hide();
    }

}
