import {Component, OnInit, ViewChild, Injector, ViewEncapsulation,} from '@angular/core';
import {AppComponentBase} from "@shared/common/app-component-base";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
    RefundPPServiceProxy,
    GetDetailPPNoResultDto, CreateRefundPPInputDto
} from "@shared/service-proxies/service-proxies";
import {appModuleAnimation} from "@shared/animations/routerTransition";
import {ValidationService} from "@app/pponline/share/validation.service";
import {DataTable, Paginator} from "primeng/primeng";

@Component({
    selector: 'app-refund',
    templateUrl: './refund.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./refund.component.css'],
    animations: [appModuleAnimation()]
})
export class RefundComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    validationForm: FormGroup;
    model: GetDetailPPNoResultDto;
    modelRefund: CreateRefundPPInputDto;
    reason: any;
    first: any;
    reasonSelect: any;
    reasonText: any;
    saving = false;
    search: any;
    unitInfo: any = [];
    searchValue: any;
    _ppNoID: any;
    value: boolean = false;
    data: any;

    constructor(injector: Injector,
                private _fb: FormBuilder,
                private _refundPPServiceProxy: RefundPPServiceProxy) {
        super(injector);
        this.validationForm = _fb.group({
            'bankName': [null, [Validators.required, Validators.maxLength(16)]],
            'rekNo': [null, [Validators.required, Validators.maxLength(16), ValidationService.numValidator]],
            'rekName': [null, [Validators.required, Validators.maxLength(16)]],
            'reason': [null, Validators.required],
            'yourReason': [null],
        });
    }

    ngOnInit() {
        this.model = new GetDetailPPNoResultDto;
        this.modelRefund = new CreateRefundPPInputDto;
    }
    ngAfterViewInit(): void {
        setTimeout(() => {   
            $('.ui-paginator-rpp-options').after('items per page');
        }, 0);
    }
    getDataLoading = false;
    getDataShow = false;

    //Search Data
    onChangeSearch(search): void {
        if (this.search == undefined || this.search == '') {
            this.notify.warn("PP Number cannot be null");
        } else {
            this.getDataLoading = true;
            this.searchValue = search;
            this._refundPPServiceProxy.getDetailPPNo(search)
                .finally(() => {
                        this.validationForm.reset();
                        setTimeout(() => {
                            this.getDataLoading = false;
                        }, 0);
                    }
                ).subscribe((result) => {
                this.getDataShow = true;
                this.getData(result);
            }, err => {
                this.message.info('data not found');
                this.getDataShow = false;
            });
        }
    }

    // set data on model DTO
    getData(items) {
        this.model.customerName = items.customerName;
        this.model.customerCode = items.customerCode;
        this.model.scmCode = items.scmCode;
        this.model.memberCode = items.memberCode;
        this.model.memberName = items.memberName;
        this.model.ppPrice = items.ppPrice;
        this.model.ppNoID = items.ppNoID;
        this.model.namaBank = items.namaBank;
        this.model.noRek = items.noRek;
        this.model.namaRek = items.namaRek;
        this.model.refundReason = items.refundReason;
        this.model.ppStatus = items.ppStatus;
        this.model.ppNoID = items.ppNoID;
        this.model.ppPrice = items.ppPrice;
        this.model.unitInfo = items.unitInfo;
        this.unitInfo = [this.model.unitInfo];
        if (items.ppStatus == 'Z') {
            this.notify.info("PP Number already Refund")
        } else if (items.ppStatus == 'B') {
            this.notify.info("PP Number is Booked")
        }
        this.getUnitInfo();
        this.getReason();
    }


    getUnitInfo(event = null): void {
        if (event) {
            this.first = event.first;
        } else {
            this.primengDatatableHelper.records = this.unitInfo;
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
            this.primengDatatableHelper.hideLoadingIndicator();
        }
    }

    getReasonLoading = false;

    //get list Reason
    getReason() {
        this.getReasonLoading = true;
        this._refundPPServiceProxy.getListRefundReason().finally(() => {
            setTimeout(() => {
                $('.reason').selectpicker('refresh');
                this.getReasonLoading = false;
            }, 2000);
        }).subscribe((reason) => {
            this.reason = reason;
        });
    }

    onChangeReason(reasonSelect){
        if (reasonSelect == 5){
            this.validationForm.controls['yourReason'].setValidators(Validators.compose([Validators.required]));
        } else {
            this.validationForm.controls['yourReason'].setValidators(Validators.compose([null]));
            this.validationForm.controls['yourReason'].setValue([null]);
            this.validationForm.controls['yourReason'].reset();
        }
    }

    //Create Refund
    createRefundLoading = false;

    createRefund(): void {
        this.createRefundLoading = true;
        this.modelRefund.ppNoID = this.model.ppNoID;
        this.modelRefund.refundReasonID = this.reasonSelect;
        this.modelRefund.customerName = this.model.customerName;
        this.modelRefund.customerCode = this.model.customerCode;
        this.modelRefund.memberName = this.model.memberName;
        if (this.reasonSelect == '5') {
            this.modelRefund.refundReason = this.reasonText;
        } else if (this.reasonSelect !== '5') {
            delete this.modelRefund.refundReason;
        }
        this._refundPPServiceProxy.createRefundPP(this.modelRefund)
            .finally(() => {
                    setTimeout(() => {
                        this.clear();
                        this.createRefundLoading = false;
                        this.getDataShow = false;
                    }, 0);
                }
            ).subscribe((result) => {
                window.open(result.message);
                // this.onChangeSearch(this.searchValue);
                this.reasonText = [];
                this.message.success("Refund Successfully")
                    .done(() => {
                    });
            }
        );
    }

    createUndoRefund() {
        this.undoRefund(this.model.ppNoID);
    }

    //create undo refund
    undoRefundLoading = false;

    undoRefund(ppNoID) {
        this.undoRefundLoading = true;
        this._ppNoID = ppNoID;
        this._refundPPServiceProxy.updateRefund(this._ppNoID)
            .finally(() => {
                setTimeout(() => {
                    this.undoRefundLoading = false;
                    this.getDataShow = false;
                    this.clear();
                }, 0);
            }).subscribe(() => {
            this.message.success("Undo Refund Successfully").done(() => {
                this.validationForm.reset();
            });
        });
    }

    clear() {
        this.search = null;
        this.searchValue = null;
        this.model = new GetDetailPPNoResultDto;
        this.modelRefund = new CreateRefundPPInputDto;
    }
}

