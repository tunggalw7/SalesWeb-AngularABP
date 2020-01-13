import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import {
    MsProjectServiceProxy,
    TokenAuthServiceProxy,
    ProjectServiceProxy,
    CustomerMemberServiceProxy
} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './index.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../assets/project/app/css/bootstrap.css',
        "../../assets/project/app/css/style.css",
        '../../assets/project/app/css/swiper.css',
        '../../assets/project/app/css/dark.css',
        '../../assets/project/app/css/font-icons.css',
        '../../assets/project/app/css/animate.css',
        '../../assets/project/app/css/magnific-popup.css',
        '../../assets/project/app/css/responsive.css',
    ]
})
export class IndexComponent extends AppComponentBase implements OnInit {

    sub;
    data_projects: any = [];
    promotionLoading = false;

    hasPermissionMemberActivation;
    hasPermissionRegisterCustomer;
    hasPermissionCustomer;
    ipFromUpdateDomain;
    searchBox;
    public constructor(
        injector: Injector,
        private _router: Router,
        public _appSessionService: AppSessionService,
        private _script: ScriptLoaderService,
        private _authService: AppAuthService,
        private _msProjectService: MsProjectServiceProxy,
        private _projectService: ProjectServiceProxy,
        private _tokenAuthServiceProxy: TokenAuthServiceProxy,
        private _customerMemberService: CustomerMemberServiceProxy,
        private activatedRoute: ActivatedRoute,
    ) {
        super(injector);
        this.hasPermissionMemberActivation = abp.auth.isGranted('Pages.Tenant.CustomerMember.MemberActivation');
        this.hasPermissionRegisterCustomer = abp.auth.isGranted('Pages.Tenant.CustomerMember.SignUpCustomer');
        this.hasPermissionCustomer = abp.auth.isGranted('Pages.Tenant.SalesWeb.Customer');
    }
    autoLoading = false;
    
    ngAfterViewInit() {
        setTimeout(() => {
        
            this.autoLoading = true;
            this.activatedRoute.params.subscribe(params => {
                console.log('params',params);
                if (params.membercode !=undefined) localStorage.setItem('memberCode', params.membercode);
                if (params.domainlogin !=undefined) localStorage.setItem('domainLogin', params.domainlogin);
                if (params.ippublic !=undefined) localStorage.setItem('ippublicFromService', params.ippublic);
             
                if (params.domainlogin !=undefined) {
                        this._customerMemberService.checkLogin(params.membercode, params.domainlogin)
                    .subscribe(result => {
                        console.log('checkLogin', result);
                        if (result.result != undefined) {
                            if (result.result == false) {
                                this._tokenAuthServiceProxy.logoutMember(localStorage.getItem('memberCode'))
                                .subscribe((result) => {
                                    console.log('logout ', result);
                                    abp.auth.clearToken();
                                    this._authService.logout();
                                    location.href = result.message;
                                });
                            }
                        }
                        this.autoLoading = false;
                    }, err => {
                        console.error(err);
                    });
                }
            });
            
            let memberCode = '';
            if (this._appSessionService.user != undefined) memberCode = this._appSessionService.user.userName;
            this._projectService.getListAllProduct(memberCode, this.searchBox)
                .finally(() => {
                    setTimeout(() => {
                        this.promotionLoading = true;
    
                        this._script.load('body', 'assets/project/app/js/functions.js');
                        this._script.load('body', 'assets/project/app/js/jquery.js');
                        this._script.load('body', 'assets/project/app/js/plugins.js');
                        this._script.load('body', 'assets/project/app/js/project.js');
                        this._script.load('head', 'assets/project/app/js/getipaddress.js');
                    }, 0);
                })
                .subscribe(result => {
                    let i = 0;
                    this.data_projects = result;
                    while (i < this.data_projects.length) {
                        if (this.data_projects[i].productLogo != "" || this.data_projects[i].productLogo != null) {
                            this.data_projects[i].productLogo = this.data_projects[i].productLogo.replace(/\\/g, "/");
                        }
                        i++
                    }
                });
            console.log(localStorage.getItem('ippublicFromService'));
        }, 0);
    }

    ngOnInit(): void {
    }

    gotoProjectDetail(projectId, productID) {
        window.open("project-detail/" + projectId + '/' + productID, "_self");
    }

    logout(): void {
        this._tokenAuthServiceProxy.logoutMember(localStorage.getItem('memberCode'))
            .subscribe((result) => {
                if (result) {
                    this._authService.logout(true, result.message);
                }
            });
    }
}
