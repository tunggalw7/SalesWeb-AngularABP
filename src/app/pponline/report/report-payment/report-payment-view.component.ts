import {AppComponentBase} from "@shared/common/app-component-base";
import {AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {DataTable, Paginator} from "primeng/primeng";
import {
    GetReportPaymentInputDto, GetReportPaymentResultDto,
    PaymentPPServiceProxy
} from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'app-report-payment-view',
    templateUrl: './report-payment-view.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./report-payment.component.css']
})

export class ReportPaymentViewComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    first: any;
    dataLocalStorage: any = [];
    dataLocalStorageSort: any = [];
    model: GetReportPaymentInputDto;
    totalAmount: GetReportPaymentResultDto[];
    totalRow: number = 0;

    year: boolean = false;
    month: boolean = false;
    paymentStatus: boolean = false;
    paymentDate: boolean = false;
    clearDate: boolean = false;
    bank: boolean = false;
    paymentType: boolean = false;
    orderNo: boolean = false;
    PPNo: boolean = false;
    accountNo: boolean = false;
    accountName: boolean = false;
    bankBranch: boolean = false;
    amount: boolean = false;
    totalLength: any;

    constructor(injector: Injector,
                private _paymentPPServiceProxy: PaymentPPServiceProxy) {
        super(injector)
    }

    ngOnInit() {
        this.model = new GetReportPaymentInputDto;
        this.dataLocalStorage = JSON.parse(localStorage.getItem("reportPayment"));
        this.dataLocalStorageSort = JSON.parse(localStorage.getItem("reportPaymentSort"));
        this.model = this.dataLocalStorage;
        this.getDataReport();
        this.setYear(this.dataLocalStorageSort);
        this.setMonth(this.dataLocalStorageSort);
        this.setPaymentStatus(this.dataLocalStorageSort);
        this.setPaymentDate(this.dataLocalStorageSort);
        this.setClearDate(this.dataLocalStorageSort);
        this.setBank(this.dataLocalStorageSort);
        this.setPaymentType(this.dataLocalStorageSort);
        this.setOrderNo(this.dataLocalStorageSort);
        this.setPPNo(this.dataLocalStorageSort);
        this.setAccountNo(this.dataLocalStorageSort);
        this.setAccountName(this.dataLocalStorageSort);
        this.setBankBranch(this.dataLocalStorageSort);
        this.setAmount(this.dataLocalStorageSort);
    }

    ngAfterViewInit() {
        localStorage.removeItem("reportPayment");
        localStorage.removeItem("reportPaymentSort");
    }

    getDataReport(event = null) {

        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this._paymentPPServiceProxy.getReportPayment(this.model)
                .subscribe(result => {
                    this.setDisplay();
                    this.primengDatatableHelper.records = result;
                    this.primengDatatableHelper.totalRecordsCount = result.length;
                    this.primengDatatableHelper.hideLoadingIndicator();
                    this.totalAmount = result;
                    this.totalAmount.forEach(e => {
                        this.totalRow += e.amount;
                    })
                }, err => {
                    this.primengDatatableHelper.hideLoadingIndicator();
                })
        }
    }

    setYear(sort) {
        return sort === 1;
    }

    setMonth(sort) {
        return sort === 2;
    }

    setPaymentStatus(sort) {
        return sort === 3;
    }

    setPaymentDate(sort) {
        return sort === 4;
    }

    setClearDate(sort) {
        return sort === 5;
    }

    setBank(sort) {
        return sort === 6;
    }

    setPaymentType(sort) {
        return sort === 7;
    }

    setOrderNo(sort) {
        return sort === 8;
    }

    setPPNo(sort) {
        return sort === 9;
    }

    setAccountNo(sort) {
        return sort === 10;
    }

    setAccountName(sort) {
        return sort === 11;
    }

    setBankBranch(sort) {
        return sort === 12;
    }

    setAmount(sort) {
        return sort === 13;
    }

    setDisplay() {
        this.totalLength = this.dataLocalStorageSort.length - 1;

        if (this.dataLocalStorageSort.find(this.setYear) === 1) {
            this.year = true;
        }
        if (this.dataLocalStorageSort.find(this.setMonth) === 2) {
            this.month = true;
        }
        if (this.dataLocalStorageSort.find(this.setPaymentStatus) === 3) {
            this.paymentStatus = true;
        }
        if (this.dataLocalStorageSort.find(this.setPaymentDate) === 4) {
            this.paymentDate = true;
        }
        if (this.dataLocalStorageSort.find(this.setClearDate) === 5) {
            this.clearDate = true;
        }
        if (this.dataLocalStorageSort.find(this.setBank) === 6) {
            this.bank = true;
        }
        if (this.dataLocalStorageSort.find(this.setPaymentType) === 7) {
            this.paymentType = true;
        }
        if (this.dataLocalStorageSort.find(this.setOrderNo) === 8) {
            this.orderNo = true;
        }
        if (this.dataLocalStorageSort.find(this.setPPNo) === 9) {
            this.PPNo = true;
        }
        if (this.dataLocalStorageSort.find(this.setAccountNo) === 10) {
            this.accountNo = true;
        }
        if (this.dataLocalStorageSort.find(this.setAccountName) === 11) {
            this.accountName = true;
        }
        if (this.dataLocalStorageSort.find(this.setBankBranch) === 12) {
            this.bankBranch = true;
        }
        if (this.dataLocalStorageSort.find(this.setAmount) === 13) {
            this.amount = true;
        }
    }

}
