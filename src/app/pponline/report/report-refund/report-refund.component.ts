import {AfterViewInit, Component, Injector, OnInit, ViewEncapsulation} from '@angular/core';
import {AppComponentBase} from "@shared/common/app-component-base";
import {
    GetCheckBoxDisplayedFieldResultDto, RefundPPServiceProxy,
    ReportRefundResultDto
} from "@shared/service-proxies/service-proxies";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectItem} from "primeng/primeng";
import {FileDownloadService} from "@shared/utils/file-download.service";
import {AppSessionService} from "@shared/common/session/app-session.service";

@Component({
    selector: 'app-report-refund',
    templateUrl: './report-refund.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./report-refund.component.css']
})
export class ReportRefundComponent extends AppComponentBase implements OnInit, AfterViewInit {
    refundDateFrom: any;
    refundDateTo: any;
    modelRefundDateTo: any;
    modelRefundDateFrom: any;
    model: any;
    validationForm: FormGroup;
    listCheckItemsAll: SelectItem[] = [];
    listCheckItems: SelectItem[] = [];
    selectedDisplayField: any[] = [];
    selectedDisplayFieldAll: any[] = [];
    selectedDisplayFieldTextAll: any[] = [];
    selectedDisplayFieldText: any[] = [];
    selectedDisplayFieldTempAll: string[] = ['All'];
    selectedDisplayFieldTemp: any[] = [];
    listCheck: GetCheckBoxDisplayedFieldResultDto[] = [];
    listCheckItemsDisable: boolean = true;
    modelSort: any = [];
    listBodyAll: any[] = [];
    listBody: any[] = [];
    listHeader: any = [];
    changePrint: any;
    modelGeneratePDF: any = [];
    generatePdfUrl: any;
    generateExcelUrl: any;
    userID: any;

    constructor(injector: Injector,
                private _fb: FormBuilder,
                private _appSessionService: AppSessionService,
                private _refundPPServiceProxy: RefundPPServiceProxy,
                private _fileDownloadService: FileDownloadService) {
        super(injector);
        this.validationForm = _fb.group({
            'printOn': [null, [Validators.required]],
        });
    }

