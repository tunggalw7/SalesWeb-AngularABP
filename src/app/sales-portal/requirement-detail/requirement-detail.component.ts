import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  RoleServiceProxy,
  RoleListDto,
  TransactionServiceProxy,
  AdminServiceProxy,
  GetDropdownProjectByMemberCode,
  RequirementDetailSPServiceProxy,
  MsClusterServiceProxy
} from '@shared/service-proxies/service-proxies';
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
  templateUrl: './requirement-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./requirement-detail.component.css'],
  animations: [appModuleAnimation()]

})

export class RequirementDetailComponent extends AppComponentBase {
  @ViewChild('dataTable') dataTable: DataTable;
  @ViewChild('paginator') paginator: Paginator;

  _projects: GetDropdownProjectByMemberCode[];
  taskListResultReq = [];
  taskListResultDoc = [];
  taskListResultReqLength = 0;
  taskListResultDocLength = 0;
  _termOfPaymentList: any = [];
  filterResult: any = [];
  selectedFilter: any;

  firstTaskList = 0;
  secondTaskList = 0;
  project
  cluster
  memberCode;
  pctComm;

  constructor(
    injector: Injector,
    private _router: Router,
    private _transaction: TransactionServiceProxy,
    private _appSessionService: AppSessionService,
    private _adminServiceProxy: AdminServiceProxy,
    private _currencyPipe: CurrencyPipe,
    private _requirementServiceProxy: RequirementDetailSPServiceProxy,
    private _msClusterServiceProxy: MsClusterServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.memberCode = this._appSessionService.user.userName;
    this.getListProject();
    // this.getTaskList();
  }
  ngAfterViewInit(): void {
      setTimeout(() => {   
          $('.ui-paginator-rpp-options').after('items per page');
      }, 0);
  }
  projectLoading = false;
  getListProject() {
    this.projectLoading = true;
    this._requirementServiceProxy.getDropdownProjectByMemberCode(this.memberCode)
      .finally(() => {
        setTimeout(() => {
          $('.project').selectpicker('refresh');
          this.projectLoading = false;
        }, 0);
      }).subscribe(result => {
        this._projects = result;
        console.log("project", this._projects)
      });
  }

  projectChange(event) {
    if (event) {
      this.getListTerm(Number(event.split('|')[0]))
    }
  }

  termLoading = false;
  getListTerm(id) {
    this.termLoading = true;
    this._msClusterServiceProxy.getMsClusterByProjectOB(id)
      .finally(() => {
        setTimeout(() => {
          $('.term').selectpicker('refresh');
          this.termLoading = false;
        }, 0);
      }).subscribe(result => {
        this._termOfPaymentList = result.items;
      })
  }

  onChangeTaskFilter(pctComm, expectedComm) {
    if (pctComm != undefined && expectedComm != undefined) {
      this.getTaskList();
    }
  }

  getTaskList() {
    this.primengDatatableHelper.showLoadingIndicator();
    this.primengDatatableHelper.isLoading = true;
    let projectCode = this.project ? this.project.split('|')[1] : undefined
    this._requirementServiceProxy.getRequirementDetail(projectCode, this.cluster, this.memberCode)
      .finally(() => {
        this.primengDatatableHelper.hideLoadingIndicator();
        this.primengDatatableHelper.isLoading = false;
      }).subscribe(result => {
        this.taskListResultReq = result.dataReq;
        this.taskListResultDoc = result.dataDoc;
        this.taskListResultReqLength = result.dataReq.length;
        this.taskListResultDocLength = result.dataDoc.length;
        this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
      })
  }

  firstTaskListEvent(event = null) {
    if (event) {
      this.firstTaskList = event.first;
    } else {
      this.getTaskList();
      this.firstTaskList = 0;
    }
  }

  secondTaskListEvent(event = null) {
    if (event) {
      this.secondTaskList = event.first;
    } else {
      this.getTaskList();
      this.secondTaskList = 0;
    }
  }

}



