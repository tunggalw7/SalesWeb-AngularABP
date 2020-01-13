import {Directive, ElementRef, Input, OnDestroy, Optional} from '@angular/core';
import {NgControl} from '@angular/forms';
import * as _ from 'lodash';

@Directive({
  selector: '[inputMask]',
})
export class InputMaskDirective {    
    @Input('inputMask')
    mask: string;

    @Input('inputMaskOptions')
    options: any;

    constructor(
        private elementRef: ElementRef,
        @Optional() private control: NgControl,
    ) {}

    ngOnChanges(): void {
        if (!this.control) {
        console.warn('No control for InputMaskDirective');
        return;
        }
        
        if (this.mask) {
            $(this.elementRef.nativeElement).inputmask(this.mask, this.options);
            $(this.elementRef.nativeElement).change(this.handleChange);
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
        this.control.control.patchValue(this.elementRef.nativeElement.value);
    }

}