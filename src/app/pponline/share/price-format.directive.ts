import {
    Directive, Provider, forwardRef, Renderer, ElementRef, Renderer2, AfterViewInit, Output,
    EventEmitter, Injector
} from '@angular/core';
import {DefaultValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator} from '@angular/forms';
import {AppComponentBase} from "@shared/common/app-component-base";

@Directive({
    selector: 'span.price'
})
export class PriceFormatDirective extends AppComponentBase implements AfterViewInit  {
    ngAfterViewInit() {
        let innerHtml = $(this.elementRef.nativeElement).html();
        let num = parseFloat(innerHtml.toString());
        if (!isNaN(num) && /[a-z]/i.test(innerHtml) === false) {
            // $(this.elementRef.nativeElement).addClass('pull-right');
            $(this.elementRef.nativeElement).html('<span class="pull-left">Rp. </span><span class="pull-right">' +
                this.currencyFormattedNumber(this.roundTo(num, 2).toString(), '.', ',') + '</span>');
        }
    }

    constructor(
        injector: Injector,
        private elementRef: ElementRef
    ) {
        super(injector);
    }

}
