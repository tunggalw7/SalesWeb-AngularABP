import { Component, ViewContainerRef, OnInit, AfterViewInit, Injector, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatSignalrService } from 'app/shared/layout/chat/chat-signalr.service';
import { SignalRHelper } from 'shared/helpers/SignalRHelper';
import { AppComponentBase } from 'shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { SubscriptionStartType } from '@shared/AppEnums';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import * as moment from 'moment';
import {
    CustomerMemberServiceProxy,
    TokenAuthServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { UserManualComponent } from '@app/shared/layout/user-manual-modal.component';

@Component({
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @ViewChild('userManualModal') userManualModal: UserManualComponent;
    private viewContainerRef: ViewContainerRef;
    private router: Router;

    subscriptionStartType = SubscriptionStartType;
    installationMode: boolean = true;
    ipFromUpdateDomain;

    public constructor(
        injector: Injector,
        viewContainerRef: ViewContainerRef,
        private _router: Router,
        private _chatSignalrService: ChatSignalrService,
        private _appSessionService: AppSessionService,
        private _customerMemberService: CustomerMemberServiceProxy,
        private _tokenAuthServiceProxy: TokenAuthServiceProxy,
        private _authService: AppAuthService,
        private activatedRoute: ActivatedRoute) {
        super(injector);
        this.viewContainerRef = viewContainerRef; // You need this small hack in order to catch application root view container ref (required by ng2 bootstrap modal)
        this.router = _router;
        
        this.activatedRoute.url
            .subscribe(val => {
                this._customerMemberService.checkLogin(this._appSessionService.user.userName, localStorage.getItem('domainLogin'))
                    .subscribe(result => {
                        if (result.result != undefined) {
                            if (result.result == false) {
                                this._tokenAuthServiceProxy.logoutMember(localStorage.getItem('memberCode'))
                                    .subscribe((result) => {
                                        if (result) {
                                            this._authService.logout(true, result.message);
                                        }
                                    });
                            }
                        }
                    }, err => {
                        console.error(err);
                    });
            });

        // if (localStorage.getItem('domainLogin') == null || localStorage.getItem('domainLogin') == undefined) {
        //     console.log(_appSessionService.user); 
        //     if (localStorage.getItem('memberCode')) {
        //         this._tokenAuthServiceProxy.logoutMember(localStorage.getItem('memberCode'))
        //             .subscribe((result) => {
        //                 console.log('logout ', result);
        //                 abp.auth.clearToken();
        //                 this._authService.logout();
        //                 location.href = result.message;
        //             });
        //     }
        // }
        // if (localStorage.getItem('ippublicFromService') == null || localStorage.getItem('ippublicFromService') == undefined) {
        //     this._tokenAuthServiceProxy.logoutMember(localStorage.getItem('memberCode'))
        //         .subscribe((result) => {
        //             console.log('logout ', result);
        //             abp.auth.clearToken();
        //             this._authService.logout();
        //             location.href = result.message;
        //         });
        // } else {
        //     this.activatedRoute.url
        //         .subscribe(val => {
        //             this._tokenAuthServiceProxy.updateDomainLogin(abp.session.userId, localStorage.getItem('ippublicFromService'), localStorage.getItem('isLogin') === "true")
        //                 .subscribe(result => {
        //                     if (result.result != undefined) {
        //                         this.ipFromUpdateDomain = result.message;
        //                         localStorage.setItem('domainLogin', result.message);
        // console.log('masuk app bos',localStorage.getItem('domainLogin'));
        //                         this._customerMemberService.checkLogin(this._appSessionService.user.userName, localStorage.getItem('domainLogin'))
        //                             .subscribe(result => {
        //                                 console.log('checkLogin', result);
        //                                 if (result.result != undefined) {
        //                                     if (result.result == false) {
        //                                         // this._tokenAuthServiceProxy.logoutMember(localStorage.getItem('memberCode'))
        //                                         //     .subscribe((result) => {
        //                                         // this._authService.logout();
        //                                         // });
        //                                     }
        //                                 }
        //                             }, err => {
        //                                 console.error(err);
        //                             });
        //                     }
        //                 }, err => {
        //                     console.error(err);
        //                 });

        //         });
        // }
    }

    openUserManual() {
        this.userManualModal.show()
    }

    ngOnInit(): void {
        if (this.appSession.application && this.appSession.application.features['SignalR']) {
            SignalRHelper.initSignalR(() => { this._chatSignalrService.init(); });
        }

        this.installationMode = UrlHelper.isInstallUrl(location.href);
    }

    subscriptionStatusBarVisible(): boolean {
        return this._appSessionService.tenantId > 0 &&
            (this._appSessionService.tenant.isInTrialPeriod ||
                this.subscriptionIsExpiringSoon());
    }

    subscriptionIsExpiringSoon(): boolean {
        if (this._appSessionService.tenant.subscriptionEndDateUtc) {
            return moment().utc().add(AppConsts.subscriptionExpireNootifyDayCount, 'days') >= moment(this._appSessionService.tenant.subscriptionEndDateUtc);
        }

        return false;
    }

    ngAfterViewInit(): void {
        if (mApp.initialized) {
            return;
        }

        mApp.init();
        mLayout.init();
        mApp.initialized = true;
    }
}
