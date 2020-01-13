import {AfterViewInit, Component, Injector, OnInit, Input, ViewEncapsulation, ViewChild} from "@angular/core";
import {AppComponentBase} from "@shared/common/app-component-base";
import {
    GetListHistoryPaymentResultDto, GetListReportOrderInputDto, GetListReportOrderResultDto,
    OrderPPServiceProxy
} from "@shared/service-proxies/service-proxies";
import {DataTable, Paginator} from "primeng/primeng";
import {AppSessionService} from "@shared/common/session/app-session.service";


@Component({
    selector: 'app-report-order-view',
    templateUrl: './report-order-view.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./report-order.component.css']
})

export class ReportOrderViewComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    first: any;
    dataLocalStorage: any = [];
    model: GetListReportOrderInputDto;
    totalAmount: GetListReportOrderResultDto[];
    totalRow: number = 0;
    dataLocalStorageSort: any = [];
    year: boolean = false;
    month: boolean = false;
    orderStatus: boolean = false;
    orderDate: boolean = false;
    customer: boolean = false;
    orderCode: boolean = false;
    project: boolean = false;
    prefferedUnit: boolean = false;
    termPayment: boolean = false;
    qty: boolean = false;
    price: boolean = false;
    totalPrice: boolean = false;
    totalLength: any;
    userID: any;

    constructor(injector: Injector,
                private _appSessionService: AppSessionService,
                private _orderPPServiceProxy: OrderPPServiceProxy) {
        super(injector)
    }

    ngOnInit() {
        this.userID = this._appSessionService.userId;
        this.model = new GetListReportOrderInputDto;
        this.model.orderStatusID = [];
        this.model.termID = [];
        this.model.preferredTypeName = [];
        this.dataLocalStorage = JSON.parse(localStorage.getItem("reportOrder"));
        this.dataLocalStorageSort = JSON.parse(localStorage.getItem("reportOrderSort"));

        this.model = this.dataLocalStorage;
        this.getDataReport();
        this.setYear(this.dataLocalStorageSort);
        this.setMonth(this.dataLocalStorageSort);
        this.setOrderStatus(this.dataLocalStorageSort);
        this.setOrderDate(this.dataLocalStorageSort);
        this.setCustomer(this.dataLocalStorageSort);
        this.setOrderCode(this.dataLocalStorageSort);
        this.setProject(this.dataLocalStorageSort);
        this.setPrefferedUnit(this.dataLocalStorageSort);
        this.setTermPayment(this.dataLocalStorageSort);
        this.setQty(this.dataLocalStorageSort);
        this.setPrice(this.dataLocalStorageSort);
        this.setTotalPrice(this.dataLocalStorageSort);
    }

    ngAfterViewInit() {
        localStorage.removeItem("reportOrder");
        localStorage.removeItem("reportOrderSort");
    }

    getDataReport(event = null) {
        this.model.orderDateFrom = this.dataLocalStorage.orderDateFrom;
        this.model.orderDateTo = this.dataLocalStorage.orderDateTo;
        this.model.userID = this.userID;
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this._orderPPServiceProxy.getListReportOrder(this.model)
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

    setYear(sort) {
        return sort === 1;
    }

    setMonth(sort) {
        return sort === 2;
    }

    setOrderCode(sort) {

        return sort === 3;
    }

    setOrderDate(sort) {
        return sort === 4;
    }

    setOrderStatus(sort) {
        return sort === 5;
    }

    setProject(sort) {
        return sort === 6;
    }

    setCustomer(sort) {
        return sort === 7;
    }

    setPrefferedUnit(sort) {
        return sort === 8;
    }

    setTermPayment(sort) {
        return sort === 9;
    }

    setQty(sort) {
        return sort === 10;
    }

    setPrice(sort) {
        return sort === 11;
    }

    setTotalPrice(sort) {
        return sort === 12;
    }

    getTotalAmount() {
        this.totalLength = this.dataLocalStorageSort.length - 1;
        if (this.dataLocalStorageSort.find(this.setYear) === 1) {
            this.year = true;
        }
        if (this.dataLocalStorageSort.find(this.setMonth) === 2) {
            this.month = true;
        }
        if (this.dataLocalStorageSort.find(this.setOrderCode) === 3) {
            this.orderCode = true;
        }
        if (this.dataLocalStorageSort.find(this.setOrderDate) === 4) {
            this.orderDate = true;
        }
        if (this.dataLocalStorageSort.find(this.setOrderStatus) === 5) {
            this.orderStatus = true;
        }
        if (this.dataLocalStorageSort.find(this.setProject) === 6) {
            this.project = true;
        }
        if (this.dataLocalStorageSort.find(this.setCustomer) === 7) {
            this.customer = true;
        }
        if (this.dataLocalStorageSort.find(this.setPrefferedUnit) === 8) {
            this.prefferedUnit = true;
        }
        if (this.dataLocalStorageSort.find(this.setTermPayment) === 9) {
            this.termPayment = true;
        }
        if (this.dataLocalStorageSort.find(this.setQty) === 10) {
            this.qty = true;
        }
        if (this.dataLocalStorageSort.find(this.setPrice) === 11) {
            this.price = true;
        }
        if (this.dataLocalStorageSort.find(this.setTotalPrice) === 12) {
            this.totalPrice = true;
        }
    }

}
