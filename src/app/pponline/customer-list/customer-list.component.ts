import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AppComponentBase} from "@shared/common/app-component-base";
import {DataTable, Paginator} from "primeng/primeng";
import {CustomerPPServiceProxy} from "@shared/service-proxies/service-proxies";
import {Router} from "@angular/router";

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    first: any;
    listCustomer: any;

    constructor(injector: Injector,
                private _customerPPServiceProxy: CustomerPPServiceProxy,
                private _router: Router,) {
        super(injector);
    }

    ngOnInit() {
        this.listCustomer = {
            customerName: undefined,
            customerCode: undefined
        }
    }


    getCustomerListCheck(){
        if(this.listCustomer.customerName == undefined && this.listCustomer.customerCode == undefined || this.listCustomer.customerName == "" && this.listCustomer.customerCode == ""){
            this.notify.warn(" customer name or customer code must be field");
        }
        else if(this.listCustomer.customerName == "" && this.listCustomer.customerCode == undefined || this.listCustomer.customerName == undefined && this.listCustomer.customerCode == "" ){
            this.notify.warn(" customer name or customer code must be field");
        }
        else if(this.listCustomer.customerName !== undefined || this.listCustomer.customerCode !== undefined || this.listCustomer.customerName !== "" || this.listCustomer.customerCode !== "" ){
            this.getCustomerList();
        }
    }

    getCustomerList(event = null): void {
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this._customerPPServiceProxy.getListCustomerPP(this.listCustomer.customerName, this.listCustomer.customerCode)
                .subscribe(result => {
                    this.primengDatatableHelper.records = result;
                    this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                    this.primengDatatableHelper.totalRecordsCount = result.length;
                    this.primengDatatableHelper.hideLoadingIndicator();
                }, err => {
                    this.primengDatatableHelper.hideLoadingIndicator();
                })
        }
    }

    customerUpdate(customerCode) {
        this._router.navigate(['/app/pponline/customerupdate/', customerCode]);
    }

    buyPP(customerCode: any, customerName:any) {
        // this._router.navigate(['app-pp/main/transactionpp', customerCode, customerName]);
        this._router.navigate(['app/pponline/transactionpp'], { queryParams: { customerCode: customerCode, customerName: customerName } });
    }

}
