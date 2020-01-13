import { Component, Injector, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import {
    ListRenovationResultDto,
    DiagramaticServiceProxy,
    InsertTRUnitReservedInputDto,
    TransactionServiceProxy,
    ListTermResultDto,
    GrossPriceDto,
    ProjectServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { CurrencyPipe } from '@angular/common';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { AppSessionService } from '@shared/common/session/app-session.service';

export class SelectionCtrl {
    renovation: any;
    term: any;
    bank: any;
}

@Component({
    templateUrl: './booking-unit-selection.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./booking-unit-selection.component.css'],
    animations: [appModuleAnimation()]
})
export class BookingUnitComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable') dataTable: DataTable;

    model_ctrl: SelectionCtrl = new SelectionCtrl;
    _model_form: SelectionCtrl = new SelectionCtrl;
    selectionForm: FormGroup;
    _model_renov: any;
    _model_term: any;
    editForm: FormGroup;
    bankList = [];
    bankList2: any;
    modelBankList: any = [];
    modelBankList2: any = [];
    bankID: any = [];
    renovations: ListRenovationResultDto[] = [];
    terms: ListTermResultDto[] = [];
    prices;
    prices_param;
    button_status = false;
    project_office;
    tower;
    sub;
    params_url;
    changeBankList: any = [];
    userID;
    unitImg;
    dataCart;
    bankSet: any;
    creationTime;
    timerMsg;
    renov;
    validationForm: FormGroup;
    dataTerm: any = [];
    showBank = false;
    view = {
        'projectName': null,
        'clusterName': null
    };
    form_builder_selection = {
        'renovation': [null, Validators.compose([Validators.required])],
        'term': [null, Validators.compose([Validators.required])],
        'bank': [null]
    }

    constructor(injector: Injector,
        private _activeroute: ActivatedRoute,
        private _router: Router,
        private _renovService: DiagramaticServiceProxy,
        private _priceService: DiagramaticServiceProxy,
        private _termService: DiagramaticServiceProxy,
        private _projectService: ProjectServiceProxy,
        private _towerService: ProjectServiceProxy,
        private _transaction: TransactionServiceProxy,
        private _sessionService: AbpSessionService,
        private _fb: FormBuilder,
        private _script: ScriptLoaderService,
        private _diagramaticService: DiagramaticServiceProxy,
        public _appSessionService: AppSessionService,
        private _changeDetector: ChangeDetectorRef) {
        super(injector);
        
        localStorage.removeItem("redirectLinkAfterLoggedIn");
        this.selectionForm = _fb.group(this.form_builder_selection);
        this.model_ctrl = this.r_control();
    }

    ngDoCheck() {
        this._changeDetector.detectChanges();
    }

    /*executes once the component template is built*/
    ngAfterViewInit() {
        // $("#start_timer").click(function () {
        //   alert('Your unit has been reserved for 30 minutes');
        //   if (localStorage.getItem('booking_duration') == undefined || localStorage.getItem('booking_duration') == '' || localStorage.getItem('booking_duration') == 'null:NaN' || localStorage.getItem('booking_duration') == ':NaN') {
        //     localStorage.setItem('booking_duration', "30 : 00");
        //   } else {
        //     localStorage.setItem('booking_duration', $('#mytimer')[0].innerHTML);
        //   }
        // });
    }

    unitDetail: any;
    customerCode: any;
    customerName: any;
    fromCustomer: boolean;
    custID: any;
    customerPotential: any;
    fromPotential: boolean;
    ngOnInit(): void {
        this.bankID = {
            bankID1: 0,
            bankID2: 0
        }
        this.changeBankList = {
            termID: 0,
            termName: undefined
        }
        this.sub = this._activeroute.params.subscribe(params => {
            this.params_url = params;
            this.customerCode = params.customerCode;
            this.customerName = params.customerName;
            this.custID = params.custID;

            if (params.unitID != undefined) {
                this._diagramaticService.getUnitSelectionDetail(params.unitID).subscribe((result) => {
                    if (result.projectName != undefined) this.view.projectName = result.projectName;
                    if (result.tower != undefined) this.view.clusterName = result.tower;

                    this.unitDetail = result;
                });
            }
            if (this.custID !== undefined) {
                this.fromPotential = true;
            } else if (this.customerCode !== undefined && this.customerName !== undefined) {
                this.fromCustomer = true;
            }

            this.checkPPnInPreview(this.params_url.projectID);
            this.getListterm_and_renovation();
        });

    }

    PpnPreview;
    checkPPnInPreview(event){
        this._transaction.checkPPnInPreview(event)
            .subscribe(result => {
                this.PpnPreview = result;
            })
    }

    r_control() {
        return {
            renovation: this.selectionForm.controls['renovation'],
            term: this.selectionForm.controls['term'],
            bank: this.selectionForm.controls['bank'],
        }
    }

    myMethod(e) {
        const LIMIT_NUMBER = 2;
        if (e.value.length > LIMIT_NUMBER) {
            e.value.pop();
        }
        if (e.value.length) {
            this.bankID = {
                bankID1: null,
                bankID2: null
            }
            for (let index = 0; index < e.value.length; index++) {
                if (index == 0) {
                    this.bankID.bankID1 = e.value[index] = 0 ? null : e.value[index];
                }
                if (index == 1) {
                    this.bankID.bankID2 = e.value[index] = 0 ? null : e.value[index];
                }
            }
        }
        this.getGrossPriceTemp();
    }

    getNameFromList(list: any[], key: string, key_value: string, value: any) {
        let value_save;
        list.forEach(item => {
            if (item[key_value] == value) {
                value_save = item[key];
            }
        });
        return value_save;
    }

    rennovationLoading = false;
    getListterm_and_renovation() {
        this.rennovationLoading = true;
        this._renovService.getListRenovation(this.params_url.unitID)
            .finally(() => {
                setTimeout(() => {
                    this._model_form.renovation = this.renov;
                    $(".renovation").selectpicker("refresh");
                    this.rennovationLoading = false;
                }, 0);
            })
            .subscribe(result => {
                this.renovations = result;
                this.renovations.forEach(items => {
                    if (items.renovationName === "Gold") {
                        this.renov = items.renovationID;
                    }
                })
            });
    }

    getTerm(renovid) {
        if (renovid) {
            this._termService.getListTerm(this.params_url.unitID, renovid)
                .finally(() => {
                    setTimeout(() => {
                        $('.term').selectpicker('refresh');
                        this.prices = null;
                        this.button_status = false;
                    }, 0);
                })
                .subscribe(result => {
                    this.terms = result;
                });
        }
    }

    getlistTower() {
        this._towerService.getDetailListProject(this.params_url.projectID)
            .subscribe((result) => {
                this.tower = result.cluster;
                this.view.clusterName = this.getNameFromList(this.tower, 'clusterName', 'clusterId', this.params_url.clusterid);
            });
    }

    unitLoading = false;
    getgrossPrice(unitID: number, renovID: number, termID: number) {
        this.button_status = false;
        this.unitLoading = true;
        this._termService.getGrossPrice(unitID, renovID, termID)
            .subscribe((result) => {
                setTimeout(() => {
                    this.button_status = true;
                }, 1000);

                this.unitLoading = false;
                if (result.grossPrice !== undefined) {
                    this.prices = result.grossPrice;
                    this.prices_param = result.grossPrice;
                } else {
                    this.notify.error('error when get price');
                }
            });
    }

    onchangeterm(obj) {
        this.changeBankList.termID = '';
        this.changeBankList.termName = '';
        this.dataTerm = obj;
        this.changeBankList = [];
        
        if (obj != undefined) {
            if (obj.termName.indexOf('KPA') !== -1 || obj.termName.indexOf('KPR') !== -1) {
                this.showBank = true;
                this.prices = "";
                this.changeBankList = obj;
                this.getListBank();
                this.selectionForm.controls['bank'].setValidators(Validators.compose([Validators.required]));
                this.selectionForm.controls['bank'].reset();
            } else {
                this.showBank = false;
                this.bankID = [];
                this.modelBankList = [];
                this.selectionForm.controls['bank'].setValidators(Validators.compose([null]));
                this.selectionForm.controls['bank'].reset();
                this._model_form.term = this.dataTerm.termID;

                this.getGrossPriceTemp();
            }
        }
    }

    getGrossPriceTemp() {
        this.prices = null;
        this.button_status = false;

        let termid;
        if (this.showBank == true) {
            termid = this._model_form.term.termID;
        } else {
            termid = this._model_form.term;
        }
        this.getgrossPrice(this.params_url.unitID, this._model_form.renovation, termid);
        //     }
        // }, 1000);
    }

    getListBank() {
        this._renovService.getListBankKPA(this.params_url.projectID, 0)
            .finally(() => {
                setTimeout(() => {
                    $('.bankList').selectpicker('refresh');
                }, 0);
            }).subscribe(result => {
                this.bankList = []
                result.forEach(element => {
                    let input = {
                        value: 0,
                        label: '',
                    }
                    input.value = element.bankID
                    input.label = element.bankName
                    this.bankList.push(input)
                });
            })
    }

    onchangeBankList(bank) {
        this.prices = '';
        this.bankID.bankID1 = bank;
        this._renovService.getListBankKPA(this.params_url.projectID, bank).finally(() => {
            setTimeout(() => {
                $('.bankList2').selectpicker('refresh');
            }, 0);
        }).subscribe(result => {
            this.bankList2 = result;
        });
    }

    onchangeBankList2(bank) {
        this.bankID.bankID2 = bank;
        this.getGrossPriceTemp();
    }

    onchangerenov(evnt) {
        this.prices = null;
        this.button_status = false;
        this.changeBankList.termID = '';
        this.changeBankList.termName = '';
        this.getTerm(evnt);
    }

    checkSecond(sec) {
        if (sec < 10 && sec >= 0) {
            sec = "0" + sec
        }; // add zero in front of numbers < 10
        if (sec < 0) {
            sec = "59";
        }

        return sec;
    }

    checkAuthenticatedUser() {
        if (this._appSessionService.userId) {
            this.inserttrunitreserved();
        } else {
            localStorage.setItem("redirectLinkAfterLoggedIn", window.location.href);
            this._router.navigate(['/account/login']);
        }
    }

    inserttrunitreserved() {
        if (this.prices_param == undefined || this.prices_param <= 0) {
            this.message.info('Unit price is not valid! Please contact the administration for more info.');
        } else {
            this.button_status = false;
            let params = new InsertTRUnitReservedInputDto;
            if ((this.params_url.ppNo != '') || (this.params_url.ppNo == 'false')) {
                params.ppNo = (this.params_url.ppNo == 'false' ? "" : this.params_url.ppNo);
                params.psCode = (this.params_url.psCode == 'false' ? "" : this.params_url.psCode);

                localStorage.setItem('psCode-pp', params.psCode);
            }
            params.projectID = this.params_url.projectID;
            params.unitID = this.params_url.unitID;
            params.sellingPrice = this.prices_param;
            params.renovID = this._model_form.renovation;
            params.termID = this._model_form.term.termID;
            params.userID = this._sessionService.userId;
            params.bankID1 = this.bankID.bankID1;
            params.bankID2 = this.bankID.bankID2;
            params.projecttInfoID = this.unitDetail.projectInfoID;

            if ((localStorage.getItem('mytimer' + this._sessionService.userId) === null)) {
                this.timerMsg = 'Your unit has been reserved for 30 minutes';
            } else {
                this.timerMsg = 'Your remaining time is ' + localStorage.getItem('mytimer' + this._sessionService.userId);
            }


            this._transaction.insertTrUnitReserved(params)
                .subscribe((result) => {
                    if (result.result) {
                        localStorage.setItem('bank', JSON.stringify(this.bankID));
                        this.message.success('Unit Reserved Successfully')
                            .done(() => {
                                this.message.info(this.timerMsg)
                                    .done(() => {
                                        if (this.fromCustomer == true) {
                                            localStorage.setItem("idCust", this.customerCode);
                                            localStorage.setItem("cust", "true");
                                            this._router.navigate(['/app/main/cart', this.customerCode, this.customerName]);
                                        } else if (this.fromPotential == true) {
                                            localStorage.setItem("idCust", this.custID);
                                            localStorage.setItem("cust", "true");
                                            this._router.navigate(['/app/main/cart', this.custID]);
                                        } else {
                                            localStorage.setItem("cust", "false");
                                            this._router.navigate(['/app/main/cart']);
                                        }
                                    });
                            });
                    } else {
                        this.message.error(result.message).done(() => {
                            this._router.navigate(['/app/main/available-unit']);
                        });
                    }
                });
        }
    }
}
