import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

import { AbpModule, ABP_HTTP_PROVIDER } from 'abp-ng2-module/src/abp.module';

import { AppModule } from '@app/app.module';
// import { AppSalesPortalModule } from '@app-salesportal/app-salesportal.module';

import { CommonModule } from '@shared/common/common.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { RootRoutingModule } from 'root-routing.module';

import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies';

import { RootComponent } from 'root.component';
import { AppPreBootstrap } from 'AppPreBootstrap';

import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';

import * as _ from 'lodash';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { EasyPieChartModule } from 'ng2modules-easypiechart';
import { DataTableModule } from 'primeng/primeng';
import { FileUploadModule } from 'ng2-file-upload';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DataTablesModule } from 'angular-datatables';
import {ReportOrderViewComponent} from "@app/pponline/report/report-order/report-order-view.component";
import {ReportPaymentViewComponent} from "@app/pponline/report/report-payment/report-payment-view.component";
import {ReportRefundViewComponent} from "@app/pponline/report/report-refund/report-refund-view.component";

// import {AppSalesPortalModule} from "@app-salesportal/app-salesportal.module";


export function appInitializerFactory(injector: Injector) {
    return () => {
        abp.ui.setBusy();

        handleLogoutRequest(injector.get(AppAuthService));

        return new Promise<boolean>((resolve, reject) => {
            AppPreBootstrap.run(() => {
                let appSessionService: AppSessionService = injector.get(AppSessionService);
                let ui: AppUiCustomizationService = injector.get(AppUiCustomizationService);
                appSessionService.init().then(
                    (result) => {

                        //Css classes based on the layout
                        let appUiCustomizationService: AppUiCustomizationService = injector.get(AppUiCustomizationService);
                        if (abp.session.userId) {
                            $('body').attr('class', appUiCustomizationService.getAppModuleBodyClass());
                        } else {
                            $('body').attr('class', appUiCustomizationService.getAccountModuleBodyClass());
                        }

                        //tenant specific custom css
                        if (appSessionService.tenant && appSessionService.tenant.customCssId) {
                            $('head').append('<link id="TenantCustomCss" href="' + AppConsts.remoteServiceBaseUrl + '/TenantCustomization/GetCustomCss?id=' + appSessionService.tenant.customCssId + '" rel="stylesheet"/>');
                        }

                        //set og share image meta tag
                        if (!appSessionService.tenant || !appSessionService.tenant.logoId) {
                            $('meta[property=og\\:image]').attr('content', window.location.origin + "/assets/common/images/app-logo-on-" + ui.getAsideSkin() + ".png");
                        } else {
                            $('meta[property=og\\:image]').attr('content', AppConsts.remoteServiceBaseUrl + '/TenantCustomization/GetLogo?id=' + appSessionService.tenant.logoId);
                        }

                        abp.ui.clearBusy();

                        if (abp.localization.currentLanguage.name) {
                            let angularLocale = convertAbpLocaleToAngularLocale(abp.localization.currentLanguage.name);
                            System.import(`@angular/common/locales/${angularLocale}.js`)
                                .then(module => {
                                    registerLocaleData(module.default);
                                    resolve(result);
                                }, reject);
                        } else {
                            resolve(result);
                        }
                    },
                    (err) => {
                        abp.ui.clearBusy();
                        reject(err);
                    }
                );
            }, resolve, reject);
        });
    };
}

export function convertAbpLocaleToAngularLocale(locale: string): string {
    if (!AppConsts.localeMappings) {
        return locale;
    }

    let localeMapings = _.filter(AppConsts.localeMappings, { from: locale });
    if (localeMapings && localeMapings.length) {
        return localeMapings[0]['to'];
    }

    return locale;
}

export function getRemoteServiceBaseUrl(): string {
    return AppConsts.remoteServiceBaseUrl;
}

export function getCurrentLanguage(): string {
    return abp.localization.currentLanguage.name;
}

function handleLogoutRequest(authService: AppAuthService) {
    let currentUrl = UrlHelper.initialUrl;
    let returnUrl = UrlHelper.getReturnUrl();
    if (currentUrl.indexOf(('account/logout')) >= 0 && returnUrl) {
        authService.logout(true, returnUrl);
    }
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppModule,
        CommonModule.forRoot(),
        AbpModule,
        ServiceProxyModule,
        RootRoutingModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        EasyPieChartModule,
        DataTableModule,
        ReactiveFormsModule,
        FileUploadModule,
        DropzoneModule,
        DataTablesModule
    ],
    declarations: [
        RootComponent,
        ReportOrderViewComponent,
        ReportPaymentViewComponent,
        ReportRefundViewComponent
    ],
    providers: [
        ABP_HTTP_PROVIDER,
        { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [Injector],
            multi: true
        },
        {
            provide: LOCALE_ID,
            useFactory: getCurrentLanguage
        }
    ],
    bootstrap: [RootComponent]
})
export class RootModule {

}
