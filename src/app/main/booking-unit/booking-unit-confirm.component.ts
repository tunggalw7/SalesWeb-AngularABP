import { Component, Injector, ViewChild, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import {
    TransactionServiceProxy,
    DiagramaticServiceProxy,
    TransactionPPServiceProxy,
    BulkPaymentServiceProxy,
    CreateUnitVirtualAccountInputDto,
    CreateTransactionUniversalDto,
    PaymentPPServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { AppSessionService } from '@shared/common/session/app-session.service';
import * as moment from 'moment';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { truncateSync } from 'fs';

export class ConfirmCtrl {
    fund: any;
    bank: any;
    dest: any;
    no_rek: any;
    voucher: any;
    ppNo: any;
}

@Component({
    templateUrl: './booking-unit-confirm.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
    styleUrls: ['./booking-unit-confirm.component.css']
})
export class ConfirmComponent extends AppComponentBase {
    bankID: any;
    @ViewChild('dataTable') dataTable: DataTable;
    foundSource;
    bank;
    transSource;
    paySource: any = [];
    payType;
    userID: number;
    psCode: string;
    detailData: any = [];
    detailCustomer: any = [];
    dateInput;
    rpInput;
    payForm: FormGroup;
    model_ctrl: ConfirmCtrl = new ConfirmCtrl;
    dataTrans;
    dataNotif;
    autodebet;
    checkPP = false;
    ppnumber;
    form_builder_confirm = {
        'fund': [null, Validators.compose([Validators.required])],
        'bank': [null, Validators.compose([Validators.required])],
        'dest': [null, Validators.compose([Validators.required])],
        'no_rek': [null, Validators.compose([Validators.required])],
        'voucher': [null],
        'ppNo': [null]
    }

    otherPaymentStatus: boolean = false;
    VoucherPp: any;
    voucherPrice: any;
    voucherTotalToBePaid: any;
    voucherValue: any;
    listPPNo: any;
    ppPrice: any;
    hiddenPayment: boolean = false;
    ppnoSelected: any;
    totalToBePaid: any;
    paymentTypeList: any;

    getPscodePP;
    dataUnit = [];
    dataArrPP = [];

    constructor(injector: Injector,
        private _diagramService: DiagramaticServiceProxy,
        private _appSessionService: AppSessionService,
        private _transactionServiceProxy: TransactionServiceProxy,
        private _transactionPPServiceProxy: TransactionPPServiceProxy,
        private _bulkPaymentServiceProxy: BulkPaymentServiceProxy,
        private _paymentPPServiceProxy: PaymentPPServiceProxy,
        // private _oneSignalNotificationServiceProxy : OneSignalNotificationServiceProxy,
        private _script: ScriptLoaderService,
        private _fb: FormBuilder,
        private _router: Router,
        private _currencyPipe: CurrencyPipe) {
        super(injector);

        this.userID = this._appSessionService.userId;

        this.psCode = localStorage.getItem('pscode');
        let pscodePP = localStorage.getItem('psCode-pp');
        this.getPscodePP = (pscodePP == "" ? null : pscodePP);

        this.payForm = _fb.group(this.form_builder_confirm);
        this.model_ctrl = this.r_control();
    }

    r_control() {
        return {
            fund: this.payForm.controls['fund'],
            bank: this.payForm.controls['bank'],
            dest: this.payForm.controls['dest'],
            no_rek: this.payForm.controls['no_rek'],
            voucher: this.payForm.controls['voucher'],
            ppNo: this.payForm.controls['ppNo']
        }
    }

    payTypee: any;
    payLoading = false;
    voucherPayTypeId;
    ngOnInit() {
        this.getTransactionSetting();

        this._transactionServiceProxy.getGetListBank()
            .finally(() => {
                setTimeout(() => {
                    $('.bank').selectpicker('refresh');
                }, 0);
            })
            .subscribe(result => {
                this.bank = result;
            });

        this._diagramService.getListSumberDana()
            .finally(() => {
                setTimeout(() => {
                    $('.foundSource').selectpicker('refresh');
                }, 0);
            })
            .subscribe(result => {
                this.foundSource = result;
            });

        this._diagramService.getListTujuanTransaksi()
            .finally(() => {
                setTimeout(() => {
                    $('.dest').selectpicker('refresh');
                }, 0);
            })
            .subscribe(result => {
                this.transSource = result;
            });

        if (this.getPscodePP != undefined) {
            this.get_data(this._appSessionService.userId, this.getPscodePP);
        } else {
            this.get_data(this._appSessionService.userId, this.psCode);
        }
    }

    //Get Payment Type
    getListPaymentType(projectId?, flag?) {
        let hiddenPayment = [16, 5, 17];
        this.payLoading = true;

        this._paymentPPServiceProxy.getListPaymentMethod(projectId, flag)
            .finally(() => {
                setTimeout(() => {
                    // $('.paymentType').selectpicker('refresh');
                    this.payLoading = true;
                })
            }).subscribe(result => {
                this.paymentTypeList = result;
                result.forEach(item => {
                    if (item.paymentType == 17) {
                        this.voucherPayTypeId = item.paymentTypeId;
                    }
                    if (item.paymentType == 5) {
                        this.autodebet = item.paymentTypeId;
                    }
                    if (hiddenPayment.indexOf(item.paymentType) == -1) {
                        this.paySource.push(item);
                    }
                });
            });
    }

    PpnPreview;
    checkPPnInPreview(event) {
        this._transactionServiceProxy.checkPPnInPreview(event)
            .subscribe(result => {
                this.PpnPreview = result;
            })
    }

    checkUnitPP() {
        this.payTypee = false;
        setTimeout(() => {
            // this.payTypee = true;
        }, 3000);
        for (var i = 0; i < this.detailData.unit.length; i++) {
            let unit = this.detailData.unit[i];

            if (unit.ppNo == null) unit.ppNo = "";
            if (unit.ppNo == "") unit.ppNo = "";

            if (unit.ppNo != "") {
                this.ppnumber = this.detailData.unit[i].ppNo;
                this.payType = 5;
                this.hiddenPayment = true;
                this.checkPP = true;
                break;
            }
        }
    }

    projectCode;
    get_data(userid, pscode) {
        this.payLoading = true;
        // this.payTypee = false;
        this._transactionServiceProxy.getDetailBookingUnit(userid, pscode)
            .finally(() => {
                setTimeout(() => {
                    this.payLoading = false;
                }, 3000);
            })
            .subscribe(result => {
                // this.checkPPnInPreview(result.unit[0].projectID);
                this.detailData = result;
                this.detailCustomer = result.customer;
                this.projectCode = result.unit[0].projectCode;
                if (this.detailCustomer) {
                    this.dateInput = moment(this.detailCustomer.birthDate).format('DD MMMM YYYY');
                }
                if (this.detailData.amountToBePaid) {
                    // var rupiah = '';
                    // var angkarev = this.detailData.amountToBePaid.toString().split('').reverse().join('');
                    // for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
                    this.rpInput = this._currencyPipe.transform(this.detailData.amountToBePaid, 'Rp. ');

                    // this.rpInput = 'Rp. ' + rupiah.split('', rupiah.length - 1).reverse().join('');
                }

                this.primengDatatableHelper.records = result.unit;
                this.primengDatatableHelper.totalRecordsCount = result.unit.length;
                this.primengDatatableHelper.hideLoadingIndicator();

                if (this.getPscodePP != undefined) {
                    this.psCode = this.getPscodePP;
                }

                if (this.checkPP) {
                    for (var i = 0; i < this.detailData.unit.length; i++) {
                        this.dataUnit.push({
                            "ppNo": this.detailData.unit[i].ppNo,
                            "unitID": this.detailData.unit[i].unitID,
                            "termID": this.detailData.unit[i].termID,
                            "renovID": this.detailData.unit[i].renovID,
                            "projectID": this.detailData.unit[i].projectID,
                            "sellingprice": this.detailData.unit[i].sellingPrice,
                            "bfAmount": this.detailData.unit[i].bookingFee,
                            "bankID1": this.detailData.unit[i].bankID1,
                            "bankID2": this.detailData.unit[i].bankID2
                        });
                    }
                } else {
                    for (var i = 0; i < this.detailData.unit.length; i++) {
                        this.dataUnit.push({
                            "ppNo": null,
                            "unitID": this.detailData.unit[i].unitID,
                            "termID": this.detailData.unit[i].termID,
                            "renovID": this.detailData.unit[i].renovID,
                            "projectID": this.detailData.unit[i].projectID,
                            "sellingprice": this.detailData.unit[i].sellingPrice,
                            "bfAmount": this.detailData.unit[i].bookingFee,
                            "bankID1": this.detailData.unit[i].bankID1,
                            "bankID2": this.detailData.unit[i].bankID2
                        });
                    }
                    this.dataArrPP.push({ "ppNo": "" });
                }


                this.getListPaymentType(result.unit[0].projectID, 1);
                this.checkUnitPP();
                this.voucherByUnitCheck(this.detailData);
            });
    }

    //check status unit project
    voucherByUnitCheckLoading = false;
    voucherByUnitCheck(detail) {
        this.voucherByUnitCheckLoading = true;
        let unitLength: any = detail.unit;

        if (unitLength.length == 1) {
            this.otherPaymentStatus = false;
            this.voucherByUnitCheckLoading = false;
            if (unitLength[0].isRequiredPP == true) {
                this.otherPaymentStatus = true
            } else {
                this.otherPaymentStatus = false;
            }
        } else if (unitLength.length > 1) {
            for (let i = 0; i < unitLength.length; i++) {
                if (unitLength[0].projectID == unitLength[i].projectID) {
                    this.voucherByUnitCheckLoading = false;
                    this.otherPaymentStatus = false;
                    if (unitLength[0].isRequiredPP == true) {
                        this.otherPaymentStatus = true
                    } else {
                        this.otherPaymentStatus = false;
                    }
                } else {
                    this.voucherByUnitCheckLoading = false;
                    this.otherPaymentStatus = true;
                    break;
                }
            }
        }
        this.getPPNo();
    }

    //clean value on change voucher or PP
    onChangeVoucherByUnitCheckLoading = false;
    onChangeVoucherByUnitCheck(voucherPp) {
        this.payType = undefined;
        this.payLoading = false;

        if (voucherPp == '1') {
            this.payTypee = true;
        } else if (voucherPp == '2') {
            this.payTypee = false;
        }

        this.onChangeVoucherByUnitCheckLoading = true;
        if (this.VoucherPp == 1) {
            this.voucherTotalToBePaid = this.rpInput;
            if (this.rpInput == "Rp. 0.00") {
                this.payTypee == true
            }
            if (this.totalToBePaid == 0) {
                this.payTypee == true
            }
            this.totalToBePaid = this.detailData.amountToBePaid;
            this.ppPrice = undefined;
            this.onChangeVoucherByUnitCheckLoading = false;
            this.onChangehiddenPayment('1');
        } else {
            this.totalToBePaid = undefined;
            this.voucherValue = undefined;
            this.model_ctrl.voucher.value = null;
            this.payForm.controls['voucher'].reset();
            this.voucherTotalToBePaid = this.rpInput;
            if (this.rpInput == "Rp. 0.00") {
                this.payTypee == true
            }
            if (this.totalToBePaid == 0) {
                this.payTypee == true
            }
            this.totalToBePaid = this.detailData.amountToBePaid;
            this.voucherPrice = undefined;
            this.onChangeVoucherByUnitCheckLoading = false;
            this.onChangehiddenPayment('1');
        }
    }

    //get list PPNO
    getPPNoLoading = false;
    getPPNo() {
        if (this.ppnumber == undefined) {
            // this.payTypee = true;
        }

        this.getPPNoLoading = true;
        this._diagramService.getDropdownPPNo(this.psCode, this.detailData.unit[0].projectID)
            .finally(() => {
                this.getPPNoLoading = false
            }).subscribe(result => {
                this.listPPNo = result;
            });
    }

    //check on change PPNO
    isExceedsTheLimit: boolean = false;
    isSelectedPPLimit: boolean = false;
    finalPrice: number = 0;
    sumOfPPPrice: number = 0;
    sumOfPPPriceMatcher: number = 0;
    isLatest: boolean = false;
    onChangePPnoLoading = false;
    onChangePPno(ppNo) {
        if (ppNo.value.length <= this.primengDatatableHelper.records.length) {
            if (this.isExceedsTheLimit) {
                this.isExceedsTheLimit = false;
                this.isSelectedPPLimit = false;
            } else {
                if (this.ppnumber == undefined) {
                    // this.payTypee = true;
                    this.hiddenPayment = false;
                }

                this.isSelectedPPLimit = false;
                this.onChangePPnoLoading = true;
                this.ppPrice = undefined;
                this.voucherValue = undefined;
                this.voucherTotalToBePaid = this.rpInput;
                if (ppNo.value.length > 0) {
                    // this.payTypee = (ppNo.value.length == this.dataUnit.length ? false : true);

                    this.finalPrice = 0;
                    this.sumOfPPPrice = 0;
                    this.sumOfPPPriceMatcher = 0;

                    this.ppnoSelected = [];
                    this.ppnoSelected = ppNo.value;

                    this.ppnoSelected
                        .forEach((ppnoObj, index) => {
                            this.getPPPrice(ppnoObj, index);
                        });

                        console.log(this.ppnoSelected)

                } else {
                    this.onChangePPnoLoading = false;
                    this.ppnoSelected = undefined;
                    this.payType = undefined;
                    this.payTypee = false;
                }
            }
        }
        else {
            this.isSelectedPPLimit = true;
            this.isExceedsTheLimit = true;
            return false;
        }
    }

    getPPPrice(ppnoItem, index) {
        this._transactionServiceProxy.getPPPrice(ppnoItem)
            .finally(() => {
                this.onChangePPnoLoading = false;
            }).subscribe(result => {
                this.sumOfPPPrice = this.calculatePPPrice(this.sumOfPPPrice, result.ppPrice);
                if (this.sumOfPPPrice != this.sumOfPPPriceMatcher) {
                    this.sumOfPPPriceMatcher = this.sumOfPPPrice;
                    // console.log("sumOfPPPrice ", this.sumOfPPPriceMatcher);

                    let count = index + 1;
                    this.isLatest = (this.ppnoSelected.length == count ? true : false);

                    if (this.isLatest === true) {
                        // this.finalPrice = 0;
                        delete this.ppPrice, delete this.voucherTotalToBePaid, delete this.totalToBePaid;

                        this.finalPrice = this.detailData.amountToBePaid - this.sumOfPPPriceMatcher;
                        // console.log("final price = " + this.detailData.amountToBePaid + " - " + this.sumOfPPPriceMatcher + " = " + this.finalPrice);

                        this.ppPrice = this._currencyPipe.transform(this.sumOfPPPriceMatcher, 'Rp. ');
                        this.voucherTotalToBePaid = this._currencyPipe.transform(this.finalPrice, 'Rp. ');
                        this.totalToBePaid = this.finalPrice;
                        // console.log("totalToBePaid ", this.totalToBePaid);

                        if (this.totalToBePaid == 0) {
                            this.paymentTypeList.forEach(item => {
                                let paytype = item.paymentType;
                                if (paytype == 5) {
                                    this.payType = item.paymentTypeId + '|' + item.paymentType;
                                    // this.payTypee = true
                                }
                            });
                        }
                        this.onChangehiddenPayment('2');

                    }
                }
            });
    }

    calculatePPPrice(sumPPPrice: number, itemPPPrice: number) {
        return sumPPPrice + itemPPPrice;
    }

    //check for hedden payment method
    onChangehiddenPayment(value) {
        if (this.ppnumber == undefined) {
            this.hiddenPayment = true;
        } else {
            this.hiddenPayment = false;
        }

        if (this.totalToBePaid <= 0) {
            this.hiddenPayment = true;
        } else {
            this.hiddenPayment = false;
        }
    }

    //verify voucher input available or no
    voucherExists;
    totallastbepaid;
    onChangeVoucherLoading = false;
    onChangeVoucher(voucher) {
        this.voucherExists = false;
        if (voucher !== undefined && voucher !== null) {
            if (voucher.length == 8) {
                this.onChangeVoucherLoading = true;
                this.voucherValue = voucher;
                this._transactionPPServiceProxy.verifyVoucher(voucher, this.projectCode)
                    .finally(() => {
                        setTimeout(() => {
                            this.payTypee = true;
                            // if (this.voucherExists==false){
                            if (this.totalToBePaid < 0 && this.voucherPrice != 0) {
                                this.message.info('Your voucher amount is bigger than amount to be paid. The rest amount will completely used up.');
                            }
                            // }        
                            this.onChangehiddenPayment('1');
                            this.onChangeVoucherLoading = false;
                        }, 0)
                    }).subscribe(result => {
                        this.voucherPrice = this._currencyPipe.transform(result.message, 'Rp. ');
                        if (parseFloat(result.message) > parseFloat(this.detailData.amountToBePaid)) {
                            this.voucherTotalToBePaid = this._currencyPipe.transform(0, 'Rp. ');
                            this.totallastbepaid = 0;
                        } else {
                            this.voucherTotalToBePaid = this._currencyPipe.transform(this.detailData.amountToBePaid - parseFloat(result.message), 'Rp. ');
                            this.totallastbepaid = this.detailData.amountToBePaid - parseFloat(result.message);
                        }
                        this.totalToBePaid = this.detailData.amountToBePaid - parseFloat(result.message);
                        if (this.totallastbepaid == 0) {
                            this.paymentTypeList.forEach(item => {
                                let paytype = item.paymentType;
                                if (paytype == 17) {
                                    this.payType = item.paymentTypeId + '|' + item.paymentType;
                                }
                            });
                        } else {
                            this.payType = undefined;
                        }
                    }, err => {
                        // if (err.message=='Voucher already used') this.voucherExists = true;                    
                        this.onChangeVoucherLoading = false;
                        this.voucherValue = undefined;
                        this.model_ctrl.voucher.value = null;
                        // this.totalToBePaid = 0;
                        this.voucherPrice = undefined;
                        this.totallastbepaid = undefined;
                        this.totalToBePaid = undefined;
                        this.voucherTotalToBePaid = this.rpInput;
                        this.payForm.controls['voucher'].reset();
                        this.payType = undefined;
                        this.payTypee = false;
                        this.onChangehiddenPayment('1');
                    });
            } else {
                this.onChangeVoucherLoading = false;
                this.voucherPrice = undefined;
                this.voucherTotalToBePaid = this.rpInput;
                this.totalToBePaid = this.detailData.amountToBePaid;
                this.payType = undefined;
                this.payTypee = false;
                this.onChangehiddenPayment('1');
            }
        }
    }

    
    // getNotif(item){
    //     debugger
    //     let orderID = item[0].orderID;
    //     let dataNotif = new GetDataPushNotifDto;
    //     let dataUnitBooked = item;
    //     dataNotif.unitOrderID = orderID;
    //     this._oneSignalNotificationServiceProxy.pushNotif(dataNotif)
    //         .finally(() => {
    //             setTimeout (() => {
                   
    //             }, 3000);
    //         })
    //         .subscribe(result => {                           
    //         });

    // }

    paydisable = false;
    bookPay() {
        this.paydisable = true;
        this.payLoading = true;
        this.payTypee = false;

        let payTypeID;
        if (this.checkPP) {
            payTypeID = this.autodebet;
        } else {
            if (this.payType == undefined && this.totallastbepaid == 0 && this.payTypee == true) {
                payTypeID = this.voucherPayTypeId;
            } else {
                payTypeID = parseInt(this.payType.split("|")[0]);
            }
        }

        this.dataTrans = {
            "payTypeID": payTypeID,
            "pscode": this.psCode,
            "totalAmt": this.detailData.amountToBePaid,
            "orderHeaderID": 0,
            "orderCode": "",
            "arrPP": this.dataArrPP,
            "arrUnit": this.dataUnit,
            "userID": this.userID,
            "memberCode": this._appSessionService.user.userName,
            "memberName": this._appSessionService.user.name,
            "scmCode": "",
            "otherPaymentType": ""
        }

        if (this.model_ctrl.dest.value != undefined) {
            this.dataTrans.tujuanTransaksiID = this.model_ctrl.dest.value;
        }
        if (this.model_ctrl.fund.value != undefined) {
            this.dataTrans.sumberDanaID = this.model_ctrl.fund.value;
        }
        if (this.model_ctrl.no_rek.value != undefined) {
            this.dataTrans.nomorRekeningPemilik = this.model_ctrl.no_rek.value;
        }
        if (this.model_ctrl.bank.value != undefined) {
            this.dataTrans.bankRekeningPemilik = this.model_ctrl.bank.value;
        }

        // if (this.VoucherPp=="2" && !this.hiddenPayment) this.dataTrans.otherPaymentType = this.ppnoSelected;
        if (this.VoucherPp == "2" && this.hiddenPayment) this.dataTrans.otherPaymentType = "";
        // if (this.ppnoSelected !== undefined && this.ppnoSelected !== null) {
        //     this.dataTrans.otherPaymentType = this.ppnoSelected;
        // }

        if (this.voucherValue !== undefined && this.voucherValue !== null) {
            this.dataTrans.otherPaymentType = this.voucherValue;
        }

        let message = "", message_title = "";

        if (this.checkPP) {
            this._transactionServiceProxy.doBookingPriorityPass(this.dataTrans)
                .finally(() => {
                    setTimeout(() => {
                        this.payLoading = false;
                        this.paydisable = false;
                    }, 3000);
                })
                .subscribe(result => {
                    this.message.info('Transaction successfully')
                        .done(() => {
                            localStorage.removeItem('mytimer' + this._appSessionService.userId);
                            localStorage.removeItem('creationtimer' + this._appSessionService.userId);
                            localStorage.removeItem('booking_duration');
                            window.open('/app/sales-portal/dashboard/', "_self");
                            localStorage.removeItem('psCode-pp');
                        });
                });
        } else {
            if (this.payType.split("|")[1] == '5') { // Pay with Priority Pass

                /* Start: Set selected PPNO's to Unit Data */
                if (this.ppnoSelected.length >= this.dataTrans.arrUnit.length) {
                    for (let index = 0; index < this.dataTrans.arrUnit.length; index++) {
                        this.dataTrans.arrUnit[index].ppNo = this.ppnoSelected[index];
                    }
                }
                /* End: Set selected PPNO's to Unit Data */

                this._transactionServiceProxy.doBookingPriorityPass(this.dataTrans)
                    .subscribe(dataUnitBooked => {
                        // this.getNotif(dataUnitBooked);
                        if (dataUnitBooked.length > 0) {
                            for (let index = 0; index < dataUnitBooked.length; index++) {
                                let count = index + 1;
                                let unit = dataUnitBooked[index];
                                let isLatest = (dataUnitBooked.length === count ? true : false);

                                var unitPrices = this.dataTrans.arrUnit.find(function (arrUnit) {
                                    return arrUnit.unitID == unit.unitId;
                                });

                                this.createBilling(false, unit.bookCode, unit, unitPrices, isLatest);
                                // this.generateKonfirmasiPesanan(unit.orderID, unit.unitId, unit.bookCode);
                            }
                        }
                    });
            } else {
                this._transactionServiceProxy.doBookingMidransReq(this.dataTrans)
                    .finally(() => {
                        setTimeout(() => {
                            this.payLoading = false;
                            this.paydisable = false;
                        }, 3000);
                    })
                    .subscribe(result => {
                        if (this.payType == undefined && this.totallastbepaid == 0 && this.payTypee == true) {
                            message = "";
                            message_title = "Transaction successfully";
                        } else {
                            if (this.payType.split("|")[1] == '4') {
                                message = "Payment method has been sent to email:" + result.biller_code;
                                message_title = "Your virtual account number is (Permata Bank) " + result.permata_va_number;
                            }
                            else if (this.payType.split("|")[1] == '3' || this.payType.split("|")[1] == '10' || this.payType.split("|")[1] == '11') {
                                message = "Redirecting you to midtrans, please do not refresh this page";
                                message_title = result.status_message;
                            }
                            else {
                                message = "";
                                message_title = "Transaction successfully";
                            }
                        }
                        this.message.info(message, message_title)
                            .done(() => {
                                if (this.payType.split("|")[1] == '3' || this.payType.split("|")[1] == '10' || this.payType.split("|")[1] == '11') {
                                    window.open(result.redirect_url);
                                }
                                this._router.navigate(['app/sales-portal/dashboard']);
                            });
                    });
            }
        }
    }

    clientId;
    getTransactionSetting() {
        this._transactionServiceProxy.getTransactionSetting()
            .subscribe(result => {
                this.clientId = result.value;
            });
    }

    convertDate(_input_date) {
        let _datetime_expired = new Date(new Date(_input_date).getTime() - (new Date(_input_date).getTimezoneOffset() * 60000))
            .toISOString();
        //.split("T");
        return _datetime_expired;
    }

    isKPSended = { "yes": [], "no": [] }
    isGenerateVa = { "yes": [], "no": [] }
    listOfBookedUnit = [];
    createBilling(_isPriorityPass, _typeOfCode, _unit?, _prices?, _isLatest?) {
        let _type = "createbilling";
        let _client_id = this.clientId;
        let _trx_id = _typeOfCode;
        let _billing_type = (_isPriorityPass ? "c" : "i");

        let _trx_amount;
        if (this.VoucherPp == "2" && !this.hiddenPayment && (this.ppnoSelected == undefined || this.ppnoSelected.length == 0)) _trx_amount = this.detailData.amountToBePaid;
        else if (this.VoucherPp == "2" && !this.hiddenPayment) _trx_amount = _prices.sellingprice - _prices.bfAmount;
        else if (this.VoucherPp == "2" && this.hiddenPayment) _trx_amount = _prices.sellingprice - _prices.bfAmount;
        else if (this.VoucherPp == undefined && !this.hiddenPayment) _trx_amount = this.detailData.amountToBePaid;

        let now = new Date();
        // +5 Year
        let add5year = now.getFullYear() + 5;
        let set5year = new Date().setFullYear(add5year);
        let _datetime_expired_bookunit = this.convertDate(set5year);

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

            "trx_amount": Math.round(_trx_amount),
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

            "customer_name": this.detailCustomer.customerName, /* (Required) this.detailCustomer.customerName */
            "customer_email": this.detailCustomer.email, // this.detailCustomer.email: "syauqigusti@gmail.com"
            //"customer_phone": "083834415004",
            //"virtual_account": "8001000000000001",
            "datetime_expired": _datetime_expired_bookunit,
            "description": "Payment of Trx " + _trx_id,
        };

        this._bulkPaymentServiceProxy.createBilling(createBillingDto)
            .finally(() => {
                setTimeout(() => {
                    this.payLoading = false;
                    this.paydisable = false;
                }, 3000);
            })
            .subscribe(result => {
                if (!_isPriorityPass) { //Unit

                    this.listOfBookedUnit.push({
                        "unit": _unit,
                        "va_number": result.data.virtual_account
                    });
                    this.insertVaNumberMsVirtualAccount(result.data, _unit, _isLatest);
                }
            });
    }

    insertVaNumberMsVirtualAccount(_trxReturn, _trxUnit, _isLatest) {
        let perUnit = _trxUnit.unitCode + "-" + _trxUnit.unitNo;
        this._transactionServiceProxy.createVirtualAccount(
            new CreateUnitVirtualAccountInputDto({
                "unitId": _trxUnit.unitId,
                "noVA": _trxReturn.virtual_account
            })
        )
            .finally(() => {
                // if (_isLatest) {
                //     abp.notify.info('VA number has been generated for: <b>' + this.isGenerateVa.yes + '</b>.' + (this.isGenerateVa.no.length > 0 ? ' And delayed or failed for: <b>' + this.isGenerateVa.no + '</b>.' : ''), 'Generate Virtual Account.');
                // }
            })
            .subscribe(result => {
                this.isGenerateVa.yes.push(perUnit);
                this.generateKonfirmasiPesanan(_trxUnit.orderID, _trxUnit.unitId, _trxUnit.bookCode, _trxUnit, _isLatest);
            }, err => {
                this.isGenerateVa.no.push(perUnit);
            });
    }

    generateKonfirmasiPesanan(orderId, unitId, bookCode, unit, _isLatest) {
        let perUnit = unit.unitCode + "-" + unit.unitNo;
        this._transactionServiceProxy.sendEmailKP(orderId, unitId, bookCode)
            .finally(() => {
                if (_isLatest) {
                    // abp.notify.info('Email has been sent for: <b>' + this.isKPSended.yes + '</b>.' + (this.isKPSended.no.length > 0 ? ' And delayed or failed for: <b>' + this.isKPSended.no + '</b>.' : ''), 'Konfirmasi Pesanan.');

                    this.showResultNotification();
                }
            })
            .subscribe(result => {
                this.isKPSended.yes.push(perUnit);
            }, err => {
                this.isKPSended.no.push(perUnit);
            });
    }

    showResultNotification() {
        setTimeout(function () {
            $("#popup-banktransfer")[0].className = "swal-overlay swal-overlay--show-modal";
        }, 1500);
    }

    imgClick() {
        this.payTypee = false;
        this.payLoading = true;
        setTimeout(() => {
            this.payLoading = false;
        }, 3000);
    }
}

