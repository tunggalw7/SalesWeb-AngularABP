import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ClosingAccountServiceProxy, GetSysClosingAccountListDto, CreateDeleteSysClosingAccountInputDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PermissionTreeComponent } from '../shared/permission-tree.component';
import {SelectItem} from "@node_modules/primeng/components/common/selectitem";

import * as _ from 'lodash';

@Component({
    selector: 'editSysClosingModal',
    templateUrl: './edit-sys-closing-modal.component.html',
    styleUrls: ['./edit-sys-closing-modal.component.css']
})
export class EditSysClosingModalComponent extends AppComponentBase {

    @ViewChild('roleNameInput') roleNameInput: ElementRef;
    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    getListLoading = false;
    noData: boolean;

    listSys: any = [];
    listSysClosing: SelectItem[] = [];
    selectedSysTemp: any[] = [];
    selectedSys: any[] = [];
    selectedSysText: any[] = [];

    // listAc: any = [];
    // listAccount: SelectItem[] = [];
    // selectedAccountTemp: any[] = [];
    // selectedAccount: any[] = [];
    
    
    // selectedAccountText: any[] = [];

    // listOt: any = [];
    // listOtherType: SelectItem[] = [];
    // selectedOtherTypeTemp: any[] = [];
    // selectedOtherType: any[] = [];
    // selectedOtherTypeText: any[] = [];

    // listPt: any = [];
    // listPayType: SelectItem[] = [];
    // selectedPayTypeTemp: any[] = [];
    // selectedPayType: any[] = [];
    // selectedPayTypeText: any[] = [];

    // listPf: any = [];
    // listPayFor: SelectItem[] = [];
    // selectedPayForTemp: any[] = [];
    // selectedPayFor: any[] = [];
    // selectedPayForText: any[] = [];
    

    user: any = [];
    userID: number;
    dropdown: GetSysClosingAccountListDto = new GetSysClosingAccountListDto();
    dropdown1 = [];
    listSave: any = [];
    _tabs = [];
    currentTab: boolean[] = [];
    activeTab: any;
    inputModal;
    constructor(
        injector: Injector,
        private _closingAccountServiceProxy: ClosingAccountServiceProxy
    ) {
        super(injector);
        this.currentTab[1] = true;
        this.activeTab = 1;
    }

    show(userId): void {
        console.log(userId);
        
        this.user = userId;
        this.userID = userId.userID;
        this.getDetailSysClosing(userId.userID)
        this.tabs();
        this.modal.show();
    }

    tabs(){
        this._tabs = [
            { "idTabs": 1, "tabName": "Project" },
        ]
    }

    switchTab(id){
        console.log("id", id);
        this.activeTab = id;
        this.currentTab = [];
        this.currentTab[id] = true;
    }

    getDetailSysClosing(userID){
        this.getListLoading = true;
        this.selectedSysTemp = [];
        this.listSysClosing = [];
        this._closingAccountServiceProxy.getDetailSysClosingAccount(userID).finally(() => {
            setTimeout(() => {
                this.getListLoading = false;
                $('.listSys').selectpicker('refresh');
            },)
        }).subscribe(result => {
            console.log("dropdown", result);
            if (result.listSysClosingAccount.length == 1) {
                this.noData = false;
            } else { this.noData = true;}
                this.dropdown = result;
                this.listSys = this.dropdown.listSysClosingAccount;
                this.listSys.forEach(item => {
                    this.listSysClosing.push({
                        value: {
                            id: item.accountID,
                            code: item.accountCode,
                            name: item.accountName
                        },
                        label: item.accountCode+' - '+item.accountName
                    });
                    if (item.isChecked == true) {
                        this.selectedSysTemp.push(
                            {
                                id: item.accountID,
                                code: item.accountCode,
                                name: item.accountName
                            }
                        )
                    }
                })
                this.onChangeSysClosing(this.selectedSysTemp);
            })
    }   

    onChangeSysClosing(event) {
        this.selectedSys = [];
        this.selectedSysText = [];
        this.selectedSysTemp.forEach(item => {
            // this.inputModal.push(
            //     item.id
            // );
            this.selectedSys.push(
                item.id
           );
            this.selectedSysText.push(item.name);
        });
    }

   save(): void {
    const self = this;
    this.saving = true;
    if (this.activeTab === 1) {
        this.inputModal = new CreateDeleteSysClosingAccountInputDto();
        this.inputModal.userID = this.userID;
        this.inputModal.listSysClosingAccount = this.selectedSys;  
    }
    this._closingAccountServiceProxy.createDeleteSysClosingAccount(this.inputModal)
        .finally(() => {
            this.saving = false
            localStorage.setItem('save', 'true');
        })
        .subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.modalSave.emit(null);
        });
}

    close(): void {
        this.active = false;
        this.selectedSys = [];
        this.selectedSysTemp = [];
        this.selectedSysText = [];
        this.modal.hide();
    }
}
