import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ProjectServiceProxy,
    // DiagramaticServiceProxy,
    // TransactionServiceProxy,
    TokenAuthServiceProxy,

    // AdminServiceProxy,
    AdminManageProjectServiceProxy,
    MsProjectServiceProxy,
    GetListManageProjectResultDto,
    // GetKeyFeaturesResultDto,
    GetListProductByProjectResultDto,
    // GetListProjectGalleryResultDto,
    // GetListSocialMediaProjectResultDto
} from '@shared/service-proxies/service-proxies';
import { DomSanitizer } from '@angular/platform-browser';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
// import { NgxGalleryOptions, NgxGalleryImage } from "@node_modules/ngx-gallery";
import { Paginator } from "primeng/primeng";
import { DataTable } from 'primeng/components/datatable/datatable';

@Component({
    templateUrl: './siteplan-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../assets/project/app/css/bootstrap.css',
        '../../assets/project/app/css/style.css',
        // '../../assets/project/app/css/swiper.css',
        '../../assets/project/app/css/dark.css',
        '../../assets/project/app/css/font-icons.css',
        // '../../assets/project/app/css/animate.css',
        // '../../assets/project/app/css/magnific-popup.css',
        '../../assets/project/app/css/responsive.css',
    ]
})
export class SiteplanDetailComponent extends AppComponentBase {
    // @ViewChild('dataTable') dataTable: DataTable;
    // @ViewChild('paginator') paginator: Paginator;

    // lat: number = 51.678418;
    // lng: number = 7.809007;

    
    // project_description;
    // project_feature;
    // grid_feature;
    // spin_popup;
    // spin_popup_tb;
    // project_gallery = [];
    // project_siteplan;
    // project_siteplan_desc;
    // project_office: any = [];
    // project_location: any = [];
    // dataDetailTower: any = [];
    // dataDetailCluster;
    // getOptionDetailCluster: any = [];
    // dataUnitType: any = [];
    // PopUpCluster = [];
    // PopUpUnit: any = [];
    // url;
    // filterCluster;
    // filterByName;
    // google: any;
    // spin_unit = false;
    // show_unit = true;
    // reservedBy;
    // dataCart: any = [];
    // image_promo;
    

    
    // projectInfoId;
    
    // facebook;
    // twitter;
    // instagram;

    // xcenter;
    // firstTower;
    // towerList: any = [];

    // isActivePropDetail = false;
    // isActiveLocation = false;
    // isActiveUnitType = false;
    // isActiveTowerCluster = false;
    // isActiveGallery = false;
    // isActiveDesc = false;
    // isActiveMarketing = false;
    // isActiveSosmed = false;
    // isActiveKey = false;
    

    // detailProject: any;
    
    // detailTowerCluster = [];
    // detailKeyFeatures: GetKeyFeaturesResultDto[];
    // detailUnitType: any = [];
    // detailGallery: GetListProjectGalleryResultDto[];
    // detailSosmed: GetListSocialMediaProjectResultDto[];
    

    // galleryOptions: NgxGalleryOptions[];
    // galleryImages: NgxGalleryImage[] = [];
    // loadingDDLCluster: boolean;
    
    // clusterList = [];
    // clusterItems = [];
    // clusterSettings = {};
    
    
    // productSettings = {};
    // objClusterList = [];


    sub;
    productId;
    isOBActive = false;
    isPPOlActive = false;
    isActiveSite = false;
    productItems = [];
    productsList = [];
    model: any = [];
    hasPermissionMemberActivation;
    detailInfo = new GetListManageProjectResultDto();
    objProductList: GetListProductByProjectResultDto[];

