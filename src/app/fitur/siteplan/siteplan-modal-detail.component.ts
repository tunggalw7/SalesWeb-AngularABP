import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { RoleServiceProxy, RoleListDto, AdminServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import * as _ from 'lodash';

@Component({
    selector: 'detailSiteplanModal',
    templateUrl: './siteplan-modal-detail.component.html',

})
export class SiteplanModalDetailComponent extends AppComponentBase {
    @ViewChild('detailSiteplanModal') modal: ModalDirective;

    active = false;
    sitePlan: any = [];
    // projectName;

    constructor(
        injector: Injector,
        private _adminService: AdminServiceProxy
    ) {
        super(injector);
    }

    show(project) {
        this.active = true;
        // this.projectName = project.projectName;

        this._adminService.getDetailSitePlan(project)
            .subscribe(result => {
                this.sitePlan = result;
                setTimeout(() => {
                    this.modal.show();
                }, 0);
            });
    }
    close() {
        this.active = false;
        this.modal.hide();
    }

}
