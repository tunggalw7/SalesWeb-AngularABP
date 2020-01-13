import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { RegisterCustomerComponent } from './register-customer/register-customer.component';
import { UpdateCustomerComponent } from './update-customer/update-customer.component';
import { BookingUnitComponent } from '@requirelogin_or_not/booking-unit/booking-unit-selection.component';
import { VerifyComponent } from './booking-unit/booking-unit-verify.component';
import { ConfirmComponent } from './booking-unit/booking-unit-confirm.component';
import { FinishConfirmComponent } from './booking-unit/booking-unit-finish.component';
import { CartComponent } from './cart/cart.component';
import { DiagrammaticComponent } from '@app/main/diagrammatic/diagrammatic.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.SalesWeb.ViewProjectPromo' } },
                    { path: 'dashboard/:projectID', component: DashboardComponent, data: { permission: 'Pages.Tenant.SalesWeb.ViewProjectPromo' } },
                    { path: 'bookingHistory', component: BookingHistoryComponent, data: { permission: 'Pages.Tenant.SalesWeb.SalesPortal.History.BookingHistory' } },
                    { path: 'registerCustomer', component: RegisterCustomerComponent, data: { permission: 'Pages.Tenant.SalesWeb.Customer.CreateCustomer' } },
                    { path: 'registerCustomer/:idNo/:name/:birthDate/:bypp', component: RegisterCustomerComponent, data: { permission: 'Pages.Tenant.SalesWeb.Customer.CreateCustomer' } },
                    { path: 'registerCustomer/:idNo/:name/:birthDate/:potentialID/:bypp', component: RegisterCustomerComponent, data: { permission: 'Pages.Tenant.SalesWeb.Customer.CreateCustomer' } },
                    { path: 'registerCustomer/:custID/:potential', component: RegisterCustomerComponent, data: { permission: 'Pages.Tenant.SalesWeb.Customer.CreateCustomer' } },
                    { path: 'updateCustomer/:psCode/:bypp', component: UpdateCustomerComponent, data: { permission: 'Pages.Tenant.SalesWeb.Customer.EditCustomer' } },
                    // { path: 'updateCustomer/:psCode', component: UpdateCustomerComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },

                    { path: 'booking-unit/:projectID/:clusterid/:unitNo/:unitCode/:unitID', component: BookingUnitComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },
                    { path: 'booking-unit/:projectID/:clusterid/:unitNo/:unitCode/:unitID/:ppNo/:psCode', component: BookingUnitComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },
                    { path: 'booking-unit/:customerCode/:customerName/:projectID/:clusterid/:unitNo/:unitCode/:unitID/:ppNo/:psCode', component: BookingUnitComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },
                    { path: 'booking-unit/:custID/:projectID/:clusterid/:unitNo/:unitCode/:unitID/:ppNo/:psCode', component: BookingUnitComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },
                    { path: 'booking-unit-verify/:bypp', component: VerifyComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },
                    { path: 'booking-unit-confirm', component: ConfirmComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },
                    { path: 'booking-unit-finish/:orderID', component: FinishConfirmComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },
                    { path: 'cart', component: CartComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },
                    { path: 'cart/:customerCode/:customerName', component: CartComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },
                    { path: 'cart/:custID', component: CartComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },

                    { path: 'available-unit', component: DiagrammaticComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },
                    { path: 'available-unit/:projectID/:clusterID', component: DiagrammaticComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },
                    { path: 'available-unit/:projectID/:clusterID/:unitType', component: DiagrammaticComponent, data: { permission: 'Pages.Tenant.SalesWeb.OnlineBooking.AvailableUnit' } },

                    // {
                    //     path: 'rnd',
                    //     loadChildren: 'app/main/rnd/rnd.module#RnDModule',
                    //     data: { preload: true } //Lazy load main module
                    // },
                ]
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
