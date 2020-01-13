import {Component, ViewChild, Injector, Output, EventEmitter, ElementRef} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {AdminServiceProxy, AddSocialMediaInputDto} from "@shared/service-proxies/service-proxies";
import {AppComponentBase} from '@shared/common/app-component-base';
import {ScriptLoaderService} from '@shared/common/_services/script-loader.service';
import {DropzoneComponent, DropzoneDirective, DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import {FormBuilder, FormGroup, Validators, Form} from "@angular/forms";
import {FileUploadModule} from "primeng/primeng";
import {FileUploader, FileUploaderOptions} from "ng2-file-upload";
import {AppConsts} from "@shared/AppConsts";
import {IAjaxResponse} from "abp-ng2-module/dist/src/abpHttp";
import {TokenService} from "abp-ng2-module/dist/src/auth/token.service";

export class image {
    icon: any;
}

export class FormControl {
    social: any;
    status: any;
}

@Component({
    selector: 'socialModalAdd',
    templateUrl: './social-modal-add.component.html',

})
export class SocialModalAddComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('socialModalAdd') modal: ModalDirective;
    @ViewChild('SocialName') nameInput: ElementRef;
    @ViewChild(DropzoneComponent) dropzonRef: DropzoneComponent;
    @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;


    public uploader: FileUploader;
    public temporaryPictureUrl: string;
    private temporaryPictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};
    active = true;
    saving = false;
    model: AddSocialMediaInputDto;
    isActive = true;
    socialForm: FormGroup;
    model_img: image = new image;
    form_control: FormControl = new FormControl;
    _form_control: FormControl = new FormControl;
    formGroup: FormGroup;
    uploadedFileName = null;
    uploadedFileNamePastSrc = '';
    uploadedFileNamePast = null;
    uploaded;

    optionsFile = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadSocialMediaIcon',
        pictureUrl: 'SosialMediaIcon',
        max_width: 201,
        max_height: 201,
    }

    form_builder_selection = {
        'social': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
        'status': [null],
        'icon': [null],
    }

    constructor(injector: Injector,
                private _fb: FormBuilder,
                private _script: ScriptLoaderService,
                private _adminServiceProxy: AdminServiceProxy,
                private _tokenService: TokenService) {
        super(injector);
        this.socialForm = _fb.group(this.form_builder_selection);
        this.form_control = this.r_control();
    }

    ngOnInit(): void {
        this.model = new AddSocialMediaInputDto();
        this.model.isActive = true;
    }

    show(data?): void {
        this.model.socialMediaName = '';
        this.model.isActive = true;
        this.uploadedFileName = null;
        this.uploadedFileNamePastSrc = null;
        this.active = true;
        this.modal.show();
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    save(): void {
        this.saving = true;
        const self = this;
        this.model.socialMediaIcon = this.uploadedFileName;
        this._adminServiceProxy.createSosialMedia(this.model)
            .finally(() => this.saving = false)
            .subscribe(() => {
                    this.message.success("Social Media Added Successfully")
                        .done(() => {
                            this.close();
                            this.modalSave.emit(null);
                        });
                }
            );
    }

    close(): void {
        // this.socialForm.reset();
        // this.model.init();
        // this.model = new AddSocialMediaInputDto();
        // this.model.isActive = true;
        this.model.socialMediaName = "";
        this.delImage();
        this.modal.hide();
    }

    r_control() {
        return {
            social: this.socialForm.controls['social'],            
            status: this.socialForm.controls['status'],
            icon: this.socialForm.controls['icon']
        }
    }

    companyLogoUploaded(event): void {
        // abp.notify.success('FileUploaded');
        // this.uploadedFileName = event.toString();
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if(this.uploaded == 'true'){
                abp.notify.success('FileUploaded');
                this.uploadedFileName = event.toString();
            } else{
                this.uploadedFileName = null;
                $("#logo").val(null);
                abp.notify.warn('height and width must be 200px x 200px below it');
            } 
            
        }, 800);
    }

    pictureUrl(event) {
        // this.uploadedFileNamePastSrc = event.toString();
        // this.appFileNamePastSrc = event.toString();
        this.uploadedFileNamePastSrc = null;
        // this.LogoFileNamePastSrc = event.toString();
        //Get reference of FileUpload.
        var fileUpload = $("#logo")[0];
        // debugger
        //Check whether HTML5 is supported.
        if (typeof (fileUpload['files']) != "undefined") {
            //Initiate the FileReader object.
            var reader = new FileReader();
            //Read the contents of Image File.
            reader.readAsDataURL(fileUpload['files'][0]);
            reader.onload = function (e) {
                //Initiate the JavaScript Image object.
                var image = new Image();
                //Set the Base64 string return from FileReader as source.
                image.src = e.target['result'];
                image.onload = function () {
                    
                    //Determine the Height and Width.
                    var height = image.height;
                    var width = image.width;
                    if (height > 201 || width > 201) {
                        localStorage.setItem('allowupd', 'false');
                    } else{
                        localStorage.setItem('allowupd', 'true');
                    }
                };
            }
        } else {
          alert("This browser does not support HTML5.");
        }
        
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if(this.uploaded == 'true'){
                this.uploadedFileNamePastSrc = event.toString();
            } else {
                this.uploadedFileNamePastSrc = null;
            }    
        }, 500);
    }

    delImage = function () {
        this.uploadedFileName = null;
        $("input[type='file']").val(null);
        this.model.socialMediaIcon = null;
        this.uploadedFileNamePastSrc = null;
    }

    removefile(id: string) {
        this.model_img.icon = null;
    }
}
