import { Directive, ElementRef, Input, Output, OnDestroy, Optional, EventEmitter } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';

@Directive({
    selector: '[date-picker]',
    providers: [NgModel],
})
export class DatePickerDirective {
    @Input('options')
    options: any;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    @Output() dateChanged: EventEmitter<any> = new EventEmitter();

    constructor(
        private elementRef: ElementRef,
        @Optional() private control: NgControl,
    ) { }

    ngOnInit() {

    }
    ngOnChanges(): void {
        if (!this.control) {
            console.warn('No control');
            return;
        }

        // default date picker
        $(this.elementRef.nativeElement).datepicker(this.options);
        $(this.elementRef.nativeElement).datepicker().on('dp.change', this.handleChange)
    }

    private handleChange: (any) => void = (event: any): void => {
        let dateInput = moment(event.date.format('YYYY-MM-DD'));
        event.dateInput = dateInput
        this.control.control.patchValue(event.dateInput.format('MM/DD/YYYY'));
        this.ngModelChange.emit(event.dateInput.format('MM/DD/YYYY'));
        this.dateChanged.emit(event.dateInput.format('MM/DD/YYYY'));
    }

}