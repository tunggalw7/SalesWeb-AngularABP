import { Component, Injector, ViewChild, ViewEncapsulation, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import {
    TransactionServiceProxy,
    RoleServiceProxy,
    RoleListDto,
    DiagramaticServiceProxy,
    BookingHistoryServiceProxy,
    ListResultDtoOfGetListNotaris
} from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppSessionService } from '@shared/common/session/app-session.service';
import * as moment from 'moment';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

export class ConfirmCtrl {
    fund: any;
    bank: any;
    dest: any;
    no_rek: any;
}

@Component({
    templateUrl: './booking-unit-finish.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
    styleUrls: ['./booking-unit-confirm.component.css']
})
export class FinishConfirmComponent extends AppComponentBase {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('SampleDatePicker') sampleDatePicker: ElementRef;

    selectedPsCode: any;

    foundSource;
    detailData: any = [];
    detailCustomer: any = [];
    payForm: FormGroup;
    model_ctrl: ConfirmCtrl = new ConfirmCtrl;
    dataTrans;

    dateInput;
    orderDate;
    finalOrderDate;
    
    params_url;
    dataOrder = [];
    detailOrder: any = [];
    notarys = [];
    // notarys: ListResultDtoOfGetListNotaris = new ListResultDtoOfGetListNotaris; 
    
    form_builder_confirm = {
        'fund': [null, Validators.compose([Validators.required])],
        'bank': [null, Validators.compose([Validators.required])],
        'dest': [null, Validators.compose([Validators.required])],
        'no_rek': [null, Validators.compose([Validators.required])]
    }

    constructor(injector: Injector,
        private _bookingService: BookingHistoryServiceProxy,
        private _diagramService: DiagramaticServiceProxy,
        private _appSessionService: AppSessionService,
        private _transactionService: TransactionServiceProxy,
        private _activeroute: ActivatedRoute,
        private _script: ScriptLoaderService,
        private _fb: FormBuilder,
        private _router: Router,
        private _currencyPipe: CurrencyPipe) {
        super(injector);

        this.payForm = _fb.group(this.form_builder_confirm);
        this.model_ctrl = this.r_control();
        // this.selectedPsCode = "00002317";
    }

    r_control() {
        return {
            fund: this.payForm.controls['fund'],
            bank: this.payForm.controls['bank'],
            dest: this.payForm.controls['dest'],
            no_rek: this.payForm.controls['no_rek']
        }
    }

    ngOnInit() {
        this._activeroute.params
            .subscribe(params => {
                this.params_url = params;
                if (this.params_url.orderID != "" || this.params_url.orderID != null) {
                    // for test http://localhost:4500/app/main/booking-unit-finish/1410
                    this.getDetailBookingHistory(this.params_url.orderID);
                    this.getListNotary();
                } else {
                    this.message.confirm(
                        "Are you sure to register new customer ?",
                        "Your order was not found",
                        isConfirmed => {
                            if (isConfirmed) this._router.navigate(['app/main/bookingHistory']);
                            else this._router.navigate(['app/main/dashboard']);
                        }
                    );
                }
            });
  
    }

    notaryLoading = false;
    getListNotary() {
        this.notaryLoading = true;
        this._transactionService.getListNotaris()
            .finally(() => {
                setTimeout(() => {
                    this.notaryLoading = false;
                    $('.notary').selectpicker('refresh');
                }, 0);
            })
            .subscribe(result => {
                this.notarys = result.items;
            });
    }

    getDetailBooking = false;
    getDetailBookingHistory(orderID) {
        this.getDetailBooking = true;
        this.primengDatatableHelper.isLoading = true;
        this._bookingService.getDetailBookingHistoryNotaris(orderID)
            .finally(() => {
                setTimeout(() => {
                    this.getDetailBooking = false;
                    this.primengDatatableHelper.isLoading = false;
                }, 0);
            })
            .subscribe((result) => {
                console.log("getDetailBookingHistory ", result);

                this.detailOrder = result;            
                this.detailOrder.orderDate = moment(this.detailOrder.orderDate).format("DD MMM YYYY"); 
                this.selectedPsCode = this.detailOrder.pscode;

                for (var i = 0; i < result.arrUnit.length; i++) {
                    this.dataOrder.push({ 
                        projectName: result.arrUnit[i].projectName, 
                        unitNo: result.arrUnit[i].unitno, 
                        unitName: result.arrUnit[i].unitName, 
                        detail: result.arrUnit[i].detail, 
                        facing: result.arrUnit[i].facingName, 
                        ppno: result.arrUnit[i].ppNo != "" ? result.arrUnit[i].ppNo : "-" });
                }
                this.primengDatatableHelper.records = this.dataOrder;
            });
    }

    invalidOrderdate = false;
    onSelectedOrderDate(orderdate) {
        let dateInput = moment(orderdate).format('MM/DD/YYYY');
        this.orderDate = dateInput;

        if (new Date(dateInput.toString()) > new Date()) this.invalidOrderdate = true;
        else {
            this.invalidOrderdate = false;
            this.finalOrderDate = moment(orderdate).format('YYYY-MM-DD');
        }
    }

    printKP(KPUrl) {
        // let finalKPUrl = KPUrl.split('"')[1];
        let myWindow = window.open(KPUrl, '_blank');
        myWindow.print();
    }
}