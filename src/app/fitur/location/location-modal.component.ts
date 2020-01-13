import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { RoleServiceProxy, RoleListDto, BookingHistoryServiceProxy, DiagramaticServiceProxy, TransactionServiceProxy, AdminServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import * as _ from 'lodash';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';

@Component({
    selector: 'previewModal',
    templateUrl: './location-modal.component.html',

})
export class LocationModalDetailComponent extends AppComponentBase {
    @ViewChild('previewModal') modal: ModalDirective;
    
    locationType;
    locationProject;
    locationData: any = [];

    constructor(
        injector: Injector,
        private _transactionServiceProxy: TransactionServiceProxy,
        private _script: ScriptLoaderService,
        private _adminService: AdminServiceProxy
    ) {
        super(injector);
    }

    show(type?: any, project?: any): void {
        this.locationType = type;

        this._adminService.getDetailProjectLocation(project)
            .subscribe(result => {
                this.locationData = result;
            });

        this.locationProject = project;
        this.modal.show();
    }
    
    close(): void {
        this.modal.hide();
    }

    ngAfterViewInit() {
        this._script.load('body', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDieZ7uAY4DPdT3Z4fp4KtykHl6dWryYdw');
        this._script.load('body', 'assets/project/app/js/fitur.js');
    }
}
