import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    Injector,
    ViewContainerRef,
    ElementRef,
    ViewEncapsulation,
    HostListener
} from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    DiagramaticServiceProxy,
    ProjectServiceProxy,
    ListTowerResultDto,
    ListProjectResultDto,
    ListResultDtoOfListProjectResultDto,
    UnitsDto,
    IUnitsDto,
    GetDiagramaticForWebListDto,
    IGetDiagramaticForWebListDto,
    ListResultDtoOfListProjectInfoResultDto,
    GetAllProjectListDto,
    ListZoningResultDto,
    ListBedroomResultDto,
    TransactionServiceProxy
} from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { setTimeout } from 'timers';
import { hidden } from "@angular-devkit/core/src/terminal/colors";

import { DiagrammaticDetailModalComponent } from 'app/main/diagrammatic/diagrammatic-detail-modal.component';
import { DetailDiagrammaticComponent } from './detail-diagramatic/detail-diagrammatic.component';
import { PPNoModalComponent } from 'app/main/diagrammatic/ppno-modal.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';

export class FormControl {
    project: any;
    tower: any;
    view: any;
    bedroom: any;
    unittype: any;
}

@Component({
    selector: 'app-diagrammatic2',
    templateUrl: './diagrammatic.component.html',
    styleUrls: ['./diagrammatic.component.css'],
    animations: [appModuleAnimation()]
})
export class DiagrammaticComponent extends AppComponentBase implements OnInit, AfterViewInit {
    primengDatatableHelper: any;
    diagrammatic_data: any[];
    diagrammaticType: any[];
    columnunitype: any[];
    dtOptions: any = {};
    showdiagramatic: Boolean = false;
    showSelectedButton: Boolean = false;
    showtowername: Boolean = true;
    showdetaildiagramatic: any;
    datadetailunit: any;
    process = false;
    isDesktop = true;
    params: any;
    thisroute;
    _detaildiagrammatic: DetailDiagrammaticComponent;
    _floors: GetDiagramaticForWebListDto[];
    _projects: ListProjectResultDto[];
    _towers: ListTowerResultDto[];
    _zonings: ListZoningResultDto[];
    _bedrooms: ListBedroomResultDto[];
    _unittype = [];

    withParams = false;
    paramTower: any;
    paramUnitType: any;
    selectZone = '';
    selectBedRoom = '';
    disableButton = false;
    dataTableDestroyed = false;

    dtTrigger: Subject<any> = new Subject();
    unittype: any[];

    form_control: FormControl = new FormControl();
    _form_control: FormControl = new FormControl();
    formGroup: FormGroup;
    sub;
    showloading = false;

    @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
    @ViewChild('detailDiagramatic') detailDiagramatic: DetailDiagrammaticComponent;
    @ViewChild('detailDiagrammaticModal') detailDiagrammaticModal: DiagrammaticDetailModalComponent;
    @ViewChild('ppnoModal') ppnoModal: PPNoModalComponent;

    constructor(injector: Injector,
        private _script: ScriptLoaderService,
        private _diagramaticService: DiagramaticServiceProxy,
        private _projectService: ProjectServiceProxy,
        private _transaction: TransactionServiceProxy,
        private _fb: FormBuilder,
        private _router: Router,
        public _appSessionService: AppSessionService,
        private _activeroute: ActivatedRoute) {
        super(injector);
        this.formBuilder = {
            'project': [null, Validators.compose([Validators.required])],
            'tower': [null, Validators.compose([Validators.required])],
            'unittype': [null],
            'view': [null],
            'bedroom': [null],
            'nullform': [null]
        };
        this.formGroup = this._fb.group(this.formBuilder);
        this.form_control = this.form_control_();
    }

