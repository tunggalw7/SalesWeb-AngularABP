import { Component, Injector, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    ADConfigurationServiceProxy
} from "@shared/service-proxies/service-proxies";
import { PrimengDatatableHelper } from "@shared/helpers/PrimengDatatableHelper";
import { Router, ActivatedRoute } from "@angular/router";
import { LazyLoadEvent, DataTable, Paginator } from "primeng/primeng";
export class FormControl {
    project: any;
}
@Component({
    selector: "app-ad-config",
    templateUrl: "./ad-config.component.html"
})
export class ADConfigComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @ViewChild("dataTable") dataTable: DataTable;
    @ViewChild("paginator") paginator: Paginator;

    _projects: any = [];
    _products: any = [];
    _form_control: FormControl = new FormControl();
    projectCode: any;
    productCode: any;
    filterText: string = "";
    primeNGProjectDetail: any;
    first = 0;
    
    constructor(
        injector: Injector,
        private _adconfig: ADConfigurationServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.primengDatatableHelper = new PrimengDatatableHelper();
    }

    ngAfterViewInit(): void {
        this.getLatestList();
    }

    formatNumber(num) {
        num = Math.round(num);
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + ",00";
    }

    getLatestList(event = null): void {
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this._adconfig.getTasklistADAuth().subscribe(result => {
                console.log("getProductSetupListResult ", result);
                this.primengDatatableHelper.records = result;
                this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                this.primengDatatableHelper.totalRecordsCount = result.length;
                this.primengDatatableHelper.hideLoadingIndicator();
            }, err => {
                this.primengDatatableHelper.hideLoadingIndicator();
            });
            // }
        }
    }
}
