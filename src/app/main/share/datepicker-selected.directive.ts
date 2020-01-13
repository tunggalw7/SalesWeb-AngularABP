import { Directive, AfterViewInit, ElementRef, ViewChild, Injector, Input, Output, EventEmitter, HostListener, OnChanges, Optional } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { NgModel, NgControl } from "@angular/forms";

@Directive({
    selector: '[datePicker]',
    providers: [NgModel],
})
export class DatePickerSelectedDirective extends AppComponentBase implements AfterViewInit {
    datetimeFormat: string = 'DD/MM/YYYY hh:mm:ss A';
    dateFormat: string = 'DD/MM/YYYY';
    hostElement: ElementRef;
    _selectedDate: moment.Moment = moment().startOf('day');
    @Output() selectedDateChange = new EventEmitter();
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

    @Input('dateType') private dateType = '';
    @Input()
    get selectedDate() {
        return this._selectedDate;
    }

    set selectedDate(val) {
        debugger
        this._selectedDate = val;
        this.selectedDateChange.emit(this._selectedDate);
        if (this._selectedDate) {
            this.setElementText(val);
            if (this.dateType == 'datetime') {
                let tmp = this._selectedDate.format(this.datetimeFormat);
                this.ngModelChange.emit(this._selectedDate.format(this.datetimeFormat));
            }
            else {
                let tmp = this._selectedDate.format(this.dateFormat);
                this.ngModelChange.emit(this._selectedDate.format(this.dateFormat));
            }
        }
        else
            this.ngModelChange.emit('');
    }

    constructor(
        injector: Injector,
        private _element: ElementRef,
        @Optional() private control: NgControl,
    ) {
        super(injector);
        this.hostElement = _element;
    }

    ngAfterViewInit(): void {
        const $element = $(this.hostElement.nativeElement);

        if (this.dateType === 'datetime') {
            $element.datetimepicker({
                format: this.datetimeFormat
            }).on('dp.change', this.handleChange);
        } else {
            $element.datepicker({
                language: abp.localization.currentLanguage.name,
                format: this.dateFormat,
                autoclose: true
            }).on('changeDate', e => {
                this.selectedDate = moment(e.date);
            }).on('clearDate', e => {
                this.selectedDate = null;
            });
        }
    }

    private handleChange: (any) => void = (event: any): void => {
        this.control.control.patchValue(event.date.format(this.datetimeFormat));
    }

    setElementText(val: any) {
        const $element = $(this.hostElement.nativeElement);
        if (val) {
            $element.val(moment(val).format('L'));
        } else {
            $element.val('');
        }
    }

}
