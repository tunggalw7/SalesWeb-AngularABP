import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { MsProjectServiceProxy, MsAccountServiceProxy, PaymentLkOthersTypeServiceProxy, 
        PaymentLkPayForServiceProxy, PaymentLkPayTypeServiceProxy, GetListRolesProjectResultDto,
        CreateDeleteRolesProjectInputDto, CreateDeleteSysRolesInputDto,  } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PermissionTreeComponent } from '../shared/permission-tree.component';
import {SelectItem} from "@node_modules/primeng/components/common/selectitem";

import * as _ from 'lodash';

@Component({
    selector: 'editRolesProjectModal',
    templateUrl: './edit-roles-project-modal.component.html',
    styleUrls: ['./edit-roles-project-modal.component.css']
})
export class EditRolesProjectModalComponent extends AppComponentBase {

    @ViewChild('roleNameInput') roleNameInput: ElementRef;
    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    getListLoading = false;
    noData: boolean;

    listPj: any = [];
    listProject: SelectItem[] = [];
    selectedProjectTemp: any[] = [];
    selectedProject: any[] = [];
    selectedProjectText: any[] = [];

    listAc: any = [];
    listAccount: SelectItem[] = [];
    selectedAccountTemp: any[] = [];
    selectedAccount: any[] = [];
    
    
    selectedAccountText: any[] = [];

    listOt: any = [];
    listOtherType: SelectItem[] = [];
    selectedOtherTypeTemp: any[] = [];
    selectedOtherType: any[] = [];
    selectedOtherTypeText: any[] = [];

    listPt: any = [];
    listPayType: SelectItem[] = [];
    selectedPayTypeTemp: any[] = [];
    selectedPayType: any[] = [];
    selectedPayTypeText: any[] = [];

    listPf: any = [];
    listPayFor: SelectItem[] = [];
    selectedPayForTemp: any[] = [];
    selectedPayFor: any[] = [];
    selectedPayForText: any[] = [];
    

    role: any = [];
    rolesID: number;
    dropdown: GetListRolesProjectResultDto = new GetListRolesProjectResultDto();
    dropdown1 = [];
    listSave = [];
    _tabs = [];
    currentTab: boolean[] = [];
    activeTab: any;
    input;
    constructor(
        injector: Injector,
        private _msProjectServiceProxy: MsProjectServiceProxy,
        private _msAccountServiceProxy: MsAccountServiceProxy,
        private _paymentLkOthersTypeServiceProxy: PaymentLkOthersTypeServiceProxy,
        private _paymentLkPayForServiceProxy: PaymentLkPayForServiceProxy,
        private _paymentLkPayTypeServiceProxy: PaymentLkPayTypeServiceProxy,
    ) {
        super(injector);
        this.currentTab[1] = true;
        this.activeTab = 1;
    }

    show(roles): void {
        this.role = roles;
        this.rolesID = roles.rolesID;
        this.getDetailRolesproject(roles.rolesID)
        this.tabs();
        this.modal.show();
    }

    tabs(){
        this._tabs = [
            { "idTabs": 1, "tabName": "Roles Project" },
            { "idTabs": 2, "tabName": "Roles Account" },
            { "idTabs": 3, "tabName": "Roles Other Type" },
            { "idTabs": 4, "tabName": "Roles Pay Type" },
            { "idTabs": 5, "tabName": "Roles Pay For" },
        ]
    }

    switchTab(id){
        console.log("id", id);
        this.activeTab = id;
        this.currentTab = [];
        this.currentTab[id] = true;
    }

