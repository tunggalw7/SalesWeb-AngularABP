import { Component, AfterViewInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    RoleServiceProxy,
    RoleListDto,
    TransactionServiceProxy,
    TenantDashboardServiceProxy,
    MyCommissionSPServiceProxy,
    GetDetailCommissionDto,
    DashboardSPServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AppSalesSummaryDatePeriod } from '@shared/AppEnums';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Paginator } from "primeng/primeng";

import { FilterCommissionComponent } from './filter-commission-modal.component';
import { DetailCommissionComponent } from './detail-commission-modal.component';
import * as moment from 'moment';

@Component({
    templateUrl: './my-commission.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./my-commission.component.css'],
    animations: [appModuleAnimation()]
})

export class MyCommissionComponent extends AppComponentBase {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('filterCommissionModal') filterCommissionModal: FilterCommissionComponent;
    @ViewChild('detailCommissionModal') detailCommissionModal: DetailCommissionComponent;

    profitSharePieChart: ProfitSharePieChart;
    filterResult: any = [];
    firstTaskList = 0;
    comm: any;
    memberCode;
    // memberCode = "118887720126";

    public statusId: number
    public termId: number
    public projectId: number
    public startDate: moment.Moment = moment().startOf('day');
    public endDate: moment.Moment = moment().endOf('day');
    filters = {
        "projectId": undefined,
        "termId": undefined,
        "statusId": undefined,
        "startDate": undefined,
        "endDate": undefined
    };


    constructor(
        injector: Injector,
        private _router: Router,
        private _transaction: TransactionServiceProxy,
        private _appSessionService: AppSessionService,
        private _dashboardService: TenantDashboardServiceProxy,
        private _currencyPipe: CurrencyPipe,
        private _myCommissionSPService: MyCommissionSPServiceProxy
    ) {
        super(injector);
        this.profitSharePieChart = new ProfitSharePieChart(this._dashboardService, '#m_chart_profit_share');
    }

    ngOnInit(): void {
        this.getListTaskFilter();
        this.memberCode = this._appSessionService.user.userName;
        this.getAllInformation(this.memberCode, this.filters);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {   
            $('.ui-paginator-rpp-options').after('items per page');
        }, 0);
    }

    filterLoading = false;
    getListTaskFilter() {
        this.filterLoading = true;
        this.filterResult = [
            { "filterCode": "UC", "filterName": "Update Customer" },
            { "filterCode": "FUP", "filterName": "Follow Up Payment" }
        ];

        setTimeout(() => {
            $('.task-filter').selectpicker('refresh');
            this.filterLoading = false;
        }, 3000);
    }

    onChangeTaskFilter(obj) {
        if (obj != undefined) {
            this.getAllInformation(this.memberCode, this.filters);
        }
    }

    getAllInformation(memberCode, filters): void {
        this.primengDatatableHelper.showLoadingIndicator();
        this.getTotalExpectedCommission(memberCode);
        this.getTotalPaidCommission(memberCode);
        this.getTotalProcessedCommission(memberCode);

        filters.projectId = (filters.projectId == undefined ? "" : filters.projectId);
        filters.termId = (filters.termId == undefined ? "" : filters.termId);
        filters.statusId  = (filters.statusId == undefined ? "" : filters.statusId);
        filters.startDate  = (filters.startDate == undefined ? "" : filters.startDate);
        filters.endDate  = (filters.endDate == undefined ? "" : filters.endDate);

        this._myCommissionSPService.getTaskListMyCommission(memberCode)
        .finally(() => {
            this.primengDatatableHelper.hideLoadingIndicator();
        })
        .subscribe((result) => {
            this.primengDatatableHelper.records = result;
            this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
            this.primengDatatableHelper.totalRecordsCount = result.length;
            this.primengDatatableHelper.hideLoadingIndicator();

            this.profitSharePieChart.init(this.totalExpectedCommission,this.totalPaidCommission,this.processedCommission);

        }, err => {
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    }

    taskListEvent(event = null,) {
        if (event) {
            this.firstTaskList = event.first;
        } else {
            this.getAllInformation(this.memberCode, this.filters);
        }
    }

    showDetails(bookCode): void {
        this.detailCommissionModal.show(bookCode);
    }

    totalExpectedCommission:number;
    getTotalExpectedCommission(memberCode): void{
        this._myCommissionSPService.getTotalExpectedCommission(memberCode)
        .subscribe(result => {
            this.totalExpectedCommission = result.totalExpectedCommission == undefined ? 0 : result.totalExpectedCommission;
        })
    }

    totalPaidCommission:number;
    getTotalPaidCommission(memberCode): void{
        this._myCommissionSPService.getTotalPaidCommission(memberCode)
        .subscribe(result => {
            this.totalPaidCommission = result.totalPaidCommission == undefined ? 0 : result.totalPaidCommission;
        });
    }

    processedCommission:number;
    getTotalProcessedCommission(memberCode){
        this._myCommissionSPService.getTotalProcessedCommission(memberCode)
        .subscribe(result => {
            this.processedCommission = result.processedCommission == undefined ? 0 : result.processedCommission;
        });
    }
    
}

abstract class DashboardChartBase {
    loading = true;

    showLoading() {
        setTimeout(() => { this.loading = true; });
    }

    hideLoading() {
        setTimeout(() => { this.loading = false; });
    }
}

class ProfitSharePieChart extends DashboardChartBase {
    //== Profit Share Chart.
    //** Based on Chartist plugin - https://gionkunz.github.io/chartist-js/index.html

    _canvasId: string;
    // data: number[];

    constructor(private _dashboardService: TenantDashboardServiceProxy, canvasId: string) {
        super();
        this._canvasId = canvasId;
    }

    init(totalExpected,totalPaid,processedCommission) {
        // this.data = data;
        if ($(this._canvasId).length === 0) {
            return;
        }

        var chart = new Chartist.Pie(this._canvasId, {
            series: [{
                value: totalExpected,
                className: 'Total Expected',
                meta: {
                    color: mUtil.getColor('brand')
                }
            },
            {
                value: totalPaid,
                className: 'Total Paid',
                meta: {
                    color: mUtil.getColor('accent')
                }
            },
            {
                value: processedCommission,
                className: 'Processed Commission',
                meta: {
                    color: mUtil.getColor('warning')
                }
            }
            ],
            labels: [1, 2, 3]
        }, {
                donut: true,
                donutWidth: 17,
                showLabel: false
            });

        chart.on('draw', (data) => {
            if (data.type === 'slice') {
                // Get the total path length in order to use for dash array animation
                var pathLength = data.element._node.getTotalLength();

                // Set a dasharray that matches the path length as prerequisite to animate dashoffset
                data.element.attr({
                    'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
                });

                // Create animation definition while also assigning an ID to the animation for later sync usage
                var animationDefinition = {
                    'stroke-dashoffset': {
                        id: 'anim' + data.index,
                        dur: 1000,
                        from: -pathLength + 'px',
                        to: '0px',
                        easing: Chartist.Svg.Easing.easeOutQuint,
                        // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
                        fill: 'freeze',
                        'stroke': data.meta.color
                    }
                };

                // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
                if (data.index !== 0) {
                    (animationDefinition['stroke-dashoffset'] as any).begin = 'anim' + (data.index - 1) + '.end';
                }

                // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us

                data.element.attr({
                    'stroke-dashoffset': -pathLength + 'px',
                    'stroke': data.meta.color
                });

                // We can't use guided mode as the animations need to rely on setting begin manually
                // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
                data.element.animate(animationDefinition, false);
            }
        });

        this.hideLoading();
    }
}