import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { AppComponentBase } from "@shared/common/app-component-base";
import { DropzoneComponent, DropzoneDirective } from "ngx-dropzone-wrapper";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminServiceProxy, UpdateManageProjectInputDto,AdminPromoServiceProxy, CreatePromoInputDto,UpdatePromoInputDto } from "@shared/service-proxies/service-proxies";
import * as moment from 'moment';
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";

export class ManagePromoCtrl {
    projectID: any
    activeFrom: any
    activeTo: any
    targetURL: any
    sortNo: any 
    uploadFileWeb: any
    uploadFileApp: any
}

@Component({
    selector: 'managePromoModal',
    templateUrl: './manage-promo-addedit-modal.component.html'
})

export class ManagePromoAddEditModalComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;

    @ViewChild('ActiveFromDatePicker') activeFromDatePicker: ElementRef;
    @ViewChild('ActiveToDatePicker') activeToDatePicker: ElementRef;

    active: boolean = false;
    saving: boolean = false;

    promoForm: FormGroup;
    form_ctrl: ManagePromoCtrl = new ManagePromoCtrl;
    model: ManagePromoCtrl = new ManagePromoCtrl;
    projectCode;
    projectName;
    finalActiveFromDate;
    finalActiveToDate;
    _projects;
    projectId;
    promoId;
    action;
    recordItem;
    webFileName = null;
    webFileNamePastSrc = null;
    uploaded;
    appFileName = null;
    appFileNamePastSrc = null;
    uploadedFileNamePast = null;
    updateDto: UpdatePromoInputDto = new UpdatePromoInputDto();
    status;    
    imgAppUpdated = false;
    imgWebUpdated = false;
    form_builder_model = {
        'projectID': [null, Validators.compose([Validators.required])],
        'activeFrom': [null, Validators.compose([Validators.required])],
        'activeTo': [null],
        'targetURL': [null, Validators.compose([Validators.required, Validators.maxLength(200)])],
        'sortNo': [null, Validators.compose([Validators.required, Validators.max(1000)])],
        'uploadFileWeb': [null],
        'uploadFileApp': [null],
    }

    optionsWeb = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadPromoImage',
        pictureUrl: 'Promo',
        max_width: 1024,
        max_height: 768,
    }

    optionsApp = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadPromoImageApp',
        pictureUrl: 'PromoApp',
        max_width: 640,
        max_height: 640,
    }
    constructor(injector: Injector,
        private _fb: FormBuilder,
        private _adminServiceProxy: AdminServiceProxy,
        private _promoService: AdminPromoServiceProxy) {
        super(injector);
        this.promoForm = _fb.group(this.form_builder_model);
        this.form_ctrl = this.r_control();        
    }

    
    ngOnInit() {
        this.getListProject();
    }

    pictureWeb(event) {
        // this.webFileNamePastSrc = event.toString();
        this.webFileNamePastSrc = null;
        // this.LogoFileNamePastSrc = event.toString();
        //Get reference of FileUpload.
        var fileUpload = $("#uploadFileWeb")[0];
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
                    if (height > 768 || width > 1024) {
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
                this.webFileNamePastSrc = event.toString();
            } else {
                this.webFileNamePastSrc = null;
            }    
        }, 500);
    }

    pictureApp(event) {
        // this.appFileNamePastSrc = event.toString();
        this.appFileNamePastSrc = null;
        // this.LogoFileNamePastSrc = event.toString();
        //Get reference of FileUpload.
        var fileUpload = $("#uploadFileApp")[0];
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
                    if (height > 640 || width > 640) {
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
                this.appFileNamePastSrc = event.toString();
            } else {
                this.appFileNamePastSrc = null;
            }    
        }, 500);
    }

    webUploaded(event): void {     
        // abp.notify.success('FileUploaded');
        // this.webFileName = event.toString();
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if(this.uploaded == 'true'){
                abp.notify.success('FileUploaded');
                this.webFileName = event.toString();
            } else{
                this.webFileName = null;
                $("#uploadFileWeb").val(null);
                abp.notify.warn('height and width must be 1024px x 768px below it');
            } 
            
        }, 800);
    }

    appUploaded(event): void {
        // abp.notify.success('FileUploaded');
        // this.appFileName = event.toString();
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if(this.uploaded == 'true'){
                abp.notify.success('FileUploaded');
                this.appFileName = event.toString();
            } else{
                this.appFileName = null;
                $("#uploadFileApp").val(null);
                abp.notify.warn('height and width must be 640px x 640px below it');
            } 
            
        }, 800);
    }

    delImageWeb() {
        this.webFileName = null;
        $("#inputWebImg").val(null);
        this.webFileNamePastSrc = null;
    }

    delImageApp() {
        this.appFileName = null;
        $("#inputAppImg").val(null);
        this.appFileNamePastSrc = null;
    }
    
    projectLoading = false;
    getListProject() {
        this.projectLoading = true;
        this._adminServiceProxy.getListAllProject().finally(() => {
        }).subscribe(result => {
            this.refreshProject();
            this._projects = result.items;
        });
    }

    refreshProject(){        
        setTimeout(() => {
            $('.project').selectpicker('refresh');
            this.projectLoading = false;
        }, 0);
    }

    onChangeProject(obj) {
        this.projectId = obj.target.value;  
    }

    invalidBirthdate = false;
    finalBirthDate1;
    finalBirthDate2;
    onSelectedDate(date, type) {
        let dateInput = moment(date).format('YYYY-MM-DD');
        if (type === "start") {
            this.model.activeFrom = dateInput;
            this.finalBirthDate1 = moment(date).format('YYYY-MM-DD');

        } else { 
            this.finalBirthDate2 = moment(date).format('YYYY-MM-DD');
            this.model.activeTo = dateInput; 
        }
    }   

    allowSave;
    validasi(){
        this.allowSave = true;
        let comparedate = this.compare(this.finalBirthDate1,this.finalBirthDate2,'','',0);
        if ((comparedate==false) && (this.model.activeTo!=undefined || this.model.activeTo!="")){ // End date must be greater than start date            
            this.message.error('End date must be greater than Start date!');
            this.allowSave= false;
        }
    }
    
    compare(dateTimeA, dateTimeB, dateTimeC, dateTimeD, type) {
        var momentA = moment(dateTimeA,"YYYY-MM-DD");
        var momentB = moment(dateTimeB,"YYYY-MM-DD");
        if (type==0){
            if (momentA >= momentB) return false;
            else if (momentA < momentB) return true;
        }else if(type==1){
            var momentC = moment(dateTimeC,"YYYY-MM-DD");
            var momentD = moment(dateTimeD,"YYYY-MM-DD");
            if (((momentA >= momentC) && (momentA <= momentD))) {
                return false;
            }
            else{
                return true;
            }
        }
    }

    show(action:any,record: any, getall): void {        
        this.webFileName = null;
        this.appFileName = null;
        this.action= action;

        if (action=='Edit'){   
            this.imgAppUpdated = true;
            this.imgWebUpdated = true;
            this.appFileNamePastSrc = record.promoFileApp;
            this.webFileNamePastSrc = record.promoFileWeb;
            this.recordItem = getall;
            this.promoId = record.promoId;       
            this.model.projectID = record.projectID;
            this.refreshProject();
            this.model.targetURL = record.targetURL;
            this.model.activeFrom = moment(record.periodStart).format('YYYY-MM-DD');
            if (record.periodEnd!=undefined){
                this.model.activeTo = moment(record.periodEnd).format('YYYY-MM-DD');
                var momentB = moment(this.model.activeTo,"YYYY-MM-DD");
                this.finalBirthDate2 = moment(momentB).format('YYYY-MM-DD');
            }
            this.model.sortNo = record.sortNo;
            
            var momentA = moment(this.model.activeFrom,"YYYY-MM-DD");
            this.finalBirthDate1 = moment(momentA).format('YYYY-MM-DD');

        }else{
            $('#activeFrom').datepicker('update','');
            $('#activeEnd').datepicker('update','');
            this.model.activeFrom = undefined;
            this.model.activeTo = undefined;
            this.finalBirthDate2=undefined;
            this.promoForm.reset(); 
            this.appFileNamePastSrc = null;
            this.webFileNamePastSrc = null;
            this.webFileName = null;
            this.appFileName = null;
            this.model.projectID = undefined;
            this.refreshProject();
        }

        this.modal.show();
    }

    save(): void {
        this.validasi();
        
        let imgAppStatus; let imgWebStatus;
        if (this.appFileNamePastSrc=="-"){
            imgAppStatus = "";
        }else{            
            if ((this.appFileName == "" || this.appFileName == null) && (this.appFileNamePastSrc!=null)){
                imgAppStatus = "";
            }else if ((this.appFileName == "" || this.appFileName == null) && (this.imgAppUpdated==true) && (this.appFileNamePastSrc==null)){
                imgAppStatus = "removed";
            }else{
                imgAppStatus = "updated";
            }
        }

        if (this.webFileNamePastSrc=="-"){
            imgWebStatus = "";
        }else{     
            if ((this.webFileName == "" || this.webFileName == null) && (this.webFileNamePastSrc!=null)){
                imgWebStatus = "";
            }else if ((this.webFileName == "" || this.webFileName == null) && (this.imgWebUpdated==true) && (this.webFileNamePastSrc==null)){
                imgWebStatus = "removed";
            }else{
                imgWebStatus = "updated";
            }
        }

        if (this.allowSave){
            if (this.action=='Add'){
                let createDto: CreatePromoInputDto = new CreatePromoInputDto();
                createDto.promoFileWeb = this.webFileName == null ? '' : this.webFileName;
                createDto.promoFileApp = this.appFileName == null ? '' : this.appFileName; 
                // createDto.promoAlt = "";
                createDto.promoDataType = "1";
                createDto.targetURL = this.model.targetURL;
                createDto.projectID = this.model.projectID;
                createDto.sortNo = this.model.sortNo;
                createDto.periodStart = this.finalBirthDate1; 
                if (this.finalBirthDate2 != undefined){
                    createDto.periodEnd = this.finalBirthDate2;   
                } 
                createDto.isActive = true;         
                this._promoService.createPromo(createDto)
                    .finally(() => this.saving = false)
                    .subscribe(result => {
                        this.message.success("Promo " + result.message + " Successfully")
                            .done(() => {
                                this.close();
                                this.modalSave.emit(null);
                            });
                    }, err => {
                        this.message.error(err.message)
                            .done(() => {
                                console.error("createPromo ", err.message);
                            });
                    });
            }else{           
                let imgStatus=true;
                this.updateDto.promoId = this.promoId;
                this.updateDto.promoFileWeb = this.webFileName;
                this.updateDto.promoFileApp = this.appFileName; 
                // this.updateDto.promoAlt = "";
                this.updateDto.promoDataType = "1";
                this.updateDto.targetURL = this.model.targetURL;
                this.updateDto.projectID = this.model.projectID;
                this.updateDto.sortNo = this.model.sortNo;
                this.updateDto.periodStart = this.finalBirthDate1;  
                this.updateDto.periodEnd = this.finalBirthDate2;   
                this.updateDto.isActive = true;   
                this.updateDto.imageStatusFileApp = imgAppStatus;   
                this.updateDto.imageStatusFileWeb = imgWebStatus;   
                this._promoService.updatePromo(this.updateDto)
                    .finally(() => this.saving = false)
                    .subscribe(result => {
                        this.message.success("Promo " + result.message + " Successfully")
                            .done(() => {
                                this.close();
                                this.modalSave.emit(null);
                            });
                    }, err => {
                        this.message.error(err.message)
                            .done(() => {
                                console.error("updatePromo ", err.message);
                            });
                    });
            }
        }
    }

    close() {
        // this.model.sortNo = "";
        // this.model.activeFrom = "";
        // this.model.activeTo = "";
        // this.model.targetURL = ""; 
        this.promoForm.reset();
        this.active = false;
        this.modal.hide();
    }

    r_control() {
        return {
            projectID: this.promoForm.controls['projectID'],
            activeFrom: this.promoForm.controls['activeFrom'],
            activeTo: this.promoForm.controls['activeTo'],
            targetURL: this.promoForm.controls['targetURL'],
            sortNo: this.promoForm.controls['sortNo'],
            uploadFileWeb: this.promoForm.controls['uploadFileWeb'],
            uploadFileApp: this.promoForm.controls['uploadFileApp'],
        }
    }

}
