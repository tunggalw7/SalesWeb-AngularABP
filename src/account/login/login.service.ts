import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    TokenAuthServiceProxy,
    AuthenticateModel,
    AuthenticateResultModel,
    ExternalLoginProviderInfoModel,
    ExternalAuthenticateModel,
    ExternalAuthenticateResultModel,
    LoginMemberInputModel
} from '@shared/service-proxies/service-proxies';

import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';

import { MessageService } from '@abp/message/message.service';
import { LogService } from '@abp/log/log.service';
import { TokenService } from '@abp/auth/token.service';
import { UtilsService } from '@abp/utils/utils.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppSessionService } from '@shared/common/session/app-session.service';

import * as _ from 'lodash';
declare const FB: any; // Facebook API
declare const gapi: any; // Facebook API
declare const WL: any; // Microsoft API

export class ExternalLoginProvider extends ExternalLoginProviderInfoModel {

    static readonly FACEBOOK: string = 'Facebook';
    static readonly GOOGLE: string = 'Google';
    static readonly MICROSOFT: string = 'Microsoft';

    icon: string;
    initialized = false;

    constructor(providerInfo: ExternalLoginProviderInfoModel
    ) {
        super();

        this.name = providerInfo.name;
        this.clientId = providerInfo.clientId;
        this.icon = ExternalLoginProvider.getSocialIcon(this.name);
    }

    private static getSocialIcon(providerName: string): string {
        providerName = providerName.toLowerCase();

        if (providerName === 'google') {
            providerName = 'googleplus';
        }

        return providerName;
    }
}

@Injectable()
export class LoginService {

    static readonly twoFactorRememberClientTokenName = 'TwoFactorRememberClientToken';

    authenticateModel: LoginMemberInputModel;
    authenticateResult: AuthenticateResultModel;

    externalLoginProviders: ExternalLoginProvider[] = [];

    rememberMe: boolean;
    isLogin: boolean = false;

    constructor(
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router,
        private _utilsService: UtilsService,
        private _messageService: MessageService,
        private _tokenService: TokenService,
        private _logService: LogService,
        private _tokenAuthServiceProxy: TokenAuthServiceProxy,
        private _authService: AppAuthService
    ) {
        this.clear();
    }

    authenticate(finallyCallback?: () => void, redirectUrl?: string) {
        debugger
        finallyCallback = finallyCallback || (() => { });

        // We may switch to localStorage instead of cookies
        this.authenticateModel.twoFactorRememberClientToken = this._utilsService.getCookieValue(LoginService.twoFactorRememberClientTokenName);
        this.authenticateModel.singleSignIn = UrlHelper.getSingleSignIn();
        this.authenticateModel.returnUrl = UrlHelper.getReturnUrl();
        this.authenticateModel.domainLogin = localStorage.getItem('ippublic');

        // this._tokenAuthService
        //     .authenticate(this.authenticateModel)
        //     .finally(finallyCallback)
        //     .subscribe((result: AuthenticateResultModel) => {
        //         this.processAuthenticateResult(result, redirectUrl);
        //     });
        localStorage.setItem('memberCode', this.authenticateModel.userNameOrEmailAddress);
        console.log('this.authenticateModel',this.authenticateModel);
        this._tokenAuthService
            .authenticate(this.authenticateModel)
            .finally(finallyCallback)
            .subscribe((result: AuthenticateResultModel) => {
                debugger
                localStorage.setItem('ippublicFromService', result.ipAddress);
                localStorage.setItem('domainLogin', result.ipAddress);
                localStorage.setItem('isLogin', 'true');
                // this.checkLogin(result.userId, result.ipAddress);
                this.processAuthenticateResult(result, redirectUrl);
            }, (err) => {
                debugger
                let a = "";
                if (err.details) {
                    a = err.details.toString();
                }
                
                if (err.details == 'Member is already sign in') {
                    this.isLogin = true;
                    this._messageService.confirm(
                        "Another Members are still active!",
                        isConfirmed => {
                            if (isConfirmed) {
                                this._tokenAuthServiceProxy.logoutMember(this.authenticateModel.userNameOrEmailAddress)
                                    .subscribe((result) => {
                                        if (result) this.authenticate(
                                            null,
                                            redirectUrl
                                        );
                                    });
                            }
                        }
                    );
                }
                
                else if (a.includes('\\')) {
                    abp.message.error(err.details.replace(/\\\\/g, '\\'), err.message)
                } 
                
                else if (err.details == 'Please activate your member first') {
                    this._messageService.confirm(
                        "Do you want actived your member?",
                        isConfirmed => {
                            if (isConfirmed) {
                                location.href = err.message;
                            }
                        }
                    );
                }
            }
            );

            localStorage.setItem('isLogin', this.isLogin.toString());
    }