    formBuilder = {};
    customerCode: any;
    customerName: any;
    fromCustomer: boolean;
    custID: any;
    customerPotential: any;
    fromPotential: boolean;
    isDiagramatic: boolean;
    isSvg: boolean;
    ngOnInit(): void {
        this.isDiagramatic = true;
        this.isSvg = false;
        this._activeroute.queryParams.subscribe(param => {
            this.customerCode = param.customerCode;
            this.customerName = param.customerName;
            this.custID = param.custID;
            if (this.custID !== undefined) {
                this.fromPotential = true;
            } else if (this.customerCode !== undefined && this.customerName !== undefined) {
                this.fromCustomer = true;
            }
        })

        if (window.innerWidth <= 980) {
            this.isDesktop = false;
        }
        this.sub = this._activeroute.params.subscribe(params => {
            if (params.projectID !== undefined && params.clusterID !== undefined) {
                this.withParams = true;
                this.showloading = true;

                this._form_control.project = params.projectID;
                this.paramTower = params.clusterID;
                if (params.unitType !== undefined) {
                    this.paramUnitType = params.unitType;
                }
            }
            this.getListProject();
        });
        this.thisroute = this._router.url;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (window.innerWidth <= 980) {
            this.isDesktop = false;
        }
    }

    ngAfterViewInit(): void {
        this._detaildiagrammatic = this.detailDiagramatic;
    }

    arraycontains(a, obj) {
        for (let i = 0; i < a.length; i++) {
            if (a[i].title.toUpperCase() === obj.title.toUpperCase()) {
                return true;
            }
        }
        return false;
    }

    form_control_() {
        return {
            project: this.formGroup.controls['project'],
            tower: this.formGroup.controls['tower'],
            view: this.formGroup.controls['nullform'],
            bedroom: this.formGroup.controls['nullform'],
            unittype: this.formGroup.controls['nullform'],
        };
    }

    towerName = "";
    projectName = "";
    diagramaticLoading = false;
    diagramaticTableLoading = false;
    boxdiagrammaticLoading = false;

    showdiagramaticlist() {
        if (this._form_control.project != "" && this._form_control.tower.split("|")[0] != "") {
            // this.isSvg = false;
            // setTimeout(() => {
            //     this.isDiagramatic = true;
            // }, 1000);
            if (this.isSvg == true) {
                this.isSvg = false;
                this.isDiagramatic = true;
            }
            this.getdiagramaticList(this._form_control.project, this._form_control.tower.split("|")[0]);
        }
    }

    initDataTable() {
        this.disableButton = true;
        if (this.showdiagramatic === true) {
            this.diagramaticLoading = true;
            this.diagramaticTableLoading = true;
            this.datatableElement.dtInstance
            .then((dtInstance: DataTables.Api) => {
                    // Destroy the table first
                    this.dataTableDestroyed = true;
                    dtInstance.destroy();
                    $('.table-diagramatic').empty();
                    this.showtowername = true;
                    setTimeout(() => {
                        this.diagramaticLoading = false;
                        this.diagramaticTableLoading = false;
                        this.showdiagramatic = true;
                        this.showSelectedButton = true;
                        this.configDatatable();
                    }, 3000);
                });

        } else {
            this.diagramaticLoading = true;
            this.showdiagramatic = true;
            this.showSelectedButton = true;
            setTimeout(() => {
                this.diagramaticLoading = false;
                this.configDatatable();
            }, 3000);
        }
        this.selectZone = this._form_control.view;
        this.selectBedRoom = this._form_control.bedroom;
        this.projectName = this._form_control.project;
        this.towerName = this._form_control.tower.split("|")[1];
        this.boxdiagrammaticLoading = true;
    }

