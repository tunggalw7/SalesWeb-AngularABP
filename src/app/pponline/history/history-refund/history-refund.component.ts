import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AppComponentBase} from "@shared/common/app-component-base";
import {DataTable, Paginator} from "primeng/primeng";
import {RefundPPServiceProxy} from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'app-history-refund',
    templateUrl: './history-refund.component.html',
    styleUrls: ['./history-refund.component.css']
})
export class HistoryRefundComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    filterText = '';
    first: 0;
    dataNull: any;
    search: any;

    constructor(injector: Injector,
                private _refundPPServiceProxy: RefundPPServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.getDataTable(this.dataNull);
    }
    ngAfterViewInit(): void {
        setTimeout(() => {   
            $('.ui-paginator-rpp-options').after('items per page');
        }, 0);
    }
    //get data print
    getDataPrint(search) {
        this._refundPPServiceProxy.printFormPembatalan(search).subscribe(result => {
            window.open(result.message, 'blank',);
        });

    }

    //get data table
    getDataTable(search): void {
        // if (search = null) {
        //     this.first = search.first;
        // } else
        if (search == null || search == '' || search == undefined) {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this._refundPPServiceProxy.getListRefundHistory().subscribe(result => {
                this.primengDatatableHelper.records = result;
                this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                this.primengDatatableHelper.totalRecordsCount = result.length;
                this.primengDatatableHelper.hideLoadingIndicator();
            }, err => {
                this.primengDatatableHelper.hideLoadingIndicator();
            });
        } else if (search !== null || search !== '' || search !== undefined) {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this._refundPPServiceProxy.getListRefundHistoryBySearch(search).subscribe(result => {
                this.primengDatatableHelper.records = result;
                this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                this.primengDatatableHelper.totalRecordsCount = result.length;
                this.primengDatatableHelper.hideLoadingIndicator();
            }, err => {
                this.primengDatatableHelper.hideLoadingIndicator();
            });
        }
    }
}

