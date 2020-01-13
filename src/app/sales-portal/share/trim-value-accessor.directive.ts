import {
    Directive, Provider, forwardRef, Renderer, ElementRef, Renderer2, AfterViewInit, Output,
    EventEmitter
} from '@angular/core';
import {DefaultValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator} from '@angular/forms';

const FORMAT_CPF_VALUE_ACCESSOR = { provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TrimValueAccessor),
    multi: true
};

@Directive({
    selector: 'input[type=text]',
    host: {
        '(input)': 'input($event.target.value)',
        '(blur)': 'blur($event.target.value)',
        '(keypress)': 'keypress($event)',
        '(submit)': 'submit($event.target.value)'
    },
    providers: [FORMAT_CPF_VALUE_ACCESSOR]
})
export class TrimValueAccessor extends DefaultValueAccessor implements AfterViewInit  {
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

    ngAfterViewInit() { }

    blur(value: string) {
        // Write back to model
        if (value) {
            // value = value.toLowerCase();
            //write formatted to to control view
            (<any>this)._elementRef.nativeElement.value = value.trim();
            this.ngModelChange.emit(value.trim());
        }
        this.onTouched();
    }

    keypress(event) {
        let code = event.keyCode || event.which;
        if (code === 32 && event.target.value === '') { //space
            return false;
        }
    }

    input(value: string) {
        // Write back to model
        if (value) {
            // value = value.toLowerCase();
            //write formatted to to control view
            // (<any>this)._elementRef.nativeElement.value = value.trim();
        }
        this.onChange(value);
    }

    submit(value: string) {
        if (value) {
            (<any>this)._elementRef.nativeElement.value = value.trim();
            this.ngModelChange.emit(value.trim());
        }
    }

    writeValue(value: any): void {
        // Write to view
        // if (value) {
        //     value = value.toUpperCase();
        // }
        super.writeValue(value);
    }
}