    unittypeLoading = false;
    diagrammaticWidth = '100%';
    headerUnit;
    rowUnit = [];
    initHeaderUnit() {
        this.headerUnit = [];
        this.headerUnit.push({ 'displayName': 'Units', 'Units': 'Units' });
    }
    mouseHover(e) {
        this.detailDiagramatic.show(0, 0, 0);

    }
    mouseLeave(e) {
        this.detailDiagramatic.hide();

    }
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    getdiagramaticList(projectID: number, towerID: number, detailID?: number) {
        // this.isSvg = false;
        // this.isDiagramatic = true;
        this.process = true;
        // this.unittypeLoading = true;
        this.diagramaticLoading = true;
        this.disableButton = true;
        // this.zoningLoading = true;
        // this.bedroomLoading = true;

        this._diagramaticService.getTypeDiagramatic(projectID, towerID, detailID)
            .finally(() => {
                if (this.diagrammaticType.length) {
                    this._diagramaticService.getListDiagramaticWeb(projectID, towerID, detailID)
                        .finally(() => {
                            if (this.withParams === true) {
                                this.withParams = false;
                            }
                            setTimeout(() => {
                                $('.unittype').selectpicker('refresh');
                                this.diagramaticLoading = false;
                                this.disableButton = false;
                                // this.zoningLoading = false;
                                // this.unittypeLoading = false;
                                // this.bedroomLoading = false;
                            }, 0);

                            this.initDataTable();
                            
                            localStorage.setItem("SVGMap", JSON.stringify({
                                "projectId": this._form_control.project,
                                "clusterId": this._form_control.tower.split("|")[0],
                                "unitType": this._form_control.unittype,
                                "zoningId": this.zoningID,
                                "bedroom": this._form_control.bedroom
                            }));
                            this.initSiteplanSVG();
                        })
                        .subscribe(result => {
                            let diagrammaticType = this.diagrammaticType[0].category;
                            for (let i = 0; i < result.length; i++) {
                                if (result[i].floor === null) result[i].floor = "-";
                            }
                            this._floors = result;
                            this.unittype = [{ 'title': '0', 'data': 'floor', 'width': 'auto' }];
                            this._unittype = [];
                            let listUnitType = [];
                            if (this._floors.length > 0) {
                                //sort floor desc
                                this._floors.sort(function (a, b) {
                                    return parseInt(b.floor) - parseInt(a.floor);
                                });

                                this._floors.forEach(floor => {

                                    let units: IUnitsDto[] = floor.units;
                                    units.forEach(unit => {
                                        // let keyUnittype = unit.unitNo.substring(2).replace('.', '_');
                                        let typeName;
                                        let detailName = '';
                                        let headertext;

                                        if (diagrammaticType.toUpperCase() == 'MEIKARTA') {
                                            if (unit.typeName.replace('.', '') == "") {
                                                typeName = unit.typeName;
                                            } else {
                                                typeName = unit.typeName.replace('.', '');
                                            }
                                            //jangan hapus dulu !!
                                            // }else if (diagrammaticType.toUpperCase()=='HIGHRISE'){
                                            //     if (unit.detailCode.replace('.', '')==""){
                                            //         typeName = unit.detailCode;
                                            //     }else{
                                            //         typeName = unit.detailCode.replace('.', '');
                                            //     }
                                            //     typeName = unit.detailCode;
                                        } else {
                                            if (unit.detailCode.replace('.', '') == "") {
                                                typeName = unit.detailCode;
                                            } else {
                                                typeName = unit.detailCode.replace('.', '');
                                            }
                                            // typeName = unit.detailCode;
                                        }

                                        if (unit.detailName != undefined) detailName = unit.detailName.toUpperCase();

                                        let obj_coulmn = {
                                            'title': typeName.toUpperCase(),
                                            'title_data': typeName.toUpperCase(),
                                            'detail_name': detailName,
                                            'unitType': unit.unitType.toUpperCase(),
                                            'data': typeName.toUpperCase() + '.unitNo',
                                            'orderable': false,
                                            'width': 'auto'
                                        };
                                        // keyUnittype.toUpperCase() + '.unitNo',
                                        if (!this.arraycontains(this.unittype, obj_coulmn)) {
                                            let unittype_filter;
                                            if (diagrammaticType.toUpperCase() == 'LANDED') {
                                                unittype_filter = obj_coulmn.unitType;
                                            } else {
                                                unittype_filter = obj_coulmn.unitType;
                                            }
                                            this.unittype.push(obj_coulmn);
                                            this._unittype.push(unittype_filter);
                                            this._unittype = this.sortUnitType(this._unittype.filter(this.onlyUnique), "dropdown-unittype");
                                        }
                                        floor[typeName.toUpperCase()] = unit;
                                        listUnitType[unit.detailCode] = typeName.toUpperCase();
                                    });
                                });

                                if (this._floors.length !== 1 && this._floors[0].floor !== null) {
                                    this._floors.forEach(floor => {
                                        this.unittype.forEach(item => {
                                            let units = floor.units;
                                            if (!(item.title in floor)) {
                                                let obj_unit = {
                                                    'bedroom': null,
                                                    'unitNo': null,
                                                    'unitStatusCode': null,
                                                    'unitStatusName': null,
                                                    'zoningName': null
                                                };
                                                let title;
                                                if (item.title != undefined) {
                                                    title = item.title.replace('.', '_');
                                                    floor[item.title] = obj_unit;
                                                }
                                            }
                                        });
                                    });
                                }

                                //sort unit type
                                this.unittype = this.sortUnitType(this.unittype, "header-unittype");
                            }

                            this._form_control.unittype = undefined;
                            if (this.withParams === true && this.paramUnitType !== undefined) {
                                if (listUnitType[this.paramUnitType] !== undefined) {
                                    this._form_control.unittype = listUnitType[this.paramUnitType];
                                }
                                this.paramUnitType = undefined;
                            }

                            this.process = false;
                        });
                }
            })
            .subscribe((result) => {
                this.diagrammaticType = result;
                if (this.diagrammaticType.length <= 10) {
                    this.diagrammaticWidth = '100%';
                } else if (this.diagrammaticType.length > 10) {
                    this.diagrammaticWidth = '1500px';
                }
            }, err => {
                this.message.error(err);
            });
    }

