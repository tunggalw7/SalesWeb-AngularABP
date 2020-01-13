import {
    AfterViewInit, Component, ElementRef, Injectable, Injector, OnInit, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {AppComponentBase} from "@shared/common/app-component-base";
import {
    GetCheckBoxDisplayedFieldResultDto,
    GetListReportOrderInputDto,
    OrderPPServiceProxy,
    PaymentPPServiceProxy
} from "@shared/service-proxies/service-proxies";
import {SelectItem} from "primeng/primeng";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "@app/pponline/share/validation.service";
import {FileDownloadService} from "@shared/utils/file-download.service";
import * as moment from "@node_modules/moment";
import {AppSessionService} from "@shared/common/session/app-session.service";


@Component({
    selector: 'app-report-order',
    templateUrl: './report-order.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./report-order.component.css']
})

export class ReportOrderComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @ViewChild('project') nameInput: ElementRef;

    checked: boolean = true;
    listCheckItemsDisable: boolean = true;
    listCheck: GetCheckBoxDisplayedFieldResultDto[] = [];
    listCheckItemsAll: SelectItem[] = [];
    listCheckItems: SelectItem[] = [];
    selectedDisplayField: any[] = [];
    selectedDisplayFieldAll: any[] = [];
    selectedDisplayFieldTextAll: any[] = [];
    selectedDisplayFieldText: any[] = [];
    selectedDisplayFieldTempAll: string[] = ['All'];
    selectedDisplayFieldTemp: any[] = [];




    listProject: any = [];

    listTern: any = [];
    listTermPayment: SelectItem[] = [];
    selectedTermPaymentText: any[] = [];
    selectedTermPaymentTemp: any[] = [];
    selectedTermPayment: any[] = [];
    orderStatus: any = [];
    listCheckPreferredTypeDisable: boolean = true;

    listPreferredType: any [] = [];
    listPreferredTypeItemsAll: SelectItem[] = [];
    listPreferredTypeItems: SelectItem[] = [];
    selectedPreferredTypeAll: string[] = ['All'];
    selectedPreferredTypeItemsAll: any[] = [];
    selectedPreferredType: any[] = [];
    selectedPreferredTypeText: any[] = [];
    selectedPreferredTypeTemp: any[] = [];

    orderDateFrom: any;
    orderDateTo: any;
    validationForm: FormGroup;
    localStorage: any = [];
    model: GetListReportOrderInputDto;
    modelSort: any = [];
    prefferedProjectID: any = [];
    modelOrderDateTo: any;
    modelOrderDateFrom: any;
    changePrint: any;
    modelGeneratePDF: any = [];
    listBodyAll: any[] = [];
    listBody: any[] = [];
    listHeader: any = [];
    generatePdfUrl: any;
    generateExcelUrl: any;
    orderStatusValue: any[] = [];
    userID: any;

    constructor(injector: Injector,
                private _fb: FormBuilder,
                private _appSessionService: AppSessionService,
                private _orderPPServiceProxy: OrderPPServiceProxy,
                private _paymentPPServiceProxy: PaymentPPServiceProxy,
                private _fileDownloadService: FileDownloadService) {
        super(injector);
        this.validationForm = _fb.group({
            'printOn': [null, Validators.compose([Validators.required])],
            'project': [null, Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
        this.userID = this._appSessionService.userId;
        this.model = new GetListReportOrderInputDto;
        this.listCheckItemsAll = [
            {label: 'All', value: 'All'}
        ];

        this.listPreferredTypeItemsAll = [
            {label: 'All', value: 'All'}
        ]

        this.modelGeneratePDF = {
            "paperSizeID": 0,
            "orientationID": 0,
            "listData": {
                "listHeader": [
                    {
                        "headerID": "string",
                        "header": "string"
                    }
                ],
                "listBody": [
                    {
                        "year": "string",
                        "yearMonth": "string",
                        "orderCode": "string",
                        "orderDate": "string",
                        "orderStatus": "string",
                        "projectName": "string",
                        "customerName": "string",
                        "preferredTypeName": "string",
                        "termPayment": "string",
                        "qty": 0,
                        "price": 0,
                        "totalPrice": 0
                    }
                ]
            }
        };
        this.model.orderStatusID = [];
        this.model.termID = [];
        this.model.preferredTypeName = [];
        this.modelSort = {
            printOn: '1',
            paperSize: '1',
            paperOrientation: '1',
        };


        this.getListCheckboxDisplayedField();
        this.getListProject();
        this.getListDropdownTerm();
        this.getListOrderStatus();
    }

    ngAfterViewInit() {

    }

    orderStatusLoading = false;

    //get list order Status checkbox
    getListOrderStatus() {
        this.orderStatusLoading = true;
        this._paymentPPServiceProxy.getListOrderStatus().finally(() => {
            setTimeout(() => {
                this.orderStatusLoading = false;
            })
        }).subscribe(result => {
            this.orderStatus = result;
        })
    }


    getListprojectLoading = false;

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

    onChangeProject(projectID) {
        this.prefferedProjectID = projectID;
        if (this.prefferedProjectID != undefined) {
            this.getListPreferredType(this.prefferedProjectID);
        }
    }

    getListCheckboxDisplayedFieldLoading = false;

    //get list checkbox diplayed dropdown
    getListCheckboxDisplayedField() {
        this.getListCheckboxDisplayedFieldLoading = true;
        this._orderPPServiceProxy.getCheckboxDisplayedField().finally(() => {
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


    getListDropdownTermLoading = false;

    getListDropdownTerm() {
        this.getListDropdownTermLoading = true;
        this._orderPPServiceProxy.getDropdownTerm().finally(() => {
            setTimeout(() => {
                $('.ternPayment').selectpicker('refresh');
                this.getListDropdownTermLoading = false
            })
        }).subscribe(result => {
            this.listTern = result;
            this.listTern.forEach(item => {
                this.listTermPayment.push({
                    value: {
                        id: item.termID,
                        name: item.termName
                    },
                    label: item.termName
                });
            });
            this.listTern.map((items) => this.selectedTermPaymentTemp.push(
                {
                    id: items.termID,
                    name: items.termName
                }));
            this.onChangeTermPayment(this.selectedTermPaymentTemp);
        });

    }

    onChangeTermPayment(event) {
        this.selectedTermPayment = [];
        this.selectedTermPaymentText = [];
        this.selectedTermPaymentTemp.forEach(item => {
            this.selectedTermPayment.push(item.id);
            this.selectedTermPaymentText.push(item.name);
        });

    }


    getListPreferredTypeLoading = false;

    getListPreferredType(projectID: number): void {
        this.getListPreferredTypeLoading = true;
        this._orderPPServiceProxy.getPreferredUnitType(projectID).finally(() => {
            setTimeout(() => {
                $('.prefferedType').selectpicker('refresh');
                this.getListPreferredTypeLoading = false;
            })
        }).subscribe(result => {
            this.listPreferredType = result;
            this.listPreferredTypeItems = [];
            result.forEach(item => {
                this.listPreferredTypeItems.push({
                    value: {
                        id: item.preferredTypeName,
                        name: item.preferredTypeName
                    },
                    label: item.preferredTypeName
                });
            });
        }, err => {
            // this.notify.info("Preffered Type Not Found")
        })
    }

    onChangePreferredTypeAll(event) {
        this.getListPreferredTypeLoading = true;
        if (event.length === 1) {
            this.listCheckPreferredTypeDisable = true;
            this.getListPreferredTypeLoading = false;
        } else if (event.length === 0) {
            this.listCheckPreferredTypeDisable = false;
            this.getListPreferredTypeLoading = false;
        }

    }

    onChangePreferredType(event) {
        this.selectedPreferredType = [];
        this.selectedPreferredTypeText = [];
        this.selectedPreferredTypeTemp.forEach(item => {
            this.selectedPreferredType.push(item.id);
            this.selectedPreferredTypeText.push({
                headerID: item.preferredTypeName,
                header: item.preferredTypeName
            });
        })
    }

    invalidDateStart = false;
    onSelectedDateFrom(date) {
        let dateInput = date.format('YYYY/MM/DD');
        this.orderDateFrom = dateInput;

        if (new Date(dateInput.toString()) > new Date()) {
            this.invalidDateStart = true;}
        else {
            this.invalidDateStart = false;
            // this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
        }
    }




    invalidDateEnd = false;
    onSelectedDateTo(date) {
        let dateInput = date.format('YYYY/MM/DD');
        this.orderDateTo = dateInput;


        if (new Date(dateInput.toString()) > new Date()) {
            this.invalidDateEnd = true;}
        else {
            this.invalidDateEnd = false;
            // this.finalBirthDate = moment(birthdate).format('YYYY-MM-DD');
        }

    }


    getListReportOrderLoading = false;

    getListReportOrder() {
        this.selectedPreferredTypeItemsAll = [];
        if (this.listCheckPreferredTypeDisable === true) {
            this.listPreferredType.forEach(items => {
                this.selectedPreferredTypeItemsAll.push(items.preferredTypeName)
            });
            this.model.preferredTypeName = this.selectedPreferredTypeItemsAll;
        } else if (this.listCheckPreferredTypeDisable === false) {
            this.model.preferredTypeName = this.selectedPreferredType;
        }
        this.model.orderStatusID = this.orderStatusValue;
        this.model.orderDateFrom = this.orderDateFrom;
        this.model.orderDateTo = this.orderDateTo;
        this.model.termID = this.selectedTermPayment;
        this.model.userID = this.userID;
        this.getListReportOrderLoading = true;
        this._orderPPServiceProxy.getListReportOrder(this.model)
            .finally(() => {
                setTimeout(() => {
                    this.getListReportOrderLoading = false;
                    if (this.modelSort.printOn == 1) {
                        this.setLocalStorage(this.model);
                        this.setSelectedDisplayField();
                        window.open('reportOrderView', '_blank', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes')
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
            this.setYear(this.selectedDisplayField);
            this.setMonth(this.selectedDisplayField);
            this.setOrderCode(this.selectedDisplayField);
            this.setOrderDate(this.selectedDisplayField);
            this.setOrderStatus(this.selectedDisplayField);
            this.setProject(this.selectedDisplayField);
            this.setCustomer(this.selectedDisplayField);
            this.setPrefferedUnit(this.selectedDisplayField);
            this.setTermPayment(this.selectedDisplayField);
            this.setQty(this.selectedDisplayField);
            this.setPrice(this.selectedDisplayField);
            this.setTotalPrice(this.selectedDisplayField);
            this.listBody = result;
            this.listBodyAll = result;
        });
    }


    setLocalStorage(model) {
        localStorage.setItem('reportOrder', JSON.stringify(model));
    }


    setSelectedDisplayField() {
        this.selectedDisplayFieldAll = [];
        if (this.listCheckItemsDisable === true) {
            this.listCheck.forEach(items => {
                this.selectedDisplayFieldAll.push(items.displayedID);
            });
            localStorage.setItem('reportOrderSort', JSON.stringify(this.selectedDisplayFieldAll));
        } else if (this.listCheckItemsDisable === false) {
            localStorage.setItem('reportOrderSort', JSON.stringify(this.selectedDisplayField));
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
        this._orderPPServiceProxy.generateReportPdf(this.modelGeneratePDF)
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
        this._orderPPServiceProxy.generateExcelReportOrder(this.modelGeneratePDF)
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

    setOrderCode(sort) {
        return sort === 3;
    }

    setOrderDate(sort) {
        return sort === 4;
    }

    setOrderStatus(sort) {
        return sort === 5;
    }

    setProject(sort) {
        return sort === 6;
    }

    setCustomer(sort) {
        return sort === 7;
    }


    setPrefferedUnit(sort) {
        return sort === 8;
    }

    setTermPayment(sort) {
        return sort === 9;
    }

    setQty(sort) {
        return sort === 10;
    }

    setPrice(sort) {
        return sort === 11;
    }

    setTotalPrice(sort) {
        return sort === 12;
    }


    listBodySort() {
        if (this.selectedDisplayField.find(this.setYear) !== 1) {
            for (var key in this.listBody) {
                delete this.listBody[key]['year'];
            }
        }

        if (this.selectedDisplayField.find(this.setMonth) !== 2) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['yearMonth'];
            }
        }

        if (this.selectedDisplayField.find(this.setOrderCode) !== 3) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['orderCode'];
            }
        }

        if (this.selectedDisplayField.find(this.setOrderDate) !== 4) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['orderDate'];
            }
        }

        if (this.selectedDisplayField.find(this.setOrderStatus) !== 5) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['orderStatus'];
            }
        }

        if (this.selectedDisplayField.find(this.setProject) !== 6) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['projectName'];
            }
        }

        if (this.selectedDisplayField.find(this.setCustomer) !== 7) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['customerName'];
            }
        }

        if (this.selectedDisplayField.find(this.setPrefferedUnit) !== 8) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['preferredTypeName'];
            }
        }

        if (this.selectedDisplayField.find(this.setTermPayment) !== 9) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['termPayment'];
            }
        }

        if (this.selectedDisplayField.find(this.setQty) !== 10) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['qty'];
            }
        }

        if (this.selectedDisplayField.find(this.setPrice) !== 11) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['price'];
            }
        }

        if (this.selectedDisplayField.find(this.setTotalPrice) !== 12) {
            for (var key in this.listBody) {
                delete this.listBody[key] ['totalPrice'];
            }
        }

        if (this.modelSort.printOn == 2) {
            this.generatePDF();
        } else if (this.modelSort.printOn == 3) {
            this.generateExcel();
        }

    }

}
