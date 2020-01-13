import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, SendEmailActivationLinkInput, CustomerMemberServiceProxy, SignUpMemberInputDto } from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { access } from 'fs';

export class dataAccountCtrl {
    email: any
    memberCode: any
    birthDate: any
    password: any
    confirmPassword: any
}

@Component({
    templateUrl: './member-activation.component.html',
    animations: [accountModuleAnimation()]
})
export class MemberActivationComponent extends AppComponentBase {
    @ViewChild('SampleDatePicker') sampleDatePicker: ElementRef;

    
    saving = false;
    max_date = false;
    finalBirthDate;
    editForm: FormGroup;
    customerForm: FormGroup;

    memberAct: SignUpMemberInputDto = new SignUpMemberInputDto();
    model_ctrl: dataAccountCtrl = new dataAccountCtrl;
    _model: dataAccountCtrl = new dataAccountCtrl;
    model: SignUpMemberInputDto = new SignUpMemberInputDto;

    form_builder_model = {
        'email': [null, Validators.compose([Validators.required, Validators.email])],
        'memberCode': [null, Validators.compose([Validators.required, Validators.maxLength(12)])],
        'birthDate': [null],
        'password': [null, Validators.compose([Validators.required])],
        'confirmPassword': [null, Validators.compose([Validators.required])]
    }
    
    constructor(
        injector: Injector,
        private _memberService: CustomerMemberServiceProxy, 
        private _fb: FormBuilder,
        private _router: Router
    ) {
        super(injector);
        this.customerForm = _fb.group(this.form_builder_model);
        this.model_ctrl = this.r_control();
    }

    invalidBirthdate = false;
    onSelectedBirthDate(birthdate) {
        let dateInput = moment(birthdate).format('MM/DD/YYYY');
        this.model.birthDate = dateInput;

        // console.log("birthdate ", birthdate);
        // console.log("new Date(birthdate) ", new Date(birthdate));
        // console.log("new Date() ", new Date());

        if (new Date(dateInput.toString()) > new Date()) {
            this.invalidBirthdate = true;
        }
        else {
            this.invalidBirthdate = false;
            this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
        }
    }

    trimming_fn(x) {    
        return x ? x.replace(/\s/g,'') : '';    
    }; 

    memberLoading = false;
    save(): void {
        this.memberLoading = true;
        this.saving = true;

        this.model.birthDate = this.finalBirthDate;
        this._memberService.memberActivation(this.model)
        .finally(() => {
                setTimeout(() => {
                    this.memberLoading = false;
                }, 0);
            })
            .subscribe((result) => {
                let msg_box = result.message;
                if (result.message == "Member Is Not Exist" || result.message == "Birthdate is Not Valid" ||
                result.message == "Email is Not Valid" || result.message == "Member is already activated") {
                    this.message.error(msg_box);
                } else if (result.message == "Password and Confirm Password is not match"){
                    this.message.error("Password and Confirm Password is not match!");
                } else {
                    this.message.info(msg_box).done(() => {
                        this._router.navigate(['account/login']);
                    });
                }
            });
    }

    r_control() {
        return {
            email: this.customerForm.controls['email'],
            memberCode: this.customerForm.controls['memberCode'],
            birthDate: this.customerForm.controls['birthDate'],
            password: this.customerForm.controls['password'],
            confirmPassword: this.customerForm.controls['confirmPassword'],
        }
    }
}   
