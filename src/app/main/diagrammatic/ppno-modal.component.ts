import {Component, ViewChild, Injector, Output, EventEmitter, ElementRef} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {AppComponentBase} from '@shared/common/app-component-base';
import {AppConsts} from '@shared/AppConsts';
import {
    RoleServiceProxy,
    RoleListDto,
    BookingHistoryServiceProxy,
    DiagramaticServiceProxy,
    ListDetailDiagramaticWebResultDto,
    VerifyPPNoInputDto,
} from '@shared/service-proxies/service-proxies';
import {Router, ActivatedRoute} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as _ from 'lodash';
import { ValidationService } from "@app/main/share/validation.service";
import * as moment from 'moment';
import { AppSessionService } from '@shared/common/session/app-session.service';

export class ppCtrl {
    ppnumber: any
    birthDate: any
}

@Component({
    selector: 'ppnoModal',
    templateUrl: './ppno-modal.component.html'
})

export class PPNoModalComponent extends AppComponentBase {
    @ViewChild('SampleDatePicker') sampleDatePicker: ElementRef;
    @ViewChild('ppnoModal') modal: ModalDirective;  
    insertPPLoading : any = false;    
    model_ctrl: ppCtrl = new ppCtrl;
    model: ppCtrl = new ppCtrl;
    finalBirthDate;
    project; tower; unitno; unitcode; unitid;
    ppLoading=false;
    ppForm: FormGroup;
    _ppno;

    form_builder_model = {
        'ppnumber': [null, Validators.compose([Validators.required, Validators.maxLength(16)])],
        'birthDate': [null]
    }

    constructor(injector: Injector,
                private _diagramServices: DiagramaticServiceProxy,
                private _fb: FormBuilder,
                private _appSessionService: AppSessionService,
                private _router: Router) {
        super(injector);
        this.ppForm = _fb.group(this.form_builder_model);
        this.model_ctrl = this.r_control();
    }

    show(project: any,tower: any,unitNo: any, unitCode: any, unitID: any): void {
        this.getListPPNo(this._appSessionService.userId);
        this.project = project;
        this.tower = tower;
        this.unitno = unitNo;
        this.unitcode = unitCode;
        this.unitid = unitID;
        this.reset();
        this.modal.show();
    }

    close(): void {
        this.reset();
        this.modal.hide();
    }

    reset(){
        this.model.ppnumber = '';
        this.model.birthDate = undefined;
        this.finalBirthDate = undefined;
    }

    r_control() {
        return {
            ppnumber: this.ppForm.controls['ppnumber'],
            birthDate: this.ppForm.controls['birthDate'],
        }
    }

    getListPPNo(userid) {
        console.log('userid',userid);
        this.ppLoading = true;
        this._diagramServices.getListPPNoMobile(userid).finally(() => {
            setTimeout(() => {
                $('.project').selectpicker('refresh');
                this.ppLoading = false;
            }, 0);
        }).subscribe(result => {
            console.log('_ppno', result);
            this._ppno = result;
        });
    }

    invalidBirthdate = false;
    onSelectedBirthDate(birthdate) {
        let dateInput = moment(birthdate).format('MM/DD/YYYY');
        this.model.birthDate = dateInput;

        if (new Date(dateInput.toString()) > new Date()) this.invalidBirthdate = true;
        else {
            this.invalidBirthdate = false;
            this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
        }
    }

    save() {
        this.insertPPLoading = true;
        let dtoPP = new VerifyPPNoInputDto;
        dtoPP.ppNo = this.model.ppnumber.ppno;
        dtoPP.birthDate = this.finalBirthDate;
        
        console.log(this.project);
        console.log(this.tower);
        console.log(this.unitno);
        console.log(this.unitcode);
        console.log(this.model.ppnumber);
        console.log(this.finalBirthDate);
        
            this._diagramServices.verifyPPNo(dtoPP)
            .finally(() => {
                  }).subscribe(result => {
                console.log('result',result);
                if (result){
                    this.message.success(result.message)
                    .done(() => {
                        this.insertPPLoading = false;
                        
                        this._router.navigate(['/app/main/booking-unit/', this.project, this.tower,this.unitno,this.unitcode,this.unitid, this.model.ppnumber.ppno, this.model.ppnumber.psCode]);
                    });
                }
            }, err => {
                this.message.error(err.message)
                    .done(() => {
                        this.insertPPLoading = false;
                        console.error("err ", err.message);
                    });
            });    
    }
}
