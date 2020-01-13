import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MsProjectServiceProxy, GetAllMsUnitStatusListDto, ListResultDtoOfGetAllMsUnitStatusListDto, UpdateRolesUnitStatusInputDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditRolesProjectModalComponent } from './edit-roles-project-modal.component';
import { DataTable } from 'primeng/components/datatable/datatable';

@Component({
    templateUrl: './role-project.component.html',
    styleUrls: ['./role-project.component.less'],
    animations: [appModuleAnimation()]
})
export class RoleProjectComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('editRolesProjectModal') editRolesProjectModal: EditRolesProjectModalComponent;
    @ViewChild('dataTable') dataTable: DataTable;

    firstUnit = 0;
    filterText= '';
    getAllMSUnit: any = [];
    getUnitStatusDropdown:  ListResultDtoOfGetAllMsUnitStatusListDto;
    createModel: UpdateRolesUnitStatusInputDto;
    listProject: any = [];
    listAllProject: any = [];
    taskListAll : any = []
    save = localStorage.getItem('save');
    advancedRolesOtherTypeShow = false;
    tagShow = false;

    constructor(
        injector: Injector,
        private _msProjectServiceProxy: MsProjectServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _activatedRoute: ActivatedRoute) {
        super(injector);
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
    }

    ngAfterViewInit(): void {
       
    }

    ngOnInit(): void {
       this.getLisRolesProject();
       localStorage.removeItem('save');
       console.log(this.save);
       
       this.taskListAll =
        {
          "rolesID": 0,
          "roleName": "string",
          "listProject": [
            {
              "projectID": 0,
              "projectCode": "string",
              "projectName": "string"
            }
          ]
        }
    }

    showModals(roles): void {
        this.editRolesProjectModal.show(roles);
        
    }

    getLisRolesProject(){
        this.primengDatatableHelper.showLoadingIndicator();
        this._msProjectServiceProxy.getListRolesProject(this.filterText)
        .subscribe(result => {
            this.taskListAll = result; 
            this.primengDatatableHelper.records = this.taskListAll;
            this.primengDatatableHelper.totalRecordsCount = this.taskListAll.length;
            this.primengDatatableHelper.hideLoadingIndicator();
        })
    }   
    
    projectEvent(event = null) {
        if (event) {
            this.firstUnit = event.first;
        } else {
            this.getLisRolesProject();
        }
    }


    onClickShown(event, index){
        console.log(event);
        var x = document.getElementById(event);
        if (event == "showProject-"+index) {
            var y = "hideProject-"+index;
            var z = "dataProject-"+index;
            x.style.display = "none";
            document.getElementById(y).style.display = "block";
    
            if(x.style.display === "none") {
                document.getElementById(z).style.display = "block";
            } else {
                document.getElementById(z).style.display = "none";
            }
        }
        if (event == "showAccount-"+index) {
            var y = "hideAccount-"+index;
            var z = "dataAccount-"+index;
            x.style.display = "none";
            document.getElementById(y).style.display = "block";
    
            if(x.style.display === "none") {
                document.getElementById(z).style.display = "block";
            } else {
                document.getElementById(z).style.display = "none";
            }
        }
        if (event == "showOther-"+index) {
            var y = "hideOther-"+index;
            var z = "dataOther-"+index;
            x.style.display = "none";
            document.getElementById(y).style.display = "block";
    
            if(x.style.display === "none") {
                document.getElementById(z).style.display = "block";
            } else {
                document.getElementById(z).style.display = "none";
            }
        }
        if (event == "showPayType-"+index) {
            var y = "hidePayType-"+index;
            var z = "dataPayType-"+index;
            x.style.display = "none";
            document.getElementById(y).style.display = "block";
    
            if(x.style.display === "none") {
                document.getElementById(z).style.display = "block";
            } else {
                document.getElementById(z).style.display = "none";
            }
        }
        if (event == "showPayFor-"+index) {
            var y = "hidePayFor-"+index;
            var z = "dataPayFor-"+index;
            x.style.display = "none";
            document.getElementById(y).style.display = "block";
    
            if(x.style.display === "none") {
                document.getElementById(z).style.display = "block";
            } else {
                document.getElementById(z).style.display = "none";
            }
        }
    }

    onClickHide(event, index){
        console.log(event);
        var x = document.getElementById(event);
        if (event == "hideProject-"+index) {
            var y = "showProject-"+index;
            var z = "dataProject-"+index;
            x.style.display = "none";
            document.getElementById(y).style.display = "block";
    
            if(x.style.display === "none") {
                document.getElementById(z).style.display = "none";
            } else {
                document.getElementById(z).style.display = "block";
            }
        }
        if (event == "hideAccount-"+index) {
            var y = "showAccount-"+index;
            var z = "dataAccount-"+index;
            x.style.display = "none";
            document.getElementById(y).style.display = "block";
    
            if(x.style.display === "none") {
                document.getElementById(z).style.display = "none";
            } else {
                document.getElementById(z).style.display = "block";
            }
        }
        if (event == "hideOther-"+index) {
            var y = "showOther-"+index;
            var z = "dataOther-"+index;
            x.style.display = "none";
            document.getElementById(y).style.display = "block";
    
            if(x.style.display === "none") {
                document.getElementById(z).style.display = "none";
            } else {
                document.getElementById(z).style.display = "block";
            }
        }
        if (event == "hidePayType-"+index) {
            var y = "showPayType-"+index;
            var z = "dataPayType-"+index;
            x.style.display = "none";
            document.getElementById(y).style.display = "block";
    
            if(x.style.display === "none") {
                document.getElementById(z).style.display = "none";
            } else {
                document.getElementById(z).style.display = "block";
            }
        }
        if (event == "hidePayFor-"+index) {
            var y = "showPayFor-"+index;
            var z = "dataPayFor-"+index;
            x.style.display = "none";
            document.getElementById(y).style.display = "block";
    
            if(x.style.display === "none") {
                document.getElementById(z).style.display = "none";
            } else {
                document.getElementById(z).style.display = "block";
            }
        }
    }
}
