import { NgModule } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import { IndexComponent } from 'app-main/index/index.component';
import { AutologinComponent } from 'app-main/autologin/autologin.component';
import { OnlineBookingStatusComponent } from './online-booking-status/online-booking-status.component';
import { SiteplanDetailComponent } from './siteplan-detail/siteplan-detail.component';
import { BookingUnitComponent } from '@requirelogin_or_not/booking-unit/booking-unit-selection.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: IndexComponent,
                data: { preload: true }
            },
            {
                path: 'promo/:domainlogin/:membercode/:ippublic',
                component: IndexComponent,
                data: { preload: true }
            },
            {
                path: 'index/:domainlogin/:membercode/:ippublic',
                component: AutologinComponent,
                data: { preload: true }
            },
            {
                path: 'project-detail/:projectId/:productId',
                loadChildren: 'app-main/project-detail/project-detail.module#ProjectDetailModule', //Lazy load main module
                data: { preload: true }
            },
            {
                path: 'online-booking-status/:status',
                component: OnlineBookingStatusComponent
            },
            {
                path: 'siteplan-detail/:projectId/:projectInfoId',
                component: SiteplanDetailComponent,
                data: { preload: true }
            },
            { 
                path: 'booking-unit/:projectID/:clusterid/:unitNo/:unitCode/:unitID/:ppNo/:psCode', 
                component: BookingUnitComponent 
            },
            { 
                path: 'booking-unit/:projectID/:clusterid/:clusterName/:unitNo/:unitCode/:unitID/:ppNo/:psCode', 
                component: BookingUnitComponent 
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppMainRoutingModule { }
