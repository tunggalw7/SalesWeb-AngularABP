import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "@shared/common/app-component-base";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-online-booking-status',
    templateUrl: './online-booking-status.component.html',
    styleUrls: ['./online-booking-status.component.css']
})
export class OnlineBookingStatusComponent extends AppComponentBase implements OnInit {
    url: any;
    params_url: any;

    constructor(injector: Injector,
                private _activeroute: ActivatedRoute) {
        super(injector)
    }

    ngOnInit() {
        this.url = this._activeroute.params.subscribe(params => {
            this.params_url = params.status;
            this.getStatus();
        });
    }

    getStatus(){
        console.log('params',this.params_url);
    }

}
