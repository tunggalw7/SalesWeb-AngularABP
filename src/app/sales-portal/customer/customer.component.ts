import { Component, Injector, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import {
  RoleServiceProxy,
  RoleListDto,
  TransactionServiceProxy,
  AdminServiceProxy,
  GetListAllProjectResultDto,
  MyCustomerSPServiceProxy,
  GetMyCustomerListDto,
  AdminProductSetupServiceProxy
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

import { AddPotentialCustomerComponent } from './add-potential-customer.component';
import { reset } from '@angular-devkit/core/src/terminal/colors';
import * as moment from 'moment';
import { AbpSessionService } from '@abp/session/abp-session.service';

@Component({
  templateUrl: './customer.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./customer.component.css'],
  animations: [appModuleAnimation()]
})

export class CustomerComponent extends AppComponentBase {
  @ViewChild('dataTable') dataTable: DataTable;
  @ViewChild('paginator') paginator: Paginator;
  @ViewChild('addPotentialCustomerModal') addPotentialCustomerModal: AddPotentialCustomerComponent;

  _projects: GetListAllProjectResultDto[];
  taskListResult: any = [];
  _termOfPaymentList: any = [];
  filterResult: any = [];
  selectedFilter: any;

  selectedPsCode: any;

  firstTaskList = 0;
  firstTaskListt = 0;
  records;
  totalRecordsCountt;
  customerCode;
  customerName;
  memberCode;
  defaultRecordsCountPerPagee;
  public inputUn: number;
  isViewPotential;
  isViewMyCustomer;
  timePeriodLoading: boolean = false;
  _timePeriodList: any = [];
  // timeperiode;
  timeperiode: number;
  projectLoading: boolean = false;
  _projectList: any = [];
  constructor(
    injector: Injector,
    private _router: Router,
    private _transaction: TransactionServiceProxy,
    private _sessionService: AbpSessionService,
    private _appSessionService: AppSessionService,
    private _adminServiceProxy: AdminServiceProxy,
    private _currencyPipe: CurrencyPipe,
    private _myCustomerSPServiceProxy: MyCustomerSPServiceProxy,
    private _adminProductService: AdminProductSetupServiceProxy,
  ) {
    super(injector);
    this.isViewPotential = abp.auth.isGranted('Pages.Tenant.SalesWeb.Customer.ViewPotentialCustomer');
    this.isViewMyCustomer = abp.auth.isGranted('Pages.Tenant.SalesWeb.Customer.ViewMyCustomer');
  }

  ngOnInit(): void {
    console.log("ddd",localStorage.getItem("baa"));
    console.log("hmmm",localStorage.getItem("cust"));
    this.memberCode = this._appSessionService.user.userName;
    this.inputUn = this._appSessionService.userId;
    this.getCustomerList(this.inputUn);
    this.getPotentialCustomerList(this.inputUn,undefined);
    this.getTimePeriode();
  }
 
  ngAfterViewInit(): void {
      setTimeout(() => {   
          $('.ui-paginator-rpp-options').after('items per page');
      }, 0);
  }

  deleteCart() {
    //GET TOWER
    this._transaction.getTrUnitReserved(this._sessionService.userId).finally(() => {
      localStorage.removeItem("idCust");
      localStorage.removeItem("cust");
    })
      .subscribe((result) => {
        if (result.length) {
          for (var i = 0; i < result.length; i++) {
            this._transaction.deleteTrUnitReserved(result[i].unitReservedID)
              .subscribe((result) => {
              });
          }
        }
      });
  }

  getTimePeriode() {
      this.timePeriodLoading = true;
      this._myCustomerSPServiceProxy.getDropdownTimePeriod()
          .finally(() => {
              this.timePeriodLoading = false;
              this.refreshDropdown();
          })
          .subscribe(result => {
            console.log('project',result);
              this._timePeriodList = result;
          })
  }
  refreshDropdown() {
      setTimeout(() => {
          $('.project').selectpicker('refresh');
          this.timePeriodLoading = false;
      }, 3000);
  }
  getCustomerList(userid) {
    console.log('userid',userid);
    if (this.isViewMyCustomer) {
      this.primengDatatableHelper.showLoadingIndicator();
      this._myCustomerSPServiceProxy.getMyCustomerList(userid)
        .finally(() => {
          this.primengDatatableHelper.hideLoadingIndicator();
        })
        .subscribe((result) => {
          console.log("ps", result);
          
          this.records = result;
          for (let index = 0; index < this.records.length; index++) {
            this.records[index].dateTemp = moment(this.records[index].birthDate).format('DD-MM-YYYY')
          }
          this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
          this.totalRecordsCountt = result.length;
          this.primengDatatableHelper.hideLoadingIndicator();
        }, err => {
          this.primengDatatableHelper.hideLoadingIndicator();
        });
    }
  }

  taskListEvent(event = null) {
    if (event) {
      this.firstTaskList = event.first;
    } else {
      this.getCustomerList(this.inputUn);
    }
  }

  getPotentialCustomerList(inputUn,timePeriode) {
    if (this.isViewPotential) {
      this.primengDatatableHelper.showLoadingIndicator();
      this._myCustomerSPServiceProxy.getPotentialCustomerList(inputUn,timePeriode)
        .finally(() => {
          this.primengDatatableHelper.hideLoadingIndicator();
        })
        .subscribe((result) => {
          console.log('result getPotentialCustomerList list', result);
          this.primengDatatableHelper.records = result;
          for (let index = 0; index < this.primengDatatableHelper.records.length; index++) {
            if (this.primengDatatableHelper.records[index].birthDate != undefined) {
              this.primengDatatableHelper.records[index].dateTemp = moment(this.primengDatatableHelper.records[index].birthDate).format('DD-MM-YYYY')
            }
          }
          this.defaultRecordsCountPerPagee = 10;
          this.primengDatatableHelper.totalRecordsCount = result.length;
          this.primengDatatableHelper.hideLoadingIndicator();
        }, err => {
          this.primengDatatableHelper.hideLoadingIndicator();
        });
    }
  }

  taskListEventt(event = null) {
    if (event) {
      this.firstTaskListt = event.first;
    } else {
      this.getPotentialCustomerList(this.inputUn,undefined);
    }
  }

  addPotentialCustomer(): void {
    this.addPotentialCustomerModal.show();
  }

  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }

  buyPPCustomer(psCode: any, name: any) {
    //  console.log("add",psCode);
    //  console.log("dada", name);
    this._router.navigate(['app/pponline/transactionpp'], { queryParams: { customerCode: psCode, customerName: name } });
  }
  buyUnitCustomer(psCode: any, name: any) {
     console.log("add",psCode);
    //  console.log("dada", name);
    if(localStorage.getItem("idCust") !== psCode && localStorage.getItem("cust") == "true") {
      //beda
      console.log("1");
      this.deleteCart();
      this._router.navigate(['app/main/available-unit'], { queryParams: { customerCode: psCode, customerName: name } });
    }if (localStorage.getItem("idCust") == psCode && localStorage.getItem("cust") == "true") {
      //sama
      console.log("2");
      this._router.navigate(['app/main/available-unit'], { queryParams: { customerCode: psCode, customerName: name } });
    }if (localStorage.getItem("idCust") == null && localStorage.getItem("cust") == "false"){
      //beda
      console.log("3");
      this.deleteCart();
      this._router.navigate(['app/main/available-unit'], { queryParams: { customerCode: psCode, customerName: name } });
    }if (localStorage.getItem("idCust") == null && localStorage.getItem("cust") == null) {
      //pertama
      console.log("4");
      this._router.navigate(['app/main/available-unit'], { queryParams: { customerCode: psCode, customerName: name } });
    }
  }

  buyPPPotential(item) {
    //  console.log("add",psCode);
    //  console.log("dada", name);
    console.log('item', item);
    console.log('tgl', moment(item.birthDate).format('YYYY-MM-DD'));
    let dateInput = moment(item.birthDate).format('DD/MM/YYYY');
    this._router.navigate(['app/pponline/transactionpp'], { queryParams: { customerPotential: true, custID: item.id } });
  }
  buyUnitPotential(item) {
    //  console.log("add",psCode);
    //  console.log("dada", name);
    
    if(localStorage.getItem("idCust") !== item.id.toString() && localStorage.getItem("cust") == "true") {
      //beda
      console.log("1");
      
      this.deleteCart();
      this._router.navigate(['app/main/available-unit'], { queryParams: { custID: item.id } });
    }if (localStorage.getItem("idCust") == item.id.toString() && localStorage.getItem("cust") == "true") {
      //sama
      console.log("2");
      this._router.navigate(['app/main/available-unit'], { queryParams: { custID: item.id } });
    }if (localStorage.getItem("idCust") == null && localStorage.getItem("cust") == "false"){
      //beda
      console.log("3");
      this.deleteCart();
      this._router.navigate(['app/main/available-unit'], { queryParams: { custID: item.id } });
    }if (localStorage.getItem("idCust") == null && localStorage.getItem("cust") == null) {
      //pertama
      console.log("4");
      this._router.navigate(['app/main/available-unit'], { queryParams: { custID: item.id } });
    }
  }

  showDetails(data) {
    this.addPotentialCustomerModal.show(data);
  }
  
  timePeriodeChange(event){
    let timeperiode=event;
    if (event=='All'){
      timeperiode=undefined;
    }
    this.getPotentialCustomerList(this.inputUn,timeperiode);
  }
}



