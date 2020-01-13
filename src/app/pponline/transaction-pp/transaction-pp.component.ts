import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    TransactionPPServiceProxy,
    OrderPPServiceProxy,
    TrBuyPPOnlineInputDto
} from "@shared/service-proxies/service-proxies";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/primeng";
import { ActivatedRoute, Router } from "@angular/router";
import { AppSessionService } from "@shared/common/session/app-session.service";
import { ValidationService } from "@app/main/share/validation.service";

@Component({
    selector: 'app-transaction-pp',
    templateUrl: './transaction-pp.component.html',
    styleUrls: ['./transaction-pp.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TransactionPpComponent extends AppComponentBase implements OnInit {
    model: any = [];
    dropDownProject: any = [];
    dropDownProduct: any = [];
    dropDownPreferredType: any = [];
    dropDownPreferredTerm: any = [];
    dropDownPreferredBank: any = [];
    changeProjectCode: any;
    changeProjectName: any;
    changeProjectLogo: any;
    modelDropDownProject: any = {};
    modelDropDownProduct: any = null;
    modelDropDownPreferredType: any = [];
    modelDropDownPreferredTerm: any = null;
    modelPriorityPp: any;
    modelPriorityQuantity: any;
    totalPricePp: any;
    termID: any;
    termName: any;
    userID: any;
    ProductID: any;
    PreferredType: any;

    validationForm: FormGroup;
    bankList: SelectItem[] = [];
    selectedBankText: any[] = [];
    selectedBankTemp: any[] = [];
    selectedBank: any[] = [];
    customerCode: any;
    customerName: any;
    ppOrderID: any;
    projectCode: any;
    productCode: any;
    birthdate: any;
    identity: any;
    projectDetailOrder: boolean = false;
    customerListdetail: boolean = false;
    quicActionDetail: boolean = false;
    getDetailOrder: boolean = false;
    detailTransaction: any = [];
    banlListHiden: boolean = true;
    selectedBankDetail: any[] = [];
    customerPotential;
    modelTrBuy: TrBuyPPOnlineInputDto;
    orderCode: any;
    custID;
    memberCode: any;


    constructor(injector: Injector,
        private _fb: FormBuilder,
        private _router: Router,
        private _activeroute: ActivatedRoute,
        private _appSessionService: AppSessionService,
        private _transactionPPServiceProxy: TransactionPPServiceProxy,
        private _orderPPServiceProxy: OrderPPServiceProxy, ) {
        super(injector);
        this.validationForm = this._fb.group({
            'project': [null, Validators.required],
            'product': [null, Validators.required],
            'preferredunit': [null, Validators.required],
            'preferredterm': [null, Validators.required],
            'preferredbank': [null,],
            'priorityQuantity': [null, Validators.compose([Validators.required, Validators.min(1)])],

        });
    }


    ngOnInit() {
        localStorage.removeItem('orderID');
        this.modelTrBuy = new TrBuyPPOnlineInputDto;
        this._activeroute.queryParams.subscribe(params => {
            if (params.customerPotential != undefined) {
                this.customerPotential = 'true';
                this.custID = params.custID;
            } else {
                this.customerPotential = 'false';
            }
            this.customerCode = params.customerCode;
            this.customerName = params.customerName;
            this.ppOrderID = params.ppOrderID;
            this.projectCode = params.projectCode;
            this.productCode = params.productCode;
        });

        if (this.ppOrderID == undefined) {
            this.getDropdownProjectPp();
            this.getDropdownTerm();
            this.getDetailOrder = false;
        } else if (this.ppOrderID !== undefined) {
            this.getDetailTransaction(this.ppOrderID);
            this.getDetailOrder = true;
        }

        if (this.customerCode == undefined && this.customerName == undefined) {
            this.customerListdetail = false;
        } else if (this.customerCode !== undefined && this.customerName !== undefined) {
            this.customerListdetail = true;
        }

        if (this.customerCode == undefined && this.customerName == undefined && this.ppOrderID == undefined && this.projectCode == undefined && this.productCode == undefined) {
            this.quicActionDetail = true;
        }

        if (this.projectCode == undefined && this.productCode == undefined) {
            this.projectDetailOrder = false;
        } else if (this.projectCode !== undefined && this.productCode !== undefined) {
            this.projectDetailOrder = true;
            this.modelDropDownProject.projectCode = this.projectCode;
            this.detailTransaction.productCode = this.productCode;
        } else {

        }

        this.userID = this._appSessionService.userId;
        this.memberCode = this._appSessionService.user.userName;
        this.model = {
            "projectProductID": "string",
            "projectName": "string",
            "projectCode": "string",
            "projectLogo": "string",
            "productName": "string",
            "productCode": "string",
            "termRefID": 0,
            "termRefName": "string",
            "preferredTypeID": 0,
            "preferredTypeName": "string",
            "ppQuantity": 0,
            "totalPrice": 0,
            "bankID1": 0,
            "bankName1": "string",
            "bankID2": 0,
            "bankName2": "string",
            "paymentTypeID": 0,
            "psCodeCust": "string",
            "userID": 0,
        };
    }

    getDetailTransaction(ppOrderID) {
        this._orderPPServiceProxy.getDetailOrder(ppOrderID)
            .finally(() => {
                this.setDetailTransaction();
            }).subscribe(result => {
                this.detailTransaction = result;
            }
            )
    }

    setDetailTransaction() {
        this.modelDropDownProject = {
            projectCode: this.detailTransaction.projectCode
        };
        this.getDropdownProjectPp();
        this.getDropdownTerm();
    }

    getDropdownProjectPpLoading = false;

    getDropdownProjectPp() {
        this.getDropdownProjectPpLoading = true;
        this._transactionPPServiceProxy.getDropdownProjectPP(this._appSessionService.user.userName).finally(() => {
            setTimeout(() => {
                this.getDropdownProjectPpLoading = false;
                $('.project').selectpicker('refresh')
                this.setDropDownProject();
            })
        }).subscribe(result => {
            this.dropDownProject = result;
            console.log('Get Dropdown', this.dropDownProject);
            this.modelDropDownProject = this.dropDownProject[0];
        })
    }

    setDropDownProject() {
        if (this.getDetailOrder == false && this.projectDetailOrder == false) {

        } else if (this.getDetailOrder == true || this.projectDetailOrder == true) {
            for (let item of this.dropDownProject) {
                if (item.projectCode == this.modelDropDownProject.projectCode) {
                    this.modelDropDownProject = item;
                    break;
                }
            }
            setTimeout(() => {
                $('.project').selectpicker('refresh');
            }, 200)
        }
    }

    onChangeDropdownProject(project) {
        this.validationForm.controls['product'].reset();
        this.validationForm.controls['preferredunit'].reset();
        // this.changeProjectLogo = project.logo;
        if (Object.keys(project).length === 0 && project.constructor === Object) {
        } else if (Object.keys(project).length !== 0 && project.constructor !== Object) {
            this.changeProjectCode = project.projectCode;
            this.changeProjectName = project.projectName;
            this.getDropdownProductByProjectPP(this.changeProjectCode);
            this.modelDropDownPreferredType = null;
            setTimeout(() => {
                $('.preferredType').selectpicker('refresh');
                this.getPreferredTypeLoading = false;
                this.setPreferredType();
            })
            this.modelDropDownPreferredTerm = null;
            setTimeout(() => {
                this.getDropdownTermLoading = false;
                $('.preferredTerm').selectpicker('refresh');
                this.setDropDownTerm();
            })
            this.modelPriorityQuantity = null;
            if (this.modelDropDownPreferredTerm !== null || this.modelDropDownPreferredTerm !== undefined) {
                this.onChangeTermPayment();
            } else {
            }
            this.modelPriorityPp = null;
        }
    }


    getDropdownProductByProjectPPLoading = false;

    getDropdownProductByProjectPP(project) {
        this.getDropdownProductByProjectPPLoading = true;
        if (project) {
            this._transactionPPServiceProxy.getDropdownProductByProjectPP(project, this.memberCode)
                .finally(() => {
                    setTimeout(() => {
                        this.getDropdownProductByProjectPPLoading = false;
                        $('.product').selectpicker('refresh');
                        this.setDropdownProduct();
                    })
                }).subscribe(result => {
                    this.dropDownProduct = result;
                })
        }
    }


    setDropdownProduct() {
        if (this.ppOrderID !== undefined || this.productCode !== undefined) {
            for (let item of this.dropDownProduct) {
                if (item.productCode == this.detailTransaction.productCode) {
                    this.modelDropDownProduct = item;
                    break;
                }

            }
            setTimeout(() => {
                $('.product').selectpicker('refresh');
                $('.preferredType').selectpicker('refresh');
                $('.preferredTerm').selectpicker('refresh');
                $('.preferredBank').selectpicker('refresh');
                this.ProductID = this.modelDropDownProduct;
                if (this.ProductID !== null) {
                    this.getPriorityPrice(this.ProductID);
                    this.onChangeLogo(this.ProductID.projectProductID);
                }
            }, 200)

        }
    }

    onChangeProduct(product) {
        if (product == undefined || product == null) {

        } else if (product !== undefined || product !== null) {
            this.ProductID = product;
            setTimeout(() => {
                this.getPriorityPrice(this.ProductID);
                this.onChangeLogo(this.ProductID.projectProductID);
                this.getPreferredType(this.ProductID.projectProductID);
            }, 100)
        }
    }

    onChangeLogoLoading = false;

    onChangeLogo(productID) {
        this.onChangeLogoLoading = true;
        if (productID !== undefined) {
            this._transactionPPServiceProxy.getLogoProduct(this.ProductID.projectProductID)
                .finally(() => {
                    setTimeout(() => {
                        this.onChangeLogoLoading = false;
                    }, 300);
                }).subscribe(result => {
                    this.changeProjectLogo = result.logo;
                })
        } else if (productID == undefined) {
            this.onChangeLogoLoading = false;
        }

    }

    getPreferredTypeLoading = false;

    getPreferredType(project) {
        this.getPreferredTypeLoading = true;
        if (project !== undefined) {
            this._orderPPServiceProxy.getPreferredType(project).finally(() => {
                setTimeout(() => {
                    $('.preferredType').selectpicker('refresh');
                    this.getPreferredTypeLoading = false;
                    this.setPreferredType();
                })
            }).subscribe(result => {
                this.dropDownPreferredType = result;
            })
        } else if (project == undefined) {
            this.getPreferredTypeLoading = false;
        }

    }

    setPreferredType() {

        if (this.ppOrderID !== undefined) {
            for (let item of this.dropDownPreferredType) {
                if (item.preferredTypeName == this.detailTransaction.preferredUnitType) {
                    this.modelDropDownPreferredType = item;
                    break;
                }
            }
            setTimeout(() => {
                $('.preferredType').selectpicker('refresh');
            }, 200)
        } else if (this.ppOrderID == undefined) {

        }
    }

    onChangePreferredType(preferred) {
        if (preferred !== null) {
            this.PreferredType = preferred.prefferedTypeID;
            // this.getPriorityPrice();
        } else if (preferred == null) {

        }
    }

    getDropdownTermLoading = false;

    getDropdownTerm() {
        this.getDropdownTermLoading = true;
        this._orderPPServiceProxy.getDropdownTerm()
            .finally(() => {
                setTimeout(() => {
                    this.getDropdownTermLoading = false;
                    $('.preferredTerm').selectpicker('refresh');
                    this.setDropDownTerm();
                })
            }).subscribe(result => {
                this.dropDownPreferredTerm = result;
            })
    }

    setDropDownTerm() {
        if (this.ppOrderID !== undefined) {
            for (let item of this.dropDownPreferredTerm) {
                if (item.termID == this.detailTransaction.termID) {
                    this.modelDropDownPreferredTerm = item;
                    break;
                }
            }
            this.modelPriorityQuantity = this.detailTransaction.qty;

            setTimeout(() => {
                $('.preferredTerm').selectpicker('refresh');
                // this.onChangeTermPayment();
            }, 200)
        } else if (this.ppOrderID == undefined) {

        }
    }


    onChangeTermPayment() {
        if (this.modelDropDownPreferredTerm !== null) {
            this.termID = this.modelDropDownPreferredTerm.termID;
            this.termName = this.modelDropDownPreferredTerm.termName;
            this.bankList = [];
            this.selectedBankTemp = [];
            this.model.bankID1 = undefined;
            this.model.bankID2 = undefined;
            this.banlListHiden = false;
            this.bankListLoading = true;
            this.validationForm.controls['preferredbank'].reset();
            if (this.termName.indexOf('KPA') !== -1 || this.termName.indexOf('KPR') !== -1) {
                this.validationForm.controls['preferredbank'].setValidators(Validators.compose([Validators.maxLength(2), Validators.required]));
                this._transactionPPServiceProxy.getBankListKPAPP(this.changeProjectCode).finally(() => {
                    setTimeout(() => {
                        // this.validationForm.controls['preferredbank'].setValidators([null, Validators.required]);
                        this.bankListLoading = false;
                        $('.preferredBank').selectpicker('refresh');
                    })
                }).subscribe(result => {
                    this.dropDownPreferredBank = result;
                    this.dropDownPreferredBank.forEach(item => {
                        this.bankList.push({
                            value: {
                                id: item.bankId,
                                name: item.bankName
                            },
                            label: item.bankName
                        });
                    });
                    if (this.ppOrderID == undefined) {
                        this.selectedBankTemp = [];
                    } else if (this.ppOrderID !== undefined && this.modelDropDownPreferredTerm.termName == 'KPR/KPA') {
                        this.selectedBankTemp = [];
                        this.selectedBankDetail = this.detailTransaction.dataBank;
                        this.selectedBankDetail.forEach(items => {
                            this.selectedBankTemp.push({
                                id: items.bankId,
                                name: items.bankName
                            })
                        });
                    }
                    this.onChangeBank(this.selectedBankTemp);
                });
                this.banlListHiden = true;
            } else {
                this.detailTransaction.dataBank = [];
                this.selectedBankTemp = [];
                this.validationForm.controls['preferredbank'].setValidators(Validators.compose([null]));
                this.validationForm.controls['preferredbank'].setValue([null]);
                this.validationForm.controls['preferredbank'].reset();
                this.model.bankID1 = "";
                this.model.bankID2 = "";
                this.bankListLoading = false;
                this.banlListHiden = false;
            }
        }
    }

    bankListLoading = false;

    onChangeBank(event) {
        this.selectedBank = [];
        this.selectedBankText = [];
        this.selectedBankTemp.forEach(item => {
            this.selectedBank.push(item.id);
            this.selectedBankText.push(item.name);
            this.setBank(this.selectedBank);
        });
    }

    setBank(bank) {
        if (bank.length !== 0) {
            this.model.bankName1 = this.selectedBankText[0];
            this.model.bankName2 = this.selectedBankText[1];
            this.model.bankID1 = bank[0];
            this.model.bankID2 = bank[1];
        } else if (bank.length == 0) {

        }
    }

    getPriorityPriceLoading = false;

    getPriorityPrice(productID) {
        if (productID !== null) {
            this.getPriorityPriceLoading = true;
            this._transactionPPServiceProxy.getPPPrice(productID.projectProductID)
                .finally(() => {
                    setTimeout(() => {
                        this.getPriorityPriceLoading = false;
                        this.totalPrice();
                    })
                }).subscribe(result => {
                    this.modelPriorityPp = result;
                })
        } else if (this.ProductID == undefined || this.ProductID == null) {
            this.getPriorityPriceLoading = false;
        }
    }

    totalPriceLoading = false;

    totalPrice() {
        this.totalPriceLoading = true;
        if (this.modelPriorityPp !== undefined && this.modelPriorityQuantity !== undefined) {
            this.totalPricePp = this.modelPriorityPp * this.modelPriorityQuantity;
            setTimeout(() => {
                this.totalPriceLoading = false;
            }, 200)

        } else if (this.modelPriorityPp == undefined || this.modelPriorityQuantity == undefined) {
            this.totalPriceLoading = false;
        }
    }

    trBuyPPOnline() {
        this.model.projectProductID = this.modelDropDownProduct.projectProductID;
        this.model.projectName = this.changeProjectName;
        this.model.projectCode = this.changeProjectCode;
        this.model.projectLogo = this.changeProjectLogo;
        this.model.productName = this.modelDropDownProduct.productName;
        this.model.productCode = this.modelDropDownProduct.productCode;
        this.model.termRefID = this.termID;
        this.model.termRefName = this.termName;
        this.model.preferredTypeID = this.modelDropDownPreferredType.prefferedTypeID;
        // this.model.preferredTypeID = 2;
        this.model.preferredTypeName = this.modelDropDownPreferredType.preferredTypeName;
        // this.model.preferredTypeName = 'blabla';
        this.model.ppQuantity = this.modelPriorityQuantity;
        this.model.totalPrice = this.totalPricePp;
        this.model.psCodeCust = this.customerCode;
        this.model.userID = this.userID;
        if (this.customerPotential == 'true') {
            this.registerCustomer();
        } else {
            if (this.projectDetailOrder == true) {
                this.verifyCustomer();
            } else if (this.customerListdetail == true) {
                this.updateCustomer();
            } else if (this.quicActionDetail = true) {
                this.verifyCustomer();
            } else if (this.projectDetailOrder == false && this.customerListdetail == false) {
                this.transactionSummary();
            }
        }
    }

    searchCustomer() {
        this._router.navigate(['app/pponline/customer-list']);
    }

    transactionSummaryLoading = false;

    transactionSummary() {
        this.transactionSummaryLoading = true;
        setTimeout(() => {
            this.transactionSummaryLoading = false;
            this.getOrderNo(this.model.projectCode, this.model.productCode, 'transaksi');
            // this._router.navigate(['app/pponline/pponline/transaction-summary']);
        }, 200);
    }

    verifyCustomer() {
        this.transactionSummaryLoading = true;
        setTimeout(() => {
            this.transactionSummaryLoading = false;
            this.getOrderNo(this.model.projectCode, this.model.productCode, 'verify');
            // this._router.navigate(['app/main/booking-unit-verify', true]);
        }, 200);
    }

    updateCustomer() {
        this.transactionSummaryLoading = true;
        setTimeout(() => {
            this.transactionSummaryLoading = false;
            this.getOrderNo(this.model.projectCode, this.model.productCode, 'update');
            // this._router.navigate(['/app/main/updateCustomer/', this.customerCode, true]);
        }, 200);
    }

    registerCustomer() {
        this.transactionSummaryLoading = true;
        setTimeout(() => {
            this.transactionSummaryLoading = false;
            this.getOrderNo(this.model.projectCode, this.model.productCode, 'register');
            // this._router.navigate(['/app/main/registerCustomer/', this.custID, true]);
        }, 200);
    }

    getOrderNoLoading = false;

    getOrderNo(projectCode, productCode, action) {
        this.getOrderNoLoading = true;
        this._transactionPPServiceProxy.generateOrderCodePP(projectCode, productCode).finally(() => {
            setTimeout(() => {
                this.getOrderNoLoading = false;
                this.setLocalstorage(action);
            })
        }).subscribe(result => {
            this.orderCode = result.message;
        })
    }

    isMember: boolean = false;
    ppLoading = false;

    setLocalstorage(action) {
        this.ppLoading = true;
        this.modelTrBuy.projectProductID = this.model.projectProductID;
        this.modelTrBuy.projectCode = this.model.productCode;
        this.modelTrBuy.termRefID = this.model.termRefID;
        this.modelTrBuy.preferredTypeName = this.model.preferredTypeName;
        this.modelTrBuy.ppQuantity = this.model.ppQuantity;
        this.modelTrBuy.totalPrice = this.model.totalPrice;
        this.modelTrBuy.bankID1 = this.model.bankID1;
        this.modelTrBuy.bankID2 = this.model.bankID2;
        this.modelTrBuy.paymentTypeID = this.model.paymentTypeID;
        this.modelTrBuy.psCodeCust = this.model.psCodeCust;
        this.modelTrBuy.userID = this.userID;
        this.modelTrBuy.orderCode = this.orderCode;
        this._transactionPPServiceProxy.trBuyPPOnline(this.modelTrBuy).finally(() => {
            setTimeout(() => {
                this.ppLoading = false;
                if (this.isMember == false) {
                    if (action == 'transaksi') {
                        this._router.navigate(['app/pponline/pponline/transaction-summary']);
                    } else if (action == 'verify') {
                        this._router.navigate(['app/main/booking-unit-verify', true]);
                    } else if (action == 'update') {
                        this._router.navigate(['/app/main/updateCustomer/', this.customerCode, true]);
                    } else if (action == 'register') {
                        this._router.navigate(['/app/main/registerCustomer/', this.custID, true]);
                    }
                }
            })
        }).subscribe(result => {
            localStorage.setItem('orderID', result.message);
            localStorage.setItem('transaction', JSON.stringify(result));
        }, err => {
            if (err.message == 'You are not member') {
                this.isMember = true;
            }
            console.log('err', err);
        })
    }

}
