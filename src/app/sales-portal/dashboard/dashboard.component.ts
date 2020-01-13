import { Component, AfterViewInit, Injector, ViewEncapsulation, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import {
    TenantDashboardServiceProxy,
    DashboardSPServiceProxy,
    GetTotalUnitSoldDto,
    GetTotalCommissionDto,
    GetTotalCommissionPaidDto,
    TaskListSPServiceProxy,
    MyProfileSPServiceProxy,
    MyCustomerSPServiceProxy,
    GetChildListDto,
    GetRevenueAndTaxDto,

} from '@shared/service-proxies/service-proxies';
import { DataTable } from 'primeng/components/datatable/datatable';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppSalesSummaryDatePeriod } from '@shared/AppEnums';
declare let d3, Datamap: any;
import * as _ from 'lodash';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./dashboard.component.css'],
    animations: [appModuleAnimation()]
})
export class DashboardComponent extends AppComponentBase implements OnDestroy {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('ActiveStartDate') activeStartDate: ElementRef;
    @ViewChild('ActiveEndDate') activeEndDate: ElementRef;

    appSalesSummaryDateInterval = AppSalesSummaryDatePeriod;
    selectedSalesSummaryDatePeriod: any = AppSalesSummaryDatePeriod.Daily;
    dashboardTotalProfit: DashboardTotalProfit;
    dashboardTotalUnitSold: DashboardTotalUnitSold;
    dashboardTotalHotCustomer: DashboardTotalHotCustomer;
    dashboardTotalCancelUnit: DashboardTotalCancelUnit;

    salesSummaryChart: SalesSummaryChart;
    dailySalesChart: DailySalesChart;
    unitTransactionPieChart: UnitTransactionPieChart;
    ppTransactionPieChart: PpTransactionPieChart;
    filters: any = [];
    totalComm: GetTotalCommissionDto[];
    totalCommPaid: GetTotalCommissionPaidDto[];
    totalUnitTransaction: GetTotalUnitSoldDto[];
    memberCode;
    // memberCode = "118886800127";

    startDate;
    endDate;
    summary;
    summaryDaily = 1;
    totalSummary = 5;
    isSummary: number;
    totCommissions: any[];
    customers: any[];
    potentials: any[];
    totalcommissions: number;
    _totalpaid: number;
    inputUn: number;
    // inputUn = 0;
    // inputUnPP = 22;

    getStartDate;
    getEndDate;

    showAllChart: boolean = true;
    showLoadingFilter: boolean = false;
    weekFilter: boolean = false;
    finalStartDate;
    finalEndDate;

    unit;
    unitTransaction;
    pp;
    ppTransaction;
    totalRecordsCount;
    totalRecordsCountt;
    defaultRecordsCountPerPages;

    firstTaskList = 0;
    records;
    first = 0;
    parents: String;
    _childs: GetChildListDto[];
    parentMemberCode;

    memberList: any = [];

    totalProfit: any;
    totalUnit: any;
    totalCancel: any;
    totalCustomer: any;
    totalSales: any;
    totalRevenue: any;
    totalTax: any;
    revenues: number;
    taxs: number;
    totals: number;


    total: any;
    ppPercent: any;
    totalTransaction: any;
    unitPercent: any;

    dataMembers;
    dailyUnit: number;

    salesSummary: any = [];
    dailySummary: any = [];
    customerSummary: any = [];
    commissionSummary: any = [];

    constructor(
        injector: Injector,
        private _dashboardService: TenantDashboardServiceProxy,
        private _dashboardSPService: DashboardSPServiceProxy,
        private _taskListSPService: TaskListSPServiceProxy,
        private _myProfileSPServerProxy: MyProfileSPServiceProxy,
        private _myCustomerSPServiceProxy: MyCustomerSPServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
        this.dashboardTotalProfit = new DashboardTotalProfit();
        this.dashboardTotalUnitSold = new DashboardTotalUnitSold();
        this.dashboardTotalHotCustomer = new DashboardTotalHotCustomer();
        this.dashboardTotalCancelUnit = new DashboardTotalCancelUnit();

        this.salesSummaryChart = new SalesSummaryChart(this._dashboardService, 'salesStatistics');
        this.dailySalesChart = new DailySalesChart(this._dashboardService, 'dailyStatistics');
        this.unitTransactionPieChart = new UnitTransactionPieChart(this._dashboardService, '#m_chart_unit_transaction');
        this.ppTransactionPieChart = new PpTransactionPieChart(this._dashboardService, '#m_chart_pp_transaction');
    }

