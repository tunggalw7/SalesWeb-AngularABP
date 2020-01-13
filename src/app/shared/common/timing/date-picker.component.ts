import { Directive, AfterViewInit, ElementRef, ViewChild, Injector, Input, Output, EventEmitter, HostListener, OnChanges, Optional, SimpleChanges } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { NgModel, NgControl } from "@angular/forms";

@Directive({
    selector: '[datePicker]',
    providers: [NgModel],
    exportAs: 'datepickerdirective'
})
export class DatePickerDirective extends AppComponentBase implements AfterViewInit, OnChanges {
    datetimeFormat: string = 'DD/MM/YYYY hh:mm:ss A';
    dateFormat: string = 'DD/MM/YYYY';
    hostElement: ElementRef;
    _selectedDate: moment.Moment = moment().startOf('day');
    @Output() selectedDateChange = new EventEmitter();
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

    @Input() ngModel: any;
    @Input('dateType') private dateType = '';
    @Input()
    get selectedDate() {
        return this._selectedDate;
    }

    set selectedDate(val) {
        this._selectedDate = val;
        this.selectedDateChange.emit(this._selectedDate);
        if (this._selectedDate)
            if (this.dateType == 'datetime')
                this.ngModelChange.emit(this._selectedDate.format(this.datetimeFormat));
            else
                this.ngModelChange.emit(this._selectedDate.format(this.dateFormat));
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
            $element.datetimepicker({ format: this.datetimeFormat }).on('dp.change', this.handleChange);;
        } else {
            $element.datepicker({
                language: abp.localization.currentLanguage.name,
                format: "dd/mm/yyyy",
                autoclose: true
            }).on('changeDate', e => {
                this.selectedDate = moment(e.date);
            }).on('clearDate', e => {
                this.selectedDate = null;
            });
        }
    }

    refreshDatePicker(): void {
        const $element = $(this.hostElement.nativeElement);
        $element.datepicker("setDate", this.strToDate(this.ngModel));
    }

    private handleChange: (any) => void = (event: any): void => {
        this.control.control.patchValue(event.date.format(this.datetimeFormat));
    }
    ngOnChanges(changes: SimpleChanges) {
        let self = this;
        // const $element = $(self.hostElement.nativeElement);
        // $element.datepicker("update");
        if (changes.ngModel.currentValue) {
            setTimeout(() => {
                self.refreshDatePicker();
            }, 0);
        }
        else{
            const $element = $(self.hostElement.nativeElement);
            // $element.datepicker("update");
        }
    }

}