    ngOnInit() {
        this.userID = this._appSessionService.userId;
        this.model = {
            refundDateFrom: undefined,
            refundDateEnd: undefined,
            schema: undefined,
            customerName: undefined
        };

        this.listCheckItemsAll = [
            {label: 'All', value: 'All'}
        ];

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
                        "refundDate": "2018-08-20T10:24:24.126Z",
                        "ppNo": "string",
                        "schema": "string",
                        "customerCode": "string",
                        "customerName": "string",
                        "dealCloserCode": "string",
                        "dealCloserName": "string",
                        "ppPrice": 0,
                        "bankName": "string",
                        "accountNo": "string",
                        "accountName": "string",
                        "reason": "string"
                    }
                ],
                "headerHtml": "string",
                "bodyHtml": "string"
            }
        };
        this.modelSort = {
            printOn: '1',
            paperSize: '1',
            paperOrientation: '1',
        };

        this.setDateToDay();
        this.getListCheckboxDisplayedField();
    }

    ngAfterViewInit() {
    }

    setDateToDay() {
        setTimeout(() => {
            $(".paymentDateTo").datepicker("setDate", new Date());
            this.refresh();
        }, 500);
    }

    onSelectedDateFrom(date) {
        let dateInput = date.format('YYYY-MM-DD');
        this.refundDateFrom = dateInput;
    }

    onSelectedDateTo(date) {
        let dateInput = date.format('YYYY-MM-DD');
        this.refundDateTo = dateInput;
    }


    getListCheckboxDisplayedFieldLoading = false;

    //get list checkbox diplayed
    getListCheckboxDisplayedField() {
        this.getListCheckboxDisplayedFieldLoading = true;
        this._refundPPServiceProxy.getCheckboxDisplayedFieldRefund().finally(() => {
            setTimeout(() => {
                $('.displayField').selectpicker('refresh');
                this.getListCheckboxDisplayedFieldLoading = false;
            })
        }).subscribe(result => {
            this.listCheck = result;
            result.forEach(item => {
                this.listCheckItems.push({
                    value: {
                        id: item.displayedID,
                        name: item.displayedName
                    },
                    label: item.displayedName
                });
            });
        })
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

    onChangePrintOn(value) {
        this.changePrint = value;
        setTimeout(() => {
            this.refresh();
        }, 200)
    }

    refresh() {
        $('.print').selectpicker('refresh');
        $('.paperOrientation').selectpicker('refresh');
        $('.paperSize').selectpicker('refresh');
    }

    getListReportRefundLoading = false;

    getListReportRefund() {
        this.model.refundDateFrom = this.refundDateFrom;
        this.model.refundDateEnd = this.refundDateTo;
        if (this.model.refundDateFrom == undefined) {
            delete this.model.refundDateFrom;
        }

        if (this.model.refundDateEnd == undefined) {
            delete this.model.refundDateEnd;
        }

        if (this.model.schema == undefined) {
            delete this.model.schema;
        }

        if (this.model.customerName == undefined) {
            delete this.model.customerName;
        }
        this.getListReportRefundLoading = true;
        this._refundPPServiceProxy.getReportRefund(this.model.refundDateFrom, this.model.refundDateEnd, this.model.schema, this.model.customerName, this.userID)
            .finally(() => {
                setTimeout(() => {
                    this.getListReportRefundLoading = false;
                    if (this.modelSort.printOn == 1) {
                        this.setLocalStorage(this.model);
                        this.setSelectedDisplayField();
                        window.open('reportRefundView', '_blank', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes')
                    } else if (this.modelSort.printOn !== 1 && this.listCheckItemsDisable === false) {
                        this.listBodySort();
                    } else if (this.listCheckItemsDisable === true && this.modelSort.printOn == 2) {
                        this.generatePDF();
                    } else if (this.listCheckItemsDisable === true && this.modelSort.printOn == 3) {
                        this.generateExcel();
                    }
                }, 500)
            }).subscribe(result => {
            this.listHeader = this.selectedDisplayFieldText;
            this.setPpNO(this.selectedDisplayField);
            this.setSchema(this.selectedDisplayField);
            this.setCustomerCode(this.selectedDisplayField);
            this.setCustomerName(this.selectedDisplayField);
            this.setDealCloserCode(this.selectedDisplayField);
            this.setDealCloserName(this.selectedDisplayField);
            this.setPpPrice(this.selectedDisplayField);
            this.setBankName(this.selectedDisplayField);
            this.setAccountNo(this.selectedDisplayField);
            this.setAccountName(this.selectedDisplayField);
            this.setReason(this.selectedDisplayField);
            this.setRefundDate(this.selectedDisplayField);
            this.listBody = result;
            this.listBodyAll = result;
        });
    }

    setLocalStorage(model) {
        localStorage.setItem('reportRefund', JSON.stringify(model));
    }

    setSelectedDisplayField() {
        this.selectedDisplayFieldAll = [];
        if (this.listCheckItemsDisable === true) {
            this.listCheck.forEach(items => {
                this.selectedDisplayFieldAll.push(items.displayedID);
            });
            localStorage.setItem('reportRefundSort', JSON.stringify(this.selectedDisplayFieldAll));
        } else if (this.listCheckItemsDisable === false) {
            localStorage.setItem('reportRefundSort', JSON.stringify(this.selectedDisplayField));
        }
    }


    setPpNO(sort) {
        return sort === 1;
    }

    setSchema(sort) {
        return sort === 2;
    }

    setCustomerCode(sort) {

        return sort === 3;
    }

    setCustomerName(sort) {
        return sort === 4;
    }

    setDealCloserCode(sort) {
        return sort === 5;
    }

    setDealCloserName(sort) {
        return sort === 6;
    }

    setPpPrice(sort) {
        return sort === 7;
    }

    setBankName(sort) {
        return sort === 8;
    }

    setAccountNo(sort) {
        return sort === 9;
    }

    setAccountName(sort) {
        return sort === 10;
    }

    setReason(sort) {
        return sort === 11;
    }

    setRefundDate(sort) {
        return sort === 12;
    }

    listBodySort() {
        if (this.selectedDisplayField.find(this.setPpNO) !== 1) {
            for (var key in this.listBody) {
                delete this.listBody[key]['ppNo'];
            }
        }

        if (this.selectedDisplayField.find(this.setSchema) !== 2) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['schema'];
            }
        }

        if (this.selectedDisplayField.find(this.setCustomerCode) !== 3) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['customerCode'];
            }
        }

        if (this.selectedDisplayField.find(this.setCustomerName) !== 4) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['customerName'];
            }
        }

        if (this.selectedDisplayField.find(this.setDealCloserCode) !== 5) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['dealCloserCode'];
            }
        }

        if (this.selectedDisplayField.find(this.setDealCloserName) !== 6) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['dealCloserName'];
            }
        }

        if (this.selectedDisplayField.find(this.setPpPrice) !== 7) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['ppPrice'];
            }
        }

        if (this.selectedDisplayField.find(this.setBankName) !== 8) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['bankName'];
            }
        }

        if (this.selectedDisplayField.find(this.setAccountNo) !== 9) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['accountNo'];
            }
        }

        if (this.selectedDisplayField.find(this.setAccountName) !== 10) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['accountName'];
            }
        }

        if (this.selectedDisplayField.find(this.setReason) !== 11) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['reason'];
            }
        }

        if (this.selectedDisplayField.find(this.setRefundDate) !== 12) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['refundDate'];
            }
        }

        if (this.modelSort.printOn == 2) {
            this.generatePDF();
        } else if (this.modelSort.printOn == 3) {
            this.generateExcel();
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

        this._refundPPServiceProxy.generateReportRefundPdf(this.modelGeneratePDF)
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
        this._refundPPServiceProxy.generateExcelReportRefund(this.modelGeneratePDF)
            .finally(() => {
            }).subscribe(result => {
            this.generateExcelUrl = this._fileDownloadService.downloadTempFile(result);
        })
    }
}
