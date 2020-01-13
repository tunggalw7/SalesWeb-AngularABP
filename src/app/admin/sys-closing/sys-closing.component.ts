import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClosingAccountServiceProxy, GetAllMsUnitStatusListDto, ListResultDtoOfGetAllMsUnitStatusListDto, UpdateRolesUnitStatusInputDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditSysClosingModalComponent } from './edit-sys-closing-modal.component';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';

@Component({
    templateUrl: './sys-closing.component.html',
    styleUrls: ['./sys-closing.component.less'],
    animations: [appModuleAnimation()]
})
export class SysClosingComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('editSysClosingModal') editSysClosingModal: EditSysClosingModalComponent;
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    firstUnit = 0;
    filterText= '';
    getAllMSUnit: any = [];
    // getUnitStatusDropdown:  ListResultDtoOfGetAllMsUnitStatusListDto;
    // createModel: UpdateRolesUnitStatusInputDto;
    listProject: any = [];
    listAllProject: any = [];
    taskListAll : any = []
    save = localStorage.getItem('save');
    advancedRolesOtherTypeShow = false;
    tagShow = false;

    constructor(
        injector: Injector,
        private _closingAccountServiceProxy: ClosingAccountServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _activatedRoute: ActivatedRoute) {
        super(injector);
        // this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
    }

    ngAfterViewInit(): void {
       
    }

    ngOnInit(): void {
    }

    showModals(userId): void {
        this.editSysClosingModal.show(userId);
        
    }

    getLisSysClosingAccount(event?: LazyLoadEvent) {
        if (this.primengDatatableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengDatatableHelper.showLoadingIndicator();
        console.log("dd",this.primengDatatableHelper.getMaxResultCount(this.paginator, event));
        this._closingAccountServiceProxy.getTasklistSysClosingAccount(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            this.primengDatatableHelper.getMaxResultCount(this.paginator, event),
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    }
    
    projectEvent(event = null) {
        if (event) {
            this.firstUnit = event.first;
        } else {
            this.getLisSysClosingAccount();
        }
    }


    onClickShown(event, index){
        console.log(event);
        var x = document.getElementById(event);
        var y = "hide-"+index;
        var z = "data-"+index;
        x.style.display = "none";
        document.getElementById(y).style.display = "block";

        if(x.style.display === "none") {
            document.getElementById(z).style.display = "block";
        } else {
            document.getElementById(z).style.display = "none";
        }
    }

    onClickHide(event, index){
        console.log(event);
        var x = document.getElementById(event);
        var y = "show-"+index;
        var z = "data-"+index;
        x.style.display = "none";
        document.getElementById(y).style.display = "block";
        if(x.style.display === "none") {
            document.getElementById(z).style.display = "none";
        } else {
            document.getElementById(z).style.display = "block";
        }
    }
}
