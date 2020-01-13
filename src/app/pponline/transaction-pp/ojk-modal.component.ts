import {Component, ViewChild, Injector, Output, EventEmitter, ElementRef, ViewEncapsulation} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {AppComponentBase} from '@shared/common/app-component-base';
import {CustomerMemberServiceProxy} from "@shared/service-proxies/service-proxies";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'ojkModal',
    templateUrl: 'ojk-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['transaction-pp.component.css']

})
export class OjkModalComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('ojkModal') modal: ModalDirective;


    customerCode: any;
    customerName: any;
    email: any;
    phone: any;
    maritalCode: any;
    maritalName: any;
    idNo: any;
    npwp: any;


    ppOrderID: any;
    detailCustomer: any;
    detailCustomer2: any;

    constructor(injector: Injector,
                private _activeroute: ActivatedRoute,
                private _customerMemberServiceProxy: CustomerMemberServiceProxy) {
        super(injector);
    }

    ngOnInit(): void {

    }

    //show modal with data table
    show(customerCode): void {
        this.detailCustomer = {}

        this.modal.show();

        this._activeroute.queryParams.subscribe(params => {
            this.customerCode = params.customerCode;
        });

        this.getDetailCustomer(this.customerCode);
        console.log('customer code', this.customerCode);
    }

    getDetailCustomer(customerCode) {
        this._customerMemberServiceProxy.getDetailCustomer(customerCode).finally(() => {

        }).subscribe(result => {
            this.customerName = result.name;
            this.email = result.email;
            this.phone = result.phone;
            this.idNo = result.idNo;
            this.npwp = result.npwp;

            this.maritalCode = result.marCode;
            this.setMaritalStatus(this.maritalCode);

            console.log('detail customer', result);
        })
    }


    setMaritalStatus(maritalCode) {
        this._customerMemberServiceProxy.getListMaritalStatus().finally(() => {

        }).subscribe(result => {
            console.log('result marital', result);
            result.forEach(items =>{
                if(items.marStatus == maritalCode){
                    this.maritalName = items.marStatusName;
                }
            });
            console.log('marital satatus name', this.maritalName);
        })
    }

    onShown(): void {
    }

    save(): void {
        const self = this;
    }


    close(): void {
        this.modal.hide();
    }

}