    ngOnInit(): void {
        // let param = this._activatedRoute.snapshot.queryParams['id'];
        // console.log(param)
        // this._activatedRoute.params.subscribe(params => {
        //     console.log('params',params);
        //     if (params.membercode !=undefined) localStorage.setItem('memberCode', params.membercode);
        //     if (params.domainlogin !=undefined) localStorage.setItem('domainLogin', params.domainlogin);
        //     if (params.ippublic !=undefined) localStorage.setItem('ippublicFromService', params.ippublic);
        // });
        // if (param) {
        //     let domainlogin = param.split("&")[0];
        //     let membercode = param.split("&")[1];
        //     let ippublicfromservice = param.split("&")[2];
        //     localStorage.setItem('memberCode', membercode);
        //     localStorage.setItem('domainLogin', domainlogin);
        //     localStorage.setItem('ippublicFromService', ippublicfromservice);
        // }
        this.memberCode = this._appSessionService.user.userName;
        this.inputUn = this._appSessionService.userId;
        // this.getProductsData(this.memberCode);
        this.summary = 1;
        this.finalStartDate = "2017-11-2"
        this.finalEndDate = "2019-11-2"
        this.getTotalProfit(this.memberCode);
        this.getMemberList(this.memberCode);
        this.getTaskListSP(this.memberCode);
        this.getParentList(this.memberCode);
        this.getUnitTransaction(this.inputUn);
        this.getTotalSales(this.memberCode, this.totalSummary, this.finalStartDate, this.finalEndDate);
        this.getRevenueAndTax(this.memberCode, this.totalSummary, this.finalStartDate, this.finalEndDate);
        this.getSalesSummary(this.memberCode, this.summary, this.finalStartDate, this.finalEndDate);
        this.getTotalUnitDaily(this.inputUn, this.summaryDaily);

    }
    ngAfterViewInit(): void {
        setTimeout(() => {   
            $('.ui-paginator-rpp-options').after('items per page');
        }, 0);
    }
    ifTotalSales: boolean = true;
    getTotalSales(memberCode, totalSummary, finalStartDate, finalEndDate) {
        this._dashboardSPService
            .getTotalSales(memberCode, totalSummary, finalStartDate, finalEndDate)
            .subscribe(result => {
                result.forEach(items => {
                    this.totalSales = items.total;
                });
                if (this.totalSales == undefined) {
                    this.ifTotalSales = false;
                }
            })
    }

    ifTotalRevenue: boolean = true;
    getRevenueAndTax(memberCode, totalSummary, finalStartDate, finalEndDate) {
        this._dashboardSPService
            .getRevenueAndTax(memberCode, totalSummary, finalStartDate, finalEndDate)
            .subscribe(result => {
                result.forEach(items => {
                    this.totalRevenue = items.revenue == undefined ? 0 : items.revenue;
                    this.totalTax = items.tax == undefined ? 0 : items.tax;
                });
                if (this.totalRevenue == undefined) {
                    this.ifTotalRevenue = false;
                }
            })
    }

    // noData: boolean= true;
    getSalesSummaryRevenueTax(memberCode, summary, finalStartDate, finalEndDate) {
        this._dashboardSPService
            .getRevenueAndTax(memberCode, summary, finalStartDate, finalEndDate)
            .finally(() => {
                setTimeout(() => {
                    this.salesSummaryChart.init(this.salesSummary)
                }, 200);
            })
            .subscribe(result => {
                // if (result.length == 0) {
                //     this.noData = true
                // } else {
                if (summary == 1 || summary == 2 || summary == 3) {
                    result.forEach(items => {
                        let date = moment(items.date).format('YYYY-MM-DD');
                        this.salesSummary.push({
                            period: date,
                            revenue: items.revenue,
                            tax: items.tax
                        })
                    })
                } else {
                    result.forEach(items => {
                        let date = moment(items.date).format('YYYY-MM-DD');
                        this.salesSummary.push({
                            period: items.year,
                            revenue: items.revenue,
                            tax: items.tax
                        })
                    })
                }
                // }
            })
    }

    getSalesSummary(memberCode, summary, finalStartDate, finalEndDate) {
        this._dashboardSPService
            .getTotalSales(memberCode, summary, finalStartDate, finalEndDate).finally(() => {
                this.getSalesSummaryRevenueTax(memberCode, summary, finalStartDate, finalEndDate);
            })
            .subscribe(result => {
                if (summary == 1 || summary == 2 || summary == 3) {
                    result.forEach(items => {
                        let date = moment(items.date).format('YYYY-MM-DD');
                        this.salesSummary.push({
                            period: date,
                            total_sales: items.total
                        })
                    })
                } else {
                    result.forEach(items => {
                        let date = moment(items.date).format('YYYY-MM-DD');
                        this.salesSummary.push({
                            period: items.year,
                            total_sales: items.total
                        })
                    })
                }
            })
    }


