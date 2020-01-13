import {Directive, ElementRef, Input , Output , OnDestroy, Optional,EventEmitter } from '@angular/core';
import {NgControl,NgModel} from '@angular/forms';
import * as _ from 'lodash';

@Directive({
  selector: '[inputMask][ngModel]',
  providers: [NgModel],
  host: {
    '(ngModelChange)' : 'onInputChange($event)'
      }

})
export class InputMaskDirective {    
    @Input('inputMask')
    mask: string;

    @Input('inputMaskOptions')
    options: any;

    constructor(
        private elementRef: ElementRef,
        @Optional() private control: NgControl,private model:NgModel
    ) {}

    onInputChange(event): void {
        if (!this.control) {
        console.warn('No control for InputMaskDirective');
        return;
        }

        if (this.mask) {
            $(this.elementRef.nativeElement).inputmask(this.mask, this.options);
            $(this.elementRef.nativeElement).change(this.handleChange);
            console.log(this.elementRef.nativeElement.value);
            this.model.valueAccessor.writeValue(this.elementRef.nativeElement.value);


        } else {
            if(this.options) {
                $(this.elementRef.nativeElement).inputmask(this.options);
                $(this.elementRef.nativeElement).change(this.handleChange);
            } else {
                $(this.elementRef.nativeElement).inputmask('remove');
            }
        }
    }

    private handleChange: (any) => void = (event: any):void => {
        console.log(this.elementRef.nativeElement.value);

        this.control.control.patchValue(this.elementRef.nativeElement.value);
    }

}