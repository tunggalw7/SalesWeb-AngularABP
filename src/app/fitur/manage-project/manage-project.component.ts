import {Component, OnInit, Injector, ViewChild} from '@angular/core';
import {ProjectServiceProxy, ListProjectResultDto, AdminServiceProxy} from "@shared/service-proxies/service-proxies";
import {AppComponentBase} from "@shared/common/app-component-base";
import {appModuleAnimation} from "@shared/animations/routerTransition";
import {DataTable} from "primeng/primeng";
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {Paginator} from "primeng/primeng";
import {PrimengDatatableHelper} from "@shared/helpers/PrimengDatatableHelper";
import { Router, ActivatedRoute } from '@angular/router';
import { AppSessionService } from '@shared/common/session/app-session.service';

export class FormControl {
    project: any;
}

@Component({
    selector: 'app-manage-project',
    templateUrl: './manage-project.component.html',
    styleUrls: ['./manage-project.component.css'],
    animations: [appModuleAnimation()]
})
export class ManageProjectComponent extends AppComponentBase implements OnInit {
    @ViewChild('datatable') datatable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    _projects: ListProjectResultDto[];
    _form_control: FormControl = new FormControl;
    primeNGProjectDetail: any;
    filterText = '';
    first = 0;
    selectionForm: FormGroup;
    memberCode;
    myproject: any;
    form_control: FormControl = new FormControl;
    projectForm: FormGroup;
    form_builder_selection = {
        'project': [null, Validators.compose([Validators.required])]
    }

    constructor(injector: Injector,
                private _router: Router,
                private  _fb: FormBuilder,
                private _projectService: ProjectServiceProxy,
                public _appSessionService: AppSessionService,
                private _adminServiceProxy: AdminServiceProxy) {
        super(injector);
        this.selectionForm = this._fb.group(this.form_builder_selection);
        this.form_control = this.r_control();
    }

    ngOnInit() {
        this.primeNGProjectDetail = new PrimengDatatableHelper();
        this.getLatestList();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {   
            $('.ui-paginator-rpp-options').after('items per page');
        }, 0);
    }

    getListProject() {
        let memberCode = '';
        if (this._appSessionService.user != undefined) memberCode = this._appSessionService.user.userName;
        this._projectService.getListProject(memberCode)
            .finally(() => {
                setTimeout(() => {
                    $('.project').selectpicker('refresh');
                }, 0);
            })
            .subscribe(result => {
                this._projects = result.items;
            });
    }

    getLatestList(event = null): void {
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this._adminServiceProxy.getManageProjectList().subscribe(result => {
                this.primengDatatableHelper.records = result;
                this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                this.primengDatatableHelper.totalRecordsCount = result.length;
                this.primengDatatableHelper.hideLoadingIndicator();
            }, err => {
                this.primengDatatableHelper.records = [];
                this.primengDatatableHelper.defaultRecordsCountPerPage = 0;
                this.primengDatatableHelper.totalRecordsCount = 0;
                this.primengDatatableHelper.hideLoadingIndicator();
            });
        }
    }
    setUpProject(){        
        
    }

    editProject(projectInfoId){
        this._router.navigate(['app/fitur/project-details/', projectInfoId]);
    }
    
    r_control() {
        return {
            project: this.selectionForm.controls['project'],
            legend: this.selectionForm.controls['legend']
        }
    }
}
