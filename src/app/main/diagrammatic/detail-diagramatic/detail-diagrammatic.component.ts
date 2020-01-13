import {
    Component,
    Input,
    OnInit,
    Injector,
    ViewChild,
    ViewEncapsulation,
    ElementRef,
    OnChanges,
    SimpleChanges,
    SimpleChange
} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {
    CustomerMemberServiceProxy,
    ListCountryResultDto,
    ListCityResultDto,
    ListNationResultDto,
    DocumentUpload,
    ListPostCodeResultDto,
    SignUpCustomerInputDto,
    IDocumentUpload,
    ListDetailDiagramaticWebResultDto
} from '@shared/service-proxies/service-proxies';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {DiagramaticServiceProxy} from '@shared/service-proxies/service-proxies';
import {DropzoneComponent, DropzoneDirective, DropzoneConfigInterface} from 'ngx-dropzone-wrapper';

import * as moment from 'moment';
import {Router} from '@angular/router';
import { Pipe } from '@angular/core';



@Pipe({ name: 'round' })
export class RoundPipe {
    transform(input: number) {
        return Math.round(input);
    }
}

@Component(
    {
        selector: 'detailDiagramatic',
        templateUrl: './detail-diagrammatic.component.html',
        animations: [appModuleAnimation()],
    }
)

export class DetailDiagrammaticComponent extends AppComponentBase {
    showdetail: boolean;
    styleDetail: any;
    data: any = [];
    dataDetail : any = [];
    dataDetail2:any = [];
    detailterm = [];
    columntype = [];
    columntype2 = [];
    unitStatus;
    PpnHover;
    constructor(private _diagramServices: DiagramaticServiceProxy, 
        injector: Injector) {
        super(injector);
    }

    show(data: any, unitID: number, event: any): void {
        this.showdetail = true;
        this.data = data;
        this.unitStatus = data.unitStatusCode; 
        this.configdetail(event);
        this.getUnitDetail(unitID);
        this.PpnHover = localStorage.getItem("PPnHover");
    }

    hide(): void {
        this.showdetail = false;
    }

    updatePosition(event?: any): void {
        this.configdetail(event);
    }

    showData = false;
    showDataLoading = false;

    getUnitDetail(unitId: number): void {
        this.detailterm = [], this.columntype2 = [{'col':'termName','label':'Term Of Payment'},
        {'col':'listPrice','label':'Unit Price*'},{'col':'renovName','label':'Renovation'}];

        this.showData = false;
        this.showDataLoading = true;
        this._diagramServices.getDetailDiagramaticWeb(unitId)
            .finally(() => {
                setTimeout(() => {
                    this.showData = true;
                    this.showDataLoading = false;
                }, 0);
            })
            .subscribe((result) => {
                this.dataDetail = result;
            });
    }

    toUnique(a) { //array,placeholder,placeholder
        let b;
        let c;

        b = a.length;
        while (c = --b) while (c--) a[b] !== a[c] || a.splice(c, 1);
        return a;
    }

    configdetail(event: any) {
        let top;
        let left;

        /*
        if (event.screenY > 740) {
            top = (event.pageY - 600);
        } else if (event.screenY > 600) {
            top = (event.pageY - 590);
        } else if (event.screenY > 500) {
            top = (event.pageY - 550);
        } else if (event.screenY > 425) {
            top = (event.pageY - 350);
        } else if (event.screenY > 360) {
            top = (event.pageY - 250);
        } else {
            top = (event.pageY - 150);
        }
        */

        top = window.scrollY - 150 + 80;
        top = top + 'px';

        if (event.screenX > 1240) {
            left = (event.pageX - 520) + 'px';
        } else if (event.screenX > 936) {
            left = (event.pageX - 520) + 'px';
        } else {
            left = (event.pageX + 20) + 'px';
        }

        this.styleDetail = {
            'top': top,
            'left': left,
        };
    }

    checkarrayeist(a: any[], key_array: any, value: any) {
        for (let i = 0; i < a.length; i++) {
            let item = a[i];

            if (item[key_array] == value) {
                return true;
            }
        }
    }


}
