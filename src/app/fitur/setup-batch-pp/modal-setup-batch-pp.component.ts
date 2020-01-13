import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    ElementRef,
    ChangeDetectorRef,
    OnInit
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import {
    OrganizationUnitServiceProxy,
    CreateOrganizationUnitInput,
    UpdateOrganizationUnitInput,
    OrganizationUnitDto,
    GetProjectsListDto,
    GetProjectProductListDto,
    SetupPPServiceProxy,
    CreateOrUpdateSetupPPDto,
    GetSetupPPListDto,
    ListResultDtoOfGetBankCodeDropDownListDto
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";

import * as _ from "lodash";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { stat } from "fs";

export interface IOrganizationUnitOnEdit {
    id?: number;
    parentId?: number;
    displayName?: string;
}

export class FormControl {
    projectCode: any;
    productCode: any;
    batchCode: any;
    batchStart: any;
    batchEnd: any;
    PPPrice: any;
    maxTopUp: any;
    topUp: any;
    convert: any;
    bookingFee: any;
    sellOnly: any;
    status: any;
}

@Component({
    selector: "appSetupBatchModal",
    templateUrl: "./modal-setup-batch-pp.component.html",
    styleUrls: ["./modal-setup-batch-pp.component.css"]
})
export class ModalSetupBatchPPComponent extends AppComponentBase
    implements OnInit {
    @ViewChild("createOrEditModal") modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() modalHide: EventEmitter<any> = new EventEmitter<any>();

    form_control: FormControl = new FormControl();
    model: CreateOrUpdateSetupPPDto = new CreateOrUpdateSetupPPDto();
    batchForm: FormGroup;
    _projects: GetProjectsListDto[];
    _products: GetProjectProductListDto[];

    form_builder_selection = {
        projectCode: [null, Validators.compose([Validators.required])],
        productCode: [null, Validators.compose([Validators.required])],
        batchCode: [
            null,
            Validators.compose([Validators.required, Validators.maxLength(3)])
        ],
        batchStart: [
            null,
            Validators.compose([
                Validators.required,
                Validators.maxLength(3),
                Validators.min(1),
                Validators.max(999)
            ])
        ],
        batchEnd: [
            null,
            Validators.compose([
                Validators.required,
                Validators.maxLength(3),
                Validators.min(1),
                Validators.max(999)
            ])
        ],
        PPPrice: [null],
        maxTopUp: [
            null,
            Validators.compose([Validators.required, Validators.min(1)])
        ],
        topUp: [null],
        convert: [null],
        bookingFee: [null],
        sellOnly: [null],
        status: [null]
    };

    active = false;
    saving = false;
    isAdd: boolean = false;
    isEdit: boolean = false;
    isView: boolean = false;
    isLoading: boolean = false;
    isDisable: boolean = false;
    projectCode: any;
    productCode: any;
    PPPrice: any;
    lastbatch: number;
    a: boolean;
    b: boolean;
    c: boolean;
    d: boolean;

    record: CreateOrUpdateSetupPPDto = new CreateOrUpdateSetupPPDto();

    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        private _setupPPServiceProxy: SetupPPServiceProxy
    ) {
        super(injector);
        this.batchForm = this._fb.group(this.form_builder_selection);
        this.form_control = this.r_control();
    }

    ngOnInit(): void {
        this.getListProject();
    }

    onShown(): void {}

    show(record?: GetSetupPPListDto, status?): void {
        if (record) {
            console.log(record);
            if (status == "edit") {
                this.isEdit = true;
                this.getLatestBatchSequence(record);
                this.setData(record.batchEntryID);
            } else if (status == "view") {
                this.isView = true;
                this.getLatestBatchSequence(record);
                this.setData(record.batchEntryID);
                this.batchForm.controls["topUp"].disable();
                this.batchForm.controls["status"].disable();
            }
        } else {
            this.isAdd = true;
            this.model = new CreateOrUpdateSetupPPDto();
            this.model.isActive = true;
            this.model.maxTopUpFromOldBatch = 1;
        }
        this.active = true;
        this.modal.show();
    }

    setData(batchID) {
        this._setupPPServiceProxy
        .getDetailSetupPP(batchID)
        .finally(() => (this.isLoading = false))
        .subscribe(result => {
        console.log('result getdetailsetuppp', result);
        this.model.batchEntryID = result.batchID;
        this.model.projectCode = result.projectCode;
        this.model.productCode = result.productCode;
        this.model.batchCode = result.batchCode;
        this.model.batchNumStart = result.batchStartNum;
        this.model.batchNumEnd = result.batchEndNum;
        this.model.maxTopUpFromOldBatch = result.maxTopUp;
        this.model.batchPurpose = result.batchPurpose;
        this.PPPrice = result.priorityPassPrice;
        console.log(typeof result.batchPurpose);
        if (result.batchPurpose == 1) this.a = true;
        else if (result.batchPurpose == 2) this.b = true;
        else if (result.batchPurpose == 3) this.c = true;
        else if (result.batchPurpose == 4) this.d = true;

        this.batchForm.controls["projectCode"].disable();
        this.batchForm.controls["productCode"].disable();
        this.model.isActive = result.isActive;
        this.projectCode = this.model.projectCode;
        this.getListProduct();
        setTimeout(() => {
            $(".project").selectpicker("refresh");
        }, 0);
        setTimeout(() => {
            $(".product").selectpicker("refresh");
        }, 0);
        setTimeout(() => {
            $(".m-radio").selectpicker("refresh");
        }, 0);
        });

    }

    isAlphaOrParen(str) {
        return /^[a-zA-Z()]+$/.test(str);
    }

    save(): void {
        if (this.model.batchNumEnd > 999 || this.model.batchNumStart > 999) {
            this.notify.warn(
                "Batch Number Start or Batch Number End maximal 999"
            );
        } else if (this.model.batchNumStart > this.model.batchNumEnd) {
            this.notify.warn(
                "Batch Number Start greater than Batch Number End"
            );
        } else if (this.model.batchCode.length < 3) {
            this.notify.warn("Batch Code must 3 digit");
        } else if (!this.isAlphaOrParen(this.model.batchCode)) {
            this.notify.warn("Batch Code must alphabet");
        } else {
            if (this.isAdd) {
                this.createUnit();
            } else if (this.isEdit) {
                if (this.model.batchNumStart < this.lastbatch) {
                    this.notify.warn(
                        "Batch Number Start must greater than Batch Sequence"
                    );
                } else {
                    this.updateUnit();
                }
            }
        }
    }

    createUnit() {
        this.saving = true;
        this.model.batchCode = this.model.batchCode.toUpperCase();
        this.model.batchPurpose = Number(this.model.batchPurpose);
        const createInput = this.model;
        this.saving = true;
        this._setupPPServiceProxy
            .createSetupPP(createInput)
            .finally(() => (this.saving = false))
            .subscribe(result => {
                this.notify.info("Saved Successfully");
                this.close();
            });
    }

    onChangeProject(param) {
        this.projectCode = param;
        this.getListProduct();
        this.getPriorityPassPrice();
    }

    onChangeProduct(param) {
        this.productCode = param;
        this.getPriorityPassPrice();
    }

    getPriorityPassPrice() {
        this.isLoading = true;
        this._setupPPServiceProxy
            .getPriorityPassPrice(this.projectCode, this.productCode)
            .finally(() => (this.isLoading = false))
            .subscribe(result => {
                this.PPPrice = result;
                this.isDisable = true;
            });
    }

    getLatestBatchSequence(record) {
        this.isLoading = true;
        this._setupPPServiceProxy
            .getLatestBatchSequence(record.batchEntryID)
            .finally(() => (this.isLoading = false))
            .subscribe(result => {
                this.lastbatch = result;
            });
    }

    updateUnit() {
        this.saving = true;
        const updateInput = this.model;
        this.saving = true;
        this._setupPPServiceProxy
            .updateSetupPP(updateInput)
            .finally(() => (this.saving = false))
            .subscribe(result => {
                this.notify.info("Updated Successfully");
                this.close();
            });
    }

    r_control() {
        return {
            projectCode: this.batchForm.controls["projectCode"],
            productCode: this.batchForm.controls["productCode"],
            batchCode: this.batchForm.controls["batchCode"],
            batchStart: this.batchForm.controls["batchStart"],
            batchEnd: this.batchForm.controls["batchEnd"],
            PPPrice: this.batchForm.controls["PPPrice"],
            maxTopUp: this.batchForm.controls["maxTopUp"],
            topUp: this.batchForm.controls["topUp"],
            convert: this.batchForm.controls["convert"],
            bookingFee: this.batchForm.controls["bookingFee"],
            sellOnly: this.batchForm.controls["sellOnly"],
            status: this.batchForm.controls["status"]
        };
    }

    getListProject() {
        this._setupPPServiceProxy
            .getDropdownProject()
            .finally(() => {
                setTimeout(() => {
                    $(".project").selectpicker("refresh");
                }, 0);
            })
            .subscribe(result => {
                this._projects = result;
            });
    }

    getListProduct() {
        this._setupPPServiceProxy
            .getDropdownProjectProduct(this.projectCode)
            .finally(() => {
                setTimeout(() => {
                    $(".product").selectpicker("refresh");
                }, 0);
            })
            .subscribe(result => {
                this._products = result;
            });
    }

    close(): void {
        this.isAdd = false;
        this.isEdit = false;
        this.isView = false;
        this.isDisable = false;
        this.batchForm.controls["topUp"].enable();
        this.batchForm.controls["status"].enable();
        this.batchForm.controls["projectCode"].enable();
        this.batchForm.controls["productCode"].enable();
        this.batchForm.reset();
        this.PPPrice = null;
        setTimeout(() => {
            $(".project").selectpicker("refresh");
        }, 0);
        setTimeout(() => {
            $(".product").selectpicker("refresh");
        }, 0);
        this.projectCode = null;
        this.productCode = null;
        this.lastbatch = null;
        this.a = false;
        this.b = false;
        this.c = false;
        this.d = false;
        this.modalHide.emit();
        this.modalSave.emit();
        this.modal.hide();
        this.active = false;
    }
}
