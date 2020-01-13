import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import {
    AdminServiceProxy,
    CustomerMemberServiceProxy,
    AddPotentialCustomerDto,
    MyCustomerSPServiceProxy,
    UpdatePotentialCustomerInputDto,
    MsEventServiceProxy,
    MsPotentialCustomerPriceRangeServiceProxy,
    MsSalesLeadTypeServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FileUploadModule } from "primeng/primeng";
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";
import * as moment from 'moment';
import { ValidationService } from "app/shared/common/share/validation.service";
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DropimageComponent } from 'app/sales-portal/share/dropimage/dropimage.component';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { MessageService } from '@abp/message/message.service';
export class info {
    keyfeature: any
    status: any
}

@Component({
    selector: 'addPotentialCustomerModal',
    templateUrl: './add-potential-customer.component.html',
})

export class AddPotentialCustomerComponent extends AppComponentBase {
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('addPotentialCustomerModal') modal: ModalDirective;
    @ViewChild('SampleDatePicker') sampleDatePicker: ElementRef;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(DropzoneComponent) dropzonRef: DropzoneComponent;
    @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;
    @ViewChild("resetimg") resetimg: DropimageComponent;

    public uploader: FileUploader;
    public temporaryPictureUrl: string;
    private temporaryPictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};

    _documentTypeList: any = [];
    _eventList: any = [];
    potentialCustomerPriceRangeList: any = [];
    salesLeadTypeList: any = [];
    _jobList: any = [];

    projectFilter: Boolean = false;
    termFilter: Boolean = false;
    statusFilter: Boolean = false;
    summaryFilter: Boolean = false;
    specDateFilter: Boolean = false;

    locationType;
    locationProject;
    locationData: any = [];
    model: any = [];
    methodStatus;

    documentType;
    eventName;
    eventId;
    name;
    phoneNumber;
    email;
    birthDate;
    idNumber;
    idUpload;
    memberName;
    memberCode;

    job_address;
    salesLeadType;
    job;
    potentialCustomerPriceRange;
    inputUn;
    saving = false;
    finalBirthDate;
    jobLoading = false;
    validationForm: FormGroup;
    idNumberEdit;

    projectLogo;
    LogoFileName = null;
    LogoFileNamePastSrc = null;
    optionsLogo = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadDocumentCustomer',
        pictureUrl: 'IDUpload',
    }

    isEdit: boolean;
    pic: boolean;
    idPotential;
    constructor(
        injector: Injector,
        private _adminServiceProxy: AdminServiceProxy,
        private _appSessionService: AppSessionService,
        private _myCustomerServiceProxy: MyCustomerSPServiceProxy,
        private _customerMemberService: CustomerMemberServiceProxy,
        private _fb: FormBuilder,
        private _messageService: MessageService,
        private _msEventServiceProxy: MsEventServiceProxy,
        private _msPotentialCustomerPriceRangeServiceProxy: MsPotentialCustomerPriceRangeServiceProxy,
        private _msSalesLeadTypeServiceProxy: MsSalesLeadTypeServiceProxy
    ) {
        super(injector);
        this.validationForm = this._fb.group({
            'documentType': [null],
            'eventName': [null],
            'name': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
            'phoneNumber': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15), ValidationService.numValidator])],
            'email': [null, Validators.compose([Validators.required, Validators.email])],
            'birthDate': [null],
            'idNumber': [null, Validators.compose([Validators.required, ValidationService.numValidator])],
            'idUpload': [null],
            'job': [null],
            'job_address': [null],
            'potentialCustomerPriceRange': [null],
            'salesLeadType': [null]
        });

    }

    getocc;

    show(data?): void {
        this.finalBirthDate = undefined;
        this.clearForm();
        this.modal.show();
        this.isEdit = data ? true : false;

        if (data) {
            this.idPotential = data.id;
            this._myCustomerServiceProxy.getDetailPotentialCustomer(data.id)
                .subscribe(result => {
                    this.setData(result);
                    this.getocc = result.jobCustomer;
                    this.getListJob2();
                })
        } else {
            this.resetimg.removefile();
        }

        this.documentTypeLoading = false;
        this.potentialCustomerPriceRangeLoading = false;
        this.salesLeadTypeLoading = false;
        this.jobLoading = false;
        this.getListDocumentType();
        this.getListEvent();
        this.getListJob();
        this.memberCode = this._appSessionService.user.userName;
        this.inputUn = this._appSessionService.userId;
    }

    documentTypeLoading = false;
    potentialCustomerPriceRangeLoading = false;
    salesLeadTypeLoading = false;

    getListDocumentType() {
        this.documentTypeLoading = true;
        this._documentTypeList = [
            { "idType": 1, "documentName": "KTP" },
            { "idType": 2, "documentName": "KITAS" },
            { "idType": 3, "documentName": "Tanda Daftar Perusahaan" }
        ];

        this.documentType = "KTP";
        setTimeout(() => {
            $('.docType').selectpicker('refresh');
            this.documentTypeLoading = false;
        }, 3000);

        this._msPotentialCustomerPriceRangeServiceProxy.getMsPotentialCustomerPriceRangeDropdown().finally(() => {
            this.potentialCustomerPriceRangeLoading = false;
        }).subscribe(result => {
            this.potentialCustomerPriceRangeList = result.items;
            setTimeout(() => {
                $('#potentialCustomerPriceRange').selectpicker('refresh');
            }, 0);
        });

        this._msSalesLeadTypeServiceProxy.getMsSalesLeadTypeDropdown().finally(() => {
            this.salesLeadTypeLoading = false;
        }).subscribe(result => {
            this.salesLeadTypeList = result.items;
            setTimeout(() => {
                $('#salesLeadType').selectpicker('refresh');
            }, 0);
        });
    }

    getListJob2() {
        this._customerMemberService.getDropdownOccupation().finally(() => {
            this.jobLoading = false;
        }).subscribe(result => {
            this._jobList = result;
            result.forEach(items => {
                if (items.occupationDesc == this.getocc) {
                    this.job = items.occupationID;
                }
            })
            setTimeout(() => {
                $('.job').selectpicker('refresh');
            }, 0);
        });
    }

    getListJob() {
        this._customerMemberService.getDropdownOccupation().finally(() => {
            this.jobLoading = false;
        }).subscribe(result => {
            this._jobList = result;
            setTimeout(() => {
                $('.job').selectpicker('refresh');
            }, 0);
        });
    }

    clearForm() {
        this.documentType = undefined;
        this.eventName = undefined;
        this.eventId = undefined;
        this.name = undefined;
        this.phoneNumber = undefined;
        this.birthDate = undefined;
        this.finalBirthDate = undefined;
        this.email = undefined;
        this.idNumber = undefined;
        this.idNumberEdit = undefined;
        this.LogoFileName = undefined;
        this.memberCode = undefined;
        this.memberName = undefined;
        this.job_address = undefined;
        this.salesLeadType = undefined;
        this.job = undefined;
        this.potentialCustomerPriceRange = undefined;
        this.pic = false;
        this.idPotential = undefined;
        this.keyfeatureLoading = false;
    }

    removefile(id: string) {
        if (id === 'img') {
            this.idUpload = null;
        }
        if (id === 'pic') {
            this.pic = false;
            this.idUpload = null;
        }
    }


    onSending(data): void {
        let file = data[0];
        let base64image;
        setTimeout(() => {
            base64image = file.dataURL.replace('data:' + file.type + ';base64,', '');
            this.idUpload = base64image;

        }, 3000);

    }

    eventListLoading = false;
    getListEvent() {
        this.eventListLoading = true;
        this._msEventServiceProxy.getListEvent().finally(() => {
            this.eventListLoading = false;
        }).subscribe(result => {
            this._eventList = result;
            setTimeout(() => {
                $('.eventList').selectpicker('refresh');
            }, 3000);
        });
    }

    pictureLogo(event) {
        this.LogoFileNamePastSrc = event.toString();
    }

    LogoUploaded(event): void {
        abp.notify.success('FileUploaded');
        this.LogoFileName = event.toString();
    }

    onChangeType(event) {
        if (event == 'KTP') {
            this.validationForm.controls['idNumber'].setValidators(Validators.compose([null,Validators.required, Validators.minLength(16), Validators.maxLength(16), ValidationService.numValidator]));
            this.validationForm.controls['idNumber'].reset();
            this.idNumber = this.idNumberEdit;
        } else if (event == 'KITAS') {
            this.validationForm.controls['idNumber'].setValidators(Validators.compose([null,Validators.required, Validators.minLength(16), Validators.maxLength(20)]));
            this.validationForm.controls['idNumber'].reset();
            this.idNumber = this.idNumberEdit;
        } else if (event == 'Tanda Daftar Perusahaan') {
            this.validationForm.controls['idNumber'].setValidators(Validators.compose([null,Validators.required, Validators.minLength(16), Validators.maxLength(16), ValidationService.numValidator]));
            this.validationForm.controls['idNumber'].reset();
            this.idNumber = this.idNumberEdit;
        } else {
            this.validationForm.controls['idNumber'].setValidators(null);
            this.validationForm.controls['idNumber'].reset();
        }
    }

    invalidBirthdate = false;

    onSelectedBirthDate(birthdate) {
        let dateInput = moment(birthdate).format('MM/DD/YYYY');
        this.birthDate = dateInput;

        if (new Date(dateInput.toString()) > new Date()) this.invalidBirthdate = true;
        else {
            this.invalidBirthdate = false;
            this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
        }
    }

    keyfeatureLoading: boolean = false;

    save(): void {
        if (this.isEdit) {
            this.update();
        } else {
            this.memberCode = this._appSessionService.user.userName;
            this.memberName = this._appSessionService.user.name;

            let input = new AddPotentialCustomerDto();

            input.documentType = this.documentType;
            input.eventId = this.eventId;
            input.name = this.name;
            input.phoneNumber = this.phoneNumber;
            if (this.birthDate != "") input.birthDate = this.finalBirthDate;
            input.email = this.email;
            if (this.idNumber != undefined) input.idNumber = this.idNumber.toString();
            input.idUpload = this.idUpload;
            input.memberCode = this.memberCode;
            input.memberName = this.memberName;
            input.jobAddress = this.job_address;
            input.customerStatus = this.salesLeadType;
            input.jobCustomer = this.job;
            input.priceRange = this.potentialCustomerPriceRange;
            this.keyfeatureLoading = true;

            this._myCustomerServiceProxy.addPotentialCustomer(input)
                .finally(() => { this.saving = false; })
                .subscribe(result => {
                    if (result.result == true) {
                        this.notify.info(this.l('Add Customer Success!'));
                        this.close();
                        this.modalSave.emit(null);
                    } else {
                        this._messageService.error(this.l(result.message));
                    }
                });
        }
    }

    update() {
        this.memberCode = this._appSessionService.user.userName;
        let input = new UpdatePotentialCustomerInputDto();
        input.potentialCustomerID = this.idPotential
        input.documentType = this.documentType;
        input.eventId = this.eventId;
        input.name = this.name;
        input.phoneNumber = this.phoneNumber;
        if (this.birthDate != undefined) input.birthDate = moment(this.birthDate).format('YYYY-MM-DD');
        input.email = this.email;
        if (this.idNumber != undefined) input.idNumber = this.idNumber.toString();
        input.idUpload = this.idUpload;
        input.jobAddress = this.job_address;
        input.customerStatus = this.salesLeadType;
        input.jobCustomer = this.job;
        input.priceRange = this.potentialCustomerPriceRange;
        input.memberCode = this.memberCode;
        this.keyfeatureLoading = true;
        this._myCustomerServiceProxy.updatePotentialCustomer(input)
            .finally(() => { this.saving = false; })
            .subscribe(result => {
                if (result.result == true) {
                    this.notify.info(this.l('Add Customer Success!'));
                } else {
                    this.notify.error(this.l(result.message));
                }
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.modal.hide();
        this.getListDocumentType();
        this.getListEvent();
    }

    setData(data) {
        this.memberCode = this._appSessionService.user.userName;
        this.memberName = this._appSessionService.user.name;
        this.documentType = data.documentType;
        this.eventName = data.eventName;
        if (this.eventName) {
            let eventIndex = this._eventList.findIndex(x => x.eventName == this.eventName);
            this.eventId = this._eventList[eventIndex].id;
        }
        this.name = data.name;
        this.phoneNumber = data.phoneNumber;
        if (data.birthDate != undefined) this.birthDate = data.birthDate.format('MM/DD/YYYY');
        this.email = data.email;
        this.idNumberEdit = data.idNumber;
        this.idNumber = data.idNumber;
        this.idUpload = data.idUpload;
        this.pic = true;
        this.job_address = data.jobAddress;
        this.salesLeadType = data.customerStatus;
        this.job = data.jobCustomer;
        this.potentialCustomerPriceRange = data.priceRange;
    }


    findInvalidControls() {
        const invalid = [];
        const controls = this.validationForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid;
    }
}


