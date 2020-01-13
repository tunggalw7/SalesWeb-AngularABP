import { ElementRef, Input, OnInit, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ValidationService } from "@app/pponline/share/validation.service";

@Component({
    selector: 'control-message',
    template: '<div class="form-control-feedback" *ngIf="errorMessage">{{errorMessage}}</div>'
})
export class ControlMessageComponent implements OnInit {
    @Input('formGroup') private formGroup: FormGroup;
    @Input('formComponent') private formComponent: string;
    @Input('labelVal') private labelVal: string;

    private component: FormControl;
    errorMessage: string;

    constructor(private el: ElementRef) { }

    ngOnInit(): void {
        let componentName: string;
        let inputElement = null;

        if (this.formComponent !== '') {
            inputElement = this.el.nativeElement.parentElement.querySelector(this.formComponent);
        } else {
            inputElement = this.el.nativeElement.parentElement.querySelector('input');
        }

        if (inputElement) {
            componentName = inputElement.getAttribute('formControlName');
        }

        if (!componentName) {
            console.error('ControlMessageComponent: Unable to get the control name. Is the formControlName attribute set correctly?');
            return;
        }

        let control = this.formGroup.get(componentName);
        if (!(control instanceof FormControl)) {
            console.error(`ControlMessageComponent: Unable to get the FormControl from the form and the control name: ${componentName}.`);
            return;
        }

        this.component = control as FormControl;

        this.component.statusChanges.subscribe((status) => {
            this.onStatusChange(status, this.component.dirty);
        });
        this.onStatusChange(this.component.status, this.component.dirty);
    }

    onStatusChange(status: string, dirty: boolean): void {
        if (status === 'VALID' && dirty) {
            this.errorMessage = null;
        } else if (status === 'INVALID' && dirty) {
            for (let propertyName in this.component.errors) {
                if (this.component.errors.hasOwnProperty(propertyName) && this.component.dirty) {
                    this.errorMessage = ValidationService.getValidatorErrorMessage(propertyName, this.component.errors[propertyName], this.labelVal);
                }
            }
        } else {
            this.errorMessage = null;
        }
    }
}
