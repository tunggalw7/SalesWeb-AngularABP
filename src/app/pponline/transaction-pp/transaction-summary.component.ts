import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    DiagramaticServiceProxy,
    OrderPPServiceProxy,
    BuyPPMidtransReqInputDto,
    TransactionServiceProxy,
    TransactionPPServiceProxy,
    BulkPaymentServiceProxy,
    InsertNoVirtualAccountInputDto,
    TrBuyPPOnlineInputDto,
    PaymentPPServiceProxy
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/common/session/app-session.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDirective } from "@node_modules/ngx-bootstrap";
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-transaction-summary',
    templateUrl: './transaction-summary.component.html',
    styleUrls: ['./transaction-pp.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TransactionSummaryComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @ViewChild('ojkModal') modal: ModalDirective;
    bankList: any;
    bankList2: any;
    totalPrice: any;
    dataLocalStorage: any = [];
    orderNo: any;
    validationForm: FormGroup;
    paymentType: any = [];
    paySource: any = [];
    payType: any;
    termCondition: boolean = false;
    ojkChecking: boolean = false;
    customerCode: any;
    customerName: any;
    ppOrderID: any;
    termRefID: any;
    termRefName: any;
    psCode: any;
    voucherCode: any;
    detailOrder: any = [];
    modelBuyPpMitrans: BuyPPMidtransReqInputDto;
    payTypeID;
    hiddenPayment: boolean = false;
    ppnoSelected: any;
    totalToBePaid: any;
    VoucherPp: any;
    voucherPrice: any;
    voucherTotalToBePaid: any;
    voucherValue: any;
    rpInput;
    voucherPayTypeId;

    constructor(injector: Injector,
        private _fb: FormBuilder,
        private _router: Router,
        private _activeroute: ActivatedRoute,
        private _appSessionService: AppSessionService,
        private _transactionPPServiceProxy: TransactionPPServiceProxy,
        private _diagramaticServiceProxy: DiagramaticServiceProxy,
        private _orderPPServiceProxy: OrderPPServiceProxy,

        private _transactionServiceProxy: TransactionServiceProxy,
        private _bulkPaymentServiceProxy: BulkPaymentServiceProxy,
        private _paymentPPServiceProxy: PaymentPPServiceProxy,

        private _currencyPipe: CurrencyPipe) {
        super(injector);
        this.validationForm = this._fb.group({
            'voucher': [null],
        });
    }


    ngOnInit() {
        this.getTransactionSetting();

        this.modelBuyPpMitrans = new BuyPPMidtransReqInputDto;
        this._activeroute.queryParams.subscribe(params => {
            this.psCode = params.psCode;
            this.customerCode = params.customerCode;
            this.customerName = params.customerName;
            this.ppOrderID = params.ppOrderID;
        });
        if (this.psCode == undefined) {
            this.psCode = this.customerCode;
        }

        this.getDetailOrder(this.ppOrderID);
    }

    ngAfterViewInit() {
        localStorage.removeItem("transaction");
    }

    TrBuyPPonlineLoading = false;
    //get Detail Order
    getDetailOrder(ppOrderID) {
        this.TrBuyPPonlineLoading = true;
        this._orderPPServiceProxy.getDetailOrder(ppOrderID)
            .finally(() => {
                this.TrBuyPPonlineLoading = false;
                this.setDataBank(this.detailOrder.dataBank);
                this.getListPaymentType(this.detailOrder.projectId, 0);
                this.termConditionChange();
            }).subscribe(result => {
                this.detailOrder = result;
                this.rpInput = this._currencyPipe.transform(this.detailOrder.totalOrder, 'Rp. ');
            })
    }

    // set data bank if available
    setDataBank(detailOrder) {
        this.bankList = detailOrder[0];
        this.bankList2 = detailOrder[1];
    }

    getListPaymentTypeLoading = false;
    //Get Payment Type
    getListPaymentType(projectId?, flag?) {
        let hiddenPayment = [16, 5, 17];
        this.getListPaymentTypeLoading = true;

        // this._diagramaticServiceProxy.getPaymentType().finally(() => {
        //     setTimeout(() => {
        //         $('.paymentType').selectpicker('refresh');
        //         this.getListPaymentTypeLoading = false;
        //     })
        // }).subscribe(result => {

        //     let paytype = result;
        //     paytype.forEach(item => {
        //         if (item.paymentType == 17){
        //             this.voucherPayTypeId = item.paymentTypeID;
        //         }
        //         if (hiddenPayment.indexOf(item.paymentType) == -1) {
        //             if (item.paymentType !== 17) {
        //                 this.paySource.push(item);
        //             } else if (this.detailOrder.qty == 1) {
        //                 this.paySource.push(item);
        //             }
        //         }
        //     });

        // });

        this._paymentPPServiceProxy.getListPaymentMethod(projectId, flag)
            .finally(() => {
                setTimeout(() => {
                    // $('.paymentType').selectpicker('refresh');
                    this.getListPaymentTypeLoading = false;
                })
            }).subscribe(result => {
                result.forEach(item => {
                    if (item.paymentType == 17) {
                        this.voucherPayTypeId = item.paymentTypeId;
                    }
                    if (hiddenPayment.indexOf(item.paymentType) == -1) {
                        if (item.paymentType !== 17) {
                            this.paySource.push(item);
                        } else if (this.detailOrder.qty == 1) {
                            this.paySource.push(item);
                        }
                    }
                });
            });
    }

    ojkHidden: boolean = false;
    buttonDisable: boolean = false;
    //change term condition
    termConditionChange() {
        if (this.detailOrder.termName.indexOf('KPA') !== -1) {
            this.ojkHidden = true; //hidden OJK
            if (this.termCondition == true && this.ojkChecking == true) {
                this.buttonDisable = true;
            } else if (this.termCondition !== true || this.ojkChecking !== true) {
                this.buttonDisable = false;
            }
        } else {
            this.ojkHidden = false;
            if (this.termCondition == true) {
                this.buttonDisable = true;
            } else if (this.termCondition == false) {
                this.buttonDisable = false;
            }
        }
    }

    onChangeVoucherByUnitCheckLoading = false;
    //clean value on change voucher or PP
    onChangeVoucherByUnitCheck(voucherPp) {
        this.voucherValue = undefined;
        this.voucherPrice = 0;
        if (voucherPp == true) {
            this.payTypee = true;
        } else {
            this.payTypee = false;
        }
        // this.payLoading = false;
        this.onChangeVoucherByUnitCheckLoading = true;
        this.voucherTotalToBePaid = this._currencyPipe.transform(this.detailOrder.totalOrder, 'Rp. ');
        // if (this.rpInput == "Rp. 0.00") {
        //     this.payTypee == true
        // }
        // if (this.totalToBePaid == 0) {
        //     this.payTypee == true
        // }
        this.totalToBePaid = this.detailOrder.totalOrder;
        this.onChangeVoucherByUnitCheckLoading = false;
        this.onChangehiddenPayment();
    }

    onChangeVoucherLoading = false;
    //verify voucher input available or no
    voucherExists;
    totallastbepaid;
    onChangeVoucher(voucher) {
        this.voucherExists = false;
        if (voucher !== undefined && voucher !== null) {
            if (voucher.length == 8) {
                this.onChangeVoucherLoading = true;
                this.voucherValue = voucher;
                this._transactionPPServiceProxy.verifyVoucher(voucher, this.detailOrder.projectCode).finally(() => {
                    setTimeout(() => {
                        // if (this.voucherExists==false){
                        if (this.totalToBePaid < 0 && this.voucherPrice != 0) {
                            this.message.info('Your voucher amount is bigger than amount to be paid. The rest amount will completely used up.');
                        }
                        // }        
                        this.onChangehiddenPayment();
                        this.onChangeVoucherLoading = false;
                    }, 0)
                }).subscribe(result => {
                    this.voucherPrice = this._currencyPipe.transform(result.message, 'Rp. ');
                    if (parseFloat(result.message) >= parseFloat(this.detailOrder.totalOrder)) {
                        this.voucherTotalToBePaid = this._currencyPipe.transform(0, 'Rp. ');
                        this.payType = undefined;
                        this.payTypee = true;
                        this.totallastbepaid = 0;
                    } else {
                        this.voucherTotalToBePaid = this._currencyPipe.transform(this.detailOrder.totalOrder - parseFloat(result.message), 'Rp. ');
                        this.totallastbepaid = this.detailOrder.totalOrder - parseFloat(result.message);
                    }
                    this.totalToBePaid = this.detailOrder.totalOrder - parseFloat(result.message);
                    if (this.totalToBePaid == 0) {
                        // this.paymentTypeList.forEach(item => {
                        //     let paytype = item.paymentType;
                        //     if (paytype == 17) {
                        //         this.payType = item.paymentTypeID + '|' + item.paymentType;
                        //     }
                        // });
                    }
                }, err => {
                    // if (err.message=='Voucher already used') this.voucherExists = true;                    
                    this.onChangeVoucherLoading = false;
                    this.voucherValue = undefined;
                    // this.model_ctrl.voucher.value = null;
                    // this.totalToBePaid = 0;
                    this.voucherPrice = undefined;
                    this.totallastbepaid = undefined;
                    this.totalToBePaid = undefined;
                    this.voucherTotalToBePaid = this.rpInput;
                    // this.payForm.controls['voucher'].reset();
                    this.payType = undefined;
                    // this.payTypee = false;
                    this.onChangehiddenPayment();
                })
            } else {
                this.onChangeVoucherLoading = false;
                this.voucherPrice = undefined;
                this.voucherTotalToBePaid = this.rpInput;
                this.totalToBePaid = this.detailOrder.amountToBePaid;
                this.payType = undefined;
                this.payTypee = false;
                this.onChangehiddenPayment();
            }
        }
    }

    onChangehiddenPayment() {
        if (this.totalToBePaid <= 0) {
            this.hiddenPayment = true;
        } else {
            this.hiddenPayment = false;
        }
    }

    changePaymentType(payType, payTypeID) {
        this.payTypeID = payTypeID;
        this.validationForm.controls['voucher'].reset();
        if (payTypeID == 17) {
            this.validationForm.controls['voucher'].setValidators(Validators.compose([Validators.required]));
        } else {
            this.validationForm.controls['voucher'].setValidators(Validators.compose([null]));
            this.validationForm.controls['voucher'].setValue([null]);
            this.validationForm.controls['voucher'].reset();
        }
    }

    showModal() {
        if (this.ojkChecking == true) {
            this.modal.show();
        }
    }

    payTypee = false;
    TrBuyPPonline() {
        this.buttonDisable = false;

        if (this.payType != undefined) {
            this.modelBuyPpMitrans.paymentTypeID = parseInt(this.payType.split("|")[0]);
            this.payTypeID = parseInt(this.payType.split("|")[1]);
        } else {
            if (this.VoucherPp == true) {
                this.modelBuyPpMitrans.paymentTypeID = this.voucherPayTypeId;
                this.payTypeID = 17;
            }
        }

        this.modelBuyPpMitrans.orderCode = this.detailOrder.orderNo;
        this.modelBuyPpMitrans.totalOrder = this.dataLocalStorage.totalPrice;
        this.modelBuyPpMitrans.ppOrderID = this.ppOrderID;
        this.modelBuyPpMitrans.psCode = this.psCode;
        this.modelBuyPpMitrans.totalOrder = this.detailOrder.totalOrder;

        if (this.payTypeID == '17') {
            this.modelBuyPpMitrans.voucher = this.voucherValue;
            this.buyPPNotMidtrans();
        } else {
            if (this.VoucherPp == true) {
                if (this.totalToBePaid > 0) {
                    this.modelBuyPpMitrans.voucher = this.voucherValue;
                    this.modelBuyPpMitrans.totalOrder = this.totalToBePaid;
                }
            }

            if (this.payTypeID == '4') {
                this.buyPPNotMidtrans();
            } else {
                this.buyPPMidtransReq();
            }

            delete this.modelBuyPpMitrans.voucher;
        }
    }

    isvoucher = false;
    buyPPNotMidtrans() {
        this.TrBuyPPonlineLoading = true;
        this._transactionPPServiceProxy.buyPPNotMidtrans(this.modelBuyPpMitrans)
            .finally(() => {
                this.TrBuyPPonlineLoading = false;
            }).subscribe(result => {
                if (this.payTypeID == '4') {
                    this.createBilling(this.modelBuyPpMitrans.orderCode);
                } else {
                    this.message.info(result.status_message);
                    let message = "";
                    let messageTitle = "Transaction successful";

                    this.message.info(message, messageTitle)
                        .done(() => {
                            this._router.navigate(['app/sales-portal/dashboard']);
                        });
                }
            })
    }

    buyPPMidtransReq() {
        this.TrBuyPPonlineLoading = true;
        this._transactionPPServiceProxy.buyPPMidtransReq(this.modelBuyPpMitrans)
            .finally(() => {
                this.TrBuyPPonlineLoading = false;
            }).subscribe(result => {
                let message = "Redirecting you to midtrans, please do not refresh this page";
                let messageTitle = result.status_message;
                this.message.info(message, messageTitle)
                    .done(() => {
                        window.open(result.redirect_url);
                        this._router.navigate(['app/sales-portal/dashboard']);
                    });
            })
    }

    clientId;
    getTransactionSetting() {
        this._transactionServiceProxy.getTransactionSetting()
            .subscribe(result => {
                this.clientId = result.value;
            });
    }

    convertDate(_input_date) {
        let _datetime_expired = new Date(new Date(_input_date).getTime() - (new Date(_input_date).getTimezoneOffset() * 60000 ))
                        .toISOString();
                        //.split("T");
        return _datetime_expired;
    }

    isShowing = false;
    listOfBookedUnit;
    createBilling(_typeOfCode) {
        let _type = "createbilling";
        let _client_id = this.clientId;
        let _trx_id = _typeOfCode;
        let _billing_type = "c";

        let now = new Date();
        // +1 week
        let add1week = now.getDate() + 7;
        let set1week = new Date().setDate(add1week);
        let _datetime_expired_buypp = this.convertDate(set1week);

        let createBillingDto = {
            "type": _type,
            /*
            (Required)
            createbilling, createbillingsms
            updatebilling, inquirybilling
            */

            "client_id": _client_id,
            /*
            (Required)
            ClientID is given by BNI along with the Secret Key
            "00285" is Visionet ID
            */

            "trx_id": _trx_id,
            /* (Required) 
            Invoice/Billing ID 
            PP trx idnya ordercode. Booking unit trx idnya bookcode
            */

            "trx_amount": this.detailOrder.totalOrder,
            /*
            (Required)
            Invoice/Billing Amount
            without decimal/thousand separators, only int
            this.detailData.amountToBePaid
            */

            "billing_type": _billing_type,
            /*
            (Required)
            pp billing typenya C , klo booking unit billingnya type i

            Open Payment: o
            Fixed Payment: c
            Installment/Partial Payment: i
            Minimum Payment: m
            Open Minimun Payment: n
            Open Maximum Payment: x
            */

            "customer_name": this.customerName, /* (Required) this.detailCustomer.customerName */
            // "customer_email": this.detailCustomer.email, // this.detailCustomer.email: "syauqigusti@gmail.com"

            //"customer_phone": "083834415004",
            //"virtual_account": "8001000000000001",
            "datetime_expired": _datetime_expired_buypp,
            "description": "Payment of Trx " + _trx_id,
        };

        this._bulkPaymentServiceProxy.createBilling(createBillingDto)
            .finally(() => {
                setTimeout(() => {
                    // this.payLoading = false;
                    // this.paydisable = false;
                    this.TrBuyPPonlineLoading = false;
                }, 3000);
            })
            .subscribe(result => {
                this.listOfBookedUnit = result.data;

                // Insert Generated Virtual Account Number to TR_PPORDER
                this.insertVaNumberTrPPOrder(result.data, this.detailOrder.orderID);

                if (this.listOfBookedUnit != undefined) {
                    this.isShowing = true;
                    setTimeout(function () {
                        $("#popup-banktransfer")[0].className = "swal-overlay swal-overlay--show-modal";
                    }, 1500);
                }
            });
    }

    insertVaNumberTrPPOrder(_trxReturn, _id) {
        this._transactionPPServiceProxy.insertNoVirtualAccount(
            new InsertNoVirtualAccountInputDto({
                "ppOrderID": _id,
                "noVA": _trxReturn.virtual_account
            })
        )
        .subscribe(result => {
            console.log(result);
        });
    }

    imgClick() {
        this.payTypee = true;
        // this.payLoading = true;
        // setTimeout(() => {
        //     this.payLoading = false;
        //     this.payTypee = true;
        // }, 3000);
    }
}
