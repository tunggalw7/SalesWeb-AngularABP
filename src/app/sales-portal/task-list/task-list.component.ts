import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { RoleServiceProxy, RoleListDto, TransactionServiceProxy, TaskListSPServiceProxy, GetTaskListResultDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Paginator } from "primeng/primeng";

@Component({
  templateUrl: './task-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./task-list.component.css'],
  animations: [appModuleAnimation()]

})

export class TaskListComponent extends AppComponentBase {
  @ViewChild('dataTable') dataTable: DataTable;
  @ViewChild('paginator') paginator: Paginator;

  taskListResult: any = [];
  filterResult: any = [];
  selectedFilter: any;

  memberCode;
  // memberCode = "118887790129";

  firstTaskList = 0;

  primeNGProjectDetail: any;
  first = 0;

  constructor(
    injector: Injector,
    private _router: Router,
    private _taskListSPService: TaskListSPServiceProxy,
    private _transaction: TransactionServiceProxy,
    private _appSessionService: AppSessionService,
    private _currencyPipe: CurrencyPipe
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.memberCode = this._appSessionService.user.userName;
    this.getListTaskFilter();
    this.getTaskListSP(this.memberCode);
  }

  filterLoading = false;
  getListTaskFilter() {
    this.filterLoading = true;
    this.filterResult = [
      { "filterCode": "UC", "filterName": "Update Customer" },
      { "filterCode": "FUP", "filterName": "Follow Up Payment" }
    ];
    
    setTimeout(() => {
      $('.task-filter').selectpicker('refresh');
      this.filterLoading = false;
    }, 3000);
  }

  onChangeTaskFilter(obj) {
    if (obj != undefined) {
      this.getTaskListSP(this.memberCode);
    }
  }

  getTaskListSP(memberCode){
    this.primengDatatableHelper.showLoadingIndicator();
    this._taskListSPService
      .getTaskListSalesPortal(memberCode)
      .finally(() => {
        this.primengDatatableHelper.hideLoadingIndicator();
      })
      .subscribe(
        result => {
          this.primengDatatableHelper.records = result;
          this.primengDatatableHelper.totalRecordsCount = result.length;
          this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
        },
        err => {
          this.primengDatatableHelper.records = [];
        }
      );
    }
  
    taskListEvent(event = null) {
    if (event) {
      this.firstTaskList = event.first;
    } else {
      this.getTaskListSP(this.memberCode);
    }
  }

}

