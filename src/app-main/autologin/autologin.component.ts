import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import {
    MsProjectServiceProxy,
    TokenAuthServiceProxy,
    ProjectServiceProxy,
    CustomerMemberServiceProxy
} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './autologin.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AutologinComponent extends AppComponentBase implements OnInit {

    sub;
    data_projects: any = [];
    promotionLoading = false;

    hasPermissionMemberActivation;
    hasPermissionRegisterCustomer;
    hasPermissionCustomer;
    ipFromUpdateDomain;

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
        this.autoLoading = true;
    }
    
    autoLoading = false;
    ngAfterViewInit() {
        setTimeout(() => {   
            this.activatedRoute.params.subscribe(params => {
                console.log('params',params);
                var queryString = decodeURIComponent(window.location.search);
                var pathName = window.location.pathname;
                queryString = queryString.substring(1);
                var queries = queryString.split("&");
                var autouser, decrypt_pass;
                if (queries.length == 2){             
                    if (queries[0] != "") {
                        autouser = queries[0];
                    }
                    if (queries[1] != "") {
                        decrypt_pass =  queries[1];            
                    }     
                    this._router.navigate(['promo', params.domainlogin, params.membercode, params.ippublic]);
                    // window.open("promo/" + params.domainlogin + '/' + params.membercode + '/' + params.ippublic, "_self");               
                    this.autoLoading = false;
                }  
            });  
        }, 3000);
    }

    ngOnInit(): void {           
    }
}