    getDetailRolesproject(rolesID){
        this.getListLoading = true;
        this.selectedProjectTemp = [];
        this.selectedAccountTemp = [];
        this.selectedOtherTypeTemp = [];
        this.selectedPayForTemp = [];
        this.selectedPayTypeTemp = [];
        this.listProject = [];
        this._msProjectServiceProxy.getDetailRolesProject(rolesID).finally(() => {
            setTimeout(() => {
                this.getListLoading = false;
                $('.listPj').selectpicker('refresh');
                $('.listAc').selectpicker('refresh');
                $('.listOt').selectpicker('refresh');
                $('.listPt').selectpicker('refresh');
                $('.listPf').selectpicker('refresh');
            },)
        }).subscribe(result => {
            this.listProject = [];
            this.listAccount = [];
            this.listOtherType = [];
            this.listPayType = [];
            this.listPayFor = [];
            this.selectedProjectTemp = [];
            this.selectedAccountTemp = [];
            this.selectedOtherTypeTemp = [];
            this.selectedPayTypeTemp = [];
            this.selectedPayForTemp = [];
            // if (result.listProject.length == 1) {
            //     this.noData = false;
            // } else { this.noData = true;}
                this.dropdown = result;
                this.listPj = this.dropdown.listProject;
                this.listPj.forEach(item => {
                    this.listProject.push({
                        value: {
                            id: item.id,
                            code: item.code,
                            name: item.name
                        },
                        label: item.code+' - '+item.name
                    });
                    if (item.isChecked == true) {
                        this.selectedProjectTemp.push(
                            {
                                id: item.id,
                                code: item.code,
                                name: item.name
                            }
                        )
                    }
                })
                this.listAc = this.dropdown.listAccount;
                this.listAc.forEach(item => {
                    this.listAccount.push({
                        value: {
                            id: item.id,
                            code: item.code,
                            name: item.name
                        },
                        label: item.code+' - '+item.name
                    });
                    if (item.isChecked == true) {
                        this.selectedAccountTemp.push(
                            {
                                id: item.id,
                                code: item.code,
                                name: item.name
                            }
                        )
                    }
                })
                this.listOt = this.dropdown.listOthersType;
                this.listOt.forEach(item => {
                    this.listOtherType.push({
                        value: {
                            id: item.id,
                            code: item.code,
                            name: item.name
                        },
                        label: item.code+' - '+item.name
                    });
                    if (item.isChecked == true) {
                        this.selectedOtherTypeTemp.push(
                            {
                                id: item.id,
                                code: item.code,
                                name: item.name
                            }
                        )
                    }
                })
                this.listPt = this.dropdown.listPayType;
                this.listPt.forEach(item => {
                    this.listPayType.push({
                        value: {
                            id: item.id,
                            code: item.code,
                            name: item.name
                        },
                        label: item.code+' - '+item.name
                    });
                    if (item.isChecked == true) {
                        this.selectedPayTypeTemp.push(
                            {
                                id: item.id,
                                code: item.code,
                                name: item.name
                            }
                        )
                    }
                })
                this.listPf = this.dropdown.listPayFor;
                this.listPf.forEach(item => {
                    this.listPayFor.push({
                        value: {
                            id: item.id,
                            code: item.code,
                            name: item.name
                        },
                        label: item.code+' - '+item.name
                    });
                    if (item.isChecked == true) {
                        this.selectedPayForTemp.push(
                            {
                                id: item.id,
                                code: item.code,
                                name: item.name
                            }
                        )
                    }
                })
                this.onChangeProject(this.selectedProjectTemp);
                this.onChangeAccount(this.selectedAccountTemp);
                this.onChangeOtherType(this.selectedOtherTypeTemp);
                this.onChangePayType(this.selectedPayTypeTemp);
                this.onChangePayFor(this.selectedPayForTemp);
            })
    }   