    getDailyPPTransaction(inputUnPP) {
        this._dashboardSPService
            .getDailyPPTransaction(inputUnPP).finally(() => {
                setTimeout(() => {
                    this.dailySalesChart.init(this.dailySummary);
                }, 200);
            })
            .subscribe(result => {
                result.forEach(items => {
                    let dateInput = moment(items.date).format('YYYY-MM-DD');
                    if (items.date != undefined && items.total != undefined) {
                        this.dailySummary.push({
                            period: dateInput,
                            pp: items.total
                        })
                    }
                })
            })
    }

    getTotalUnitDaily(inputUn, summaryDaily) {
        this._dashboardSPService
            .getTotalUnitSold(inputUn, summaryDaily).finally(() => {
                this.getDailyPPTransaction(inputUn);
            })
            .subscribe(result => {
                result.forEach(items => {
                    let dateInput = moment(items.date).format('YYYY-MM-DD');
                    if (items.date != undefined && items.totalUnit != undefined) {
                        this.dailySummary.push({
                            period: dateInput,
                            unit: items.totalUnit
                        });
                    }
                });
            })
    }

    getTotalProfit(memberCode) {
        this.salesSummaryChart.showLoading();
        this._dashboardSPService
            .getTotalProfit(memberCode).finally(() => {
                this.getTotalUnitSold(this.inputUn, this.summary);
                this.getTotalHotCustomer(this.inputUn);
                this.getTotalCancelUnit(this.inputUn);
                this.getPpTransaction(this.inputUn);
                this.getUnitTransaction(this.inputUn);
            })
            .subscribe(result => {
                this.dashboardTotalProfit.init(result.totalProfit);
            })
    }

    getTotalUnitSold(inputUn, totalSummary) {
        this._dashboardSPService
            .getTotalUnitSold(inputUn, totalSummary)
            .subscribe(result => {
                result.forEach(items => {
                    this.totalUnit = items.totalUnit;
                })
                this.dashboardTotalUnitSold.init(this.totalUnit);
            })
    }

    getTotalCancelUnit(inputUn) {
        this._dashboardSPService
            .getTotalCancelUnit(inputUn)
            .subscribe(result => {
                this.dashboardTotalCancelUnit.init(result.totalCancel)
            })
    }

    getTotalHotCustomer(inputUn) {
        this._dashboardSPService
            .getTotalHotCustomer(inputUn)
            .subscribe(result => {
                this.dashboardTotalHotCustomer.init(result.totalCustomer)
            })
    }

    getPpTransaction(inputUn) {
        this._dashboardSPService
            .getPPCancelTransaction(inputUn)
            .subscribe(result => {
                let jumlahPP;
                this.ppPercent = result.total
                this.pp = 100;
                jumlahPP = Math.round(this.pp - result.percent)
                // jumlahPP = Math.round(this.pp-result.total)

                this.ppTransactionPieChart.init(result.percent, jumlahPP);
                // this.ppTransactionPieChart.init(result.total,jumlahPP);
            })
    }

    getUnitTransaction(inputUn) {
        this._dashboardSPService
            .getUnitCancelTransaction(inputUn)
            .subscribe(result => {
                let jumlahUnit;
                this.unitPercent = result.totalTransaction
                this.unit = 100;
                jumlahUnit = Math.round(this.unit - result.percent)
                // jumlahUnit = Math.round(this.unit-result.totalTransaction)

                this.unitTransactionPieChart.init(result.percent, jumlahUnit);
                // this.unitTransactionPieChart.init(result.totalTransaction,jumlahUnit);
            })
    }

    parentMember: any;
    parentList: any;
    getParentList(memberCode) {
        this._myProfileSPServerProxy.getParentList(memberCode)
            .finally(() => {
                setTimeout(() => {
                    $('.parent').selectpicker('refresh');
                }, 0);
            })
            .subscribe(result => {
                result.forEach(items => {
                    this.memberList = items.parentMemberCode
                    this.parentMember = items.memberName;
                })
                this.parents = this.parentMember;
                this.getChildList(this.memberList);
                if (this.parents == undefined) {
                    this.showAllChart = false;
                }
            });
    }

