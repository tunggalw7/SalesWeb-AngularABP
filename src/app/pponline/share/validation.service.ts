export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any, label?: string) {
        let config = {
            'required'  : `${label} is required.`,
            'email'     : 'Please enter a valid email address.',
            'emailcomplete'     : 'Please enter a valid email address.',
            'min'       : `The lowest value of ${label.toLowerCase()} is ${validatorValue.min}.`,
            'max'       : `The highest value of ${label.toLowerCase()} is ${validatorValue.max}.`,
            'minlength' : `Please enter at least ${validatorValue.requiredLength} characters.`,
            'maxlength' : `Please enter at most ${validatorValue.requiredLength} characters.`,
            'alphanumaddr'  : `Please enter only alphabets, numeric or character(- . /).`,
            'alphanum'  : `Please enter only alphabets or numeric.`,
            'alpha'     : `Please enter only alphabets.`,
            'num'       : `Please enter only digits.`,
            'fax'       : `Please enter a valid fax number.`,
        };

        let errorMessage: string = config[validatorName] ? config[validatorName] : `${label} invalid`;
        return errorMessage;
    }

    static emailCompleteValidator(input) {
        let regex = new RegExp(/^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}$/);
        if (regex.test(input.value)) {
            return null;
        } else {
            return { 'emailcomplete': true };
        }
    }

    static alphaNumAddressValidator(input) {
        let regex = new RegExp(/^[a-zA-Z0-9-.\/]+( [a-zA-Z0-9-.\/]+)*$/);
        if (regex.test(input.value)) {
            return null;
        } else {
            return { 'alphanumaddr': true };
        }
    }

    static alphaNumValidator(input) {
        let regex = new RegExp(/^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/);
        if (regex.test(input.value)) {
            return null;
        } else {
            return { 'alphanum': true };
        }
    }

    static alphaValidator(input) {
        let regex = new RegExp(/^[a-zA-Z]+( [a-zA-Z]+)*$/);
        if (regex.test(input.value)) {
            return null;
        } else {
            return { 'alpha': true };
        }
    }

    static numValidator(input) {
        let regex = new RegExp(/^[0-9]*$/);
        if (regex.test(input.value)) {
            return null;
        } else {
            return { 'num': true };
        }
    }

    static nanValidator(input){
        return isNaN(input.value)? {'nan':true}:null
    }

    static faxValidator(input) {
        let regex = new RegExp(/^(\+?\d{1,}(\-?)\d*(\-?)\(?\d{2,}\)?(\-?)\d{3,}\d{3,})$/);
        if (regex.test(input.value)) {
            return null;
        } else {
            return { 'fax': true };
        }
    }
}
