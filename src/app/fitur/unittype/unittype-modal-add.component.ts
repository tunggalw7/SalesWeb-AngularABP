import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { AppComponentBase } from "@shared/common/app-component-base";
import { DropzoneComponent, DropzoneDirective } from "ngx-dropzone-wrapper";
import { Validators, FormBuilder, FormGroup, NgForm } from "@angular/forms";
import {
    RoleServiceProxy,
    RoleListDto,
    BookingHistoryServiceProxy,
    ProjectServiceProxy,
    ListProjectResultDto,
    ListResultDtoOfListProjectResultDto,
    AdminUnitTypeServiceProxy,
    UpdateUnitTypeInputDto
} from '@shared/service-proxies/service-proxies';
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";

export class unittype {
    clusterName: any;
    projectId: any;
    detailId: any;
    unitType: any;
    images: any;
}
export class images {
    image: any;
    img_address: any;
}

@Component({
    selector: 'unittypeModal',
    templateUrl: './unittype-modal-add.component.html'
})

export class UnittypeModalAddComponent extends AppComponentBase {
    @ViewChild('unittypeModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(DropzoneComponent) dropzonRef: DropzoneComponent;
    @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;

    active = false;
    model_img: images = new images;
    unitTypeForm: FormGroup;
    mytower;
    Listtower;
    model: any = [];
    model_ctrl: unittype = new unittype;
    public uploader: FileUploader;
    public temporaryPictureUrl: string;
    private temporaryPictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};
    uploadedFileName = null;
    uploadedFileNamePastSrc = null;
    uploadedFileNamePast = null;
    imgUpdated = false;

    optionsFile = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadDetailImages',
        pictureUrl: 'DetailImage',
    }

    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        private _adminService: AdminUnitTypeServiceProxy

    ) {
        super(injector);
        this.unitTypeForm = _fb.group({
            'clusterName': [null, Validators.compose([Validators.required])],
            'unitType': [null, Validators.compose([Validators.required])],
            'images': [null]
        });
        this.model_ctrl = this.r_control();
    }

    pictureUrl(event) {
        this.uploadedFileNamePastSrc = event.toString();
    }

    delImage() {
        this.uploadedFileName = null;
        $("input[type='file']").val(null);
        this.model_img.image = null;
        this.uploadedFileNamePastSrc = null;
    }

    imgUploaded(event): void {
        abp.notify.success('File Uploaded');
        this.uploadedFileName = event.toString();
    }

    save() {  
        let imgStatus;
        if ((this.uploadedFileName == "" || this.uploadedFileName == null) && (this.imgUpdated==false)){
          imgStatus = "";
        }else if ((this.uploadedFileName == "" || this.uploadedFileName == null) && (this.imgUpdated==true)){
          imgStatus = "removed";
        }else{
          imgStatus = "updated";
        }
        this.model.detailImage = this.uploadedFileName;
        this.model.imageStatus = "updated";
        delete this.model.clusterName;
        delete this.model.detailCode;
        delete this.model.projectID;
        delete this.model.unitType;

        let modelUnit = [];
        let val: UpdateUnitTypeInputDto = new UpdateUnitTypeInputDto();
        val.detailID = this.model.detailID;
        val.detailImage = this.uploadedFileName;
        val.imageStatus = imgStatus;
        modelUnit.push(val);

        this._adminService.updateUnitType(val)
            .subscribe(result => {
                this.modalSave.emit(null);
                this.uploadedFileNamePastSrc = null;
                this.close();
                this.message.success("Unit Type Updated Successfully").done(() => {

                });
            });
    }
    show(item) {            
        this.imgUpdated = true;
        this.model = item;
        this.model.unitType = item.unitType;
        this.model.detailName = item.unitTypeDesc;
        this.uploadedFileNamePastSrc = item.unitTypeImage;
        this.active = true;
        this.modal.show();
    }

    close() {
        this.active = false;
        this.modal.hide();
    }

    r_control() {
        return {
            clusterName: this.unitTypeForm.controls['clusterName'],
            unitType: this.unitTypeForm.controls['unitType'],
            projectId: this.unitTypeForm.controls['projectId'],
            detailId: this.unitTypeForm.controls['detailId'],
            images: this.unitTypeForm.controls['images'],
        }
    }
}