    getChildList(parentMemberCode) {
        this._myProfileSPServerProxy.getChildList(parentMemberCode)
            .finally(() => {
                setTimeout(() => {
                    $('.child').selectpicker('refresh');
                }, 0);
            }).subscribe(result => {
                this._childs = result;
            })
    }


    onStartDate(startdate) {
        let startInput = moment(startdate).format('MM/DD/YYYY');
        this.finalStartDate = moment(startdate).format('YYYY-MM-DD');
    }
    onEndDate(enddate) {
        let endInput = moment(enddate).format('MM/DD/YYYY');
        this.finalEndDate = moment(enddate).format('YYYY-MM-DD');
    }
    onChangeFilter(summary) {
        this.startDate = "";
        this.endDate = "";
        $("#salesStatistics").empty();
        this.salesSummary = [];
        setTimeout(() => {
            this.getSalesSummary(this.memberCode, summary, this.finalStartDate, this.finalEndDate);
        }, 3100)
    }

    reload() {
        this.getUnitTransaction(this.inputUn);
        this.getPpTransaction(this.inputUn);
    }

    // invalidStartDate: boolean = false;
    // onSelectedDate(startdate,enddate) {
    //     console.log(startdate);
    //     console.log(enddate);
    //     let startInput = moment(startdate).format('MM/DD/YYYY');
    //     let endInput = moment(enddate).format('MM/DD/YYYY');
    //     console.log(startInput);
    //     console.log(endInput);


    //         this.invalidStartDate = false;
    //         this.finalStartDate = moment(startdate).format('YYYY-MM-DD');
    //         this.finalEndDate = moment(enddate).format('YYYY-MM-DD');


    // }

    ngOnDestroy() {
    }

    getTaskListSP(memberCode): void {
        this.primengDatatableHelper.showLoadingIndicator();
        this._taskListSPService.getTaskListSalesPortal(memberCode)
            .subscribe(result => {
                this.primengDatatableHelper.records = result;
                this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
                this.totalRecordsCountt = result.length;
                this.primengDatatableHelper.hideLoadingIndicator();
            }, err => {
                this.primengDatatableHelper.hideLoadingIndicator();
            })
    }

    getMemberList(memberCode): void {
        this.primengDatatableHelper.showLoadingIndicator();
        this._dashboardSPService.getListMember(memberCode)
            .subscribe(result => {
                this.records = result;
                this.defaultRecordsCountPerPages = 5;
                this.primengDatatableHelper.totalRecordsCount = result.length;
                this.primengDatatableHelper.hideLoadingIndicator();
            }, err => {
                this.primengDatatableHelper.hideLoadingIndicator();
            })
    }

