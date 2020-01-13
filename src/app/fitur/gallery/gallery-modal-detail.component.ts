import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { RoleServiceProxy, RoleListDto, AdminServiceProxy, CreateGalleryInputDto, UpdateImageGalleryInputDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Validators, FormBuilder, FormGroup, NgForm } from "@angular/forms";
import * as _ from 'lodash';
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";
export class gallery {
    imageAlt;
    images;
    sortNo;
}
@Component({
    selector: 'detailGalleryModal',
    templateUrl: './gallery-modal-detail.component.html',

})
export class GalleryModalDetailComponent extends AppComponentBase {

    @ViewChild('detailGalleryModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    title;
    saveMethod;
    model: any = [];
    model_ctrl: gallery = new gallery;
    galleryForm: FormGroup;
    projectID;
    public uploader: FileUploader;
    public temporaryPictureUrl: string;
    private temporaryPictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};
    uploadedFileName = null;
    uploadedFileNamePastSrc = null;
    uploadedFileNamePast = null;
    getRecords: any = [];
    imgUpdated = false;

    optionsFile = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadImageGallery',
        pictureUrl: 'ImageGallery',
    }

    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        private _adminService: AdminServiceProxy
    ) {
        super(injector);
        this.galleryForm = _fb.group({
            'imageAlt': [null, Validators.compose([Validators.required])],
            'sortNo': [null, Validators.compose([Validators.required])],
            'images': [null]
        });
        this.model_ctrl = this.r_control();
    }

    show(item, projectId, gallery?, record?, indeks?) {
        this.title = item;
        this.active = true;
        // this.getRecords =record;
        if (item == 'Add') {
            this.model = [];
            this.delImage();
            this.model.methodStatus = "Add";
            this.saveMethod = "Added";
            this.model.projectId = projectId;
            this.imgUpdated = false;
            this.getRecords = record;
        } else {
            var i = 0;
            record.forEach(item => {
                if (i = indeks) {
                    this.getRecords = item;
                }
                i++;
            });

            this.imgUpdated = true;
            this.saveMethod = "Updated";
            this.model.methodStatus = "Update";
            this.model.galleryId = gallery.galleryId;
            this.model = gallery;
            this.uploadedFileNamePastSrc = this.model.imageURL;
            this.model.id = indeks;
        }
        this.modal.show();
    }
    onSave(model) {
        let allowSave = true;
        this.model.imageStatus = true;
        this.model.imageURL = this.uploadedFileName;
        this.model.fileTypeId = 1;
        let imgStatus;
        if ((this.uploadedFileName == "" || this.uploadedFileName == null) && (this.imgUpdated == false)) {
            imgStatus = "";
        } else if ((this.uploadedFileName == "" || this.uploadedFileName == null) && (this.imgUpdated == true)) {
            imgStatus = "removed";
        } else {
            imgStatus = "updated";
        }
        if (this.getRecords) {
            for (var i = 0; i < this.getRecords.length; i++) {
                if (this.getRecords[i].sortNo == this.model.sortNo) {
                    allowSave = false;
                    break;
                }
            }
        }
        if (allowSave) {
            if (this.saveMethod == "Updated") {
                this.model.imageURL = this.uploadedFileName;
                this.model.imageTemp = this.uploadedFileNamePastSrc;
                this.model.imageStatus = imgStatus;
                this.model.methodStatus = "Update";
                this.modalSave.emit(this.model);
            } else {
                let dataGallery = [];
                this.model.imageURL = this.uploadedFileName;
                this.model.imageTemp = this.uploadedFileNamePastSrc;
                this.model.imageStatus = imgStatus;
                this.model.methodStatus = "Add";

                this.modalSave.emit(this.model);
            }
            this.close();
        } else {
            this.message.error('Please enter another sortno!');
        }
    }

    close() {
        this.active = false;
        this.model = [];
        this.delImage();
        this.modal.hide();
    }

    pictureUrl(event) {
        let imageUrl = event.toString();
        if (imageUrl.indexOf("?") != -1) {
            this.uploadedFileNamePastSrc = imageUrl.split("?")[0];
        } else {
            this.uploadedFileNamePastSrc = imageUrl;
        }
    }

    delImage() {
        this.uploadedFileName = null;
        $("input[type='file']").val(null);
        this.uploadedFileNamePastSrc = null;
    }

    imgUploaded(event): void {
        abp.notify.success('File Uploaded');
        this.uploadedFileName = event.toString();
    }

    r_control() {
        return {
            imageAlt: this.galleryForm.controls['imageAlt'],
            images: this.galleryForm.controls['images'],
            sortNo: this.galleryForm.controls['sortNo'],
        }
    }

}
