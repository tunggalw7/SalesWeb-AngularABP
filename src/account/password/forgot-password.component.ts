import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, SendPasswordResetCodeInput } from '@shared/service-proxies/service-proxies';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import {
    ReactiveFormsModule,
    FormsModule,
    FormGroup,
    FormControl,
    Validators,
    FormBuilder
} from '@angular/forms';

export class datactrl {
    username: any
    email: any
}

@Component({
    templateUrl: './forgot-password.component.html',
    animations: [accountModuleAnimation()]
})
export class ForgotPasswordComponent extends AppComponentBase {

    model: SendPasswordResetCodeInput = new SendPasswordResetCodeInput();

    saving = false;
    forgotPassForm: FormGroup;
    model_ctrl: datactrl = new datactrl;

    form_builder_model = {
        'email': [null, Validators.compose([Validators.required, Validators.email])],
        'username': [null, Validators.compose([Validators.required])]
    }

    constructor (
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _appUrlService: AppUrlService,
        private _fb: FormBuilder,
        private _router: Router
        ) {
        super(injector);        
        this.forgotPassForm = _fb.group(this.form_builder_model);
        this.model_ctrl = this.r_control();
    }

    trimming_fn(x) {    
        return x ? x.replace(/\s/g,'') : '';    
    }; 

    save(): void {
        this.saving = true;
        this._accountService.sendPasswordResetCode(this.model)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.message.success(this.l('PasswordResetMailSentMessage'), this.l('MailSent')).done(() => {
                    this._router.navigate(['account/login']);
                });
            });
    }
    r_control() {
        return {
            email: this.forgotPassForm.controls['email'],
            username: this.forgotPassForm.controls['username']
        }
    }
}
