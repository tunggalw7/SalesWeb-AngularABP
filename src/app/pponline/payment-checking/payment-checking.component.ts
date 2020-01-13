import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AppComponentBase} from "@shared/common/app-component-base";
import {PaymentPPServiceProxy, PaymentBookingFeeServiceProxy, MsProjectServiceProxy} from "@shared/service-proxies/service-proxies";
import {DataTable, Paginator} from "primeng/primeng";
import { AbpSessionService } from 'abp-ng2-module/src/session/abp-session.service';

@Component({
    selector: 'app-payment-checking',
    templateUrl: './payment-checking.component.html',
    styleUrls: ['./payment-checking.component.css']
})
export class PaymentCheckingComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    first: any;
    model: any;
    project: any;

    constructor(injector: Injector,
                private _paymentPPServiceProxy: PaymentPPServiceProxy,
                private _paymentBFServiceProxy: PaymentBookingFeeServiceProxy, 
                private _msProjectServiceProxy: MsProjectServiceProxy,
                private _sessionService: AbpSessionService,
                ) {
        super(injector);
    }
    ngOnInit() {
        this.model = {
            projectID: undefined,
            orderCode: undefined,
            cutomerName: undefined,
            isPP: true,
        }
        this.getListProject(true);
    }
    ngAfterViewInit(): void {
        setTimeout(() => {   
            $('.ui-paginator-rpp-options').after('items per page');
        }, 0);
    }
    projectLoading = false;

    //get list project dropdown
    getListProject(event): void {
        this.projectLoading = true;
        if(event){
            this._paymentPPServiceProxy.getListProjectMapping().finally(() => {
                setTimeout(() => {
                    $('.project').selectpicker('refresh');
                    this.projectLoading = false;
                })
            }).subscribe(result => {
                this.project = result;
                this.model.projectID = result[0].projectID;
            })
        }
        else{
            this._msProjectServiceProxy.getProjectCheckRole(this._sessionService.userId,0).finally(() => {
                setTimeout(() => {
                    $('.project').selectpicker('refresh');
                    this.projectLoading = false;
                })
            }).subscribe(result => {
                this.project = result;
            })
        }
    }

    getListPaymentCheck(event = null): void {
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            if(this.model.isPP){
                this._paymentPPServiceProxy.getListPaymentCheck(this.model.projectID, this.model.orderCode, this.model.cutomerName)
                    .subscribe(result =>{
                        this.primengDatatableHelper.records = result;
                        this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                        this.primengDatatableHelper.totalRecordsCount = result.length;
                        this.primengDatatableHelper.hideLoadingIndicator();
                    }, err =>{
                        this.message.info('data not found');
                        this.primengDatatableHelper.hideLoadingIndicator();
                    })
            }
            else{
                this._paymentBFServiceProxy.getOrderCodeDataTasklist (this.model.cutomerName,this.model.projectID?this.model.projectID:0, this.model.orderCode)
                .subscribe(result =>{
                    this.primengDatatableHelper.records = result;
                    this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                    this.primengDatatableHelper.totalRecordsCount = result.length;
                    this.primengDatatableHelper.hideLoadingIndicator();
                }, err =>{
                    this.message.info('data not found');
                    this.primengDatatableHelper.hideLoadingIndicator();
                })
            }
        }
    }
    resetValue(event){
        this.model.projectID=undefined;
        this.model.orderCode=undefined;
        this.model.customerName=undefined;
        this.getListProject(event);
        this.first=0;
        this.primengDatatableHelper.records=[];
        this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
        this.primengDatatableHelper.totalRecordsCount=0;
    }
}