    externalAuthenticate(provider: ExternalLoginProvider): void {
        this.ensureExternalLoginProviderInitialized(provider, () => {
            if (provider.name === ExternalLoginProvider.FACEBOOK) {
                FB.login();
            } else if (provider.name === ExternalLoginProvider.GOOGLE) {
                gapi.auth2.getAuthInstance().signIn();
            } else if (provider.name === ExternalLoginProvider.MICROSOFT) {
                WL.login({
                    scope: ['wl.signin', 'wl.basic', 'wl.emails']
                });
            }
        });
    }

    init(): void {
        this.initExternalLoginProviders();
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
                LoginService.twoFactorRememberClientTokenName,
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

    private clear(): void {
        this.authenticateModel = new LoginMemberInputModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }

    private initExternalLoginProviders() {
        this._tokenAuthService
            .getExternalAuthenticationProviders()
            .subscribe((providers: ExternalLoginProviderInfoModel[]) => {
                this.externalLoginProviders = _.map(providers, p => new ExternalLoginProvider(p));
            });
    }

    ensureExternalLoginProviderInitialized(loginProvider: ExternalLoginProvider, callback: () => void) {
        if (loginProvider.initialized) {
            callback();
            return;
        }

        if (loginProvider.name === ExternalLoginProvider.FACEBOOK) {
            jQuery.getScript('//connect.facebook.net/en_US/sdk.js', () => {
                FB.init({
                    appId: loginProvider.clientId,
                    cookie: false,
                    xfbml: true,
                    version: 'v2.5'
                });

                FB.getLoginStatus(response => {
                    this.facebookLoginStatusChangeCallback(response);
                });

                callback();
            });
        } else if (loginProvider.name === ExternalLoginProvider.GOOGLE) {
            jQuery.getScript('https://apis.google.com/js/api.js', () => {
                gapi.load('client:auth2',
                    () => {
                        gapi.client.init({
                            clientId: loginProvider.clientId,
                            scope: 'openid profile email'
                        }).then(() => {
                            gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
                                this.googleLoginStatusChangeCallback(isSignedIn);
                            });

                            this.googleLoginStatusChangeCallback(gapi.auth2.getAuthInstance().isSignedIn.get());
                        });

                        callback();
                    });
            });
        } else if (loginProvider.name === ExternalLoginProvider.MICROSOFT) {
            jQuery.getScript('//js.live.net/v5.0/wl.js', () => {
                WL.Event.subscribe('auth.login', this.microsoftLogin);
                WL.init({
                    client_id: loginProvider.clientId,
                    scope: ['wl.signin', 'wl.basic', 'wl.emails'],
                    redirect_uri: AppConsts.appBaseUrl,
                    response_type: 'token'
                });
            });
        }
    }

    private facebookLoginStatusChangeCallback(resp) {
        if (resp.status === 'connected') {
            const model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.FACEBOOK;
            model.providerAccessCode = resp.authResponse.accessToken;
            model.providerKey = resp.authResponse.userID;
            model.singleSignIn = UrlHelper.getSingleSignIn();
            model.returnUrl = UrlHelper.getReturnUrl();

            this._tokenAuthService.externalAuthenticate(model)
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if (result.waitingForActivation) {
                        this._messageService.info('You have successfully registered. Waiting for activation!');
                        return;
                    }

                    this.login(result.accessToken, result.encryptedAccessToken, result.expireInSeconds, false, '', result.returnUrl);
                });
        }
    }

    private googleLoginStatusChangeCallback(isSignedIn) {
        if (isSignedIn) {
            const model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.GOOGLE;
            model.providerAccessCode = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
            model.providerKey = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getId();
            model.singleSignIn = UrlHelper.getSingleSignIn();
            model.returnUrl = UrlHelper.getReturnUrl();

            this._tokenAuthService.externalAuthenticate(model)
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if (result.waitingForActivation) {
                        this._messageService.info('You have successfully registered. Waiting for activation!');
                        return;
                    }

                    this.login(result.accessToken, result.encryptedAccessToken, result.expireInSeconds, false, '', result.returnUrl);
                });
        }
    }

    /**
    * Microsoft login is not completed yet, because of an error thrown by zone.js: https://github.com/angular/zone.js/issues/290
    */
    private microsoftLogin() {
        this._logService.debug(WL.getSession());
        const model = new ExternalAuthenticateModel();
        model.authProvider = ExternalLoginProvider.MICROSOFT;
        model.providerAccessCode = WL.getSession().access_token;
        model.providerKey = WL.getSession().id; // How to get id?
        model.singleSignIn = UrlHelper.getSingleSignIn();
        model.returnUrl = UrlHelper.getReturnUrl();

        this._tokenAuthService.externalAuthenticate(model)
            .subscribe((result: ExternalAuthenticateResultModel) => {
                if (result.waitingForActivation) {
                    this._messageService.info('You have successfully registered. Waiting for activation!');
                    return;
                }

                this.login(result.accessToken, result.encryptedAccessToken, result.expireInSeconds, false, '', result.returnUrl);
            });
    }
}
