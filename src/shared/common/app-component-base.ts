import { Injector } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { LocalizationService } from 'abp-ng2-module/src/localization/localization.service';
import { PermissionCheckerService } from 'abp-ng2-module/src/auth/permission-checker.service';
import { FeatureCheckerService } from 'abp-ng2-module/src/features/feature-checker.service';
import { NotifyService } from 'abp-ng2-module/src/notify/notify.service';
import { SettingService } from 'abp-ng2-module/src/settings/setting.service';
import { MessageService } from 'abp-ng2-module/src/message/message.service';
import { AbpMultiTenancyService } from 'abp-ng2-module/src/multi-tenancy/abp-multi-tenancy.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { PrimengDatatableHelper } from '@shared/helpers/PrimengDatatableHelper';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import {Moment} from "moment-timezone";
import * as moment from 'moment';

export class ModalProperty {
    edit: boolean
    id: number
    name: string
}

export abstract class AppComponentBase {

    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    localization: LocalizationService;
    permission: PermissionCheckerService;
    feature: FeatureCheckerService;
    notify: NotifyService;
    setting: SettingService;
    message: MessageService;
    multiTenancy: AbpMultiTenancyService;
    appSession: AppSessionService;
    primengDatatableHelper: PrimengDatatableHelper;
    ui: AppUiCustomizationService;

    constructor(injector: Injector) {
        this.localization = injector.get(LocalizationService);
        this.permission = injector.get(PermissionCheckerService);
        this.feature = injector.get(FeatureCheckerService);
        this.notify = injector.get(NotifyService);
        this.setting = injector.get(SettingService);
        this.message = injector.get(MessageService);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.appSession = injector.get(AppSessionService);
        this.ui = injector.get(AppUiCustomizationService);
        this.primengDatatableHelper = new PrimengDatatableHelper();
    }

    l(key: string, ...args: any[]): string {
        return this.ls(this.localizationSourceName, key, args);
    }

    ls(sourcename: string, key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, sourcename);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args[0].unshift(localizedText);

        return abp.utils.formatString.apply(this, args[0]);
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }

    isGrantedAny(...permissions: string[]): boolean {
        if (!permissions) {
            return false;
        }

        for (const permission of permissions) {
            if (this.isGranted(permission)) {
                return true;
            }
        }

        return false;
    }

    strToMoment(date: string, format: string = 'dd/mm/yyyy', isDatetime: boolean = false): Moment {
        let separator = date.indexOf('-') != -1 ? '-' : '/';
        let splitDate: string[];
        let formattedDate: Date;
        let splitTime: string = '';

        if(isDatetime) {
            let idxSpace = date.indexOf(' ')
            splitDate = date.substr(0, idxSpace).split(separator);
            splitTime = date.substr(idxSpace);
        } else {
            splitDate = date.split(separator);
        }
        if(format=='dd'+separator+'mm'+separator+'yyyy')
            formattedDate = new Date(splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0]+splitTime);
        else if(format=='mm'+separator+'dd'+separator+'yyyy')
            formattedDate = new Date(splitDate[2]+'-'+splitDate[0]+'-'+splitDate[1]+splitTime);
        else
            formattedDate = new Date(splitDate[0]+'-'+splitDate[1]+'-'+splitDate[2]+splitTime);

        let dateInput = moment(formattedDate);
        return dateInput;
    }

    momentToStr(date: Moment): string {
        return date.format('DD/MM/YYYY');
    }

    momentToDateTimeStr(date: Moment): string {
        return date.format('DD/MM/YYYY hh:mm:ss A');
    }
    s(key: string): string {
        return abp.setting.get(key);
    }

    strToDate(date: string, format: string = 'dd/mm/yyyy', isDatetime: boolean = false): Date {
        let separator = date.indexOf('-') != -1 ? '-' : '/';
        let splitDate: string[];
        let formattedDate: Date;
        let splitTime: string = '';

        if(isDatetime) {
            let idxSpace = date.indexOf(' ')
            splitDate = date.substr(0, idxSpace).split(separator);
            splitTime = date.substr(idxSpace);
        } else {
            splitDate = date.split(separator);
        }
        
        if(format=='dd'+separator+'mm'+separator+'yyyy')
            formattedDate = new Date(splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0]+splitTime);
        else if(format=='mm'+separator+'dd'+separator+'yyyy')
            formattedDate = new Date(splitDate[2]+'-'+splitDate[0]+'-'+splitDate[1]+splitTime);
        else
            formattedDate = new Date(splitDate[0]+'-'+splitDate[1]+'-'+splitDate[2]+splitTime);

        return formattedDate;
    }

    currencyFormattedNumber(number, thousandsSeparator = ',', decimalSeparator = '.'): string {
        let parts = number.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        return parts.join(decimalSeparator) + (parts.length === 1 ? decimalSeparator + '00' : (parts[1].length === 1 ? '0' : ''));
    }

    roundTo(n, digits) {
        if (digits === undefined) {
            digits = 0;
        }

        let multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        let test = (Math.round(n) / multiplicator);
        return +(test.toFixed(digits));
    }
}
