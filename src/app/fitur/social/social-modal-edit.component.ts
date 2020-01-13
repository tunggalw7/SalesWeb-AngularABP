import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    AdminServiceProxy,
    EditSocialMediaResultDto,
    UpdateSocialMediaInputDto
} from "@shared/service-proxies/service-proxies";
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";
import { TokenService } from "abp-ng2-module/dist/src/auth/token.service";
import { FormBuilder, FormGroup,Validators } from "@angular/forms";

@Component({
    selector: 'socialModalEdit',
    templateUrl: './social-modal-edit.component.html',
    styleUrls: ['./social.component.css']
})

export class SocialModalEditComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('socialName') nameInput: ElementRef;

    public uploader: FileUploader;
    public temporaryPictureUrl: string;
    private temporaryPictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};
    active: boolean = false;
    saving: boolean = false;
    model: UpdateSocialMediaInputDto;
    updateImage = "updated";
    removeImage = "removed";
    notImage = null;
    modelsave: any;
    uploadedFileName = null;
    uploadedFileNamePastSrc = null;
    uploadedFileNamePast = null;
    uploadedFileNameTemp = null;
    socialForm: FormGroup;
    uploaded;

    optionsFile = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadSocialMediaIcon',
        pictureUrl: 'SosialMediaIcon',
        max_width: 201,
        max_height: 201,
    }

    constructor(injector: Injector,
        private _adminServiceProxy: AdminServiceProxy,
        private _tokenService: TokenService,
        private _fb: FormBuilder) {
        super(injector);
        this.model = new UpdateSocialMediaInputDto();
    }

    ngOnInit(): void {
        this.model = new UpdateSocialMediaInputDto();
        this.socialForm = this._fb.group({
            'socialName': [null],
            'status': [null]
        });
    }

    show(record: any): void {
        this.model.id = record.socialMediaID;
        this.model.isActive = record.isActive;
        this.model.socialMediaName = record.socialMediaName;
        this.model.socialMediaIcon = record.socialMediaIcon;
        this.uploadedFileNamePastSrc = record.socialMediaIcon;
        this.uploadedFileName = record.socialMediaIcon;
        this.uploadedFileNameTemp = record.socialMediaIcon;
        this.removeImage = '';
        this.active = true;
        this.modal.show();
        this.modelsave = this.model;
    }

    save(): void {
        this.saving = true;
        // if (this.model.socialMediaIcon == null) {
        //     this.model.iconStatus = this.removeImage;
        //     this.model.socialMediaIcon = this.uploadedFileNameTemp;
            
        // } else {
            this.model.iconStatus = this.removeImage;
            this.model.socialMediaIcon = this.uploadedFileName;
        // } 
        this._adminServiceProxy.updateSosialMedia(this.modelsave)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.message.success("Social Media Updated Successfully")
                    .done(() => {
                        this.modalSave.emit(null);
                        this.close();
                    });
            }, err => {
            });
    }

    //notification & change uploaded file name
    companyLogoUploaded(event): void {
        // abp.notify.success('File Uploaded');
        // this.uploadedFileName = event.toString();
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if(this.uploaded == 'true'){
                abp.notify.success('FileUploaded');
                this.uploadedFileName = event.toString(); 
            } else{
                this.uploadedFileName = null;
                $("#icon").val(null);
                abp.notify.warn('height and width must be 200px x 200px below it');
            } 
            
        }, 800);
    }

    // set url folder temporary
    pictureUrl(event) {
        // this.uploadedFileNamePastSrc = event.toString();
        this.uploadedFileNamePastSrc = null;
        // this.LogoFileNamePastSrc = event.toString();
        //Get reference of FileUpload.
        var fileUpload = $("#icon")[0];
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
                this.removeImage = 'updated';
                this.uploadedFileNamePastSrc = event.toString();
            } else {
                this.uploadedFileNamePastSrc = null;
            }    
        }, 500);
    }

    // delete image
    delImage = function () {
        this.uploadedFileName = null;
        $("input[type='file']").val(null);
        this.model.socialMediaIcon = null;
        this.uploadedFileNamePastSrc = null;
        this.removeImage = "removed";
    }

    close(): void {
        // this.socialForm.reset();
        this.delImage();
        this.modal.hide();
        this.active = false;
    }
}
