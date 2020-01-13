import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AdminServiceProxy, CreateKeyFeatureInputDto, UpdateKeyFeaturesInputDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import * as _ from 'lodash';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export class info {
    keyfeature: any
}

@Component({
    selector: 'keyfeatureModal',
    templateUrl: './keyfeature.component.html',
})

export class KeyFeatureComponent extends AppComponentBase {

    @ViewChild('keyfeatureModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    locationType;
    locationProject;
    locationData: any = [];
    model: any = [];
    methodStatus;

    keyfeatureForm: FormGroup;
    form_control: info = new info;
    form_builder_model = {
        'keyfeature': [null, Validators.compose([Validators.required])]
    }

    constructor(
        injector: Injector,
        private _script: ScriptLoaderService,
        private _adminServiceProxy: AdminServiceProxy,
        private _fb: FormBuilder
    ) {
        super(injector);
        this.keyfeatureForm = _fb.group(this.form_builder_model);
        this.form_control = this.r_control();
    }

    show(type,indeks,data?): void {
        if (type=="Edit"){
            this.methodStatus = "Update";
            this.model.methodStatus = "Update";
            this.model.keyFeatures = data.keyFeatures;
            this.model.id = indeks;
        }else{
            this.keyfeatureForm.reset();
            this.model.methodStatus = "Add";
            this.methodStatus = "Add";
        }
        this.modal.show();
    }

    keyfeatureLoading: boolean = false;
    save(): void {
        this.keyfeatureLoading = true;
        this.modalSave.emit(this.model);
        this.keyfeatureForm.reset();
        this.close();
    }

    close(): void {
        this.modal.hide();
        this.keyfeatureForm.reset();
    }

    r_control() {
        return {
            keyfeature: this.keyfeatureForm.controls['keyfeature']
        }
    }
}
