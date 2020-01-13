import { Component, Injector, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    ProjectServiceProxy,
    Project_clusters,
    Key_features,
    AdminNewProjectServiceProxy,
    SetupPPServiceProxy,
    GetProjectsListDto,
    AdminProductSetupPPOLServiceProxy,
    GetProjectProductListDto
} from "@shared/service-proxies/service-proxies";
import { PrimengDatatableHelper } from "@shared/helpers/PrimengDatatableHelper";
import { Router, ActivatedRoute } from "@angular/router";
import { LazyLoadEvent, DataTable, Paginator } from "primeng/primeng";
export class FormControl {
    project: any;
}
@Component({
    selector: "app-setup-batch",
    templateUrl: "./setup-batch-pp.component.html"
})
export class SetupBatchPPComponent extends AppComponentBase implements OnInit, AfterViewInit {
    
    @ViewChild("dataTable") dataTable: DataTable;
    @ViewChild("paginator") paginator: Paginator;
    _projects: any=[];
    _products: any=[];
    _form_control: FormControl = new FormControl();
    projectCode: any;
    productCode: any;
    filterText: string = "";
    primeNGProjectDetail: any;
    first = 0;
    constructor(
        injector: Injector,
        private _activeroute: ActivatedRoute,
        private _setupPP: SetupPPServiceProxy,
        private _setupPPOL : AdminProductSetupPPOLServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.primengDatatableHelper = new PrimengDatatableHelper();
        this.getListProject();
    }
    ngAfterViewInit(): void {
        this.getLatestList();
        setTimeout(() => {   
            $('.ui-paginator-rpp-options').after('items per page');
        }, 0);
    }

    formatNumber(num) {
        num = Math.round(num);
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + ",00";
    }

    getListProject() {
        this._setupPPOL
            .getPPProjectNameListResult()
            .finally(() => {
                setTimeout(() => {
                    $(".project").selectpicker("refresh");
                }, 0);
            })
            .subscribe(result => {
                this._projects = result.items;
            });
    }

    getListProduct() {
        this._setupPP
            .getDropdownProjectProduct(this.projectCode)
            .finally(() => {
                setTimeout(() => {
                    $(".product").selectpicker("refresh");
                }, 0);
            })
            .subscribe(result => {
                this._products = result;
            });
    }

    onChangeProject(event) {
        this.getListProduct();
        this.getLatestList();
    }

    onChangeProduct(event) {
        this.getLatestList();
    }

    getLatestList(event = null): void {
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
                this._setupPP.getSetupPP(
                    this.projectCode,
                    this.productCode).subscribe(result => {
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
