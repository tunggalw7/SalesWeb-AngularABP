import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AdminServiceProxy, CreateOrUpdateSocialMediaProjectInputDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as _ from 'lodash';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import * as moment from 'moment';

export class info {
    sosialMedia: any
    url: any
    status: any
}

@Component({
    selector: 'socialModal',
    templateUrl: './socialmedia.component.html',
})

export class SocialMediaComponent extends AppComponentBase {

    @ViewChild('socialModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    projectId;
    methodStatus;
    saveStatus;
    _socials: any = [];
    model: any = [];
    socialMediaForm: FormGroup;
    form_control: info = new info;
    
    form_builder_model = {
        'sosialMedia': [null, Validators.compose([Validators.required])],
        'url': [null, Validators.compose([Validators.required])],
        'status': [null]
    }

    constructor(
        injector: Injector,
        private _script: ScriptLoaderService,
        private _adminServiceProxy: AdminServiceProxy,
        private _fb: FormBuilder
    ) {
        super(injector);
        this.socialMediaForm = _fb.group(this.form_builder_model);
        this.form_control = this.r_control();
        this.getListSocialMedia();
    }

    show(projectInfoID, data, indeks,type): void {
        if (type == "Add") {
            this.model.sosialMediaID = undefined;
            setTimeout(() => {
                $('.socialmedia').selectpicker('refresh');
                // $('.socialmedia').prop('disabled', true);
            }, 0);
            this.model.socialMediaLink ="";
            this.model.isActive = true;
            this.methodStatus = "Add";
            this.model.methodStatus = "Add";
            this.saveStatus = "Added";
            $('.socialmedia').prop('disabled', false);
        } else {
            this.model.projectInfoID = projectInfoID;
            this.model.sosialMediaID = data.socialMediaId+"|"+data.socialMediaName;
            this.model.socialMediaLink = data.socialMediaLink;
            this.model.socialMediaLinkID = data.socialMediaLinkID;
            this.model.isActive = data.isActive;     
            this.model.methodStatus = "Update";
            this.model.id = indeks;

            this.methodStatus = "Update";
            this.saveStatus = "Updated";
            
            setTimeout(() => {
                $('.socialmedia').selectpicker('refresh');
                // $('.socialmedia').prop('disabled', true);
            }, 0);
        }
        
        this.modal.show();
    }

    sosmedLoading: boolean = false;
    save(): void {
        this.sosmedLoading = true;
        // this.model.creationTime = moment(moment(new Date()).format('YYYY-MM-DD'));
        if (this.model.isActive==undefined) this.model.isActive = false;
        this.modalSave.emit(this.model);
        this.close();
    }

    sosmedListLoading = false;
    getListSocialMedia(): void {
        this.sosmedListLoading = true;
        this._adminServiceProxy.getListSocialMedia()
            .finally(() => {
                setTimeout(() => {
                    this.sosmedListLoading = false;
                    $('.socialmedia').selectpicker('refresh');
                }, 0);
            })
            .subscribe(result => {
                this._socials = result.items;
            }, err => {
                this.message.error(err.message)
                    .done(() => {
                        console.error("getListSocialMedia ", err.message);
                    });
            });
    }

    close(): void {
        this.model = new CreateOrUpdateSocialMediaProjectInputDto;
        this.socialMediaForm.reset();
        this.model.sosialMediaID = undefined;
        setTimeout(() => {
            this.sosmedListLoading = false;
            $('.socialmedia').selectpicker('refresh');
        }, 0);
        this.modal.hide();
    }

    r_control() {
        return {
            sosialMedia: this.socialMediaForm.controls['sosialMedia'],
            url: this.socialMediaForm.controls['url'],
            status: this.socialMediaForm.controls['status']
        }
    }
}
