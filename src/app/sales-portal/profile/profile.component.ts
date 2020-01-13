import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  RoleServiceProxy,
  RoleListDto,
  TransactionServiceProxy,
  AdminServiceProxy,
  MyProfileSPServiceProxy,
  GetParentListDto,
  GetListAllProjectResultDto,
  GetChildListDto,
  GetMyProductDto
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
// import { ProfileTreeComponent } from './profile-tree.component';

@Component({
  templateUrl: './profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./profile.component.css'],
  animations: [appModuleAnimation()]
})

export class ProfileComponent extends AppComponentBase {
  @ViewChild('dataTable') dataTable: DataTable;
  @ViewChild('paginator') paginator: Paginator;
  // @ViewChild('profileTree') profileTree: ProfileTreeComponent;

  _projects: GetListAllProjectResultDto[];
  parents: String;
  _childs: GetChildListDto[];
  _products: any;
  filterResult: any = [];
  selectedFilter: any;

  firstTaskList = 0;

  

  memberCode;
  parentMemberCode;

  constructor(
    injector: Injector,
    private _router: Router,
    private _appSessionService: AppSessionService,
    private _adminServiceProxy: AdminServiceProxy,
    private _myProfileSPServerProxy: MyProfileSPServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {

    this.memberCode = this._appSessionService.user.userName;
    this.getListProject();
    this.getParentList(this.memberCode);
    this.getChildList(this.parentMemberCode);
    this.getMyProductList(this.memberCode);
  }

  projectLoading = false;
  getListProject() {
    this.projectLoading = true;
    this._adminServiceProxy.getListAllProject()
      .finally(() => {
        setTimeout(() => {
          $('.project').selectpicker('refresh');
          this.projectLoading = false;
        }, 0);
      }).subscribe(result => {
        this._projects = result.items;
      });
  }

  scmCode: string;
  getMyProductList(memberCode){
    this._myProfileSPServerProxy.getMyProductList(memberCode)
    .finally(() => {
      setTimeout(() => {
        $('.product').selectpicker('refresh');
      }, 0);
    }).subscribe(result => {
      this.scmCode = result.scmCode;
      this._products = result.listMyProduct;
    });
  }

  onClick(){

  }

  parentList: any = [];
  getParentList(memberCode){
    this._myProfileSPServerProxy.getParentList(memberCode)
    .finally(() => {
      setTimeout(() => {
        $('.parent').selectpicker('refresh');
      }, 0);
    })
    .subscribe(result => {
      // this.parents = result.parentMemberCode;
    });
  }

  getChildList(parentMemberCode){
    this._myProfileSPServerProxy.getChildList(parentMemberCode)
    .finally(() => {
      setTimeout(() => {
        $('.child').selectpicker('refresh');
      }, 0);
    }).subscribe(result => {
      this._childs = result;
    })
  }

}



