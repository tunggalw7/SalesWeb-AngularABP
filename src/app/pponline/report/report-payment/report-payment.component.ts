import {AfterViewInit, Component, Injector, OnInit, ViewEncapsulation} from '@angular/core';
import {AppComponentBase} from "@shared/common/app-component-base";
import {
    GetReportPaymentInputDto, PaymentPPServiceProxy, OrderPPServiceProxy,
    GetCheckBoxDisplayedFieldResultDto
} from "@shared/service-proxies/service-proxies";
import {SelectItem} from "primeng/primeng";
import {FileDownloadService} from "@shared/utils/file-download.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-report-payment',
    templateUrl: './report-payment.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./report-payment.component.css']
})
export class ReportPaymentComponent extends AppComponentBase implements OnInit, AfterViewInit {
    orderStatus: any = [];
    paymentType: any = [];
    paymentBank: any = [];
    paymentDateFrom: any;
    paymentDateTo: any;
    orderDateFrom: any;
    orderDateTo: any;
    clearDateFrom: any;
    clearDateTo: any;
    listPaymentType: SelectItem[] = [];
    selectedTermPaymentTemp: any[] = [];
    selectedPaymentTypeText: any[] = [];
    selectedPaymentType: any[] = [];
    listPaymentBank: SelectItem[] = [];
    selectedPaymentBankTemp: any[] = [];
    selectedPaymentBankText: any[] = [];
    selectedPaymentBank: any[] = [];

    listCheckItemsDisable: boolean = true;
    listCheckItemsAll: SelectItem[] = [];
    listCheckItems: SelectItem[] = [];
    selectedDisplayField: any[] = [];
    selectedDisplayFieldAll: any[] = [];
    selectedDisplayFieldText: any[] = [];
    selectedDisplayFieldTextAll: any[] = [];
    selectedDisplayFieldTemp: any[] = [];
    selectedDisplayFieldTempAll: string[] = ['All'];
    listCheck: GetCheckBoxDisplayedFieldResultDto[] = [];
    statusID: any = [];
    changePrint: any;
    modelPaymentDateTo: any;
    modelPaymentDateStart: any;
    modelOrderDateTo: any;
    modelOrderDateStart: any;
    modelClearDateTo: any;
    modelClearDateStart: any;

    listBody: any[] = [];
    listBodyAll: any[] = [];
    listHeader: any = [];
    generatePdfUrl: any;
    generateExcelUrl: any;

    model: GetReportPaymentInputDto;
    modelGeneratePDF: any = [];
    modelSort: any = [];

    validationForm: FormGroup;


