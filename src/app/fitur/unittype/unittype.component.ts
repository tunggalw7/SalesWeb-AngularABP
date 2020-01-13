import { Component, Injector, ViewChild, ViewEncapsulation, Input,Output, EventEmitter } from '@angular/core';
import {
    RoleServiceProxy,
    RoleListDto,
    BookingHistoryServiceProxy,
    ProjectServiceProxy,
    ListProjectResultDto,
    ListResultDtoOfListProjectResultDto,
    AdminServiceProxy,
    AdminUnitTypeServiceProxy,
    AdminManageProjectServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from "primeng/primeng";
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { DatePipe } from '@angular/common';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Paginator } from "primeng/primeng";

export class FormControl {
    project: any;
}

@Component({
    selector: 'unittypeSubModul',
    templateUrl: './unittype.component.html',
    styleUrls: ['./unittype.component.css'],
    animations: [appModuleAnimation()]
})
export class UnittypeComponent extends AppComponentBase {
    @ViewChild('datatable') datatable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    @Input() getSelectedProject:number;
    @Output() unitChange = new EventEmitter();

    filterText = '';
    first = 0;
    unit: any = [];
    selectionForm: FormGroup;
    _projects: ListProjectResultDto[];
    myproject: any;
    form_control: FormControl = new FormControl;
    _form_control: FormControl = new FormControl;
    projectForm: FormGroup;
    show_unit=true;


    form_builder_selection = {
        'project': [null, Validators.compose([Validators.required])]
    }

    constructor(injector: Injector,
        private _fb: FormBuilder,
        private _projectService: ProjectServiceProxy,
        private _adminService: AdminServiceProxy,
        private _adminUnitTypeService: AdminUnitTypeServiceProxy,
        private _adminManageProject: AdminManageProjectServiceProxy) {
        super(injector);
        this.selectionForm = this._fb.group(this.form_builder_selection);
        this.form_control = this.r_control();
    }

    ngOnInit(): void {
        this.unitChanged();
        this.show_unit = true;
    }
    ngAfterViewInit(): void {
        setTimeout(() => {   
            $('#unittype .ui-paginator-rpp-options').after('items per page');
        }, 0);
    }
    ngOnChanges() {
        if (this.getSelectedProject !== undefined) {
            this.getLatestList(this.getSelectedProject);
            this.getManageProject(this.getSelectedProject);
        }
    }

    r_control() {
        return {
            project: this.selectionForm.controls['project'],
            legend: this.selectionForm.controls['legend']
        }
    }

    getUnitEvent(event = null) {
        if (event) {
            this.first = event.first;
        } else {
            this.getLatestList(this.getSelectedProject);
        }
    }

    unitChanged() { // You can give any function name
        console.log('show unit',this.show_unit);
        this.unitChange.emit(this.show_unit);
    }

    getManageProject(projectInfoID){
        if(projectInfoID!=undefined){
            this._adminManageProject.getDetailManageProject(projectInfoID).finally(() => {
                setTimeout(() => {
                }, 0);
            }).subscribe(result => {
                if (JSON.parse(result.displaySetting)){
                    let displayForm = JSON.parse(result.displaySetting);
                    this.show_unit = displayForm.unittype;
                    this.unitChanged();
                } 
            }, err => {
                this.primengDatatableHelper.records = [];
                this.primengDatatableHelper.defaultRecordsCountPerPage = 0;
                this.primengDatatableHelper.totalRecordsCount = 0;
                this.primengDatatableHelper.hideLoadingIndicator();
            });
        }
    }

    getLatestList(projectInfoID: number) {
        this.unit = [];
        this.primengDatatableHelper.records = [];
        this.first = 0;

        if(projectInfoID!=undefined){
        this.primengDatatableHelper.showLoadingIndicator();
        this._adminService.getListTower(projectInfoID)
            .subscribe(result => {
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
                this.primengDatatableHelper.totalRecordsCount = result.items.length;
                this.primengDatatableHelper.hideLoadingIndicator();
            }, err => {
                this.primengDatatableHelper.hideLoadingIndicator();
            });
        }
    }

}
