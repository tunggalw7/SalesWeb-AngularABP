import { Component, AfterViewInit, Injector, ViewEncapsulation, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TenantDashboardServiceProxy, ProjectServiceProxy, AdminProductSetupServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppSalesSummaryDatePeriod } from '@shared/AppEnums';
declare let d3, Datamap: any;
import * as _ from 'lodash';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./dashboard.component.css'],
    animations: [appModuleAnimation()]
})
export class DashboardComponent extends AppComponentBase implements AfterViewInit {
    data_projects: any = [];
    collections: any = [];
    userID: number;
    projectName;
    subtitle;
    constructor(
        injector: Injector,
        private _dashboardService: TenantDashboardServiceProxy,
        private _projectService: ProjectServiceProxy,
        private _sessionService: AbpSessionService,
        private _activeroute: ActivatedRoute,
        private _adminProductService: AdminProductSetupServiceProxy,
    ) {
        super(injector);
        this.userID = this._sessionService.userId;
    }
    poromotionLoading = false;
    project: number;
    projectLoading: boolean = false;
    _projectList: any = [];

    ngOnInit(): void {
        // this._activeroute.params.subscribe(params => {
        //     console.log('params promo',params);
        //     if (params.projectID!=undefined) {
        //         this.getProjectDetail(params.projectID);
        //         this.poromotionLoading = true;
        //         this._projectService.getListPromotion(parseInt(params.projectID))
        //             .finally(() => {
        //                 setTimeout(() => { 
        //                     this.poromotionLoading = false;
        //                 }, 1500);
        //             })
        //             .subscribe(result => {
        //                 console.log('result promotion', result);
        //                 for(let i = 0; i < result.items.length; i++) {
        //                     // this.getListProjectInfo(result.items[i].projectID, result.items[i].targetURL);
        //                     this.getListProjectInfo(result.items[i].projectID, result.items[i].promoFile, result.items[i].targetURL);
        //                 }
        //             });
        //     }
        // });
        if (localStorage.getItem('promo_projectID') != undefined) {
            this.projectChange(parseInt(localStorage.getItem('promo_projectID')));
            // this.getProjectDetail(localStorage.getItem('promo_projectID'));
            // this.poromotionLoading = true;
            // this._projectService.getListPromotion(parseInt(localStorage.getItem('promo_projectID')))
            //     .finally(() => {
            //         setTimeout(() => {
            //             this.poromotionLoading = false;
            //         }, 1500);
            //     })
            //     .subscribe(result => {
            //         console.log('result promotion', result);
            //         for (let i = 0; i < result.items.length; i++) {
            //             // this.getListProjectInfo(result.items[i].projectID, result.items[i].targetURL);
            //             this.getListProjectInfo(result.items[i].projectID, result.items[i].promoFile, result.items[i].targetURL);
            //         }
            //     });
        }
        else{
            this.projectChange('');
        }
        // this.poromotionLoading=true;
        // this._projectService.getListPromotion(undefined)
        //     .finally(() => {
        //         setTimeout(() => {
        //             this.poromotionLoading = false;
        //         }, 1500);
        //         console.log(this.data_projects);
        //     })
        //     .subscribe(result => {
        //         console.log('result promotion', result);
        //         this.data_projects=result.items
        //         // result.forEach((element,i) => {
        //         //     this.getListProjectInfo(result[i].projectID, result[i].promoFile, result[i].targetURL);
        //         // });
                
        //     });
        this.getProjectDropdown();

    }
    projectChange(event){
        if(!isNaN(event)){
            this.poromotionLoading = true;
            this._projectService.getListPromotion(event)
            .finally(() => {
                setTimeout(() => {
                    this.poromotionLoading = false;
                }, 1500);
                console.log(this.data_projects);
            })
            .subscribe(result => {
                console.log('result promotion', result);
                this.data_projects=result.items
                // result.items.forEach((element,i) => {
                    
                // });
            });
        }
        else{
            this.poromotionLoading = true;
            this._projectService.getListPromotion(undefined)
            .finally(() => {
                setTimeout(() => {
                    this.poromotionLoading = false;
                }, 1500);
                console.log(this.data_projects);
            })
            .subscribe(result => {
                console.log('result promotion', result);
                this.data_projects=result.items
                // result.forEach((element,i) => {
                //     this.getListProjectInfo(result[i].projectID, result[i].promoFile, result[i].targetURL);
                // });
            });
        }
    }
    getProjectDetail(projectID) {
        this._projectService.getDetailListProject(parseInt(projectID))
            .finally(() => {
            })
            .subscribe(result => {
                this.projectName = result.projectName;
                this.subtitle = 'List promotion of this project';
            });
    }
    getProjectDropdown() {
        this.projectLoading = true;
        this._adminProductService.getListProjectResult()
            .finally(() => {
                this.projectLoading = false;
                this.refreshDropdown();
            })
            .subscribe(result => {
                this._projectList = result.items;
            })
    }
    refreshDropdown() {
        setTimeout(() => {
            $('.project').selectpicker('refresh');
            this.projectLoading = false;
        }, 3000);
    }
    ngAfterViewInit(): void {
        // this.getDashboardStatisticsData(AppSalesSummaryDatePeriod.Daily);
        // this.regionalStatsWorldMap.draw(true);
        // this.memberActivityTable.init();

    }
    
    getListProjectInfo(projectID,urlImage, targetURL): void {
        // this._projectService.getListProjectInfo(projectID)
        //     .subscribe((result) => {
        //         if (!result.items.length) {
        //             this.collections.push({
        //                 "isLoadedInfo": false,
        //                 "projectID": projectID,
        //                 "imgURL": urlImage,
        //                 "targetURL": targetURL
        //             });
        //         } else {
        //             this.collections.push({
        //                 "isLoadedInfo": true,
        //                 "projectID": projectID,
        //                 "data": result.items[0],
        //                 "imgURL": urlImage,
        //                 "targetURL": targetURL
        //             });
        //         }
        //     });
    }

    redirectToProjectDetail(url): void {
        console.log('url', url);
        var exturl = "http://"+url.toString();
        // window.location.href=url;
        window.open(exturl, "_blank");
    }
}


