import {Component, ViewChild, Injector, Output, EventEmitter, ElementRef, ViewEncapsulation} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {AppComponentBase} from '@shared/common/app-component-base';
import {DropzoneComponent, DropzoneDirective, DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import {FormBuilder, FormGroup, Validators, Form} from "@angular/forms";
import {
    GetListHistoryPaymentResultDto, InsertPaymentOfflineInputDto,
    PaymentPPServiceProxy, TransactionServiceProxy
} from "@shared/service-proxies/service-proxies";
import {ValidationService} from "@app/pponline/share/validation.service";
import {FileUploader, FileUploaderOptions} from "ng2-file-upload";

@Component({
    selector: 'orderPPModal',
    templateUrl: './order-pp-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./order-pp.component.css']

})
// export class CheckPayment {
//     orderCode: any;
//     projectID: any;
//     projectCode: any;
//     customerName: any;
//     psCode: any;
//     orderStatusName: any;
//     ppOrderID: any;
//     qty: any;
//     totalAmount: any;
//     outstanding: any;
//     paidAmount: any;
//   }

export class OrderPPModalComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('orderPPModal') modal: ModalDirective;
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
    createPaymentData: InsertPaymentOfflineInputDto;
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

    // _model: CheckPayment = new CheckPayment;

    optionsFile = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadReceipt',
        pictureUrl: 'PPOnline',
    }

    constructor(injector: Injector,
                private _fb: FormBuilder,
                private _paymentPPServiceProxy: PaymentPPServiceProxy,
                private _transactionServiceProxy: TransactionServiceProxy) {
        super(injector);
        this.validationForm = _fb.group({
            'paymentDate': [null, [Validators.required]],
            'paymentType': [null, [Validators.required]],
            'bankList': [null, [Validators.required]],
            'location': [null, [Validators.required]],
            'accountNo': [null, Validators.compose([Validators.required, ValidationService.numValidator])],
            'accountName': [null, [Validators.required]],
            'uploader': [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.showCreatePayment = false;
        this.model = new GetListHistoryPaymentResultDto;
        this.createPaymentData = new InsertPaymentOfflineInputDto;
        this.getData = {
            customerName: undefined,
            qty: undefined,
            paymentID: undefined,
            ppOrderID: undefined
        };
    }

    paymentCheck: any;
    //show modal with data table
    show(record,action): void {
        if (action==true){
            this.actionForm=true; 
        }else{
            this.actionForm=false; 
        } 
        this.active = true;
        this.modal.show();
        this.dataRecord = record;
        setTimeout(() => {
            $(".paymentDate").datepicker("setDate", new Date());
            $(".paymentDate").datepicker('refresh');
        }, 500);
        // this.createPaymentData.paymentAmt = this.dataRecord.outstanding;
        this.getListPaymentType();
        this.getListBank();
        this.getListPaymentCheck(record);
        
    }

    test: any;
    getListPaymentCheck(record): void {
        this._paymentPPServiceProxy.getListPaymentCheck(record.projectID, record.orderCode, record.cutomerName)
        .finally(() => {
            setTimeout(() => {
              $('.paymentChecks').selectpicker('refresh');
            }, 0);
          }).subscribe(result => {
            
            this.paymentCheck = result.forEach(items => {
                this.dataRecord.qty = items.qty;
                this.dataRecord.totalAmount = items.totalAmount;
                this.dataRecord.paidAmount = items.paidAmount;
                this.dataRecord.outstanding = items.outstanding;
                this.createPaymentData.paymentAmt = items.outstanding;
            })
          });
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

    // get list bank dropdown
    getListBank(): void {
        this.bankLoading = true;
        this._paymentPPServiceProxy.getListDropdownBank().finally(() => {
            setTimeout(() => {
                this.bankLoading = false;
                $(".bankList").selectpicker('refresh');
            }, 200)
        }).subscribe(result => {
            this.bankList = result;
        });
    }

    // create payment history
    createPayment() {
        this.createPaymentData.ppOrderID = this.dataRecord.ppOrderID;
        this.createPaymentData.docFile = this.uploadedFileName;
        this.createPaymentData.paymentDate = this.dateFormat;
        this._transactionServiceProxy.inputPaymentOffline(this.createPaymentData).subscribe((result) => {
            this.message.success("Create payment Successfully")
                .done(() => {
                    this.close();
                    this.modalSave.emit(null);
                });
        });
    }


    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    save(): void {
        this.saving = true;
        const self = this;
    }

    //notification & change uploaded file name
    companyLogoUploaded(event): void {
        abp.notify.success('File Uploaded');
        this.uploadedFileName = event.toString();
    }

    // set url folder temporary
    pictureUrl(event) {
        this.uploadedFileNamePastSrc = event.toString();
    }

    // delete image
    delImage = function () {
        this.uploadedFileName = null;
        $("input[type='file']").val(null);
        this.model.socialMediaIcon = null;
        this.uploadedFileNamePastSrc = null;
    }


    close(): void {
        this.validationForm.reset();
        this.active = false;
        this.modal.hide();
    }

}