    constructor(injector: Injector,
                private _fb: FormBuilder,
                private _paymentPPServiceProxy: PaymentPPServiceProxy,
                private _fileDownloadService: FileDownloadService) {
        super(injector);
        this.validationForm = _fb.group({
            'printOn': [null, Validators.compose([Validators.required])],
            'project': [null, Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
        this.model = new GetReportPaymentInputDto;
        this.model.orderStatusID = [];
        this.model.bankID = [];
        this.model.paymentType = [];

        this.listCheckItemsAll = [
            {label: 'All', value: 'All'}
        ];

        this.modelSort = {
            printOn: '1',
            paperSize: '1',
            paperOrientation: '1',
        };

        this.modelGeneratePDF = {
            "paperSizeID": 0,
            "orientationID": 0,
            "listData": {
                "listHeader": [
                    {
                        "headerID": 0,
                        "header": "string"
                    }
                ],
                "listBody": [
                    {
                        "year": "string",
                        "yearMonth": "string",
                        "orderCode": "string",
                        "paymentDate": "string",
                        "clearDate": "string",
                        "paymentStatus": "string",
                        "ppNo": "string",
                        "paymentTypeName": "string",
                        "bankName": "string",
                        "bankBranch": "string",
                        "accountNo": "string",
                        "accountName": "string",
                        "customerName": "string",
                        "amount": 0
                    }
                ]
            }
        };

        // this.model.orderDateTo : any;
        this.getListOrderStatus();
        this.getListPaymentType();
        this.getListPaymentBank();
        this.getListCheckboxDisplayedField();
        this.getListProject();
    }

    getListprojectLoading = false;
    listProject: any = [];

    //get list project dropdown
    getListProject() {
        this.getListprojectLoading = true;
        this._paymentPPServiceProxy.getListProjectMapping().finally(() => {
            setTimeout(() => {
                this.refresh();
                $('.project').selectpicker('refresh');
                // $(".paymentDateTo").datepicker({maxDate: '0'});
                $(".paymentDateTo").datepicker("max", new Date());
                this.getListprojectLoading = false;
            }, 500)
        }).subscribe(result => {
            this.listProject = result;
        })
    }

    ngAfterViewInit() {
        this.refresh();
    }

    invalidPaymentDateStart = false;
    onSelectPaymentDateFrom(date) {
        let dateInput = date.format('YYYY/MM/DD');
        this.paymentDateFrom = dateInput;

        if (new Date(dateInput.toString()) > new Date()) {
            this.invalidPaymentDateStart = true;}
        else {
            this.invalidPaymentDateStart = false;
            // this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
        }
    }

    invalidPaymentDateTo = false;
    onSelectPaymentDateTo(date) {
        let dateInput = date.format('YYYY/MM/DD');
        this.paymentDateTo = dateInput;

        if (new Date(dateInput.toString()) > new Date()) {
            this.invalidPaymentDateTo = true;}
        else {
            this.invalidPaymentDateTo = false;
            // this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
        }
    }

    invalidOrderDateStart = false;
    onSelectOrderDateFrom(date) {
        let dateInput = date.format('YYYY/MM/DD');
        this.orderDateFrom = dateInput;

        if (new Date(dateInput.toString()) > new Date()) {
            this.invalidOrderDateStart = true;}
        else {
            this.invalidOrderDateStart = false;
            // this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
        }
    }

    invalidOrderDateEnd = false;
    onSelectOrderDateTo(date) {
        let dateInput = date.format('YYYY/MM/DD');
        this.orderDateTo = dateInput;


        if (new Date(dateInput.toString()) > new Date()) {
            this.invalidOrderDateEnd = true;}
        else {
            this.invalidOrderDateEnd = false;
            // this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
        }
    }

    invalidClearDateStart = false;
    onSelectClearDateFrom(date) {
        let dateInput = date.format('YYYY/MM/DD');
        this.clearDateFrom = dateInput;

        if (new Date(dateInput.toString()) > new Date()) {
            this.invalidClearDateStart = true;}
        else {
            this.invalidClearDateStart = false;
            // this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
        }
    }

    invalidClearDateEnd = false;
    onSelectClearDateTo(date) {
        let dateInput = date.format('YYYY/MM/DD');
        this.clearDateTo = dateInput;

        if (new Date(dateInput.toString()) > new Date()) {
            this.invalidClearDateEnd = true;}
        else {
            this.invalidClearDateEnd = false;
            // this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
        }
    }

    onChangePrintOn(value) {
        this.changePrint = value;
        setTimeout(() => {
            this.refresh();
        }, 200)
    }

    paperSizeLoading = false;

    refresh() {
        // $('.print').selectpicker('refresh');
        $('.paperOrientation').selectpicker('refresh');
        $('.paperSize').selectpicker('refresh');

    }

    orderStatusLoading = false;

    //get list order Status checkbox
    getListOrderStatus() {
        this.orderStatusLoading = true;
        this._paymentPPServiceProxy.getListOrderStatus().subscribe(result => {
            this.orderStatus = result;
        })
    }

    getListPaymentTypeLoading = false;

    getListPaymentType() {
        this.getListPaymentTypeLoading = true;
        this._paymentPPServiceProxy.getListPaymentType().finally(() => {
            setTimeout(() => {
                $('.print').selectpicker('refresh');
                $('.paymentType').selectpicker('refresh');
                this.getListPaymentTypeLoading = false;
                // $(".paymentDateEnd").datepicker("setDate", new Date());
                // $(".orderDateEnd").datepicker("setDate", new Date());
            })
        }).subscribe(result => {
            this.paymentType = result;
            this.paymentType.forEach(item => {
                this.listPaymentType.push({
                    value: {
                        id: item.paymentType,
                        name: item.paymentTypeName
                    },
                    label: item.paymentTypeName
                });
            });
            this.paymentType.map((items) => this.selectedTermPaymentTemp.push(
                {
                    id: items.paymentType,
                    name: items.paymentTypeName
                }));
            this.onChangePaymentType(this.selectedTermPaymentTemp);
        });
    }

    onChangePaymentType(event) {
        this.selectedPaymentType = [];
        this.selectedPaymentTypeText = [];
        this.selectedTermPaymentTemp.forEach(item => {
            this.selectedPaymentType.push(item.id);
            this.selectedPaymentTypeText.push(item.name);
        });
    }

    getListPaymentBankLoading = false;

    getListPaymentBank() {
        this.getListPaymentBankLoading = true;
        this._paymentPPServiceProxy.getListDropdownBank().finally(() => {
            setTimeout(() => {
                this.getListPaymentBankLoading = false;
                $('.paymentBank').selectpicker('refresh');
            })
        }).subscribe(result => {
            this.paymentBank = result;
            this.paymentBank.forEach(item => {
                this.listPaymentBank.push({
                    value: {
                        id: item.bankID,
                        name: item.bankName
                    },
                    label: item.bankName
                });
            });
            this.paymentBank.map((items) => this.selectedPaymentBankTemp.push(
                {
                    id: items.bankID,
                    name: items.bankName
                })
            );
            this.onChangePaymentBank(this.selectedPaymentBankTemp);
        });
    }

    onChangePaymentBank(event) {
        this.selectedPaymentBank = [];
        this.selectedPaymentBankText = [];
        this.selectedPaymentBankTemp.forEach(item => {
            this.selectedPaymentBank.push(item.id);
            this.selectedPaymentBankText.push(item.name);
        });
    }

    getListCheckboxDisplayedFieldLoading = false;

    //get list checkbox diplayed dropdown
    getListCheckboxDisplayedField() {
        this.getListCheckboxDisplayedFieldLoading = true;
        this._paymentPPServiceProxy.getCheckboxDisplayedFieldPayment()
            .finally(() => {
                setTimeout(() => {
                    $('.onReport').selectpicker('refresh');
                    this.getListCheckboxDisplayedFieldLoading = false;
                })
            }).subscribe(result => {
            this.listCheck = result;
            this.listCheck.forEach(item => {
                this.listCheckItems.push({
                    value: {
                        id: item.displayedID,
                        name: item.displayedName
                    },
                    label: item.displayedName
                });
            });
        });
    }

    onChangeDisplayFieldAll(event) {
        this.getListCheckboxDisplayedFieldLoading = true;
        if (event.length === 1) {
            this.listCheckItemsDisable = true;
            this.getListCheckboxDisplayedFieldLoading = false;
        } else if (event.length === 0) {
            this.getListCheckboxDisplayedFieldLoading = false;
            this.listCheckItemsDisable = false;
        }
    }

    onChangeDisplayField(event) {
        this.selectedDisplayField = [];
        this.selectedDisplayFieldText = [];
        this.selectedDisplayFieldTemp.forEach(item => {
            this.selectedDisplayField.push(item.id);
            this.selectedDisplayFieldText.push({
                headerID: item.id,
                header: item.name
            });
        })
    }


    getListReportPaymentLoading = false;

    getListReportPayment() {
        this.getListReportPaymentLoading = true;
        this.model.paymentDateFrom = this.paymentDateFrom;
        this.model.paymentDateTo = this.paymentDateTo;
        this.model.orderDateFrom = this.orderDateFrom;
        this.model.orderDateTo = this.orderDateTo;
        this.model.clearDateFrom = this.clearDateFrom;
        this.model.clearDateTo = this.clearDateTo;
        this.model.paymentType = this.selectedPaymentType;
        this.model.bankID = this.selectedPaymentBank;
        this.model.projectID = this.model.projectID;
        if(this.model.keyword === "" || this.model.keyword === undefined ){
            delete this.model.keyword;
        }
        this.model.orderStatusID = this.statusID;
        if (this.selectedPaymentType.length === 0 || this.selectedPaymentType.length === undefined) {
            delete this.model.paymentType;
        }
        if (this.selectedPaymentBank.length === 0 || this.selectedPaymentBank.length === undefined) {
            delete this.model.bankID;
        }
        if (this.statusID.length === 0 || this.statusID.length === undefined) {
            delete this.model.orderStatusID
        }
        this._paymentPPServiceProxy.getReportPayment(this.model).finally(() => {
            setTimeout(() => {
                this.getListReportPaymentLoading = false;
                if (this.modelSort.printOn == 1) {
                    this.setLocalStorage(this.model);
                    this.setSelectedDisplayField();
                    window.open('reportPaymentView', '_blank', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes')
                } else if (this.modelSort.printOn !== 1 && this.listCheckItemsDisable === false) {
                    this.setDisplay();
                } else if (this.listCheckItemsDisable === true && this.modelSort.printOn == 2) {
                    this.generatePDF();
                } else if (this.listCheckItemsDisable === true && this.modelSort.printOn == 3) {
                    this.generateExcel();
                }
            });
        }).subscribe(result => {
            this.listHeader = this.selectedDisplayFieldText;
            this.listBody = result;
            this.listBodyAll = result;
            this.setYear(this.selectedDisplayField);
            this.setMonth(this.selectedDisplayField);
            this.setPaymentStatus(this.selectedDisplayField);
            this.setPaymentDate(this.selectedDisplayField);
            this.setClearDate(this.selectedDisplayField);
            this.setBank(this.selectedDisplayField);
            this.setPaymentType(this.selectedDisplayField);
            this.setOrderNo(this.selectedDisplayField);
            this.setPPNo(this.selectedDisplayField);
            this.setAccountNo(this.selectedDisplayField);
            this.setAccountName(this.selectedDisplayField);
            this.setBankBranch(this.selectedDisplayField);
            this.setAmount(this.selectedDisplayField);
        });

    }

    setLocalStorage(model) {
        localStorage.setItem('reportPayment', JSON.stringify(model));
    }

    setSelectedDisplayField() {
        this.selectedDisplayFieldAll = [];
        if (this.listCheckItemsDisable === true) {
            this.listCheck.forEach(items => {
                this.selectedDisplayFieldAll.push(items.displayedID);
            });
            localStorage.setItem('reportPaymentSort', JSON.stringify(this.selectedDisplayFieldAll));
        } else if (this.listCheckItemsDisable === false) {
            localStorage.setItem('reportPaymentSort', JSON.stringify(this.selectedDisplayField));
        }
    }


    generatePDF() {
        this.modelGeneratePDF.listData.listBody = [];
        if (this.listCheckItemsDisable === true) {
            this.modelGeneratePDF.listData.listBody = this.listBodyAll;
            this.selectedDisplayFieldTextAll = [];
            this.listCheck.forEach(items => {
                this.selectedDisplayFieldTextAll.push({
                    headerID: items.displayedID,
                    header: items.displayedName
                });
                this.modelGeneratePDF.listData.listHeader = this.selectedDisplayFieldTextAll;
            });
        } else if (this.listCheckItemsDisable === false) {
            this.modelGeneratePDF.listData.listHeader = this.selectedDisplayFieldText;
            this.modelGeneratePDF.listData.listBody = this.listBody;
        }

        this.modelGeneratePDF.paperSizeID = parseInt(this.modelSort.paperSize);
        this.modelGeneratePDF.orientationID = parseInt(this.modelSort.paperOrientation);
        this._paymentPPServiceProxy.generateReportPaymentPdf(this.modelGeneratePDF)
            .finally(() => {

            }).subscribe(result => {
            this.generatePdfUrl = result;
            window.open(this.generatePdfUrl.message, '_blank', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes');
        })
    }

    generateExcel() {
        this.modelGeneratePDF.listData.listBody = [];
        if (this.listCheckItemsDisable === true) {
            this.modelGeneratePDF.listData.listBody = this.listBodyAll;
            this.selectedDisplayFieldTextAll = [];
            this.listCheck.forEach(items => {
                this.selectedDisplayFieldTextAll.push({
                    headerID: items.displayedID,
                    header: items.displayedName
                });
                this.modelGeneratePDF.listData.listHeader = this.selectedDisplayFieldTextAll;
            });
        } else if (this.listCheckItemsDisable === false) {
            this.modelGeneratePDF.listData.listHeader = this.selectedDisplayFieldText;
            this.modelGeneratePDF.listData.listBody = this.listBody;
        }

        this.modelGeneratePDF.paperSizeID = parseInt(this.modelSort.paperSize);
        this.modelGeneratePDF.orientationID = parseInt(this.modelSort.paperOrientation);
        // this.modelGeneratePDF.listData.listBody = this.listBody;
        // this.modelGeneratePDF.listData.listHeader = this.selectedDisplayFieldText;
        this._paymentPPServiceProxy.generateExcelReportOrder(this.modelGeneratePDF)
            .finally(() => {
            }).subscribe(result => {
            this.generateExcelUrl = this._fileDownloadService.downloadTempFile(result);
        })
    }


    setYear(sort) {
        return sort === 1;
    }

    setMonth(sort) {
        return sort === 2;
    }

    setPaymentStatus(sort) {
        return sort === 3;
    }

    setPaymentDate(sort) {
        return sort === 4;
    }

    setClearDate(sort) {
        return sort === 5;
    }

    setBank(sort) {
        return sort === 6;
    }

    setPaymentType(sort) {
        return sort === 7;
    }

    setOrderNo(sort) {
        return sort === 8;
    }

    setPPNo(sort) {
        return sort === 9;
    }

    setAccountNo(sort) {
        return sort === 10;
    }

    setAccountName(sort) {
        return sort === 11;
    }

    setBankBranch(sort) {
        return sort === 12;
    }

    setAmount(sort) {
        return sort === 13;
    }

    setDisplay() {

        if (this.selectedDisplayField.find(this.setYear) !== 1) {
            for (var key in this.listBody) {
                delete this.listBody[key]['year'];
            }
        }
        if (this.selectedDisplayField.find(this.setMonth) !== 2) {
            for (var key in this.listBody) {
                delete this.listBody[key]['yearMonth'];
            }
        }
        if (this.selectedDisplayField.find(this.setPaymentStatus) !== 3) {
            for (var key in this.listBody) {
                delete this.listBody[key]['paymentStatus'];
            }
        }
        if (this.selectedDisplayField.find(this.setPaymentDate) !== 4) {
            for (var key in this.listBody) {
                delete this.listBody[key]['paymentDate'];
            }
        }
        if (this.selectedDisplayField.find(this.setClearDate) !== 5) {
            for (var key in this.listBody) {
                delete this.listBody[key]['clearDate'];

            }
        }
        if (this.selectedDisplayField.find(this.setBank) !== 6) {
            for (var key in this.listBody) {
                delete this.listBody[key]['bankName'];
            }
        }
        if (this.selectedDisplayField.find(this.setPaymentType) !== 7) {
            for (var key in this.listBody) {
                delete this.listBody[key]['paymentTypeName'];
            }
        }
        if (this.selectedDisplayField.find(this.setOrderNo) !== 8) {
            for (var key in this.listBody) {
                delete this.listBody[key]['orderCode'];
            }
        }
        if (this.selectedDisplayField.find(this.setPPNo) !== 9) {
            for (var key in this.listBody) {
                delete this.listBody[key]['ppNo'];
            }
        }
        if (this.selectedDisplayField.find(this.setAccountNo) !== 10) {
            for (var key in this.listBody) {
                delete this.listBody[key]['accNo'];
            }
        }
        if (this.selectedDisplayField.find(this.setAccountName) !== 11) {
            for (var key in this.listBody) {
                delete this.listBody[key]['accName'];
            }
        }
        if (this.selectedDisplayField.find(this.setBankBranch) !== 12) {
            for (var key in this.listBody) {
                delete this.listBody[key]['bankBranch'];
            }
        }
        if (this.selectedDisplayField.find(this.setAmount) !== 13) {
            for (var key in this.listBody) {
                delete this.listBody[key]['amount'];
            }
        }

        if (this.modelSort.printOn == 2) {
            this.generatePDF();
        } else if (this.modelSort.printOn == 3) {
            this.generateExcel();
        }

    }

}
