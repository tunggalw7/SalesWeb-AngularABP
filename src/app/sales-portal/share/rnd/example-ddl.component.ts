import { AfterContentInit, Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { BaseDropDownListComponent, getCustomInputControlValueAccessor, templateString } from 'app/sales-portal/share/base-ddl.component';

import { RoleServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    template: templateString,
    selector: 'example-ddl',
    providers: [getCustomInputControlValueAccessor(ExampleDdlComponent), BaseDropDownListComponent]
})
export class ExampleDdlComponent extends BaseDropDownListComponent implements AfterContentInit {
    @ViewChild('dropdownElement', {read: ElementRef}) el;

    listResult = this._roleService.getRoles(undefined);
    labelField = 'displayName';
    valueField = 'id';
    isLoading = true;

    constructor(
        private _roleService: RoleServiceProxy,
    ) {
        super();
    }

    ngAfterContentInit() {
        this.setDropdownElement(this.el);
    }

    //CHANGE: Uncommented retrieveByInput() method if you use param for request service
    // retrieveByInput() {
        // if(this.input != undefined && this.input != '')
        // {
        //     this.listResult = this._roleService.getRoles(this.input);
        // }
        // else {
        //     this.listResult = undefined;
        //     this.loadAllData();
        // }
    // }
}