    taskListEvent(event = null) {
        if (event) {
            this.firstTaskList = event.first;
        } else {
            this.getMemberList(this.memberCode);
        }
    }
    taskListEventt(event = null) {
        if (event) {
            this.first = event.first;
        } else {
            this.getTaskListSP(this.memberCode);
        }
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

class UnitTransactionPieChart extends DashboardChartBase {
    //== Profit Share Chart.
    //** Based on Chartist plugin - https://gionkunz.github.io/chartist-js/index.html

    _canvasId: string;
    // data: number[];

    constructor(private _dashboardService: TenantDashboardServiceProxy, canvasId: string) {
        super();
        this._canvasId = canvasId;
    }

    dataTotal() {

    }

    init(totalTransaction, unit) {
        // this.data = data;
        if ($(this._canvasId).length === 0) {
            return;
        }

        var chart = new Chartist.Pie(this._canvasId, {
            series: [{
                value: totalTransaction,
                className: 'unitTransaction',
                meta: {
                    color: mUtil.getColor('warning')
                }
            },
            {
                value: unit,
                className: 'unitTransaction',
                meta: {
                    color: '#bec6d6'
                }
            },
                // {
                //     value: data[2],
                //     className: 'custom',
                //     meta: {
                //         color: mUtil.getColor('warning')
                //     }
                // }
            ],
            labels: [1, 2]
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

class PpTransactionPieChart extends DashboardChartBase {
    //== Profit Share Chart.
    //** Based on Chartist plugin - https://gionkunz.github.io/chartist-js/index.html

    _canvasId: string;
    // data: number[];

    constructor(private _dashboardService: TenantDashboardServiceProxy, canvasId: string) {
        super();
        this._canvasId = canvasId;
    }

    dataTotal() {

    }

    init(total, pp) {
        // this.data = data;
        if ($(this._canvasId).length === 0) {
            return;
        }

        var chart = new Chartist.Pie(this._canvasId, {
            series: [{
                value: total,
                className: 'ppTransaction',
                meta: {
                    color: mUtil.getColor('success')
                }
            },
            {
                value: pp,
                className: 'ppTransaction',
                meta: {
                    color: '#bec6d6'
                }
            },
                // {
                //     value: data[2],
                //     className: 'custom',
                //     meta: {
                //         color: mUtil.getColor('warning')
                //     }
                // }
            ],
            labels: [1, 2]
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

class SalesSummaryChart extends DashboardChartBase {
    //Sales summary => MorrisJs: https://github.com/morrisjs/morris.js/

    instance: morris.GridChart;

    constructor(private _dashboardService: TenantDashboardServiceProxy, private _containerElement: any) {
        super();
    }

    init(salesSummaryData) {
        // this.instance = Morris.Line({
        Morris.Line({
            element: this._containerElement,
            gridLineColor: '#6a9afc',
            axes: true,
            data: salesSummaryData,
            fillOpacity: 1,
            lineColors: ['#e84118', '#ffb414', '#1456ff'],
            xkey: 'period',
            ykeys: ['total_sales', 'revenue', 'tax'],
            labels: ['Total Sales', 'Revenue', 'Tax'],
            pointSize: 4,
            lineWidth: 4,
            hideHover: 'auto',
            resize: true
        });

        this.hideLoading();
    }

    // reload(datePeriod) {
    //     this.showLoading();
    //     this._dashboardService
    //         .getSalesSummary(datePeriod)
    //         .subscribe(result => {
    //             this.instance.setData(result.salesSummary, true);
    //             this.hideLoading();
    //         });
    // }
}

class DailySalesChart extends DashboardChartBase {
    //Sales summary => MorrisJs: https://github.com/morrisjs/morris.js/

    instance: morris.GridChart;

    constructor(private _dashboardService: TenantDashboardServiceProxy, private _containerElement: any) {
        super();
    }

    init(dailySalesData) {
        this.instance = Morris.Bar({
            element: this._containerElement,
            barColors: ["#B21516", "#1531B2"],
            axes: true,
            data: dailySalesData,
            xkey: 'period',
            ykeys: ['unit', 'pp'],
            labels: ['Total Unit', 'PP Transaction'],
            hideHover: 'auto',
            resize: true
        });

        this.hideLoading();
    }

    // reload(datePeriod) {
    //     this.showLoading();
    //     this._dashboardService
    //         .getSalesSummary(datePeriod)
    //         .subscribe(result => {
    //             this.instance.setData(result.salesSummary, true);
    //             this.hideLoading();
    //         });
    // }
}

// class DashboardHeaderStats extends DashboardChartBase {

//     totalProfit = 0; totalProfitCounter = 0;
//     newFeedbacks = 0; newFeedbacksCounter = 0;
//     newOrders = 0; newOrdersCounter = 0;
//     newUsers = 0; newUsersCounter = 0;

//     totalProfitChange = 76; totalProfitChangeCounter = 0;
//     newFeedbacksChange = 85; newFeedbacksChangeCounter = 0;
//     newOrdersChange = 45; newOrdersChangeCounter = 0;
//     newUsersChange = 57; newUsersChangeCounter = 0;

//     init(totalProfit, newFeedbacks, newOrders, newUsers) {
//         this.totalProfit = totalProfit;
//         this.newFeedbacks = newFeedbacks;
//         this.newOrders = newOrders;
//         this.newUsers = newUsers;
//         this.hideLoading();
//     }
// }

class DashboardTotalProfit extends DashboardChartBase {

    totalProfit = 0; totalProfitCounter = 0;

    totalProfitChange = 100; totalProfitChangeCounter = 0;

    init(totalProfit) {
        this.totalProfit = totalProfit;
        this.hideLoading();
    }
}

class DashboardTotalUnitSold extends DashboardChartBase {

    totalUnit = 0; totalUnitCounter = 0;

    totalUnitChange = 100; totalUnitChangeCounter = 0;

    init(totalUnit) {
        this.totalUnit = totalUnit;
        this.hideLoading();
    }
}

class DashboardTotalHotCustomer extends DashboardChartBase {

    totalCustomer = 0; totalCustomerCounter = 0;

    totalCustomerChange = 100; totalCustomerChangeCounter = 0;

    init(totalCustomer) {
        this.totalCustomer = totalCustomer;
        this.hideLoading();
    }
}

class DashboardTotalCancelUnit extends DashboardChartBase {

    totalCancel = 0; totalCancelCounter = 0;

    totalCancelChange = 100; totalCancelChangeCounter = 0;

    init(totalCancel) {
        this.totalCancel = totalCancel;
        this.hideLoading();
    }
}