    sortUnitType(array, usefor) {
        var result = array.sort(function (a, b) {
            if (a.title != "0") {
                if (usefor === "header-unittype") { a = a.title; b = b.title; }
                else if (usefor === "dropdown-unittype") { a = a; b = b; }

                // var charPart = [a.substring(0,1), b.substring(0,1)],
                //     numPart = [a.substring(1)*1, b.substring(1)*1];

                var charPart = [a.substring(0, 2), b.substring(0, 2)],
                    numPart = [a.substring(2), b.substring(2)];

                if (charPart[0] < charPart[1]) return -1;
                else if (charPart[0] > charPart[1]) return 1;
                else { //(charPart[0] == charPart[1]){
                    if (numPart[0] < numPart[1]) return -1;
                    else if (numPart[0] > numPart[1]) return 1;
                }
            }
        });

        return result;
    }

    configDatatable() {
        let orderColumn = [[0, 'desc']];
        if (this._floors.length <= 1) {
            this.diagrammaticWidth = "100%";
        }
        if (this.diagrammaticType[0].category.toUpperCase() == 'LANDED') {
            orderColumn = [[0, 'asc']];
        }

        this.dtOptions = {
            // destroy: true,
            data: this._floors,
            columns: this.unittype,
            scrollY: '300px',
            paging: false,
            scrollX: true,
            scrollCollapse: false,
            orderable: false,
            searching: false,
            fixedHeader: {
                header: true,
            },
            // fixedColumns: {
            //     leftColumns: 1
            // },
            order: orderColumn,
            headerCallback: (header: Node, data, index: number) => {
                for (let i = 0; i < header.childNodes.length; i++) {
                    if (i != 0) {
                        let th = header.childNodes[i];
                        let headertext;
                        this.diagrammaticType.forEach(item => {
                            if (item.typeCode.replace('.', '') == "") {
                                headertext = item.typeCode;
                            } else {
                                headertext = item.typeCode.replace('.', '');
                            }

                            if (item.category.toUpperCase() == 'MEIKARTA') {
                                if (headertext.toUpperCase() == $(th).html()) {
                                    $(th).html(item.typeCode.toUpperCase() + '<br>' + item.detailName + '<br>' + item.luas + " m<sup>2</sup>");
                                }
                            } else if (item.category.toUpperCase() == 'HIGHRISE') {
                                if (headertext.toUpperCase() == $(th).html()) {
                                    $(th).html(item.typeCode);
                                }
                            } else {
                                if (headertext.toUpperCase() == $(th).html()) {
                                    $(th).html(item.detailCode);
                                }
                            }
                        });
                    } else {
                        let th = header.childNodes[i];
                        if ($(th).html() == '0') {
                            $(th).html('UNITS');
                        }
                    }
                }

            },
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                for (let i = 0; i < row.childNodes.length; i++) {
                    if (i === 0) {
                        let td = row.childNodes[i];
                        $(td).addClass('floor');
                    } else {
                        let key_unit = this.unittype[i].title.replace('.', '_');
                        let key_unit_type = this.unittype[i].unitType.replace('.', '_');
                        let unittype_filter;
                        if (this._form_control.unittype != undefined) {
                            // jangan di hapus dulu !! //
                            // if (this.diagrammaticType[0].category.toUpperCase()=="LANDED"){
                            //     if (this.unittype[i].detail_name.toUpperCase()== this._form_control.unittype){
                            //         unittype_filter = this.unittype[i].title.replace('.', '_');
                            //     }else{
                            //         unittype_filter = '-';
                            //     }
                            // }else{
                            unittype_filter = this._form_control.unittype;
                            // }
                        }

                        if (data[key_unit] !== undefined) {

                            let status = data[key_unit].unitStatusCode;
                            let td = row.childNodes[i];
                            if (unittype_filter) {
                                if (unittype_filter === "Nothing Selected") {
                                    // $(td).removeClass('highlight');
                                    if (status === 'A') {
                                        //add listener detail
                                        this.addListener(td, data, key_unit);
                                        $(td).addClass('available');
                                    } else if (status === 'Z') {
                                        //add listener detail
                                        this.addListener(td, data, key_unit);
                                        $(td).addClass('reserved');
                                    } else if (status === 'S') {
                                        //add listener detail
                                        this.addListener(td, data, key_unit);
                                        $(td).addClass('sold');
                                    }
                                } else {
                                    if (key_unit_type == unittype_filter) {
                                        if (status === 'A') {
                                            //add listener detail
                                            this.addListener(td, data, key_unit);
                                            $(td).addClass('available');
                                        } else if (status === 'Z') {
                                            //add listener detail
                                            this.addListener(td, data, key_unit);
                                            $(td).addClass('reserved');
                                        } else if (status === 'S') {
                                            //add listener detail
                                            this.addListener(td, data, key_unit);
                                            $(td).addClass('sold');
                                        }
                                    } else if (key_unit == unittype_filter) {
                                        if (status === 'A') {
                                            //add listener detail
                                            this.addListener(td, data, key_unit);
                                            $(td).addClass('available');
                                        } else if (status === 'Z') {
                                            //add listener detail
                                            this.addListener(td, data, key_unit);
                                            $(td).addClass('reserved');
                                        } else if (status === 'S') {
                                            //add listener detail
                                            this.addListener(td, data, key_unit);
                                            $(td).addClass('sold');
                                        }
                                    } else {
                                        // $(td).addClass('highlight');
                                        $(td).html('');
                                        $(td).attr('class', '');
                                    }
                                }
                            } else {
                                if (status === 'A') {
                                    this.addListener(td, data, key_unit);
                                    $(td).addClass('available');
                                } else if (status === 'Z') {
                                    //add listener detail
                                    this.addListener(td, data, key_unit);
                                    $(td).addClass('reserved');
                                } else if (status === 'S') {
                                    //add listener detail
                                    this.addListener(td, data, key_unit);
                                    $(td).addClass('sold');
                                }

                            }

                            if (this.selectZone != '' && this.selectZone != undefined && data[key_unit].zoningName != this.selectZone) {
                                $(td).html('');
                                $(td).attr('class', '');
                                this.removeAllEventListenersFromElement(td);
                            }
                            if (this.selectBedRoom != '' && this.selectBedRoom != undefined && data[key_unit].bedroom != this.selectBedRoom) {
                                $(td).html('');
                                $(td).attr('class', '');
                                this.removeAllEventListenersFromElement(td);
                            }

                        }
                        // }

                    }
                }
                return row;
            }

        };

