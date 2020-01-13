import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, NavigationEnd } from '@angular/router';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import { ReportOrderViewComponent } from "@app/pponline/report/report-order/report-order-view.component";
import { ReportPaymentViewComponent } from "@app/pponline/report/report-payment/report-payment-view.component";
import { ReportRefundViewComponent } from "@app/pponline/report/report-refund/report-refund-view.component";

const routes: Routes = [
    { path: 'dashboard', redirectTo: '/app/main/dashboard', pathMatch: 'full' },
    {
        path: 'account',
        loadChildren: 'account/account.module#AccountModule', //Lazy load account module
        data: { preload: true }
    },
    {
        path: '',
        loadChildren: 'app-main/app-main.module#AppMainModule', //Lazy load account module
        data: { preload: true }
    },
    {
        path: 'reportOrderView',
        children: [
            { path: '', component: ReportOrderViewComponent },
        ]
    },
    {
        path: 'reportPaymentView',
        children: [
            { path: '', component: ReportPaymentViewComponent },
        ]
    },
    {
        path: 'reportRefundView',
        children: [
            { path: '', component: ReportRefundViewComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule {
    constructor(
        private router: Router,
        private _uiCustomizationService: AppUiCustomizationService) {
        router.events.subscribe((event: NavigationEnd) => {
            setTimeout(() => {
                this.toggleBodyCssClass(event.url);
            }, 0);
        });
    }

    toggleBodyCssClass(url: string): void {
        if (url) {
            if (url === '/') {
                if (abp.session.userId > 0) {
                    $('body').attr('class', this._uiCustomizationService.getAppModuleBodyClass());
                } else {
                    $('body').attr('class', this._uiCustomizationService.getAccountModuleBodyClass());
                }
            }

            if (url.indexOf('/account/') >= 0) {
                $('body').attr('class', this._uiCustomizationService.getAccountModuleBodyClass());
            } else {
                $('body').attr('class', this._uiCustomizationService.getAppModuleBodyClass());
            }
        }
    }

    getSetting(key: string): string {
        return abp.setting.get(key);
    }
}
