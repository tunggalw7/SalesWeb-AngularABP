import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { RoleServiceProxy,GetListBookingHistoryInputDto, RoleListDto, BookingHistoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { BookingModalDetailComponent } from './booking-modal-detail.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './booking-history.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]

})

export class BookingHistoryComponent extends AppComponentBase {
  @ViewChild('dataTable') dataTable: DataTable;
  @ViewChild('detailBookingModal') detailBookingModal: BookingModalDetailComponent;
  browsers;
  memberCode;
  filterText;
  projectModel=[];
  dataHst: any;
  totalHst: number;
  projectItem;
  isMember:boolean=false;
  constructor(
    injector: Injector,
    private _appSessionService: AppSessionService,
    private _bookingService: BookingHistoryServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    // this.getListBookingHst();
    this.getListProject();
  }
  
  ngAfterViewInit(): void {
      setTimeout(() => {   
          $('.ui-paginator-rpp-options').after('items per page');
      }, 0);
  }

  project;
  search: boolean = false;
  onChangeProject(event){
    this.project = event
    
    if (this.project.length != 0) {
      this.search = true
    } else {
      this.search = false
    }
  }

  refreshLoading = false;
  historyRecord = [];
  getListBookingHst() {
    this.refreshLoading = true;
    let membercode='';
    if (this.isMember){
      membercode = this._appSessionService.user.userName;
    }
    delete this.dataHst;
    let filterHst = new GetListBookingHistoryInputDto;
    filterHst.memberCode = membercode;
    filterHst.projectID = this.projectModel;
    if(this.filterText!=undefined){
      filterHst.keyword = this.filterText;
    } else {
      filterHst.keyword = '';
    }
    if (this.search == true) {
      this.primengDatatableHelper.showLoadingIndicator();
      this._bookingService.getListBookingHistory(filterHst)
        .finally(() => {
          setTimeout(() => {
            this.refreshLoading = false;
            this.primengDatatableHelper.hideLoadingIndicator();
          }, 0);
        })
        .subscribe((result) => {
          // Mengambil result Booking Histoy
          this.historyRecord = [];
          result.forEach(items => {
            items.bookingHistory.forEach(item => {
              this.historyRecord.push(item)
            })
          })
          this.dataHst = this.historyRecord;
          this.totalHst = result.length;
          this.primengDatatableHelper.getSorting(this.dataTable);
          // this.primengDatatableHelper.totalRecordsCount = result.items.length;
        });
    } else {
      this.primengDatatableHelper.showLoadingIndicator();
      setTimeout(() => {
        this.refreshLoading = false;
        this.primengDatatableHelper.hideLoadingIndicator();
      }, 0);
      this.message.info("", this.l('Please Select Project First'));   
    }
  }

  projectLoading = false;
  getListProject() {
    this.projectLoading = true;
    this.memberCode = this._appSessionService.user.userName;
    let userid = this._appSessionService.userId;
    this._bookingService.getDropdownProjectBookingHistory(userid)
      .finally(() => {
        setTimeout(() => {
          $('.project').selectpicker('refresh');
          this.projectLoading = false;
        }, 0);
      })
      .subscribe((result) => {
        this.search = true;
        console.log("getListBookingHistory ", result);
        let idProject;
        // result.forEach(item => {
        //   console.log('ITEM', item);
        //   this.projectModel.push(item.projectID);
        // });
        for (let i = 0; i < result.length; i++){
          if (i == 0){
            this.projectModel.push(result[i].projectID);
          }
        }
        if (result.length) this.isMember = result[0].isMember;        
        this.projectItem = result;
      });
  }

}