        setTimeout(() => {
            this.disableButton = false;
            this.dtTrigger.next();
            this.boxdiagrammaticLoading = false;
        }, 2000);
    }

    projectLoading = false;
    getListProject() {
        this.projectLoading = true;

        let memberCode = '';
        if (this._appSessionService.user != undefined) memberCode = this._appSessionService.user.userName;
        this._projectService.getListProjectDiagramatic(memberCode)
            .finally(() => {
                setTimeout(() => {
                    $('.project').selectpicker('refresh');
                    this.projectLoading = false;
                }, 0);
            })
            .subscribe(result => {
                this._projects = result.items;
                //this._form_control.project = result.items[0];
                console.log('Projects', this._projects);
                this._form_control.project = result.items[0].projectID;
            });
    }

    PPnHover;
    checkPPnInHover(event) {
        this._transaction.checkPPnInHover(event)
            .subscribe(result => {
                this.PPnHover = result;
                localStorage.setItem("PPnHover", this.PPnHover)
            })
    }

    onChangeProject(obj) {
        if (obj !== undefined) {
            this._towers = [];
            this._form_control.tower = "";
            this.checkPPnInHover(obj);
            if (this.showdiagramatic == true &&
                this.projectName != this._form_control.project) {
                this.datatableElement.dtInstance
                    .then((dtInstance: DataTables.Api) => {
                        this.showtowername = false;
                        this.showSelectedButton = false;
                        // Destroy the table first
                        this.dataTableDestroyed = true;
                        // dtInstance.destroy();
                        $('.table-diagramatic').empty();
                        $('.dataTables_wrapper').hide();
                        
                        $('#mapsvg').empty();
                        $('.mapsvg-wrap').hide();
                    });
            }
            this.getListTower(obj);
        }
    }

    onChangeTower(obj) {
        if (obj !== null && obj !== undefined) {
            setTimeout(() => {
                $('.tower').selectpicker('refresh');
            }, 0);

            obj = obj.split("|")[0];
            this._zonings = [];
            this._bedrooms = [];

            this._form_control.view = '';
            this._form_control.bedroom = '';
            this._form_control.unittype = '';

            if (this.showdiagramatic == true &&
                this.towerName != this._form_control.tower.split("|")[1]) {
                this.datatableElement.dtInstance
                    .then((dtInstance: DataTables.Api) => {
                        this.showtowername = false;
                        this.showSelectedButton = false;
                        // Destroy the table first
                        this.dataTableDestroyed = true;
                        $('.table-diagramatic').empty();
                        $('.dataTables_wrapper').hide();

                        $('#mapsvg').empty();
                        $('.mapsvg-wrap').hide();
                    });
            }

            if (this._form_control.project != "" && this._form_control.tower.split("|")[0] != "") {
                this.getbedroomandview(this._form_control.project, this._form_control.tower.split("|")[0]);
            }
        }
    }

    towerLoading = false;
    productID;
    searchBox;
    getListTower(projectID: number): void {
        this.towerLoading = true;
        this._diagramaticService.getListTowerByProjectID(projectID,this.productID,this.searchBox)
            .finally(() => {
                // if (this.withParams === true && this.paramTower !== undefined) {
                //     this.paramTower = undefined;
                //
                //     if (this.paramUnitType === undefined) {
                //         this.showdiagramaticlist();
                //     }
                // }
                setTimeout(() => {
                    $('.tower').selectpicker('refresh');
                    this.towerLoading = false;
                }, 0);
            })
            .subscribe(result => {
                this._towers = result.items;
                if (this.withParams === true && this.paramTower !== undefined) {
                    result.items.every(item => {
                        if (item.clusterID == this.paramTower) {
                            this._form_control.tower = item.clusterID + '|' + item.clusterName;
                            return false;
                        }
                        return true;
                    });
                    this.paramTower = undefined;
                }
            });
    }

    zoningLoading = false;
    bedroomLoading = false;
    zoningID;
    bedrooms;
    getbedroomandview(projectID: number, towerID: number) {
        this.zoningLoading = true;
        this._diagramaticService.getListZoning(projectID, towerID)
            .finally(() => {
                setTimeout(() => {
                    $('.zoning').selectpicker('refresh');
                    this.zoningLoading = false;
                }, 0);
            })
            .subscribe(result => {
                this._zonings = result;
                result.forEach(item => {
                    this.zoningID = item.zoningId
                })

            });

        this.bedroomLoading = true;
        this._diagramaticService.getListBedroom(projectID, towerID)
            .finally(() => {
                setTimeout(() => {
                    $('.bedroom').selectpicker('refresh');
                    this.bedroomLoading = false;
                }, 0);
            })
            .subscribe(result => {
                this._bedrooms = result;
                result.forEach(item => {
                    this.bedrooms = item.bedroom
                })

            });
    }


    goToanotherRoute(unitNo: any, unitCode: any, unitID: any) {
        let codeUnit = '';
        if (unitCode != null) {
            codeUnit = unitCode;
        }
        if (this.fromCustomer == true) {
            this._router.navigate(['/app/main/booking-unit', this.customerCode, this.customerName, this._form_control.project, this._form_control.tower.split("|")[0], unitNo, codeUnit, unitID, '', '']);
        } else if (this.fromPotential == true) {
            this._router.navigate(['/app/main/booking-unit', this.custID, this._form_control.project, this._form_control.tower.split("|")[0], unitNo, codeUnit, unitID, '', '']);
        } else {
            this._router.navigate(['/app/main/booking-unit', this._form_control.project, this._form_control.tower.split("|")[0], unitNo, codeUnit, unitID, '', '']);
        }
        localStorage.removeItem('psCode-pp');
    }

    addListener(td: any, data: any, key_unit: string) {
        let dataUnit = data.units;
        if (this.isDesktop) {
            td.addEventListener('click', (evt) => {
                let unitCode;
                if (this.diagrammaticType[0].category.toUpperCase() == "LANDED") {
                    unitCode = data[key_unit].unitCode;
                } else {
                    unitCode = data['unitCode'];
                }
                if (data[key_unit].unitStatusCode == 'A') {
                    if (data[key_unit].isRequiredPP) {
                        this.ppnoModal.show(this._form_control.project, this._form_control.tower.split("|")[0], data[key_unit].unitNo, unitCode, data[key_unit].unitID);
                    } else {
                        this.goToanotherRoute(data[key_unit].unitNo, unitCode, data[key_unit].unitID);
                    }
                }
            });
            td.addEventListener('mouseover', (evt) => {
                this.detailDiagramatic.show(data[key_unit], data[key_unit].unitID, event);
            });
            td.addEventListener('mouseleave', (evt) => {
                this.detailDiagramatic.hide();
            });
            td.addEventListener('mousemove', (evt) => {
                this.detailDiagramatic.updatePosition(event);
            });
        } else {
            td.addEventListener('click', (evt) => {
                this.detailDiagrammaticModal.show(this._form_control.project, this._form_control.tower, data[key_unit], data[key_unit].unitNo, data['unitCode'], data[key_unit].unitID);
            });
        }
    }

    removeAllEventListenersFromElement(element) {
        let clone = element.cloneNode();
        while (element.firstChild) {
            clone.appendChild(element.lastChild);
        }

        if (element.parentNode) {
            element.parentNode.replaceChild(clone, element);
        }
    }

    initSiteplanSVG() {
        this.showdiagramatic = true;
        this.showtowername = true;

        this._script.load('head', 'assets/mapsvg/js/svg-siteplan-templates/global-functions.js');
        this._script.load('body', 'assets/mapsvg/js/svg-siteplan-templates/svg-in-availableunit.js');
    }

    tab(param){
        if(param == 1){
           //this.showdiagramaticlist();
           this.isDiagramatic = true;
           this.isSvg = false;
        //    setTimeout(() => {
        //     this.initDataTable();
        // }, 1000);
        }
        if(param == 2){
            //this.showdiagramaticlist();
            this.initSiteplanSVG();
            this.isDiagramatic = false;
            this.isSvg = true;
         }
    }
    // loaddata(){
    //     this.showdiagramaticlist();
    // }
}

