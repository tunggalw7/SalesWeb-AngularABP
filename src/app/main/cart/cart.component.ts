import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { RoleServiceProxy, RoleListDto, TransactionServiceProxy, UpdateTRUnitReserved, UnitTrUnitReservedDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  templateUrl: './cart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./cart.component.css'],
  animations: [appModuleAnimation()]
})
export class CartComponent extends AppComponentBase {
  @ViewChild('dataTable') dataTable: DataTable;

  reservedBy;
  dataCart: any = [];
  dataUnitReservedID;
  dataUnitNo;
  dataUnitID;
  prices;
  prices_param;
  pricess;
  prices_params;
  sub;
  params_url;
  add_unit = false;
  dataLocalStorage: any = [];
  model_update: UpdateTRUnitReserved = new UpdateTRUnitReserved;
  dataUnit: UnitTrUnitReservedDto[] = [];

  getPscodePP;

  constructor(
    injector: Injector,
    private _activeroute: ActivatedRoute,
    private _unitService: TransactionServiceProxy,
    private _router: Router,
    private _transaction: TransactionServiceProxy,
    private _appSessionService: AppSessionService,
    private _currencyPipe: CurrencyPipe,
    private _script: ScriptLoaderService
  ) {
    super(injector);
    let pscodePP = localStorage.getItem('psCode-pp');
    this.getPscodePP = (pscodePP == "" ? null : pscodePP);
  }

  customerCode: any;
  customerName: any;
  fromCustomer: boolean;
  custID: any;
  customerPotential: any;
  fromPotential: boolean;
  ngOnInit(): void {
    this._activeroute.params.subscribe(params => {
      this.params_url = params;
      this.customerCode = params.customerCode;
      this.customerName = params.customerName;
      this.custID = params.custID
      if (this.custID !== undefined) {
        this.fromPotential = true;
      } else if (this.customerCode !== undefined && this.customerName !== undefined) {
        this.fromCustomer = true;
      }
    })
    if (this.getPscodePP != undefined) {
      this.add_unit = true;
    }

    this.reservedBy = this._appSessionService.userId;
    this.getCart();
  }

  PpnPreview;
    checkPPnInPreview(event){
        this._transaction.checkPPnInPreview(event)
            .subscribe(result => {
                this.PpnPreview = result;
            })
    }

  ngAfterViewInit(): void {
    setTimeout(() => {
      $('.ui-paginator-rpp-options').after('items per page');
    }, 0);
  }

  isCart = false;
  getCart() {
    this._transaction.getTrUnitReserved(this.reservedBy).subscribe((result) => {
      if (result.length > 0) this.isCart = true;
      else this.isCart = false;
      this.dataCart = result;
      if (this.dataCart.length == 1) {
        this.checkPPnInPreview(result[0].projectID);
      }
      this.primengDatatableHelper.getSorting(this.dataTable),
        this.primengDatatableHelper.totalRecordsCount = result.length;
      this.primengDatatableHelper.isResponsive = true;
      this.primengDatatableHelper.hideLoadingIndicator();

      // for (var i = 0; i < result.length; i++) {
      //   if (result[i].sellingPrice !== undefined) {
      //     this.dataCart[i].sellingPrice = this._currencyPipe.transform(result[i].sellingPrice, 'Rp. ');
      //   }
      //   if (result[i].bookingFee !== undefined) {
      //     this.dataCart[i].bookingFee = this._currencyPipe.transform(result[i].bookingFee, 'Rp. ');
      //   }
      // }
    });
  }

  confirmLoading = false;
  confirmOrder() {
    this.confirmLoading = true;
    setTimeout(() => {
      if (this.getPscodePP != undefined) {
        this._router.navigate(['app/main/updateCustomer', this.getPscodePP, false]);
      } else if (this.fromCustomer == true) {
        this._transaction.getTrUnitReserved(this._appSessionService.userId)
          .subscribe((res) => {
            for (var i = 0; i < res.length; i++) {
              let val: UnitTrUnitReservedDto = new UnitTrUnitReservedDto();
              val.unitID = res[i].unitID;
              this.dataUnit.push(val);

              this.model_update.psCode = this.customerCode; //'26896747';
              this.model_update.unit = this.dataUnit;
              this._unitService.updatePsCodeTrUnitReserved(this.model_update)
                .subscribe((updateResult) => {
                  localStorage.setItem("pscode", this.customerCode);
                  if (this.dataLocalStorage !== undefined) {
                    this._router.navigate(['/app/main/updateCustomer/', this.customerCode, false]);
                  }
                  // this.notify.info(updateResult.message);
                });
            }
          });
        // this._router.navigate(['/app/main/updateCustomer/', this.customerCode, false]);
      } else if (this.fromPotential == true) {
        this._router.navigate(['/app/main/registerCustomer/', this.custID, false]);
      } else {
        this._router.navigate(['app/main/booking-unit-verify', false]);
      }
      this.confirmLoading = false;
    }, 1500);
  }

  addUnit() {
    if (this.fromCustomer == true) {
      this._router.navigate(['app/main/available-unit'], { queryParams: { customerCode: this.customerCode, customerName: this.customerName } });
    } else if (this.fromPotential == true) {
      this._router.navigate(['app/main/available-unit'], { queryParams: { custID: this.custID } });
    } else {
      this._router.navigate(['app/main/available-unit']);
    }
  }

  cancelLoading = false;
  deleteCart(unitReservedID, unitNo) {
    this.dataUnitReservedID = unitReservedID;
    this.dataUnitNo = unitNo;

    this.message.confirm(
      "Are you sure to delete this unit ?",
      "Unit " + this.dataUnitNo,
      isConfirmed => {
        if (isConfirmed) {
          this.cancelLoading = true;
          this._transaction.deleteTrUnitReserved(this.dataUnitReservedID)
            .finally(() => {
              setTimeout(() => {
                this.cancelLoading = false;
              }, 3000);
            })
            .subscribe((result) => {
              this.message.success('Unit ' + this.dataUnitNo + ' Deleted Successfully').done(() => {
                if (this.dataCart.length == 1) {
                  window.location.reload();
                  localStorage.removeItem('mytimer' + this._appSessionService.userId);
                  localStorage.removeItem('creationtimer' + this._appSessionService.userId);
                }
                this.getCart();
                // this.dataCart = [];
              });
            });
        }

      }
    );
  }

  deleteAllCart() {
    for (var i = 0; i <= this.dataCart.length; i++) {
      this._transaction.deleteTrUnitReserved(this.dataCart[i].unitReservedID)
        .subscribe((result) => {
        });
    }
    this.getCart();
  }

  modalDelete(unitReservedID, unitNo, unitID) {
    this.dataUnitReservedID = unitReservedID;
    this.dataUnitNo = unitNo;
    this.dataUnitID = unitID;
    $("#modal_delete").modal("show");
  }
}

