import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import {
    RoleServiceProxy,
    RoleListDto,
    BookingHistoryServiceProxy,
    DiagramaticServiceProxy,
    TransactionServiceProxy,
    PaymentOBServiceProxy,

    PaymentPPServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import * as _ from 'lodash';
import { CurrencyPipe } from '@angular/common';
// import { Pipe } from '@angular/core';



// @Pipe({ name: 'round' })
// export class RoundPipe {
//     transform(input: number) {
//         return Math.round(input);
//     }
// }

export class ConfirmCtrl {
    dest: any;
    fund: any;
    bank: any;
    no_rek: any;
}

@Component({
    selector: 'detailBookingModal',
    templateUrl: './booking-modal-detail.component.html',
})

export class BookingModalDetailComponent extends AppComponentBase {

    @ViewChild('detailBookingModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    detailOrder: any = [];
    orderID;
    paySource: any = [];
    dataTrans;
    payType;
    extLink;
    foundSource;
    transSource;
    userID: number;
    psCode: string;
    model_ctrl: ConfirmCtrl = new ConfirmCtrl;
    adminRole: boolean;
    constructor(
        injector: Injector,
        private _paymentOBServiceProxy: PaymentOBServiceProxy,
        private _bookingService: BookingHistoryServiceProxy,
        private _transaction: TransactionServiceProxy,
        private _diagramService: DiagramaticServiceProxy,
        private _appSessionService: AppSessionService,
        private _transactionServiceProxy: TransactionServiceProxy,
        private _paymentPPServiceProxy: PaymentPPServiceProxy,
        private _currencyPipe: CurrencyPipe
    ) {
        super(injector);
        this.userID = this._appSessionService.userId;
        this.psCode = localStorage.getItem('pscode');
    }

    ngOnInit() {
        if (this._appSessionService.user.userName.toLowerCase() == 'admin') {
            this.adminRole = true;
        } else {
            this.adminRole = false;
        }
        // console.log('this._appSessionService',this._appSessionService);
        this.extLink = 'http://google.com/';

        this._diagramService.getListSumberDana()
            .subscribe((result) => {
                this.foundSource = result;
            });
        this._diagramService.getListTujuanTransaksi()
            .subscribe((result) => {
                this.transSource = result;
            });

    }

    PpnPreview;
    checkPPnInPreview(event){
        this._transaction.checkPPnInPreview(event)
            .subscribe(result => {
                this.PpnPreview = result;
            })
    }

    getDetailBooking = false;
    dataOrder = [];
    show(item?: any): void {
        debugger
        this.getDetailBooking = true;
        // this.user_data = userData;

        this.active = true;
        this.modal.show();
        this.orderID = item.orderID;

        this._bookingService.getDetailBookingHistoryWeb(this.orderID)
            .finally(() => {
                setTimeout(() => {
                    this.getDetailBooking = false;
                }, 0);
            })
            .subscribe((result) => {
                this.checkPPnInPreview(result.arrUnit[0].projectID);
                this.detailOrder = result;
                this.dataOrder = result.arrUnit;
                
                this.getListPaymentType(result.arrUnit[0].projectID, 1);
            });
    }

    //Get Payment Type
    getListPaymentType(projectId?, flag?) {
        this.getDetailBooking = true;

        this._paymentPPServiceProxy.getListPaymentMethod(projectId, flag)
            .finally(() => {
                setTimeout(() => {
                    // $('.paymentType').selectpicker('refresh');
                    this.getDetailBooking = false;
                })
            }).subscribe(result => {
                let datapaytype = result;
                datapaytype.forEach(item => {
                    let paytype = item.paymentType;
                    if (!(paytype == 16 || paytype == 5 || paytype == 17)) {
                        this.paySource.push(item);
                    }
                });
                for (var i = 0; i < result.length; i++) {
                    if (result[i].paymentTypeId === this.detailOrder.payTypeID) {
                        this.payType = this.detailOrder.payTypeID + "|" + result[i].paymentType;
                    }
                }
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    payLoading = false;
    messageBookPay = "";
    bookPay() {
        this.payLoading = true;

        this._paymentOBServiceProxy
            .checkPaymentStatus(this.detailOrder.orderCode)
            .finally(() => {
                setTimeout(() => {
                    this.payLoading = false;
                }, 1000);
            })
            .subscribe(result => {
                if (result.transaction_status == "settlement") {
                    this.message.info("This order has been made previous payment", "")
                        .done(() => {
                        });
                } else {
                    var dataUnit = [];
                    var totalAmt = 0;

                    for (var i = 0; i < this.detailOrder.arrUnit.length; i++) {
                        dataUnit.push(
                            {
                                "unitID": this.detailOrder.arrUnit[i].unitID,
                                "termID": this.detailOrder.arrUnit[i].termID,
                                "renovID": this.detailOrder.arrUnit[i].renovID,
                                "projectID": this.detailOrder.arrUnit[i].projectID,
                                "sellingprice": this.detailOrder.arrUnit[i].sellprice,
                                "bfAmount": this.detailOrder.arrUnit[i].bfamount,
                            }
                        );

                        totalAmt = totalAmt + this.detailOrder.arrUnit[i].bfamount;
                    }

                    var dataArrPP = [];
                    dataArrPP.push(
                        { "ppNo": "" }
                    );

                    this.dataTrans = {
                        "payTypeID": parseInt(this.payType.split("|")[0]),
                        "pscode": this.detailOrder.pscode,
                        "totalAmt": totalAmt,
                        "orderHeaderID": parseInt(this.detailOrder.orderHeaderID),
                        "orderCode": this.detailOrder.orderCode,
                        "tujuanTransaksiID": this.detailOrder.tujuanTransaksiID,
                        "sumberDanaID": this.detailOrder.sumberDanaID,
                        "nomorRekeningPemilik": this.detailOrder.nomorRekeningPemilik,
                        "bankRekeningPemilik": this.detailOrder.bankRekeningPemilik,
                        "arrUnit": dataUnit,
                        "arrPP": dataArrPP,
                        "userID": this.userID,
                        "memberCode": this.detailOrder.membercode,
                        "memberName": this.detailOrder.membername,
                        "scmCode": this.detailOrder.scmcode
                    };

                    if (this.payType.split("|")[1] == '11') this.messageBookPay = 'CIMB Clicks';
                    else if (this.payType.split("|")[1] == '10') this.messageBookPay = 'BCA KlikPay';
                    else if (this.payType.split("|")[1] == '4') this.messageBookPay = 'Bank Transfer';
                    else if (this.payType.split("|")[1] == '3') this.messageBookPay = 'Credit Card';

                    console.log("this.dataTrans ", this.dataTrans);

                    this._transactionServiceProxy.reorderUnit(this.dataTrans)
                        .finally(() => {
                            setTimeout(() => {
                                this.payLoading = false;
                            }, 0);
                        })
                        .subscribe(result => {
                            let message = "";
                            if (this.payType.split("|")[1] == '4') message = "Your Virtual Account Number is " + result.permata_va_number;
                            else message = "";

                            this.message.info(message, "OK, " + this.messageBookPay + " transaction is successful")
                                .done(() => {
                                    if (this.payType.split("|")[1] != '4') {
                                        window.open(result.redirect_url);
                                    }
                                    this.close();
                                    this.modalSave.emit(null);
                                });
                        });
                }

            });
    }

    resendKP() {
        this.payLoading = true;
        this._transactionServiceProxy.resendKP(this.detailOrder.orderHeaderID)
            .finally(() => {
                setTimeout(() => {
                    this.payLoading = false;
                }, 1000);
            })
            .subscribe(result => {
                this.message.success("Resend Konfirmasi Pesanan Successfully")
                    .done(() => {
                        this.close();
                        this.modalSave.emit(null);
                    });
            });
    }

    openKP(KPUrl) {
        // let finalKPUrl = KPUrl.split('"')[1];
        window.open(KPUrl, '_blank');
    }
}
