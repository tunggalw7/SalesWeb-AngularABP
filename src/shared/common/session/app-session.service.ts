import { Injectable } from '@angular/core';
import {
    TokenAuthServiceProxy, AuthenticateResultModel,
    AuthenticateModel, SessionServiceProxy, UserLoginInfoDto, TenantLoginInfoDto, ApplicationInfoDto, GetCurrentLoginInformationsOutput
} from '@shared/service-proxies/service-proxies';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { LogService } from '@abp/log/log.service';
import { UtilsService } from '@abp/utils/utils.service';
import { TokenService } from '@abp/auth/token.service';
import { MessageService } from '@abp/message/message.service';
import { Router } from '@angular/router';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { EncrDecrService } from '../EncrDecrService';

@Injectable()
export class AppSessionService {

    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;
    rememberMe: boolean;
    isLogin: boolean = false;
    twoFactorRememberClientTokenName = 'TwoFactorRememberClientToken';
    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;

    constructor(
        private _sessionService: SessionServiceProxy,
        private _abpMultiTenancyService: AbpMultiTenancyService,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _logService: LogService,
        private _utilsService: UtilsService,
        private _messageService: MessageService,
        private _tokenService: TokenService,
        private EncrDecr: EncrDecrService,
        private _router: Router) {
        this.authenticateModel = new AuthenticateModel();
        this.autologin();
    }

    autologin(finallyCallback?: () => void, redirectUrl?: string) {
        finallyCallback = finallyCallback || (() => { });
        var queryString = decodeURIComponent(window.location.search);
        var pathName = window.location.pathname;
        queryString = queryString.substring(1);
        var queries = queryString.split("&");
        var autouser, decrypt_pass;
        if (queries.length == 2) {
            if (queries[0] != "") {
                autouser = queries[0];
            }
            if (queries[1] != "") {
                decrypt_pass = this.EncrDecr.get('123Visionet456$#@$^@1ERF', queries[1]);
            }
        }


        this._tokenAuthService.logoutMember(autouser)
            .subscribe((result) => {
                // console.log('result logout member', result);
                if ((localStorage.getItem('autouser') == undefined && queries.length == 2)) {

                    this.authenticateModel.password = decrypt_pass;
                    this.authenticateModel.rememberClient = false;
                    this.authenticateModel.returnUrl = null;
                    this.authenticateModel.singleSignIn = false;
                    this.authenticateModel.twoFactorRememberClientToken = null;
                    this.authenticateModel.userNameOrEmailAddress = autouser;
                    // this.authenticateModel.domainLogin = localStorage.getItem('ippublic');
                    localStorage.setItem('memberCode', this.authenticateModel.userNameOrEmailAddress);
                    this._tokenAuthService
                        .authenticate(this.authenticateModel)
                        .finally(finallyCallback)
                        .subscribe((result: AuthenticateResultModel) => {
                            localStorage.setItem('ippublicFromService', result.ipAddress);
                            localStorage.setItem('domainLogin', result.ipAddress);
                            localStorage.setItem('isLogin', 'true');
                            localStorage.setItem('ismemberactive', 'false');
                            this.processAuthenticateResult(result, redirectUrl);
                        }, (err) => {
                        }
                        );

                    localStorage.setItem('isLogin', this.isLogin.toString());
                    localStorage.setItem('autouser', 'true');
                }
            });
    }

    private processAuthenticateResult(authenticateResult: AuthenticateResultModel, redirectUrl?: string) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.shouldResetPassword) {
            // Password reset

            this._router.navigate(['account/reset-password'], {
                queryParams: {
                    userId: authenticateResult.userId,
                    tenantId: abp.session.tenantId,
                    resetCode: authenticateResult.passwordResetCode
                }
            });

            this.clear();

        } else if (authenticateResult.requiresTwoFactorVerification) {
            // Two factor authentication

            this._router.navigate(['account/send-code']);

        } else if (authenticateResult.accessToken) {
            // Successfully logged in
            if (authenticateResult.returnUrl && !redirectUrl) {
                redirectUrl = authenticateResult.returnUrl;
            }

            this.login(
                authenticateResult.accessToken,
                authenticateResult.encryptedAccessToken,
                authenticateResult.expireInSeconds,
                this.rememberMe,
                authenticateResult.twoFactorRememberClientToken,
                redirectUrl
            );

        } else {
            // Unexpected result!

            this._logService.warn('Unexpected authenticateResult!');
            this._router.navigate(['account/login']);

        }
    }

    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }

    private login(accessToken: string, encryptedAccessToken: string, expireInSeconds: number, rememberMe?: boolean, twoFactorRememberClientToken?: string, redirectUrl?: string): void {

        let tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined;

        this._tokenService.setToken(
            accessToken,
            tokenExpireDate
        );

        this._utilsService.setCookieValue(
            AppConsts.authorization.encrptedAuthTokenName,
            encryptedAccessToken,
            tokenExpireDate,
            abp.appPath
        );

        if (twoFactorRememberClientToken) {
            this._utilsService.setCookieValue(
                this.twoFactorRememberClientTokenName,
                twoFactorRememberClientToken,
                new Date(new Date().getTime() + 365 * 86400000), // 1 year
                abp.appPath
            );
        }
        if (redirectUrl) {
            location.href = redirectUrl;
        } else {
            let initialUrl = UrlHelper.initialUrl;

            if (initialUrl.indexOf('/account') > 0) {
                initialUrl = AppConsts.appBaseUrl;
            }

            location.href = initialUrl;
        }
    }


    get application(): ApplicationInfoDto {
        return this._application;
    }

    get user(): UserLoginInfoDto {
        return this._user;
    }

    get userId(): number {
        return this.user ? this.user.id : null;
    }

    get tenant(): TenantLoginInfoDto {
        return this._tenant;
    }

    get tenancyName(): string {
        return this._tenant ? this.tenant.tenancyName : '';
    }

    get tenantId(): number {
        return this.tenant ? this.tenant.id : null;
    }

    getShownLoginName(): string {
        const userName = this._user.name + " / " + this._user.userName;
        if (!this._abpMultiTenancyService.isEnabled) {
            return userName;
        }

        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
    }

    init(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._sessionService.getCurrentLoginInformations().toPromise().then((result: GetCurrentLoginInformationsOutput) => {
                this._application = result.application;
                this._user = result.user;
                this._tenant = result.tenant;
                resolve(true);
            }, (err) => {
                reject(err);
            });
        });
    }

    changeTenantIfNeeded(tenantId?: number): boolean {
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }

        abp.multiTenancy.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }

    private isCurrentTenant(tenantId?: number) {
        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }
}