    constructor(injector: Injector,
        private _script: ScriptLoaderService,
        private _activeroute: ActivatedRoute,
        // private _adminService: AdminServiceProxy,
        private _adminManageProjectService: AdminManageProjectServiceProxy,
        private _msProjectService: MsProjectServiceProxy,
        private _projectService: ProjectServiceProxy,
        public sanitizer: DomSanitizer,
        private _authService: AppAuthService,
        public _appSessionService: AppSessionService,
        private _tokenAuthServiceProxy: TokenAuthServiceProxy) {
        super(injector);

        // localStorage.removeItem("origin");
        localStorage.removeItem("projectCluster");
        // localStorage.setItem("origin", JSON.stringify({
        //     "remoteServiceBaseUrl": this.remoteServiceBaseUrl,
        //     "appBaseUrl": this.appBaseUrl
        // }));
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this._script.load('body', 'assets/project/app/js/functions.js');
            this._script.load('body', 'assets/project/app/js/jquery.js');
            this._script.load('body', 'assets/project/app/js/plugins.js');
            this._script.load('body', 'assets/project/app/js/project.js');
            this._script.load('head', 'assets/project/app/js/getipaddress.js');

            /* Start : Map Svg - Script */
            // this._script.load('head', 'assets/mapsvg/js/jquery.js');
            // this._script.load('head', 'assets/mapsvg/js/jquery.mousewheel.min.js');
            // this._script.load('head', 'assets/mapsvg/js/jquery.nanoscroller.min.js');
            // this._script.load('head', 'assets/mapsvg/js/mapsvg.min.js');
            // this._script.load('body', 'assets/mapsvg/js/global-functions.js');
            // this._script.load('body', 'assets/mapsvg/js/custom.js');
            /* End : Map Svg - Script */
        }, 0);
    }

    paramsProjectId;
    paramsProjectInfoId;
    ngOnInit(): void {
        this.sub = this._activeroute.params.subscribe(params => {
            if ((params.projectId != undefined) || (params.projectInfoId != undefined)) {
                this.paramsProjectId = params.projectId;
                this.paramsProjectInfoId = params.projectInfoId;

                // this.image_promo = localStorage.getItem("image_promo");
                // this.hasPermissionMemberActivation = abp.auth.isGranted('Pages.Tenant.CustomerMember.MemberActivation');
                // this.hasPermissionRegisterCustomer = abp.auth.isGranted('Pages.Tenant.CustomerMember.SignUpCustomer');
                // this.model.projectID = params.projectId;

                // this.getProductByProject(params.projectId, params.productId);
                this.getDetailManageProject(this.paramsProjectInfoId);

            } else {

                window.open("/");

            }
        });
        // this.clusterSettings = {
        //     singleSelection: true,
        //     text: "Select Tower/Cluster",
        //     selectAllText: 'Select All',
        //     unSelectAllText: 'UnSelect All',
        //     enableSearchFilter: true,
        //     classes: "myclass custom-class"
        // };
        // this.productSettings = {
        //     singleSelection: true,
        //     text: "Select Product",
        //     selectAllText: 'Select All',
        //     unSelectAllText: 'UnSelect All',
        //     enableSearchFilter: true,
        //     classes: "myclass custom-class"
        // };
        // this.galleryOptions = [
        //     { imageAutoPlay: true, imageAutoPlayPauseOnHover: true, previewAutoPlay: true, previewAutoPlayPauseOnHover: true },
        //     { breakpoint: 500, width: '300px', height: '300px', thumbnailsColumns: 3 },
        //     { breakpoint: 300, width: '100%', height: '200px', thumbnailsColumns: 2 }
        // ];
    }

    // onClusterSelect() {
    //     // console.log(item);
    // }

    // setGallery() {
    //     this.detailGallery.forEach((items) => {
    //         let imgUrl = items.imageURL.replace(/\\/g, '/');
    //         this.galleryImages.push(
    //             {
    //                 small: imgUrl,
    //                 medium: imgUrl,
    //                 big: imgUrl
    //             }
    //         );
    //     });
    // }

    // productLoading: boolean = false;
    // getProductByProject(projectId, productId) {
    //     // Dropdown Product
    //     this.productLoading = true;
    //     this._msProjectService.getProductByProject(projectId)
    //         .finally(() => {
    //             setTimeout(() => {
    //                 $('.product').selectpicker('refresh');
    //                 let selectproduct = [];
    //                 this.productsList = [];
    //                 this.objProductList.forEach(item => {
    //                     if (item.projectInfoID == productId) {
    //                         selectproduct.push({ 'id': item.projectInfoID, 'itemName': item.productName });
    //                     }
    //                     this.productsList.push({ 'id': item.projectInfoID, 'itemName': item.productName });
    //                 });

    //                 this.productItems = selectproduct;
    //                 debugger
    //                 this.productLoading = false;
    //             }, 0);
    //         })
    //         .subscribe(result => {
    //             debugger
    //             this.objProductList = result;
    //             // console.log('result product',result);

    //             if (this.objProductList.length > 0) {
    //                 this.onChangeDropdownProduct(false, productId);
    //                 // this.getDropdownClusterByProduct(productId);
    //             } else {
    //                 this.message.info('The product is not available for this project, try using a different project')
    //                     .done(() => {
    //                         window.close();
    //                         window.open("/", "_self");
    //                     });
    //             }
    //         });
    // }

    // onProductSelect() {
    //     // this._script.load('body', 'assets/project/app/js/owl.carousel/owl.carousel.min.js');
    // }

    // onChangeDropdownProduct(type, item) {
    //     // console.log('projectinfoid',item);
    //     let projectInfoId;
    //     if (type == true) {
    //         if (item.length) {
    //             projectInfoId = item[0].id;
    //         } else {
    //             projectInfoId = '';
    //         }
    //     } else {
    //         projectInfoId = item;
    //     }
    //     if (projectInfoId != undefined) {
    //         this.getDetailManageProject(projectInfoId);
    //         // this.getDetailKeyFeatures(projectInfoId);
    //         // this.getDetailGallery(projectInfoId);
    //         // this.getSocialMedia(projectInfoId);
    //     }
    // }

    getDetailManageProject(projectInfoId) {
        // this.loadingDDLCluster = true;
        // this.clusterList = [];
        // this.objClusterList = [];
        // this.clusterItems = [];
        // this.detailUnitType = [];
        // Information, Location, Site Plan
        this._adminManageProjectService.getDetailManageProject(projectInfoId)
            .finally(() => {
                setTimeout(() => {
                    // this.loadingDDLCluster = false;
                    $('.detailcluster').selectpicker('refresh');
                    // this.clusterList = [];
                    // this.objClusterList.forEach(item => {
                    //     this.clusterList.push({ 'id': item.clusterID, 'itemName': item.clusterName });
                    // });
                    // if (this.objClusterList != []) {
                    //     this.clusterItems.push({ 'id': this.objClusterList[0].clusterID, 'itemName': this.objClusterList[0].clusterName });
                    //     this.getUnitTypeByCluster(projectInfoId, this.clusterItems)
                    // }
                }, 0);
            })
            .subscribe(result => {
                localStorage.setItem("projectCluster", JSON.stringify({
                    "projectId": result.projectID,
                    "projectInfoId": result.projectInfoID 
                    // "clusterId": result.listCluster.length > 0 ? result.listCluster[0].clusterID : 0,
                }));
                setTimeout(() => {
                    /* Start : Map Svg - Script */
                      this._script.load('head', 'assets/mapsvg/js/global-functions.js');
                      this._script.load('body', 'assets/mapsvg/js/custom.js');
                    /* End : Map Svg - Script */
                }, 0);

                // console.log('resultnya', result);
                // this.objClusterList = result.listCluster;
                this.isOBActive = result.isOBActive;
                this.isPPOlActive = result.isPPOlActive;
                if (JSON.parse(result.displaySetting)) {
                    let displayForm = JSON.parse(result.displaySetting);
                    // this.isActiveDesc = displayForm.desc;
                    // this.isActiveKey = displayForm.keyfeature;
                    // this.isActiveMarketing = displayForm.marketing;
                    // this.isActivePropDetail = displayForm.proj_detail;
                    // this.isActiveSosmed = displayForm.sosmed;
                    // this.isActiveUnitType = displayForm.unittype;
                    // this.isActiveLocation = displayForm.location;
                    this.isActiveSite = displayForm.siteplan;
                }

                this.detailInfo = result;
                this.detailInfo.projectLogo = result.projectLogo.replace(/\\/g, "/");
                this.detailInfo.sitePlansImageUrl = result.sitePlansImageUrl.replace(/\\/g, "/");
                // this.detailTowerCluster = result.listCluster;

                // this.detailTowerCluster = this.towerList;
                // this.primengDatatableHelper.records = this.detailTowerCluster;
                // this.primengDatatableHelper.totalRecordsCount = this.detailTowerCluster.length;
                // this.primengDatatableHelper.defaultRecordsCountPerPage = 4;


                // localStorage.setItem('lat', this.detailInfo.latitude.toString());
                // localStorage.setItem('lng', this.detailInfo.longitude.toString());

                // if (this.isActiveDesc === true)
                //     (this.detailInfo.projectDescription != null) ? this.isActiveDesc = true : this.isActiveDesc = false;

                // if (this.isActiveMarketing === true)
                //     (this.detailInfo.projectMarketingOffice != null) && (this.detailInfo.projectMarketingPhone != null) ? this.isActiveMarketing = true : this.isActiveMarketing = false;

                // if (this.isActivePropDetail === true)
                //     (this.detailInfo.projectDeveloper != null) && (this.detailInfo.projectWebsite != null) ? this.isActivePropDetail = true : this.isActivePropDetail = false;

                // if (this.isActiveLocation === true) {
                //     (this.detailInfo.locationImageUrl != null) && (this.detailInfo.latitude != 0 && this.detailInfo.longitude != 0) ? this.isActiveLocation = true : this.isActiveLocation = false;
                // } 


                // if (this.isActiveSite === true) {
                //     (this.detailInfo.sitePlansImageUrl != null) && (this.detailInfo.sitePlansLegend != null) ? this.isActiveSite = true : this.isActiveSite = false;
                // }

                // this.isActiveLocation ? $("#isActiveLocation").show() : $("#isActiveLocation").hide();
                this.isActiveSite ? $("#isActiveSite").show() : $("#isActiveSite").hide();

                // (this.detailTowerCluster.length > 0) ? this.isActiveTowerCluster = true : this.isActiveTowerCluster = false;

                // Menu
                // if ((this.isActiveDesc || this.isActivePropDetail || this.isActiveMarketing || this.isActiveKey) || this.isActiveTowerCluster) $("#isActiveProjectInfo").show();
                // else $("#isActiveProjectInfo").hide();
            });
    }

    // towerEvent(event = null, projectInfoID) {
    //     if (event) {
    //         this.firstTower = event.first;
    //     } else {
    //         this.getDetailManageProject(projectInfoID);
    //     }
    // }

    // getDetailKeyFeatures(projectInfoId) {
    //     // Key Features
    //     this._adminService.getKeyFeatures(projectInfoId)
    //         .subscribe(result => {
    //             this.detailKeyFeatures = result.items;
    //             if (this.isActiveKey === true) {
    //                 if (this.detailKeyFeatures.length > 0) this.isActiveKey = true;
    //                 else this.isActiveKey = false;
    //             }
    //         });
    // }

    // getDetailGallery(projectInfoId) {
    //     // Gallery
    //     this._adminService.getGalleryProjectList(projectInfoId).finally(() => {
    //     }).subscribe(result => {
    //         this.detailGallery = result.items;
    //         if (this.detailGallery.length > 0) this.isActiveGallery = true;
    //         else this.isActiveGallery = false;

    //         this.isActiveGallery ? $("#isActiveGallery").show() : $("#isActiveGallery").hide();
    //         this.setGallery();
    //     });
    // }

    // getSocialMedia(projectInfoId) {
    //     // Sosmed
    //     this._adminService.getListSocialMediaProject(projectInfoId)
    //         .subscribe(result => {
    //             this.detailSosmed = result.items;
    //             if (this.isActiveSosmed === true) {
    //                 if (this.detailSosmed.length > 0) {
    //                     this.isActiveSosmed = true;

    //                     for (let i = 0; i < this.detailSosmed.length; i++) {
    //                         if (this.detailSosmed[i].socialMediaIcon != undefined) {
    //                             this.detailSosmed[i].socialMediaIcon = this.detailSosmed[i].socialMediaIcon.replace(/\\/g, "/");
    //                         }
    //                     }
    //                 }
    //                 else this.isActiveSosmed = false;
    //             }
    //         });
    // }

    // getDropdownClusterByProduct(projectInfoId) {
    //     this.loadingDDLCluster = true;
    //     this._projectService.getDropdownClusterByProduct(projectInfoId)
    //         .finally(() => {
    //             this.loadingDDLCluster = false;
    //         })
    //         .subscribe(() => {
    //             // this.detailTowerCluster = result;
    //         });
    // }

    // getUnitTypeByCluster(projectInfoId, item) {
    //     // Unit Type
    //     this.spin_unit = true;
    //     this.show_unit = false;
    //     // console.log('selectedItems item',item);
    //     let clusterid;
    //     if (item.length) {
    //         clusterid = item[0].id;
    //     }
    //     //this.filterByName = item.clusterName;
    //     this._projectService.getUnitTypeByCluster(projectInfoId, clusterid)
    //         .finally(() => {
    //             this.spin_unit = false;
    //             this.show_unit = true;
    //         })
    //         .subscribe((result) => {
    //             this.detailUnitType = result.items;
    //             if (this.isActiveUnitType === true) {
    //                 if (this.detailUnitType.length > 0) this.isActiveUnitType = true;
    //                 else this.isActiveUnitType = false;
    //             }

    //             this.isActiveUnitType ? $("#isActiveUnitType").show() : $("#isActiveUnitType").hide();
    //         });

    // }

    // detailTower(item) {
    //     this.spin_popup = true;
    //     this.spin_popup_tb = false;
    //     this.PopUpCluster = item.clusterName;
    //     this.model.clusterID = item.clusterID;
    //     this._projectService.getUnitTypeByCluster(this.productId, this.model.clusterID).subscribe((result) => {
    //         this.dataDetailCluster = result.items;
    //         this.spin_popup = false;
    //         this.spin_popup_tb = true;
    //     });
    // }

    // detailUnit(item) {
    //     this.PopUpUnit = item;
    //     if (this.PopUpUnit.clusterName == undefined) {
    //         this.PopUpUnit.clusterName = this.filterCluster.clusterName;
    //     }
    // }

    // logout(): void {
    //     this._tokenAuthServiceProxy.logoutMember(localStorage.getItem('memberCode'))
    //         .subscribe(() => {
    //             this._authService.logout();
    //         });
    // }

    // bookNow(item) {
    //     let clusterID = '';
    //     if (this.clusterItems.length) {
    //         clusterID = this.clusterItems[0].id;
    //     }

    //     if (item.unitType === "-") {
    //         item.unitType = "";
    //     }

    //     // this._router.navigate(['/app/main/available-unit/', this.model.projectID, item.clusterID, item.unitType]);
    //     window.open('/app/main/available-unit/' + this.model.projectID + '/' + clusterID + '/' + item.unitType, "_self");

    // }

    // bookUnit() {
    //     window.open('/app/main/available-unit/' + this.model.projectID + '//', "_self");
    // }

    // buyPriorityPass(projectCode, productCode) {
    //     window.open('/app/pponline/transactionpp?projectCode=' + projectCode + '&productCode=' + productCode, "_self");
    //     // this._router.navigate(['app-pp/main/transactionpp'], { queryParams: { projectCode: projectCode, productCode: productCode } });
    // }

    // viewPromo() {
    //     localStorage.setItem('promo_projectID', this.model.projectID);
    //     window.open('/app/main/dashboard/', "_self");
    // }
}
