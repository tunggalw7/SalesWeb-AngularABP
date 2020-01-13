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

    moneySeparatorMask = {prefix:'Rp. ', 'alias': 'decimal', 'groupSeparator': ',', 'autoGroup': true, 'digits': 2, 'digitsOptional': false,
    'placeholder': '0.00', rightAlign : true, clearMaskOnLostFocus: !1, 'autoUnmask': true, 'removeMaskOnSubmit': true};

    moneySeparatorMask2 = {
        'alias': 'decimal',
        'radixPoint': ',',
        'groupSeparator': '.',
        'autoGroup': true,
        'digits': 0,
        'digitsOptional': false,
        'rightAlign': false,
        'placeholder': '0'
    };

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
            if (this.mask === "idr") {
                $(this.elementRef.nativeElement).inputmask(this.moneySeparatorMask2);
            } else if (this.mask === "npwp") {
                this.options = {mask: "99.999.999.9-999.999", placeholder: "x"};
                $(this.elementRef.nativeElement).inputmask(this.mask, this.options);
            } else {
                $(this.elementRef.nativeElement).inputmask(this.mask, this.options);
            }
            $(this.elementRef.nativeElement).change(this.handleChange);
        }    {
            if (this.options) {
                $(this.elementRef.nativeElement).inputmask(this.options);
                $(this.elementRef.nativeElement).change(this.handleChange);
            } else {
                $(this.elementRef.nativeElement).inputmask('remove');
            }
        }
    }

    private handleChange: (any) => void = (event: any): void => {
        this.control.control.patchValue(this.elementRef.nativeElement.value);
    }

}