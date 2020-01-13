import { Component, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { MyCommissionSPServiceProxy, GetDetailCommissionDto, GetDetailMyCommissionListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DataTable } from 'primeng/components/datatable/datatable';

@Component({
  selector: 'detailCommissionModal',
  templateUrl: './detail-commission-modal.component.html',
  styleUrls: ['./my-commission.component.css'],

})
export class DetailCommissionComponent extends AppComponentBase {
  @ViewChild('dataTable') dataTable: DataTable;
  @ViewChild('detailCommissionModal') modal: ModalDirective;

  inputBookCode;
  _details: GetDetailMyCommissionListDto;
  details: GetDetailCommissionDto;
  firstTaskList = 0;
  bookCode: string; project: string;
  cluster: string; unitCode: string; unitNo: string;

  constructor(
    injector: Injector,
    private _mycommissionSPServiceProxy: MyCommissionSPServiceProxy,
  ) {
    super(injector);
  }

  show(bookCode): void {
    this.inputBookCode = bookCode;
    this.getDetailCommission(this.inputBookCode);
    this.modal.show();

  }

  close(): void {
    this.modal.hide();
    this.getDetailCommission(this.inputBookCode);
  }

  getDetailCommission(inputBookCode) {
    this._mycommissionSPServiceProxy.getDetailMyCommission(inputBookCode)
      .finally(() => {
        setTimeout(() => {
          $('.detail').selectpicker('refresh');
        }, 0);
        this.primengDatatableHelper.hideLoadingIndicator();
      })
      .subscribe((result) => {
        this.bookCode = result.bookCode
        this.project = result.projectCode + " - " + result.projectName
        this.cluster = result.clusterCode + " - " + result.clusterName
        this.unitCode = result.unitCode
        this.unitNo = result.unitNo
        this.primengDatatableHelper.records = result.dataReq;
        this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
        this.primengDatatableHelper.totalRecordsCount = result.dataReq.length;
        this.primengDatatableHelper.hideLoadingIndicator();
      }, err => {
        this.primengDatatableHelper.hideLoadingIndicator();
      });
  }

  taskListEvent(event = null, ) {
    if (event) {
      this.firstTaskList = event.first;
    } else {
      this.getDetailCommission(this.inputBookCode);
    }
  }
}


