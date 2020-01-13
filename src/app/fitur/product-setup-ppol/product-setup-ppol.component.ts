import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "@shared/common/app-component-base";
import {
    ProjectServiceProxy,
    Project_clusters,
    Key_features,
    GetListAllProjectResultDto,
    AdminManageProjectServiceProxy,
    AdminServiceProxy,
    CreateOrUpdateProjectInputDto,
    AdminNewProjectServiceProxy,
    AdminProductSetupServiceProxy,
    AdminProductSetupPPOLServiceProxy
} from "@shared/service-proxies/service-proxies";
import {PrimengDatatableHelper} from "@shared/helpers/PrimengDatatableHelper";
import {Router, ActivatedRoute} from '@angular/router';

export class FormControl {
    project: any;
    product: any;
}

@Component({
    selector: 'app-product-setup-ppol',
    templateUrl: './product-setup-ppol.component.html',
    styleUrls: ['./product-setup-ppol.component.css']
})
export class ProductSetupPpolComponent extends AppComponentBase implements OnInit {

    _projects: GetListAllProjectResultDto[];
    _products: any = [];
    _form_control: FormControl = new FormControl;
    primeNGProjectDetail: any;
    first = 0;
    modelProject: any;
    modelProduct: any;
    projectID: any;
    productID: number = 0;

    constructor(injector: Injector,
                private _adminServiceProxy: AdminServiceProxy,
                private _activeroute: ActivatedRoute,
                private _adminProductSetup: AdminProductSetupServiceProxy,
                private _adminPPOL: AdminProductSetupPPOLServiceProxy) {
        super(injector)
    }

    ngOnInit() {

        this.primengDatatableHelper = new PrimengDatatableHelper();
        this.getListProject();
        this._activeroute.params.subscribe(params => {
            this.modelProject = params.id + '|' + params.code;
            this.projectID = parseInt(params.id);
            if (params.id !== undefined) {
                this.getLatestList();
            }
            setTimeout(() => {
                $('.project').selectpicker('refresh');
                this.getListProduct(params.code);
            }, 0);
            // this.getLatestList();
        });
        // this.getLatestList();
    }

    projectLoading = false;
    getListProject() {
        this.projectLoading = true;
        this._adminPPOL.getPPProjectNameListResult()
            .finally(() => {
                setTimeout(() => {
                    $('.project').selectpicker('refresh');
                    this.projectLoading = false;
                }, 0);
            })
            .subscribe(result => {
                this._projects = result.items;
            });
    }

    onChangeProject(event) {
        this.projectID = null;
        var projectCode = event.split("|")[1];
        setTimeout(() => {
            this.projectID = event.split("|")[0];
            this.getListProduct(projectCode);
        }, 200);
    }

    productLoading = false;
    getListProduct(productid) {
        this.productLoading = true;
        this._adminPPOL.getProductNameResult(productid)
            .finally(() => {
                setTimeout(() => {
                    $('.product').selectpicker('refresh');
                    this.productLoading = false;
                }, 0);
            })
            .subscribe(result => {
                this._products = result.items;
            });
    }


    onChangeProduct(event) {
        this.productID = event.productProjectId;
        this.getLatestList();
    }

    getLatestList(event = null): void {
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this.primengDatatableHelper.hideLoadingIndicator();
            this._adminPPOL.getProductPPDetailListResult(this.projectID, this.productID).subscribe(result => {
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                this.primengDatatableHelper.totalRecordsCount = result.items.length;
                this.primengDatatableHelper.hideLoadingIndicator();
            }, err => {
                this.primengDatatableHelper.hideLoadingIndicator();
            });
        }
    }

}
