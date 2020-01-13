import {Component, OnInit, Injector, ViewChild} from '@angular/core';
import {ProjectServiceProxy, ListProjectResultDto, AdminServiceProxy,AdminProductSetupServiceProxy, AdminPromoServiceProxy, GetListAllProjectResultDto} from "@shared/service-proxies/service-proxies";
import {AppComponentBase} from "@shared/common/app-component-base";
import {appModuleAnimation} from "@shared/animations/routerTransition";
import {DataTable} from "primeng/primeng";
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {Paginator} from "primeng/primeng";
import {PrimengDatatableHelper} from "@shared/helpers/PrimengDatatableHelper";
import {Router, ActivatedRoute} from '@angular/router';

export class FormControlOB {
    project: any;
}

@Component({
    selector: 'app-product-setup-ob',
    templateUrl: './product-setup-ob.component.html',
    styleUrls: ['./product-setup-ob.component.css'],
    animations: [appModuleAnimation()]
})
export class ProductSetupOBComponent extends AppComponentBase implements OnInit {
    @ViewChild('datatable') datatable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    _projects_ob: GetListAllProjectResultDto[];
    _form_controlob: FormControlOB = new FormControlOB;
    primeNGProjectDetail: any;
    filterText = '';
    first = 0;
    selectionForm: FormGroup;
    memberCode;
    myproject: any;
    form_control_ob: FormControlOB = new FormControlOB;
    form_builder_setupob = {
        'project': [null, Validators.compose([Validators.required])]
    }

    constructor(injector: Injector,
                private  _fb: FormBuilder,
                private _projectService: ProjectServiceProxy,
                private _promoService: AdminPromoServiceProxy,
                private _adminServiceProxy: AdminServiceProxy,
                private _adminProductSetup: AdminProductSetupServiceProxy,
                private _activeroute: ActivatedRoute) {
        super(injector);
        this.selectionForm = this._fb.group(this.form_builder_setupob);
        this.form_control_ob = this.r_control_setupob();
    }

    ngOnInit() {
        this.primeNGProjectDetail = new PrimengDatatableHelper();
        this.getListProjectOB();
        this._activeroute.params.subscribe(params => {         
            if (params.id){
                this._form_controlob.project = parseInt(params.id);
                setTimeout(() => {
                    $('.project').selectpicker('refresh');
                }, 0);                 
                this.getLatestListOB();
            }else{
                this._form_controlob.project = undefined;
            }
        });
        // this.getLatestList();
    }
    ngAfterViewInit(): void {
        setTimeout(() => {   
            $('.ui-paginator-rpp-options').after('items per page');
        }, 0);
    }
    getListProjectOB() {
        this._adminProductSetup.getListProjectResult()
            .finally(() => {
                setTimeout(() => {
                    $('.project').selectpicker('refresh');
                }, 0);
            })
            .subscribe(result => {
                this._projects_ob = result.items;
            });
    }

    onChangeProjectOB(event){    
        this.getLatestListOB();
    }

    getLatestListOB(event = null): void {
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            // if (this._form_control.project==NaN){
                let clusterList = JSON.parse(localStorage.getItem("clusterOB"));                
                let clusterParams;

                this._adminProductSetup.getProductSetupListResult(this._form_controlob.project, clusterList.cluster).subscribe(result => {
                    this.primengDatatableHelper.records = result.items;
                    this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                    this.primengDatatableHelper.totalRecordsCount = result.items.length;
                    this.primengDatatableHelper.hideLoadingIndicator();
                }, err => {
                    this.primengDatatableHelper.hideLoadingIndicator();
                });
            // }
        }
    }

    r_control_setupob() {
        return {
            project: this.selectionForm.controls['project'],
            legend: this.selectionForm.controls['legend']
        }
    }
}
