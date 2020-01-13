import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {DataTable, Paginator} from "primeng/primeng";
import {AppComponentBase} from "@shared/common/app-component-base";
import {
    PaymentPPServiceProxy, OrderPPServiceProxy, TransactionPPServiceProxy, TransactionServiceProxy
    , GetListOrderHistoryInputDto
} from "@shared/service-proxies/service-proxies";
import {ModalDirective} from "ngx-bootstrap";
import {CheckboxModule} from "primeng/primeng";
import {Router, RouterModule, Routes} from "@angular/router";
import {AppSessionService} from "@shared/common/session/app-session.service";

@Component({
    selector: 'orderPP',
    templateUrl: './order-pp.component.html',
    styleUrls: ['./order-pp.component.css']
})
export class OrderPpComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('checkbox') checkbox: CheckboxModule;

    first: any;
    model: any;
    orderStatus: any;
    orderStatusID: any;
    paymentType: any;
    dataModal: any;
    project: any;
    sortID: any;
    byID: any;
    print: any;
    userID: any;

    constructor(injector: Injector,
                private _paymentPPServiceProxy: PaymentPPServiceProxy,
                private _orderPPServiceProxy: OrderPPServiceProxy,
                private _appSessionService: AppSessionService,
                private _transactionServiceProxy: TransactionServiceProxy,
                private _router: Router) {
        super(injector);
    }

    ngOnInit() {
        this.model = {
            orderStatusID: undefined,
            paymentType: undefined,
            projectID: [],
            keyword: undefined,
            sortID: undefined,
            byID: undefined,
        };
        this.userID = this._appSessionService.userId;
        this.getListPaymentType();
        this.getListProject();
        this.getListOrderStatus();
        this.getSortBy();
        this.getSortID();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {   
            $('.ui-paginator-rpp-options').after('items per page');
        }, 0);
    }

    orderStatusLoading = false;

    //get list order Status checkbox
    getListOrderStatus() {
        this.orderStatusLoading = true;
        this._paymentPPServiceProxy.getListOrderStatus().subscribe(result => {
            this.orderStatus = result;
        })
    }

    paymentTypeLoading = false;

    // get list payment type dropdown
    getListPaymentType(): void {
        this.paymentTypeLoading = true;
        this._paymentPPServiceProxy.getListPaymentType().finally(() => {
            setTimeout(() => {
                $(".paymentType").selectpicker('refresh');
                this.paymentTypeLoading = false;
            }, 0)
        }).subscribe(result => {
            this.paymentType = result;
        })
    }

    projectLoading = false;

    //get list project dropsown
    getListProject(): void {
        this.projectLoading = true;
        this._paymentPPServiceProxy.getListProject().finally(() => {
            setTimeout(() => {
                $('.project').selectpicker('refresh');
                this.projectLoading = false;
            });
        }).subscribe(result => {
            this.project = result;
            result.forEach(item =>{
                this.model.projectID.push(item.projectID); 
            });
            console.log('RESULT DROPDOWN', this.model.projectID);
        });
    }

    sortByLoading = false;

    //get list sort by (time, project dll)
    getSortBy() {
        this.sortByLoading = true
        this._orderPPServiceProxy.getDropdownSort().finally(() => {
            setTimeout(() => {
                $('.sortBy').selectpicker('refresh');
                this.sortByLoading = false;
            });
        }).subscribe(result => {
            this.sortID = result;
        });
    }

    sortIDLoading = false;

    //get list sort by
    getSortID() {
        this.sortIDLoading = true;
        this._orderPPServiceProxy.getDropdownSortBy().finally(() => {
            setTimeout(() => {
                this.sortIDLoading = false;
                $('.sortID').selectpicker('refresh');
            });
        }).subscribe(result => {
            this.byID = result;
        });

    }


    //get list payment history table
    getDataTable(event = null): void {
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            let params = new GetListOrderHistoryInputDto
            params.paymentType = this.model.paymentType
            params.projectID = this.model.projectID
            params.userID = this.userID
            params.keyword = this.model.keyword
            params.orderStatusID = this.model.orderStatusID
            params.sortID = this.model.sortID
            params.byID = this.model.byID
            
            this._orderPPServiceProxy.getListOrderHistory(params)
                .subscribe(result => {
                    this.primengDatatableHelper.records = result;
                    this.dataModal = this.primengDatatableHelper.records;
                    this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                    this.primengDatatableHelper.totalRecordsCount = result.length;
                    this.primengDatatableHelper.hideLoadingIndicator();
                }, err => {
                    this.primengDatatableHelper.hideLoadingIndicator();
                });
        }
    }

    resendEmailLoading = false;

    //resend email
    resendEmail(ppOrderID) {
        this.resendEmailLoading = true;
        this._orderPPServiceProxy.resendEmail(ppOrderID).finally(() => {
            this.resendEmailLoading = false;
            setTimeout(() => {
                this.message.success("Resend Successfully")
            }, 100);
        })
            .subscribe(result => {
            });
    }

    buyPP(customerCode: any, customerName: any, ppOrderID: any) {
        this._router.navigate(['app/pponline/transactionpp'], { queryParams: { customerCode: customerCode, customerName: customerName, ppOrderID: ppOrderID } });
    }

    createPayment(customerCode: any, customerName: any, ppOrderID: any) {
        this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { customerCode: customerCode, customerName: customerName, ppOrderID: ppOrderID } });

    }

    printPPLoading = false;

    printPP(ppOrderID: any, ppNo: any) {
        this.printPPLoading = true;
        this._transactionServiceProxy.printTTBF(ppOrderID, ppNo)
            .finally(() => {
                this.printPPLoading = false;
            }).subscribe(result => {
            window.open(result.url);
        })
    }

    // test(data){
    //     console.log(data)
    // }
}


