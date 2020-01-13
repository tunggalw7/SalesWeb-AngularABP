import {
    Component, OnInit, AfterViewInit, ElementRef, ViewChild, Injector, Input, Output, EventEmitter,
    forwardRef
} from '@angular/core';
import { PermissionServiceProxy, FlatPermissionWithLevelDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

const noop = () => {};
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ExampleComplexDdlComponent),
    multi: true
};

@Component({
    selector: 'example-complex-ddl',
    template: `<select #DropdownList
                    class="form-control"
                    [(ngModel)]="inputValue"
                    [attr.data-live-search]="true">
                    <option [ngValue]="undefined">{{l('NothingSelected')}}</option>
                    <option *ngFor="let a of valueList" [ngValue]="a.id">{{a.displayName}}</option>
                </select>`,
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})

export class ExampleComplexDdlComponent extends AppComponentBase implements ControlValueAccessor, OnInit, AfterViewInit {
    private innerValue: any = '';
    isLoading = false;
    valueList: any[] = [];
    _selectedValue: any;

    @Input()
    get selectedValue() {
        return this._selectedValue;
    }

    set selectedValue(val) {
        this._selectedValue = val;
        this.selectedValueChange.emit(this._selectedValue);
        this.ngModelChange.emit(val);
    }

    @Output() selectedValueChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    @ViewChild('DropdownList') dropdownListElement: ElementRef;

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    constructor(
        private _permissionService: PermissionServiceProxy,
        private _roleService: RoleServiceProxy,
        injector: Injector) {
        super(injector);
    }

    //CHANGE: Adjust this method to your service
    ngOnInit(): void {
        this._roleService.getRoles(undefined)
        .finally(() => this.refreshAll())
        .subscribe(result => {
            this.valueList = result.items;
        });
    }

    ngAfterViewInit(): void {
        $(this.dropdownListElement.nativeElement).selectpicker({
            iconBase: 'famfamfam-flag',
            tickIcon: 'la la-check'
        });
    }

    refreshAll(): void {
        setTimeout(() => {
            $(this.dropdownListElement.nativeElement).selectpicker('refresh');
        }, 0);
    }

    //get accessor
    get inputValue(): any {
        return this.innerValue;
    }

    //set accessor including call the onchange callback
    set inputValue(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.selectedValueChange.emit(v);
            this.onChangeCallback(v);
            this.refreshAll();
        }
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
