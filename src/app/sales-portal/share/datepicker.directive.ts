import {Directive, ElementRef, Input, OnDestroy, Optional} from '@angular/core';
import {NgControl} from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';

@Directive({
  selector: '[date-picker]',
})
export class DatePickerDirective {    
    @Input('options')
    options: any;

    constructor(
        private elementRef: ElementRef,
        @Optional() private control: NgControl,
    ) {}

    ngOnInit() {
  
    }
    ngOnChanges(): void {
        if (!this.control) {
            console.warn('No control');
            return;
        }
        
        // default date picker
        $(this.elementRef.nativeElement).datetimepicker(this.options);
        $(this.elementRef.nativeElement).datetimepicker().on('dp.change', this.handleChange)              
    }

    private handleChange: (any) => void = (event: any):void => {
        //this.control.control.patchValue(this.elementRef.nativeElement.value);
        let dateInput = moment(event.date.format('YYYY-MM-DDTHH:mm:ssZ'));
        event.dateInput = dateInput
        this.control.control.patchValue(event.dateInput.format('MM/DD/YYYY'));
    }

}