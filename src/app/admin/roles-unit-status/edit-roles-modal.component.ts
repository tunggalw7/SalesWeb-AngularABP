import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { MsUnitStatusServiceProxy,ADConfigurationServiceProxy, UserServiceProxy, CreateOrUpdateUserStatusInputDto, GetListRolesUnitStatusResultDto, GetDetailRolesUnitStatusResultDto, UpdateRolesUnitStatusInputDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PermissionTreeComponent } from '../shared/permission-tree.component';
import {SelectItem} from "@node_modules/primeng/components/common/selectitem";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';

@Component({
    selector: 'editRolesModal',
    templateUrl: './edit-roles-modal.component.html',
    styleUrls: ['./edit-roles-modal.component.css']
})
export class EditRolesModalComponent extends AppComponentBase {

    @ViewChild('roleNameInput') roleNameInput: ElementRef;
    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    firstUnit = 0;
    active = false;
    saving = false;
    getListLoading = false;
    selectedBeforeTemp; 
    selectedAfterTemp; 
    noData: boolean;
    filterText = '';
    selectedPermission = '';
    roletest: number = undefined;
    staterText = '';
    statusBefore = new Array();
    statusAfter = new Array();
    disabledBefore = new Array();
    disabledAfter = new Array();
    actBtn = new Array();
    listBf:any;
    first = 0;
    role: GetListRolesUnitStatusResultDto = new GetListRolesUnitStatusResultDto();
    userID: number;
    userName: string;
    dropdown: GetDetailRolesUnitStatusResultDto = new GetDetailRolesUnitStatusResultDto();
    constructor(
        injector: Injector,
        private _msUnitStatusServiceProxy: MsUnitStatusServiceProxy,
        private _userServiceProxy: UserServiceProxy,
        private _fb: FormBuilder,
        private _adconfig: ADConfigurationServiceProxy,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';      
    }

    show(userid, username): void {
        this.userID = userid;
        this.userName = username;
        this.getStatus(userid);
        this.getLatestList();
        this.modal.show();
        console.log('selectedBeforeTemp',this.selectedBeforeTemp);
    }

    a:any = [];
    b:any = [];
    beforeLabel: any = [];
    afterLabel: any = [];
    isLoading:boolean = false

    getStatus(rolesID){
        this.getListLoading = true;
        this.isLoading = true;

        this._msUnitStatusServiceProxy.getMsUnitStatusDropdown().finally(() => {
            setTimeout(() => {
                this.isLoading = false;
                this.getListLoading = false;
                $('.tes').selectpicker('refresh');
                $('.listBf').selectpicker('refresh');
                $('.listAf').selectpicker('refresh');
            },)
        }).subscribe(result => {
                this.listBf = result.items;
        });
    }        

   actEdit(id,indeks){     
       if (this.disabledBefore[indeks]==false){
           this.message.confirm(
               "Are you sure to edit this unit status ?",
               isConfirmed => {
                   if (isConfirmed) {     
                       this.save(id, this.statusBefore[indeks], this.statusAfter[indeks]);
                   }
               }
           );
       }

       for(var i=0; i < this.actBtn.length; i++){
           if(indeks == i){
                this.actBtn[indeks]= 'Save';
           }else{
                this.actBtn[i] = 'Edit'; 
                this.disabledBefore[i]= true;   
                this.disabledAfter[i]= true;               
           }
       }

       this.disabledBefore[indeks]= false;  
       this.disabledAfter[indeks]= false;  
       this.actBtn[indeks]= 'Save';
   }

   save(id?, statusBefore?, statusAfter?): void {
        const self = this;

        const input = new CreateOrUpdateUserStatusInputDto();
        input.userID = this.userID;
        input.userName = this.userName;
        if (id) input.id = id;

        if (statusBefore){
            input.unitStatusFrom = statusBefore;
        }else{
            input.unitStatusFrom = this.selectedBeforeTemp;
        }

        if (statusAfter){
            input.unitStatusTo = statusAfter;
        }else{
            input.unitStatusTo = this.selectedAfterTemp;
        }
        this.saving = true;
        this._msUnitStatusServiceProxy.createOrUpdateUserStatus(input)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.getLatestList();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.selectedAfterTemp = '';
        this.selectedBeforeTemp = '';
        this.modal.hide();
    }

    
    getLatestList(event?): void {
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this._msUnitStatusServiceProxy.getListUnitStatusByUser(this.userID,
                this.filterText)
                .finally(() => { this.primengDatatableHelper.hideLoadingIndicator(); })
                .subscribe(result => {
                    this.primengDatatableHelper.records = result;
                    this.primengDatatableHelper.totalRecordsCount = result.length;
                    this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                    if (result.length){
                        for(var i=0; i < result.length; i++){
                            this.statusBefore[i] = result[i].unitStatusFrom.split("-")[0].trim();
                            this.statusAfter[i] = result[i].unitStatusTo.split("-")[0].trim();
                            this.disabledBefore[i] = true;
                            this.disabledAfter[i] = true;
                            this.actBtn[i]= 'Edit';
                        }
                    }
                });
        }
    }

}
