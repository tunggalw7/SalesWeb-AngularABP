import { Injectable, Component } from '@angular/core';
import { AppMenuItem } from './app-menu-item';
import { AppMenu } from './app-menu';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';

@Injectable()
export class AppNavigationService {

    constructor(private _permissionService: PermissionCheckerService) {

    }

    getMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [
            new AppMenuItem('Dashboard', 'Pages.Tenant.Dashboard', 'flaticon-line-graph', '/app/sales-portal/dashboard'),
            new AppMenuItem('View Project & Promotion', 'Pages.Tenant.SalesWeb.ViewProjectPromo', 'flaticon-line-graph', '/app/main/dashboard'),
            new AppMenuItem('Customer', 'Pages.Tenant.SalesWeb.Customer', 'flaticon-users', '/app/sales-portal/customer'),
            new AppMenuItem('Web Admin', 'Pages.Tenant.SalesWeb.WebAdmin', 'flaticon-interface-8', '', [
                new AppMenuItem('Master Social Media', 'Pages.Tenant.SalesWeb.WebAdmin.MasterSocialMedia', 'flaticon-interface-8', '/app/fitur/social'),
                new AppMenuItem('Manage Promo', 'Pages.Tenant.SalesWeb.WebAdmin.ManagePromo', 'flaticon-interface-8', '/app/fitur/manage-promo'),
                new AppMenuItem('Manage Project', 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject', 'flaticon-interface-8', '/app/fitur/manage-project'),
                new AppMenuItem('Setup Batch Priority Pass', 'Pages.Tenant.SalesWeb.WebAdmin.SetupBatch', 'flaticon-interface-8', '/app/fitur/setup-batch-pp'),
            ]),
            new AppMenuItem('Back Office', 'Pages.Tenant.SalesWeb.BackOffice', 'flaticon-interface-8', '', [
                new AppMenuItem('Refund', 'Pages.Tenant.SalesWeb.BackOffice.Refund', 'flaticon-interface-9', '/app/pponline/refund'),
                new AppMenuItem('Input Payment', 'Pages.Tenant.SalesWeb.BackOffice.InputPayment', 'flaticon-clipboard', '/app/pponline/paymentchecking'),
                new AppMenuItem('Report', 'Pages.Tenant.SalesWeb.BackOffice.Report', 'flaticon-graphic-1', '', [
                    new AppMenuItem('Report Order', 'Pages.Tenant.SalesWeb.BackOffice.Report.ReportOrder', 'flaticon-graphic', '/app/pponline/report/reportOrder'),
                    new AppMenuItem('Report Payment', 'Pages.Tenant.SalesWeb.BackOffice.Report.ReportPayment', 'flaticon-file', '/app/pponline/report/reportPayment'),
                    new AppMenuItem('Report Refund', 'Pages.Tenant.SalesWeb.BackOffice.Report.ReportRefund', 'flaticon-file', '/app/pponline/report/reportRefund'),
                    // new AppMenuItem('Report Booking', 'Pages.Tenant.BackOffice.Report.ReportRefund', 'flaticon-file', '/app/pponline/report/reportBooking'),
                ]),
            ]),
            new AppMenuItem('Sales Portal', 'Pages.Tenant.SalesWeb.SalesPortal', 'flaticon-interface-8', '', [
                new AppMenuItem('Commission Info', 'Pages.Tenant.SalesWeb.SalesPortal.CommissionInfo', 'flaticon-interface-8', '', [
                    new AppMenuItem('My Commission', 'Pages.Tenant.SalesWeb.SalesPortal.CommissionInfo.MyCommission', 'flaticon-notes', '/app/sales-portal/commission/mycommission'),
                    new AppMenuItem('Requirement Detail', 'Pages.Tenant.SalesWeb.SalesPortal.CommissionInfo.RequirementDetail', 'flaticon-notes', '/app/sales-portal/commission/requirement-detail'),
                ]),
                new AppMenuItem('History', 'Pages.Tenant.SalesWeb.SalesPortal.History', 'flaticon-interface-8', '', [
                    new AppMenuItem('Refund', 'Pages.Tenant.SalesWeb.SalesPortal.History.Refund', 'flaticon-clock', '/app/pponline/history/history-refund'),
                    new AppMenuItem('PP Order', 'Pages.Tenant.SalesWeb.SalesPortal.History.PPOrder', 'flaticon-transport', '/app/pponline/history/orderPp'),
                    new AppMenuItem('Booking History', 'Pages.Tenant.SalesWeb.SalesPortal.History.BookingHistory', 'flaticon-list-2', '/app/main/bookingHistory'),
                ]),
            ]),
            new AppMenuItem('Administration', 'Pages.Administration', 'flaticon-interface-8', '', [
                new AppMenuItem('OrganizationUnits', 'Pages.Administration.OrganizationUnits', 'flaticon-map', '/app/admin/organization-units'),
                new AppMenuItem('Roles', 'Pages.Administration.Roles', 'flaticon-suitcase', '/app/admin/roles'),
                new AppMenuItem('SYS Roles', 'Pages.Administration.Roles.Edit', 'flaticon-browser', '/app/admin/sys-roles'),
                new AppMenuItem('SYS Closing', '', 'flaticon-browser', '/app/admin/sys-closing'),
                new AppMenuItem('User Unit Status', '', 'flaticon-notes', '/app/admin/roles-unit-status'),
                new AppMenuItem('Users', 'Pages.Administration.Users', 'flaticon-users', '/app/admin/users'),
                new AppMenuItem('Languages', 'Pages.Administration.Languages', 'flaticon-tabs', '/app/admin/languages'),
                new AppMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', 'flaticon-folder-1', '/app/admin/auditLogs'),
                new AppMenuItem('AD Configuration', '', 'flaticon-users', '/app/fitur/adConfig'),
                new AppMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', 'flaticon-lock', '/app/admin/maintenance'),
                new AppMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement', 'flaticon-refresh', '/app/admin/subscription-management'),
                new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', 'flaticon-medical', '/app/admin/ui-customization'),
                new AppMenuItem('Settings', 'Pages.Administration.Host.Settings', 'flaticon-settings', '/app/admin/hostSettings'),
                new AppMenuItem('Settings', 'Pages.Administration.Tenant.Settings', 'flaticon-settings', '/app/admin/tenantSettings')
            ]),
            // new AppMenuItem('DemoUiComponents', 'Pages.DemoUiComponents', 'flaticon-shapes', '/app/admin/demo-ui-components')
        ]);
    }

    checkChildMenuItemPermission(menuItem): boolean {

        for (let i = 0; i < menuItem.items.length; i++) {
            let subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName && this._permissionService.isGranted(subMenuItem.permissionName)) {
                return true;
            }

            if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            } else if (!subMenuItem.permissionName) {
                return true;
            }
        }

        return false;
    }
}