    onChangeProject(event) {
         this.selectedProject = [];
         this.selectedProjectText = [];
         this.selectedProjectTemp.forEach(item => {
             this.selectedProject.push(
                 {
                     rolesID: this.rolesID,
                     projectID: item.id
                 }
            );
             this.selectedProjectText.push(item.name);
         });
    }
    onChangeAccount(event) {
         this.selectedAccount = [];
         this.selectedAccountText = [];
         this.selectedAccountTemp.forEach(item => {
             this.selectedAccount.push(
                item.id
            );
             this.selectedAccountText.push(item.name);
         });
    }
    onChangeOtherType(event) {
         this.selectedOtherType = [];
         this.selectedOtherTypeText = [];
         this.selectedOtherTypeTemp.forEach(item => {
             this.selectedOtherType.push(
                item.id
            );
             this.selectedOtherTypeText.push(item.name);
         });
    }
    onChangePayType(event) {
         this.selectedPayType = [];
         this.selectedPayTypeText = [];
         this.selectedPayTypeTemp.forEach(item => {
             this.selectedPayType.push(
                item.id
            );
             this.selectedPayTypeText.push(item.name);
         });
    }
    onChangePayFor(event) {
         this.selectedPayFor = [];
         this.selectedPayForText = [];
         this.selectedPayForTemp.forEach(item => {
             this.selectedPayFor.push(
                 item.id
                
            );
             this.selectedPayForText.push(item.name);
         });
    }

   save(): void {
    const self = this;
    this.saving = true;
    if (this.activeTab === 1) {
        if (!this.selectedProject.length){            
            this.selectedProject.push(
                {
                    rolesID: this.rolesID,
                }
           );
        }
        this.listSave = this.selectedProject;
        this._msProjectServiceProxy.createDeleteRolesProject(this.listSave)
        .finally(() => {
            this.saving = false
            localStorage.setItem('save', 'true');
        })
        .subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.modalSave.emit(null);
        });
    } else if (this.activeTab === 2) {
        // this.listSave = this.selectedAccount;
        this.input = new CreateDeleteSysRolesInputDto();
        this.input.rolesID = this.rolesID;
        this.input.listSysRoles = this.selectedAccount
        this._msAccountServiceProxy.createDeleteRolesAccount(this.input)
        .finally(() => {
            this.saving = false
            localStorage.setItem('save', 'true');
        })
        .subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.modalSave.emit(null);
        });
    } else if (this.activeTab === 3) {
        // this.listSave = this.selectedOtherType;
        this.input = new CreateDeleteSysRolesInputDto();
        this.input.rolesID = this.rolesID;
        this.input.listSysRoles = this.selectedOtherType;
        this._paymentLkOthersTypeServiceProxy.createDeleteRolesOthersType(this.input)
        .finally(() => {
            this.saving = false
            localStorage.setItem('save', 'true');
        })
        .subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.modalSave.emit(null);
        });
    } else if (this.activeTab === 4) {
        // this.listSave = this.selectedPayType;
        this.input = new CreateDeleteSysRolesInputDto();
        this.input.rolesID = this.rolesID;
        this.input.listSysRoles = this.selectedPayType;
        this._paymentLkPayTypeServiceProxy.createDeleteRolesPayType(this.input)
        .finally(() => {
            this.saving = false
            localStorage.setItem('save', 'true');
        })
        .subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.modalSave.emit(null);
        });
    } else if (this.activeTab === 5) {
        // this.listSave = this.selectedPayFor;
        this.input = new CreateDeleteSysRolesInputDto();
        this.input.rolesID = this.rolesID;
        this.input.listSysRoles = this.selectedPayFor
        this._paymentLkPayForServiceProxy.createDeleteRolesPayFor(this.input)
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
}

    close(): void {
        this.active = false;
        this.selectedProject = [];
        this.selectedProjectTemp = [];
        this.selectedProjectText = [];
        this.selectedAccount = [];
        this.selectedAccountTemp = [];
        this.selectedAccountText = [];
        this.selectedOtherType = [];
        this.selectedOtherTypeTemp = [];
        this.selectedOtherTypeText = [];
        this.selectedPayFor = [];
        this.selectedPayForTemp = [];
        this.selectedPayForText = [];
        this.selectedPayType = [];
        this.selectedPayTypeTemp = [];
        this.selectedPayTypeText = [];
        this.modal.hide();
    }
}
