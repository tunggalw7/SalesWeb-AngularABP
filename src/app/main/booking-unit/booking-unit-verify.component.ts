import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    AccountServiceProxy,
    SendEmailActivationLinkInput,
    SignUpCustomerInputDto,
    UnitTrUnitReservedDto,
    CustomerMemberServiceProxy,
    TransactionServiceProxy,
    UpdateTRUnitReserved,
    InsertTrUnitReservedResultDto
} from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { ValidationService } from "@app/main/share/validation.service";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from "primeng/primeng";
import { empty } from 'rxjs/observable/empty';

export class dataCustomerCtrl {
    name: any
    birthDate: any
    idNo: any
}

@Component({
    templateUrl: './booking-unit-verify.component.html',
    animations: [accountModuleAnimation()]
})
export class VerifyComponent extends AppComponentBase {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('SampleDatePicker') sampleDatePicker: ElementRef;

    public selectedDate: any;
    public dateTimePickerOptions: any;

    saving = false;
    editForm: FormGroup;
    customerForm: FormGroup;
    userID: number;
    reservedBy;
    finalBirthDate;
    dataCart: any = [];
    allunitID: any = [];
    bankID: any = [];
    records;
    totalRecordsCountt;

    firstTaskList = 0;
    firstTaskListt = 0;
    first = 0;

    model_ctrl: dataCustomerCtrl = new dataCustomerCtrl;
    _model: dataCustomerCtrl = new dataCustomerCtrl;
    model: SignUpCustomerInputDto = new SignUpCustomerInputDto;
    model_update: UpdateTRUnitReserved = new UpdateTRUnitReserved;
    cust: SignUpCustomerInputDto = new SignUpCustomerInputDto();
    dataUnit: UnitTrUnitReservedDto[] = [];
    dataLocalStorage: any = [];
    hiddenTop: boolean = false;
    bypp;

    form_builder_model = {
        'name': [null],
        'birthDate': [null],
        'idNo': [null, Validators.compose([null, Validators.minLength(15), Validators.maxLength(16), ValidationService.numValidator])]
    }

    constructor(
        injector: Injector,
        private _customerService: CustomerMemberServiceProxy, private _fb: FormBuilder,
        private _pscodeService: TransactionServiceProxy,
        private _unitService: TransactionServiceProxy,
        private _router: Router,
        private _activeroute: ActivatedRoute,
        private _appSessionService: AppSessionService,
        private _transaction: TransactionServiceProxy,
        private _script: ScriptLoaderService
    ) {
        super(injector);
        this.customerForm = _fb.group(this.form_builder_model);
        this.model_ctrl = this.r_control();
        this.userID = this._appSessionService.userId;
    }

    ngOnInit(): void {
        this.dataLocalStorage = {
            psCodeCust: undefined
        }
        this.dataLocalStorage = JSON.parse(localStorage.getItem("transaction"));
        if (this.dataLocalStorage == undefined) {
            this.hiddenTop = true;
            console.log('hidden top true');
        } else {
            console.log('hidden top false');
            this.hiddenTop = false;
        }

        this.bankID = JSON.parse(localStorage.getItem("bank"));
        // $(this.sampleDatePicker.nativeElement).datetimepicker().on('dp.change', function (e) {
        //     let dateInput = moment(e.date.format('MM/DD/YYYY'));
        //     this.selectedDate = dateInput.date;
        // });

        this.reservedBy = this._appSessionService.userId;
        this._activeroute.params.subscribe(params => {
            console.log('params', params);
            this.bypp = params.bypp;
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            $('.ui-paginator-rpp-options').after('items per page');
        }, 0);
    }

    invalidBirthdate = false;

    onSelectedBirthDate(birthdate) {
        if (birthdate != null) {
            debugger
            let dateInput = moment(birthdate).format('MM/DD/YYYY');
            this.model.birthDate = dateInput;

            if (new Date(dateInput.toString()) > new Date()) this.invalidBirthdate = true;
            else {
                this.invalidBirthdate = false;
                this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
            }
        }
    }

    submitLoading = false;

