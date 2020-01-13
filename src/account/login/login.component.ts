import {Component, Injector, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {
    SessionServiceProxy,
    TokenAuthServiceProxy,
    UpdateUserSignInTokenOutput
} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from '@shared/common/app-component-base';
import {LoginService, ExternalLoginProvider} from './login.service';
import {accountModuleAnimation} from '@shared/animations/routerTransition';
import {AbpSessionService} from '@abp/session/abp-session.service';
import {UrlHelper} from 'shared/helpers/UrlHelper';

@Component({
    templateUrl: './login.component.html',
    animations: [accountModuleAnimation()]
})
export class LoginComponent extends AppComponentBase implements OnInit {
    submitting = false;
    redirectLinkBeforeLoggedIn = null;

    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _router: Router,
        private _sessionService: AbpSessionService,
        private _sessionAppService: SessionServiceProxy,
        private _tokenAuthServiceProxy: TokenAuthServiceProxy
    ) {
        super(injector);
        
        if (localStorage.getItem("redirectLinkAfterLoggedIn") != null) {
            this.redirectLinkBeforeLoggedIn = localStorage.getItem("redirectLinkAfterLoggedIn");
            localStorage.removeItem("redirectLinkAfterLoggedIn");
        }
    }

    get multiTenancySideIsTeanant(): boolean {
        return this._sessionService.tenantId > 0;
    }

    get isSelfRegistrationAllowed(): boolean {
        if (!this._sessionService.tenantId) {
            return false;
        }

        return this.setting.getBoolean('App.UserManagement.AllowSelfRegistration');
    }
    
    trimming_fn(x) {    
        return x ? x.replace(/\s/g,'') : '';    
    }; 

    validateEmail(email): boolean {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) delete this.loginService.authenticateModel.userNameOrEmailAddress;
        return true;
    }

    ngOnInit(): void {
        if (this._sessionService.userId > 0 && UrlHelper.getReturnUrl() && UrlHelper.getSingleSignIn()) {
            this._sessionAppService.updateUserSignInToken()
                .subscribe((result: UpdateUserSignInTokenOutput) => {
                    const initialReturnUrl = UrlHelper.getReturnUrl();
                    const returnUrl = initialReturnUrl + (initialReturnUrl.indexOf('?') >= 0 ? '&' : '?') +
                        'accessToken=' + result.signInToken +
                        '&userId=' + result.encodedUserId +
                        '&tenantId=' + result.encodedTenantId;

                    location.href = returnUrl;
                });
        }
        // this.loginPage();
    }

    loginPage() {
        this._tokenAuthServiceProxy.logoutMember("")
            .subscribe((result) => {
                location.href = result.message;
            });
    }

    login(): void {
        this.submitting = true;
        this.loginService.authenticate(
            () => this.submitting = false,
            this.redirectLinkBeforeLoggedIn
        );
    }

    externalLogin(provider: ExternalLoginProvider) {
        this.loginService.externalAuthenticate(provider);
    }
}
