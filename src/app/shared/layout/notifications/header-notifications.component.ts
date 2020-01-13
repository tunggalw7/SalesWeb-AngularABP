import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NotificationServiceProxy, GetNotificationsOutput, UserNotification, TransactionServiceProxy } from '@shared/service-proxies/service-proxies';
// import { UserNotificationHelper, IFormattedUserNotification } from './UserNotificationHelper';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AbpSessionService } from '@abp/session/abp-session.service';


@Component({
    templateUrl: './header-notifications.component.html',
    selector: '[headerNotifications]',
    encapsulation: ViewEncapsulation.None
})
export class HeaderNotificationsComponent extends AppComponentBase implements OnInit {

    dataCart: any = [];

    constructor(
        injector: Injector,
        private _router: Router,
        private _sessionService: AbpSessionService,
        private activatedRoute: ActivatedRoute,
        private _notificationService: NotificationServiceProxy,
        private _transaction: TransactionServiceProxy,
        private _appSessionService: AppSessionService,
    ) {
        super(injector);
        this.activatedRoute.url
            .subscribe(val => {
                this.loadCart();
            });
    }

    ngOnInit(): void {
        this.loadCart();
    }

    loadCart(): void {
        // this._transaction.getTrUnitReserved(this._sessionService.userId)
        //     .finally(() => {
        //         setTimeout(() => {
        //         }, 3000);
        //     })
        //     .subscribe((result) => {
        //         this.dataCart = result;
        //     });
    }

    gotoUrl(url): void {
        if (url) {
            location.href = url;
        }
    }
}
