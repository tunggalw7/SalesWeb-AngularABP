import {AfterViewInit, Component, Injector, OnInit, Input, ViewEncapsulation, ViewChild} from "@angular/core";
import {AppComponentBase} from "@shared/common/app-component-base";
import {RefundPPServiceProxy} from "@shared/service-proxies/service-proxies";
import {DataTable, Paginator} from "primeng/primeng";
import {AppSessionService} from "@shared/common/session/app-session.service";


@Component({
    selector: 'app-report-refund-view',
    templateUrl: './report-refund-view.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./report-refund.component.css']
})

export class ReportRefundViewComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    first: any;
    dataLocalStorage: any = [];
    model: any;
    totalAmount: any;
    totalRow: number = 0;
    dataLocalStorageSort: any = [];
    ppNo: boolean = false;
    schema: boolean = false;
    customerCode: boolean = false;
    customerName: boolean = false;
    dealCloserCode: boolean = false;
    dealCloserName: boolean = false;
    ppPrice: boolean = false;
    bankName: boolean = false;
    accountNo: boolean = false;
    accountName: boolean = false;
    reason: boolean = false;
    refundDate: boolean = false;
    totalPrice: boolean = false;
    totalLength: any;
    userID: any;

    constructor(injector: Injector,
                private _appSessionService: AppSessionService,
                private _refundPPServiceProxy: RefundPPServiceProxy) {
        super(injector)
    }

    ngOnInit() {
        this.userID = this._appSessionService.userId;
        this.model = {
            refundDateFrom: undefined,
            refundDateEnd: undefined,
            schema: undefined,
            customerName: undefined
        };
        this.dataLocalStorage = JSON.parse(localStorage.getItem("reportRefund"));
        this.dataLocalStorageSort = JSON.parse(localStorage.getItem("reportRefundSort"));
        this.model = this.dataLocalStorage;
        this.getDataReport();
        this.setPpNO(this.dataLocalStorageSort);
        this.setSchema(this.dataLocalStorageSort);
        this.setCustomerCode(this.dataLocalStorageSort);
        this.setCustomerName(this.dataLocalStorageSort);
        this.setDealCloserCode(this.dataLocalStorageSort);
        this.setDealCloserName(this.dataLocalStorageSort);
        this.setPpPrice(this.dataLocalStorageSort);
        this.setBankName(this.dataLocalStorageSort);
        this.setAccountNo(this.dataLocalStorageSort);
        this.setAccountName(this.dataLocalStorageSort);
        this.setReason(this.dataLocalStorageSort);
        this.setRefundDate(this.dataLocalStorageSort);
    }

    ngAfterViewInit() {
        // localStorage.clear();
        localStorage.removeItem("reportRefund");
        localStorage.removeItem("reportRefundSort");
    }

    getDataReport(event = null) {
        if (this.model.refundDateFrom == undefined) {
            delete this.model.refundDateFrom;
        }

        if (this.model.refundDateEnd == undefined) {
            delete this.model.refundDateEnd;
        }

        if (this.model.schema == undefined) {
            delete this.model.schema;
        }

        if (this.model.customerName == undefined) {
            delete this.model.customerName;
        }

        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this._refundPPServiceProxy.getReportRefund(this.model.refundDateFrom, this.model.refundDateEnd, this.model.schema, this.model.customerName, this.userID)
                .subscribe(result => {
                    this.getTotalAmount();
                    this.primengDatatableHelper.records = result;
                    this.primengDatatableHelper.totalRecordsCount = result.length;
                    this.primengDatatableHelper.hideLoadingIndicator();

                    this.totalAmount = result;
                    this.totalAmount.forEach(e => {
                        this.totalRow += e.totalPrice;
                    });
                }, err => {
                    this.primengDatatableHelper.hideLoadingIndicator();
                })
        }

    }

    setPpNO(sort) {
        return sort === 1;
    }

    setSchema(sort) {
        return sort === 2;
    }

    setCustomerCode(sort) {

        return sort === 3;
    }

    setCustomerName(sort) {
        return sort === 4;
    }

    setDealCloserCode(sort) {
        return sort === 5;
    }

    setDealCloserName(sort) {
        return sort === 6;
    }

    setPpPrice(sort) {
        return sort === 7;
    }

    setBankName(sort) {
        return sort === 8;
    }

    setAccountNo(sort) {
        return sort === 9;
    }

    setAccountName(sort) {
        return sort === 10;
    }

    setReason(sort) {
        return sort === 11;
    }

    setRefundDate(sort) {
        return sort === 12;
    }


    getTotalAmount() {
        this.totalLength = this.dataLocalStorageSort.length - 1;
        if (this.dataLocalStorageSort.find(this.setPpNO) === 1) {
            this.ppNo = true;
        }
        if (this.dataLocalStorageSort.find(this.setSchema) === 2) {
            this.schema = true;
        }
        if (this.dataLocalStorageSort.find(this.setCustomerCode) === 3) {
            this.customerCode = true;
        }
        if (this.dataLocalStorageSort.find(this.setCustomerName) === 4) {
            this.customerName = true;
        }
        if (this.dataLocalStorageSort.find(this.setDealCloserCode) === 5) {
            this.dealCloserCode = true;
        }
        if (this.dataLocalStorageSort.find(this.setDealCloserName) === 6) {
            this.dealCloserName = true;
        }
        if (this.dataLocalStorageSort.find(this.setPpPrice) === 7) {
            this.ppPrice = true;
        }
        if (this.dataLocalStorageSort.find(this.setBankName) === 8) {
            this.bankName = true;
        }
        if (this.dataLocalStorageSort.find(this.setAccountNo) === 9) {
            this.accountNo = true;
        }
        if (this.dataLocalStorageSort.find(this.setAccountName) === 10) {
            this.accountName = true;
        }
        if (this.dataLocalStorageSort.find(this.setReason) === 11) {
            this.reason = true;
        }
        if (this.dataLocalStorageSort.find(this.setRefundDate) === 12) {
            this.refundDate = true;
        }
    }

}
