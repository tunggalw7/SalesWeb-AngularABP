import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { AppComponentBase } from "@shared/common/app-component-base";
import { DropzoneComponent, DropzoneDirective } from "ngx-dropzone-wrapper";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminServiceProxy, UpdateManageProjectInputDto,AdminPromoServiceProxy,UpdateOlBookingInputDto,AdminProductSetupServiceProxy, CreatePromoInputDto,UpdatePromoInputDto } from "@shared/service-proxies/service-proxies";
import * as moment from 'moment';
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";

export class setupOBCtrl {
    projectId: any
    projectName: any
    activeStart: any
    activeEnd: any
    requirePP: any
    towerCode: any 
    towerName: any
}

@Component({
    selector: 'setupOBEdit',
    templateUrl: './product-setup-ob-edit-modal.component.html'
})

export class ProductSetupOBEditModalComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;

    @ViewChild('ActiveFromDatePicker') activeFromDatePicker: ElementRef;
    @ViewChild('ActiveToDatePicker') activeToDatePicker: ElementRef;

    active: boolean = false;
    saving: boolean = false;

    setupOBForm: FormGroup;
    form_ctrl: setupOBCtrl = new setupOBCtrl;
    model: setupOBCtrl = new setupOBCtrl;
    projectCode;
    projectName;
    finalActiveFromDate;
    finalActiveToDate;
    _projects;
    projectId;
    promoId;
    action;
    recordItem;
    olBookingId;

    form_builder_model = {
        'projectId': [null],
        'projectName': [null],
        'activeStart': [null, Validators.compose([Validators.required])],
        'activeEnd': [null],
        'requirePP': [null],
        'towerCode': [null],
        'towerName': [null]
    }

    constructor(injector: Injector,
        private _fb: FormBuilder,
        private _adminServiceProxy: AdminServiceProxy,
        private _promoService: AdminPromoServiceProxy,
        private _adminProductSetup: AdminProductSetupServiceProxy) {
        super(injector);
        this.setupOBForm = _fb.group(this.form_builder_model);
        this.form_ctrl = this.r_control();
    }

    
    ngOnInit() {
        this.getListProject();
    }

    show(action:any,record: any, getall): void {        
        $('#activeStart').datepicker('update','');
        $('#activeEnd').datepicker('update','');
        this.action= action;
        this.model.projectId = record.projectId;
        this.model.projectName = record.projectName;
        this.model.requirePP = record.isRequiredPP;
        if (record.periodStart) this.model.activeStart = moment(record.periodStart).format('MM/DD/YYYY');
        if (record.periodEnd) this.model.activeEnd = moment(record.periodEnd).format('MM/DD/YYYY');
        this.model.towerCode = record.clusterCode;
        this.model.towerName = record.towerClusterName;        
        var momentA = moment(this.model.activeStart,"DD/MM/YYYY");
        this.finalBirthDate1 = moment(record.periodStart).format('YYYY-MM-DD');
        if(record.periodEnd!=undefined){
            var momentB = moment(this.model.activeEnd,"DD/MM/YYYY");
            this.finalBirthDate2 = moment(record.periodEnd).format('YYYY-MM-DD');
        }else{
            this.finalBirthDate2 = undefined;
        }
        this.getOLBookingID(record.clusterId);
        this.modal.show();
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
        let dateInput = moment(date).format('MM/DD/YYYY');
        if (type === "start") {
            this.model.activeStart = dateInput;
            this.finalBirthDate1 = moment(date).format('YYYY-MM-DD');

        } else { 
            this.finalBirthDate2 = moment(date).format('YYYY-MM-DD');
            this.model.activeEnd = dateInput; 
        }
    }   

    allowSave;
    validasi(){
        this.allowSave = true;
        let comparedate = this.compare(this.model.activeStart,this.model.activeEnd,'','',0);
        if ((comparedate==false) && (this.model.activeEnd!=undefined)){ // End date must be greater than start date              
            this.message.error('End date must be greater than Start date!');
            this.allowSave= false;
        }        
    }

    getOLBookingID(clusterID){
        if (clusterID){
            this._adminProductSetup.editTowerClusterResult(clusterID)
            .finally(() => this.saving = false)
            .subscribe(result => {
                this.olBookingId = result.olBookingId;
            }, err => {
                this.message.error(err.message)
                    .done(() => {
                        console.error("err", err.message);
                    });
            });
        }
    }
    
    compare(dateTimeA, dateTimeB, dateTimeC, dateTimeD, type) {
        var momentA = moment(dateTimeA,"MM/DD/YYYY");
        var momentB = moment(dateTimeB,"MM/DD/YYYY");
        if (type==0){
            if (momentA >= momentB) return false;
            else if (momentA < momentB) return true;
        }else if(type==1){
            var momentC = moment(dateTimeC,"MM/DD/YYYY");
            var momentD = moment(dateTimeD,"MM/DD/YYYY");
            if (((momentA >= momentC) && (momentA <= momentD))) {
                return false;
            }
            else{
                return true;
            }
        }
    }

    save(): void {
        let updateDto: UpdateOlBookingInputDto = new UpdateOlBookingInputDto();

        this.validasi();
        if (this.allowSave){      
            updateDto.olBookingId = this.olBookingId;      
            // this.updateDto.projectId = this.model.projectId;
            updateDto.activeStart = this.finalBirthDate1;  
            if (this.finalBirthDate2!=undefined) {
                updateDto.activeEnd = this.finalBirthDate2;               
            }
            if (this.model.requirePP==undefined){
                this.model.requirePP=false;
            }
            updateDto.isRequirePP = this.model.requirePP;      
            this._adminProductSetup.updateTowerClusterInputAsync(updateDto)
                .finally(() => this.saving = false)
                .subscribe(result => {
                    this.message.success('Successfully updated setup Tower/Cluster!')
                        .done(() => {
                            localStorage.setItem("setOB","1");
                            this.close();
                            this.modalSave.emit(null);
                        });
                }, err => {
                    this.message.error(err.message)
                        .done(() => {
                            console.error("update product setup ", err.message);
                        });
                });
        }
    }

    close() {
        this.setupOBForm.reset();
        this.active = false;
        this.modal.hide();
    }

    r_control() {        
        return {
            projectId: this.setupOBForm.controls['projectId'],
            projectName: this.setupOBForm.controls['projectName'],
            activeStart: this.setupOBForm.controls['activeStart'],
            activeEnd: this.setupOBForm.controls['activeEnd'],
            requirePP: this.setupOBForm.controls['requirePP'],
            towerCode: this.setupOBForm.controls['towerCode'],
            towerName: this.setupOBForm.controls['towerName']
        }
    }
}
