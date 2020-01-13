import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InformationComponent } from '@app/fitur/information/information.component';
import { LocationComponent } from '@app/fitur/location/location.component';
import { SiteplanComponent } from '@app/fitur/siteplan/siteplan.component';
import { SocialComponent } from '@app/fitur/social/social.component';
import { GalleryComponent } from '@app/fitur/gallery/gallery.component';
import { UnittypeComponent } from '@app/fitur/unittype/unittype.component';
import { ManageProjectComponent } from '@app/fitur/manage-project/manage-project.component';
import { ProjectDetailsComponent } from "@app/fitur/project-details/project-details.component";
import { ManagePromoComponent } from '@app/fitur/manage-promo/manage-promo.component';
import { ProductSetupOBComponent } from '@app/fitur/product-setup-ob/product-setup-ob.component';
import { ProductSetupPpolComponent } from "@app/fitur/product-setup-ppol/product-setup-ppol.component";
import { AddNewProductComponent } from "@app/fitur/add-new-product/add-new-product.component";
import { SetupBatchPPComponent } from '@app/fitur/setup-batch-pp/setup-batch-pp.component';
import { ADConfigComponent } from './ad-config/ad-config.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'adConfig', component: ADConfigComponent },
                    { path: 'manage-promo', component: ManagePromoComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManagePromo' } },
                    { path: 'manage-project', component: ManageProjectComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject' } },
                    { path: 'add-new-product', component: AddNewProductComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject' } },
                    { path: 'product-ob/:id', component: ProductSetupOBComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject' } },
                    { path: 'product-ppol', component: ProductSetupPpolComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject' } },
                    { path: 'social', component: SocialComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.MasterSocialMedia' } },
                    { path: 'setup-batch-pp', component: SetupBatchPPComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.SetupBatch' } },
                    { path: 'project-details', component: ProjectDetailsComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject' } },
                    { path: 'project-details/:id', component: ProjectDetailsComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject' } },
                    { path: 'information', component: InformationComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject' } },
                    { path: 'location', component: LocationComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject' } },
                    { path: 'siteplan', component: SiteplanComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject' } },
                    { path: 'gallery', component: GalleryComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject' } },
                    { path: 'unittype', component: UnittypeComponent, data: { permission: 'Pages.Tenant.SalesWeb.WebAdmin.ManageProject' } },
                ]
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FiturRoutingModule { }
