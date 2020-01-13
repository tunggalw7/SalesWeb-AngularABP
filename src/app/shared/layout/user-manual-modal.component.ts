import {Component, ViewChild, Injector, ElementRef, Output, EventEmitter} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {AppComponentBase} from '@shared/common/app-component-base';
import {ADConfigurationServiceProxy} from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'userManualModal',
    templateUrl: './user-manual-modal.component.html'
})

export class UserManualComponent extends AppComponentBase {
    first: number = 0;
    baseUrl: any;
    psCode: any;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    active: boolean = false;
    saving: boolean = false;
    data;

    constructor(
        private _aDConfigurationServiceProxy: ADConfigurationServiceProxy,
        injector: Injector
    ) {
        super(injector);
        const data = require("../../../assets/appconfig.json");
        this.baseUrl = data.userManualBaseUrl;
    }

    show() {
        this.active = true;
        this.modal.show();
        this.gerTaskList();
    }

    gerTaskList() {
        let appName: any = "Sales Web";
        this._aDConfigurationServiceProxy.getListUserManual(appName)
            .finally(() => {

            }).subscribe(result => {
            this.primengDatatableHelper.records = result;
            this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
            this.primengDatatableHelper.totalRecordsCount = this.primengDatatableHelper.records.length;
            this.primengDatatableHelper.isResponsive = true;
        });
    }

    taskListEvent(event = null) {
        if (event) {
            this.first = event.first;
        } else {
            this.gerTaskList();
        }
    }

    download(link) {
        window.open(link, '_blank');
    }

    close() {
        this.modal.hide();
    }
}
