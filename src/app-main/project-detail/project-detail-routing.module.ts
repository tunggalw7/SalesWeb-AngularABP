import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectDetailComponent } from 'app-main/project-detail/project-detail.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ProjectDetailComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ProjectDetailRoutingModule { }
