import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, Form } from "@angular/forms";
import {
    GetListHistoryPaymentResultDto, InsertPaymentOfflineInputDto,
    PaymentPPServiceProxy, TransactionServiceProxy, PaymentBookingFeeServiceProxy, GetPaymentBookingFeeInputDto, PaymentOnlineBookingResponse
} from "@shared/service-proxies/service-proxies";
import { ValidationService } from "@app/pponline/share/validation.service";
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";

@Component({
    selector: 'paymentCheckingBFModal',
    templateUrl: './payment-checking-BF-modal.component.html',
    encapsulation: ViewEncapsulation.None,

})
export class PaymentCheckingBFModalComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('paymentCheckingModal') modal: ModalDirective;
    @ViewChild('amount') nameInput: ElementRef;
    @ViewChild('logo') logo: ElementRef;
    @ViewChild(DropzoneComponent) dropzonRef: DropzoneComponent;
    @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;
    public uploader: FileUploader;
    public temporaryPictureUrl: string;
    private temporaryPictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};

    active = true;
    bankList: any;
    dataRecord: any = [];
    detailPaymentInfo: any = [];
    dateFormat: any;
    model: any;
    getData: any;
    saving = false;
    isActive = true;
    createPaymentData: any;
    outstanding: any;
    validationForm: FormGroup;
    paymentType: any;
    updateImage = "updated";
    removeImage = "removed";
    uploadedFileName = null;
    uploadedFileNamePastSrc = null;
    uploadedFileNamePast = null;
    uploadedFileNameTemp = null;
    showCreatePayment = false;
    actionForm = true;
    accountLoading:boolean;
    accountList:any[];
    input :any = new GetPaymentBookingFeeInputDto();
    optionsFile = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadReceipt',
        pictureUrl: 'PPOnline',
    }

    constructor(injector: Injector,
        private _fb: FormBuilder,
        private _paymentPPServiceProxy: PaymentPPServiceProxy,
        private _transactionServiceProxy: TransactionServiceProxy,
        private _paymentBFServiceProxy:PaymentBookingFeeServiceProxy) {
        super(injector);
        this.validationForm = _fb.group({
            'paymentDate': [null, [Validators.required]],
            'paymentType': [null, [Validators.required]],
            'bankList': [null, [Validators.required]],
            'accountNo': [null, Validators.compose([Validators.required])],
            'accountList': [null, [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.showCreatePayment = false;
        this.model = new GetListHistoryPaymentResultDto;
    }

    //show modal with data table
    show(record, action): void {
        if (action == true) {
            this.actionForm = true;
        } else {
            this.actionForm = false;
        }
        this.active = true;
        this.modal.show();
        this.dataRecord = record;
        Object.assign(this.input,record);
        this.input.accountNo = record.nomorRekeningPemilik;
        this.input.paymentDateStr = '';
        this.input.bankName = record.bankRekeningPemilik;
        setTimeout(() => {
            $(".paymentDate").datepicker("setDate", new Date());
            $(".paymentDate").datepicker('refresh');
        }, 500);
        this.getListPaymentType();
        this.getListAccount();
        console.log(record);
    }

    onSelectedDate(date) {
        let dateInput = date.format('YYYY/MM/DD');
        this.dateFormat = dateInput;
    }

    paymentTypeLoading = false;

    // get list payment type dropdown
    getListPaymentType(): void {
        this.paymentTypeLoading = true;
        this._paymentPPServiceProxy.getListPaymentType().finally(() => {
            setTimeout(() => {
                this.paymentTypeLoading = false;
                $(".paymentType").selectpicker('refresh');
            }, 200)
        }).subscribe(result => {
            this.paymentType = result;
        });
    }

    bankLoading = false;

    // get list account dropdown
    getListAccount():void{
        this.accountLoading=true;
        this._paymentBFServiceProxy.getDropdownAccount(this.dataRecord.projectID).finally(() => {
            setTimeout(() => {
                this.accountLoading = false;
                $(".accountList").selectpicker('refresh');
            }, 200)
        }).subscribe(result => {
            this.accountList = result;
        });
    }

    // create payment history
    createPayment() {
        this.saving = true;
        this.input.paymentDate=this.strToMoment(this.input.paymentDateStr,'MM/DD/YYYY');
        console.log(this.input);
        this._paymentBFServiceProxy.updateUnitOrderHeader(this.input)
        .finally(()=>{
        })
        .subscribe(result=>{
           this.processDeBooking();
        },err=>{
            this.saving=false;
        });
    }
    processDeBooking(){
        let a = new PaymentOnlineBookingResponse();
        a.order_id=this.dataRecord.orderCode;
        a.transaction_status = "settlement";
        this._transactionServiceProxy.doBooking(a)
        .finally(()=>{
        })
        .subscribe(result=>{
            this.proccesPayment();
        },err=>{
            this.saving=false;
        });
    }
    proccesPayment(){
        this._paymentBFServiceProxy.processSinglePayment(this.input)
        .finally(()=>{
            this.saving = false;
        })
        .subscribe(result=>{
            this.close();
            abp.notify.success('Input payment booking fee manual success')
        });
    }


    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    save(): void {
        this.saving = true;
        const self = this;
    }

    close(): void {
        this.validationForm.reset();
        this.active = false;
        this.modalSave.emit(null);
        this.modal.hide();
    }

}
