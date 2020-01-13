import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ComponentFactoryResolver, ContentChild, ElementRef, Input, OnInit,
    ViewContainerRef
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {ControlMessageComponentQ} from 'app/sales-portal/share/control-message.component';

@Component({
    selector: '[formValidationStyle]',
    template: '<ng-content></ng-content>',
    entryComponents: [
        ControlMessageComponentQ
    ]
})
export class FormValidationStyleDirective implements AfterViewInit, AfterContentInit {
    static VALID_STYLE = 'has-success';
    static INVALID_STYLE = 'has-danger';

    @ContentChild('hasMessage', {read: ViewContainerRef}) other;
    @Input('formValidationStyle') private formGroup: FormGroup;
    @Input('formComponent') private formComponent = '';
    private component: FormControl;
    private inputElement;
    componentRef: any;

    constructor(
        private el: ElementRef,
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {

    }

    ngAfterViewInit(): void {
        let componentName: string;

        this.inputElement = null;
        if (this.formComponent !== '') {
            this.inputElement = this.el.nativeElement.querySelector(this.formComponent);
        } else {
            this.inputElement = this.el.nativeElement.querySelector('input');
        }
        if (this.inputElement) {
            componentName = this.inputElement.getAttribute('formControlName');
        }
        if (!componentName) {
            console.error('FormValidationStyleDirective: Unable to get the control name. Is the formControlName attribute set correctly?');
            return;
        }

        let control = this.formGroup.get(componentName);
        if (!(control instanceof FormControl)) {
            console.error(`FormValidationStyleDirective: Unable to get the FormControl from the form and the control name: ${componentName}.`);
            return;
        }
        this.component = control as FormControl;

        this.component.statusChanges.subscribe((status) => {
            this.onStatusChange(status, this.component.dirty);
        });
        this.onStatusChange(this.component.status, this.component.dirty);
    }

    ngAfterContentInit() {
        //Dynamically create a control message and attach it to the component.
        setTimeout(() => {
            if (this.other) {
                let factory = this.componentFactoryResolver.resolveComponentFactory(ControlMessageComponentQ);
                this.componentRef = this.other.createComponent(factory);
                let instance = this.componentRef.instance;
                instance.formGroup = this.formGroup;
            }
        }, 1);
    }

    onStatusChange(status: string, dirty: boolean): void {
        let cl = this.el.nativeElement.classList;

        if (status === 'VALID' && dirty) {
            cl.add(FormValidationStyleDirective.VALID_STYLE);
            cl.remove(FormValidationStyleDirective.INVALID_STYLE);
        } else if (status === 'INVALID' && dirty) {
            cl.add(FormValidationStyleDirective.INVALID_STYLE);
            cl.remove(FormValidationStyleDirective.VALID_STYLE);
        } else {
            cl.remove(FormValidationStyleDirective.VALID_STYLE);
            cl.remove(FormValidationStyleDirective.INVALID_STYLE);
        }
    }
}
