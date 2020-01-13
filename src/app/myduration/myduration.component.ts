import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Injector,
  ViewContainerRef,
  ElementRef,
  ViewEncapsulation,
  HostListener
} from '@angular/core';

import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Subject } from 'rxjs/Subject';
import { RoleServiceProxy, RoleListDto, TransactionServiceProxy, DiagramaticServiceProxy } from '@shared/service-proxies/service-proxies';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AbpSessionService } from '@abp/session/abp-session.service';

@Component({
  selector: "myduration",
  templateUrl: './myduration.component.html'
})

export class DurationComponent extends AppComponentBase implements OnInit {
  booktime;
  dataCart;
  mytimer: any = [];
  creationTime;
  lefttime;
  constructor(injector: Injector, private _activeroute: ActivatedRoute,
    private _router: Router,
    private _sessionService: AbpSessionService,
    private activatedRoute: ActivatedRoute,
    private _diagramaticService: DiagramaticServiceProxy,
    private _transaction: TransactionServiceProxy) {
    super(injector);
    this.activatedRoute.url
      .subscribe(val => {
        this.getTimeCart();
        this.getListCart();
      });
  }

  ngOnInit(): void {
  }

  loadTimer(creationtime) {
    // var d1 = new Date();
    // if (this.lefttime==null){
    //    d1.setSeconds(0);
    // }
    // var d2 = this.addMinutes(new Date(localtime),30);  
    // if (d1.getDate() == d2.getDate()){
    // var diff = d2.getTime() - d1.getTime();
    var msec = creationtime;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    this.lefttime = { 'leftTime': creationtime / 1000 };
    // }
  }

  timerFinished() {
    if (this.dataCart != undefined) {
      if (this.dataCart.length) {
        this.message.info('All units in the shopping cart have been emptied', 'Booking duration has expired')
          .done(() => {
            this.lefttime = null;
            this.deleteCart();
          });
      }
    }
  }

  addMinuttes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  getTimeCart() {
    this._transaction.getTimeTrUnitReserved(this._sessionService.userId)
      .finally(() => {
        setTimeout(() => {
        }, 3000);
      })
      .subscribe((result) => {
        if (result.result == true) {
          this.loadTimer(result.message);
        }
      });
  }

  getListCart() {
    this._transaction.getTrUnitReserved(this._sessionService.userId)
      .finally(() => {
        setTimeout(() => {
        }, 3000);
      })
      .subscribe((result) => {
        this.dataCart = result;
      });
  }

  deleteCart() {
    //GET TOWER
    this._transaction.getTrUnitReserved(this._sessionService.userId)
      .finally(() => {
        this._router.navigate(['app/main/dashboard']);
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
}

