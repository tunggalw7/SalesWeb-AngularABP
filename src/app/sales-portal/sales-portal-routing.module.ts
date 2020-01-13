import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '@app/sales-portal/dashboard/dashboard.component';
import { TaskListComponent } from '@app/sales-portal/task-list/task-list.component';
import { MyCommissionComponent } from '@app/sales-portal/my-commission/my-commission.component';
import { RequirementDetailComponent } from '@app/sales-portal/requirement-detail/requirement-detail.component';
import { CustomerComponent } from '@app/sales-portal/customer/customer.component';
import { ProfileComponent } from '@app/sales-portal/profile/profile.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    // { path: 'dashboard/:domainlogin/:membercode/:ippublic', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'task-list', component: TaskListComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'profile', component: ProfileComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'commission/mycommission', component: MyCommissionComponent, data: { permission: '' } },
                    { path: 'commission/requirement-detail', component: RequirementDetailComponent, data: { permission: '' } },
                    { path: 'customer', component: CustomerComponent, data: { permission: 'Pages.Tenant.SalesWeb.Customer' } }
                ]
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SalesPortalRoutingModule { }
