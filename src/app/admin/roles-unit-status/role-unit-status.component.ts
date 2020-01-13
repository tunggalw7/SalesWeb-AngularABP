import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MsUnitStatusServiceProxy, GetAllMsUnitStatusListDto, ListResultDtoOfGetAllMsUnitStatusListDto, UpdateRolesUnitStatusInputDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditRolesModalComponent } from './edit-roles-modal.component';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';

@Component({
    templateUrl: './role-unit-status.component.html',
    styleUrls: ['./role-unit-status.component.less'],
    animations: [appModuleAnimation()]
})
export class RoleUnitStatusComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('editRolesModal') editRolesModal: EditRolesModalComponent;
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    firstUnit = 0;
    filterText= '';
    getAllMSUnit: any = [];
    getUnitStatusDropdown:  ListResultDtoOfGetAllMsUnitStatusListDto;
    createModel: UpdateRolesUnitStatusInputDto;

    constructor(
        injector: Injector,
        private _msUnitStatusServiceProxy: MsUnitStatusServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _activatedRoute: ActivatedRoute) {
        super(injector);
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
    }

    ngAfterViewInit(): void {
    }

    ngOnInit(): void {
    //    this.getAllMsUnitStatus();
    //    this.getMSUnitStatusDropdown();
    }

    showModals(userid,username): void {
        this.editRolesModal.show(userid,username);        
    }
    
    getUsers(event?: LazyLoadEvent) {
        if (this.primengDatatableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengDatatableHelper.showLoadingIndicator();

        this._msUnitStatusServiceProxy.getListAllUsers(
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

    unitStatusEvent(event = null) {
        if (event) {
            this.firstUnit = event.first;
        } else {
            this.getUsers();
        }
    }
}
