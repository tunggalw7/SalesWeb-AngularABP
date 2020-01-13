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
    ListResultDtoOfGetBankCodeDropDownListDto,
    CreateADAuthDto,
    ADConfigurationServiceProxy
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
    domain: any;
    ip: any;
    username: any;
    password: any;
}

@Component({
    selector: "appAdConfigModal",
    templateUrl: "./modal-ad-config.component.html",
    styleUrls: ["./modal-ad-config.component.css"]
})
export class CreateOrUpdateAdConfigModalComponent extends AppComponentBase
    implements OnInit {
    @ViewChild("createOrEditModal") modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() modalHide: EventEmitter<any> = new EventEmitter<any>();

    form_control: FormControl = new FormControl();
    model: CreateADAuthDto = new CreateADAuthDto();
    batchForm: FormGroup;
    _projects: GetProjectsListDto[];
    _products: GetProjectProductListDto[];

    form_builder_selection = {
        domain: [null, Validators.compose([Validators.required])],
        ip: [null, Validators.compose([Validators.required])],
        username: [null, Validators.compose([Validators.required])],
        password: [null, Validators.compose([Validators.required])],
    };

    active = false;
    saving = false;
    isAdd: boolean = false;
    isEdit: boolean = false;
    isLoading: boolean = false;
    isDisable: boolean = false;

    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        private _adconfig: ADConfigurationServiceProxy,
    ) {
        super(injector);
        this.batchForm = this._fb.group(this.form_builder_selection);
        this.form_control = this.r_control();
    }

    ngOnInit(): void {
    }

    onShown(): void { }

    show(record?: GetSetupPPListDto, status?): void {
        if (record) {
            console.log(record);
            if (status == "edit") {
                this.isEdit = true;
                this.setData(record);
            }
        } else {
            this.isAdd = true;
            this.model = new CreateADAuthDto();
        }
        this.active = true;
        this.modal.show();
    }

    setData(record) {
        this.model.ip = record.ip;
        this.model.domain = record.domain;
        this.model.username = record.username;
        this.model.password = record.password;
        this.model.id = record.id;
    }

    isAlphaOrParen(str) {
        return /^[a-zA-Z()]+$/.test(str);
    }

    save(): void {
        let str = this.model.username.toString();
        if (this.model.username.split("\\")[0] == '' || this.model.username.split("\\")[0] == null || this.model.username.split("\\")[0] == undefined || !str.includes("\\")) {
            abp.notify.warn("Please insert domain in username");
        } else {
            console.log(this.model);
            if (this.isAdd) {
                this.createAD();
            } else if (this.isEdit) {
                this.updateAD();
            }
        }
    }

    createAD() {
        this.saving = true;
        const createInput = this.model;
        this.saving = true;
        this._adconfig
            .createADAuth(createInput)
            .finally(() => (this.saving = false))
            .subscribe(result => {
                this.notify.info("Saved Successfully");
                this.close();
            });
    }

    test() {
        this.saving = true;
        const createInput = this.model;
        this.saving = true;
        let str = this.model.username.toString();
        if (this.model.username.split("\\")[0] == '' || this.model.username.split("\\")[0] == null || this.model.username.split("\\")[0] == undefined || !str.includes("\\")) {
            abp.notify.warn("Please insert domain in username");
        } else {
            this._adconfig
                .testConnection(createInput)
                .finally(() => (this.saving = false))
                .subscribe(result => {
                    if(result==true){
                        this.message.success("Connection Successfully");
                    }else{
                        this.message.error("Connection Failed");
                    }
                }, err => {
                    this.message.error(err.message)
                        .done(() => {
                            console.error("err ", err.message);
                        });
                });
        }
    }

    updateAD() {
        this.saving = true;
        const updateInput = this.model;
        this.saving = true;
        this._adconfig
            .updateAdAuth(updateInput)
            .finally(() => (this.saving = false))
            .subscribe(result => {
                this.notify.info("Updated Successfully");
                this.close();
            });
    }

    r_control() {
        return {
            domain: this.batchForm.controls["domain"],
            ip: this.batchForm.controls["ip"],
            username: this.batchForm.controls["username"],
            password: this.batchForm.controls["password"],
        };
    }

    close(): void {
        this.isAdd = false;
        this.isEdit = false;
        this.isDisable = false;
        this.batchForm.reset();
        this.modalHide.emit();
        this.modalSave.emit();
        this.modal.hide();
        this.active = false;
    }
}
