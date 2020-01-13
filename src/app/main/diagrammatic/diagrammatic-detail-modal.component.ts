import {Component, ViewChild, Injector, Output, EventEmitter, ElementRef} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {AppComponentBase} from '@shared/common/app-component-base';
import {AppConsts} from '@shared/AppConsts';
import {
    RoleServiceProxy,
    RoleListDto,
    BookingHistoryServiceProxy,
    DiagramaticServiceProxy,
    ListDetailDiagramaticWebResultDto
} from '@shared/service-proxies/service-proxies';
import {Router, ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';

@Component({
    selector: 'detailDiagrammaticModal',
    templateUrl: './diagrammatic-detail-modal.component.html',
    styleUrls: ['./diagrammatic-detail-modal.component.css'],
})

export class DiagrammaticDetailModalComponent extends AppComponentBase {

    @ViewChild('detailDiagrammaticModal') modal: ModalDirective;
    showData = true;
    // data: any;

    showdetail: boolean;
    styleDetail: any;
    data: any = [];
    // showData=false;
    dataDetail: ListDetailDiagramaticWebResultDto = new ListDetailDiagramaticWebResultDto;
    detailterm = [];
    columntype = [];
    projectID;
    clusterID;
    unitNo;
    unitCode;
    unitID;

    constructor(injector: Injector,
                private _diagramServices: DiagramaticServiceProxy,
                private _router: Router) {
        super(injector);
    }

    getUnitDetail(unitId: number): void {
        this.showData = false;
        this._diagramServices.getDetailDiagramatic(unitId)
            .finally(() => {
                this.showData = true;
            })
            .subscribe((result) => {
                this.dataDetail = result;
                console.log('detail diagrammatic', this.dataDetail);
                this.dataDetail.term.forEach((itemterm) => {
                    this.columntype.push(itemterm.renovName);

                    if (this.detailterm.length === 0) {
                        itemterm['renovarray'] = [Object.assign({}, itemterm)];
                        this.detailterm.push(itemterm);

                    } else {
                        let indicator_termid = this.detailterm.map(function (e) {
                            return e.termID;
                        }).indexOf(itemterm.termID);
                        if (indicator_termid === -1) {
                            itemterm['renovarray'] = [Object.assign({}, itemterm)];
                            this.detailterm.push(itemterm);

                            // this.checkcolumntype(itemterm.renovName);

                        } else {
                            let indicator_renovid = this.detailterm[indicator_termid].renovarray.map(function (e) {
                                return e.renovID;
                            }).indexOf(itemterm.renovID);
                            if (indicator_renovid === -1) {
                                this.detailterm[indicator_termid].renovarray.push(Object.assign({}, itemterm));

                                // this.checkcolumntype(itemterm.renovName);
                            }

                        }
                    }

                });
                this.columntype = this.toUnique(this.columntype);
            });

    }

    toUnique(a) { //array,placeholder,placeholder
        let b;
        let c;

        b = a.length;
        while (c = --b) while (c--) a[b] !== a[c] || a.splice(c, 1);
        return a;
    }

    show(pid, clusterID, data, unitNo, unitCode, unitID): void {
        this.showData = false;
        this.projectID = pid;
        this.clusterID = clusterID;
        this.unitNo = unitNo;
        this.unitCode = unitCode;
        this.unitID = unitID;
        this.getUnitDetail(unitID);
        this.data = data;
        this.modal.show();
    }

    close(): void {
        this.modal.hide();
    }

    addCart() {
        this.setTimer();
        this._router.navigate(['/app/main/booking-unit', this.projectID, this.clusterID, this.unitNo, this.unitCode, this.unitID]);
    }

    ngAfterViewInit(): void {

        document.getElementById('dmatic_detail_timer').innerHTML = localStorage.getItem('booking_duration');
        startTimer();

        function startTimer() {
            var presentTime = document.getElementById('dmatic_detail_timer').innerHTML;
            var timeArray: any = presentTime.split(/[:]+/);
            var m = timeArray[0];
            var s = checkSecond((timeArray[1] - 1));
            if (s == 59) {
                m = m - 1
            }
            if (m == 0 && s == 0) {
                document.getElementById('dmatic_detail_timer').innerHTML = "Expired";
            } else {
                document.getElementById('dmatic_detail_timer').innerHTML = m + ":" + s;
                setTimeout(startTimer, 1000);
            }
        }

        function checkSecond(sec) {
            if (sec < 10 && sec >= 0) {
                sec = "0" + sec
            }
            ; // add zero in front of numbers < 10
            if (sec < 0) {
                sec = "59"
            }
            ;
            return sec;
        }

    }

    setTimer() {
        localStorage.setItem('booking_duration', document.getElementById('dmatic_detail_timer').innerHTML);
    }


}