    isPersonals: any;
    result: any;
    potentialID: any;
    save(): void {

        this.submitLoading = true;
        let verify;
        let memberCode = '';
        if (this._appSessionService.user != undefined) memberCode = this._appSessionService.user.userName;
        if (this.model.name == undefined || this.finalBirthDate == undefined || this.model.idNo == undefined ||
            this.model.name == '' || this.finalBirthDate == '' || this.model.idNo == '') verify = 'false';

        console.log('verify', verify);
        this._customerService.getListCustomer(this.model.name, this.finalBirthDate, this.model.idNo, memberCode)
            .finally(() => {
                setTimeout(() => {
                    this.submitLoading = false;
                    this.primengDatatableHelper.isLoading = false;
                }, 0);
            })
            .subscribe((result) => {
                if (verify == 'false') {
                    // if (result.items.length){
                    this.primengDatatableHelper.isLoading = true;
                    this.primengDatatableHelper.showLoadingIndicator();
                    this.primengDatatableHelper.records = result.items;
                    for (let index = 0; index < this.primengDatatableHelper.records.length; index++) {
                        if (this.primengDatatableHelper.records[index].birthDate != null) {
                            this.primengDatatableHelper.records[index].birthDate = moment(this.primengDatatableHelper.records[index].birthDate).format('DD-MM-YYYY')
                        }
                        if (this.primengDatatableHelper.records[index].name == null) {
                            this.primengDatatableHelper.records = null;
                        }
                    }
                    this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                    this.primengDatatableHelper.totalRecordsCount = result.items.length;
                    this.primengDatatableHelper.hideLoadingIndicator();
                    // console.log('data', this.primengDatatableHelper.records)
                    // console.log('data2', result.items.length)
                    // console.log('data3', this.primengDatatableHelper.totalRecordsCount)
                    // }
                } else {
                    if (result.items.length) {
                        this.verify(result.items[0].isPersonals, result.items[0]);
                    } else {
                        this.message.confirm(
                            "Are you sure to register new customer ?",
                            "Customer '" + this.model.name + "' is not registered",
                            isConfirmed => {
                                if (isConfirmed) {
                                    this.toRegister();
                                }
                            }
                        );
                    }
                }
                this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                this.primengDatatableHelper.totalRecordsCount = result.items.length;
                this.primengDatatableHelper.hideLoadingIndicator();
                // }
            });
    }

    verify(isPersonals, record) {
        if (isPersonals == true && record.result == true) {
            this.message.success('Customer Verified Successfully').done(() => {
                var allunitreserved = [];
                var newpscode = record.psCode;

                if (this.userID == 2) {
                    this.message.info('You are logged in as Administrator').done(() => {
                    });
                } else {
                    // alert(this.userID);
                    this._transaction.getTrUnitReserved(this.userID)
                        .subscribe((res) => {

                            for (var i = 0; i < res.length; i++) {
                                let val: UnitTrUnitReservedDto = new UnitTrUnitReservedDto();
                                val.unitID = res[i].unitID;
                                this.dataUnit.push(val);
                            }

                            this.model_update.psCode = newpscode; //'26896747';
                            this.model_update.unit = this.dataUnit;
                            this._unitService.updatePsCodeTrUnitReserved(this.model_update)
                                .subscribe((updateResult) => {
                                    localStorage.setItem("pscode", newpscode);
                                    if (this.dataLocalStorage !== undefined) {
                                        this._router.navigate(['/app/main/updateCustomer/', newpscode, this.bypp]);
                                    } else {
                                        this._router.navigate(['/app/main/updateCustomer/', newpscode, this.bypp]);
                                    }
                                });
                        });
                }
            });
        } if (isPersonals == false && record.result == true) {
            this.potentialID = record.potentialCustID;
            this.message.confirm(
                "Are you sure to update potentials customer ?",
                "Customer '" + record.name + "' is Potential Customer",
                isConfirmed => {
                    if (isConfirmed) {
                        this.toRegisterPotential();
                    }
                }
            );
        }
        if (isPersonals == false && record.result == false) {
            this.message.confirm(
                "Are you sure to register new customer ?",
                "Customer '" + record.name + "' is not registered",
                isConfirmed => {
                    if (isConfirmed) {
                        this.toRegister();
                    }
                }
            );
        }
    }

    removeDate() {
        this.finalBirthDate = undefined;
        this.model.birthDate = undefined;
        this.invalidBirthdate = false;
    }

    r_control() {
        return {
            name: this.customerForm.controls['name'],
            birthDate: this.customerForm.controls['birthDate'],
            idNo: this.customerForm.controls['idNo']
        }
    }

    goToanotherRoute(idNo: any, name: any, birthDate: any) {
        // if (this.dataLocalStorage !== undefined) {
        this._router.navigate(['/app/main/registerCustomer/', idNo, name, birthDate, this.bypp]);
        // } else {
        //     this._router.navigate(['/app/main/registerCustomer/', idNo, name, birthDate, this.bypp]);
        // }
    }
    goToanotherRoutePotential(idNo: any, name: any, birthDate: any, potentialID: any) {
        // if (this.dataLocalStorage !== undefined) {
        //     this._router.navigate(['/app/main/registerCustomer/', idNo, name, birthDate, potentialID, this.bypp]);
        // } else {
        this._router.navigate(['/app/main/registerCustomer/', idNo, name, birthDate, potentialID, this.bypp]);
        // }
    }

    toRegister() {
        this.goToanotherRoute(this.model.idNo, this.model.name, this.model.birthDate);
    }
    toRegisterPotential() {
        this._router.navigate(['/app/main/registerCustomer/', this.potentialID, this.bypp]);
        // this.goToanotherRoutePotential(this.model.idNo, this.model.name, this.model.birthDate, this.potentialID);
    }
}





