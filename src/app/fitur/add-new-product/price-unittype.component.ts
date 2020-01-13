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
    unittype: any
    price: any
}

@Component({
    selector: 'priceUnitModal',
    templateUrl: './price-unittype.component.html',
})

export class PriceUnitComponent extends AppComponentBase {

    @ViewChild('priceUnitModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    locationType;
    locationProject;
    locationData: any = [];
    model: any = [];
    methodStatus;

    unitForm: FormGroup;
    form_control: info = new info;
    form_builder_model = {
        'unittype': [null, Validators.compose([Validators.required])],
        'price': [null, Validators.compose([Validators.required])],
    }

    constructor(
        injector: Injector,
        private _script: ScriptLoaderService,
        private _adminServiceProxy: AdminServiceProxy,
        private _fb: FormBuilder
    ) {
        super(injector);
        this.unitForm = _fb.group(this.form_builder_model);
        this.form_control = this.r_control();
    }

    show(indeks,data?): void {
        console.log('indeks',indeks);
        console.log('data',data.keyFeatures);
        if (indeks!=undefined || indeks==0){
            this.methodStatus = "Update";
            this.model.keyFeatures = data.keyFeatures;
            this.model.id = indeks;
        }else{
            this.methodStatus = "Add";
        }
        this.modal.show();
    }

    unitLoading: boolean = false;
    save(): void {
        this.unitLoading = true;
        
        console.log('this.model',this.model);
        this.modalSave.emit(this.model);
        this.close();
    }

    close(): void {
        this.modal.hide();
        this.unitForm.reset();
    }

    r_control() {
        return {
            unittype: this.unitForm.controls['unittype'],
            price: this.unitForm.controls['price']
        }
    }
}
