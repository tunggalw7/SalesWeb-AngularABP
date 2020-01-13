import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    ElementRef,
    ViewEncapsulation,
    OnInit
} from "@angular/core";
import {
    ProjectServiceProxy,
    GetListAllProjectResultDto,
    CreateProductPPOnlineInputDto,
    AdminManageProjectServiceProxy,
    AdminProductSetupPPOLServiceProxy,
    AdminServiceProxy,
    CreateOrUpdateProjectInputDto,
    AdminNewProjectServiceProxy
} from "@shared/service-proxies/service-proxies";
import {AppComponentBase} from "@shared/common/app-component-base";
import {appModuleAnimation} from "@shared/animations/routerTransition";
import {DataTable, TabView} from "primeng/primeng";
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {SelectItem} from "primeng/primeng";
import {Router, ActivatedRoute} from '@angular/router';
import {PrimengDatatableHelper} from "@shared/helpers/PrimengDatatableHelper";
import {PriceUnitComponent} from './price-unittype.component';
// import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import * as moment from 'moment';
import {ModalDirective, TabHeadingDirective} from "ngx-bootstrap";

export class FormControl {
    projectName: any;
    productCode: any;
    productName: any;
    displayName: any;
    activeStart: any;
    activeEnd: any;
    status: any;
    statusob: any;
    statuspp: any;
    logo: any;
    banner: any;
    terms: any;
    cluster: any;
    ppselect: any;
    category: any;
    ppprice: any;
    projectDesc: any;
}

@Component({
    selector: 'addNewProduct',
    templateUrl: './add-new-product.component.html',
    styleUrls: ['./add-new-product.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class AddNewProductComponent extends AppComponentBase {
    @ViewChild('addNewProduct') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('datatable') datatable: DataTable;
    @ViewChild('tabView') tabView: TabView;
    @ViewChild('select') selectElRef;
    @ViewChild('priceUnitModal') priceUnitModal: PriceUnitComponent;
    @ViewChild('ActiveFromDatePicker') activeFromDatePicker: ElementRef;
    @ViewChild('ActiveToDatePicker') activeToDatePicker: ElementRef;

    saving: boolean = false;
    selectedProject: any;
    projectCode: any;
    itemStatusOB: any = [];
    itemStatusPP: any = [];
    projectId;
    projectName;
    clusterItem: any = [];
    projectInfo;
    clusterValue = [];
    clusterModel;
    projectForm: FormGroup;
    _projects: GetListAllProjectResultDto[];
    _categorys = [];
    _form_control: FormControl = new FormControl;
    form_control: FormControl = new FormControl;
    model: FormControl = new FormControl;
    displayName;
    LogoFileName = null;
    LogoFileNamePastSrc = null;
    BannerFileName = null;
    BannerFileNamePastSrc = null;
    TermsFileName = null;
    TermsFileNamePastSrc = null;
    listCluster = [];
    selectedClusterText: any[] = [];
    selectedClusterTemp: any[] = [];
    setClusterSelected: any[] = [];
    selectedCluster: any[] = [];
    setUpNew;
    createDto: CreateProductPPOnlineInputDto = new CreateProductPPOnlineInputDto();
    primeNgUnitType: any;
    firstUnitType = 0;
    // myOptions: IMultiSelectOption[] = [];
    optionsModel: number[] = [];
    _products;
    detailSetupProduct: any;
    ppSetup: any = [];
    dataLocalStorage: any;
    buyBySales: boolean = true;
    buyByCust: boolean = false;
    projectID: any;
    cluster: any = [];
    clusterID: any = [];
    uploaded;

    // Settings configuration
    // mySettings: IMultiSelectSettings = {
    //     enableSearch: true,
    //     checkedStyle: 'fontawesome',
    //     buttonClasses: 'btn btn-default btn-block',
    //     dynamicTitleMaxItems: 3,
    //     displayAllSelectedText: true
    // };

    // // Text configuration
    // myTexts: IMultiSelectTexts = {
    //     checkAll: 'Select all',
    //     uncheckAll: 'Unselect all',
    //     checked: 'item selected',
    //     checkedPlural: 'items selected',
    //     searchPlaceholder: 'Find',
    //     searchEmptyResult: 'Nothing found...',
    //     searchNoRenderText: 'Type in search box to see results...',
    //     defaultTitle: 'Choose Cluster',
    //     allSelected: 'All selected'
    // };


    form_builder_selection = {
        'projectName': [null, Validators.compose([Validators.required])],
        'productCode': [null, Validators.compose([Validators.required])],
        'productName': [null, Validators.compose([Validators.required])],
        'projectDesc': [null, Validators.compose([Validators.required])],
        'category': [null, Validators.compose([Validators.required])],
        'ppprice': [null, Validators.compose([Validators.required])],
        'status': [null],
        'statusob': [null],
        'statuspp': [null],
        'logo': [null],
        'banner': [null],
        'terms': [null],
        'cluster': [null],
        'ppselect': [null],
        'activeStart': [null],
        'activeEnd': [null]
    }

    optionsLogo = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadImageProjectPP',
        pictureUrl: 'PPSetup',
        max_width: 201,
        max_height: 201,
    }
    optionsBanner = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadImageProjectPP',
        pictureUrl: 'PPSetup',
        max_width: 1281,
        max_height: 121,
    }
    optionsTerms = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadImageProjectPP',
        pictureUrl: 'PPSetup',
        max_width: 1281,
        max_height: 831,
    }


    constructor(injector: Injector,
                private _fb: FormBuilder,
                private _projectService: ProjectServiceProxy,
                private _adminServiceProxy: AdminServiceProxy,
                private _adminNewProject: AdminNewProjectServiceProxy,
                private _adminManageProject: AdminManageProjectServiceProxy,
                private _activeroute: ActivatedRoute,
                private _adminPPOL: AdminProductSetupPPOLServiceProxy) {
        super(injector);
        this.projectForm = this._fb.group(this.form_builder_selection);
        this.form_control = this.r_control();
        this.model.ppselect = "2";
        localStorage.removeItem("setPP");
        localStorage.removeItem('projectPPOlId');
    }

    show(status,project) {
        this.getListProject(project);
        this.modal.show();
        this.getListCategory();
        this.dataLocalStorage = JSON.parse(localStorage.getItem("getDataSetupPPOL"));
        if (status!=false) {
            this.getDetailSetupProduct(this.dataLocalStorage.projectInfoId);
        }else{       
            if (this.dataLocalStorage.project!=undefined) this.getCluster(parseInt(this.dataLocalStorage.project.split("|")[0]),'0','add');
            this.model.productCode = this.dataLocalStorage.productCode;
            this.model.productName = this.dataLocalStorage.productName;
            // this.model.projectName = this.dataLocalStorage.project;
            this.projectID = this.dataLocalStorage.project.split("|")[0];
            this.cluster = this.dataLocalStorage.clusterCode;
            this.clusterID = this.cluster.id;
        }
    }

    getDetailSetupProduct(productID) {
        if (productID){
            this._adminPPOL.getDetailSetupProductPPOnline(productID)
                .finally(() => {
                }).subscribe(result => {
                this.model.ppprice = result.ppAmt;
                // this.model.activeStart = this.momentToStr(result.startDate);

                this.LogoFileNamePastSrc = result.logo;
                this.BannerFileNamePastSrc = result.banner;
                this.TermsFileNamePastSrc = result.termAndCondition;

                this.model.productCode = this.dataLocalStorage.productCode;
                this.model.productName = this.dataLocalStorage.productName;
                // this.model.projectName = this.dataLocalStorage.project;

                this.projectID = this.dataLocalStorage.project.split("|")[0];
                this.model.category = result.categoryID;
                this.model.projectDesc = result.productDesc;
                this.model.activeStart = moment(result.startDate).format('YYYY-MM-DD');
                this.finalBirthDate1 = moment(result.startDate).format('YYYY-MM-DD');
                if (result.endDate!=undefined){
                    this.model.activeEnd = moment(result.endDate).format('YYYY-MM-DD');
                    // this.model.activeEnd = this.momentToStr(result.endDate);
                    this.finalBirthDate2 = moment(result.endDate).format('YYYY-MM-DD');
                }
                setTimeout(() => {
                    $('.category').selectpicker('refresh');
                    $('.projsetTect').selectpicker('refresh');
                }, 200);
                localStorage.setItem('projectPPOlId',result.projectPPOlId.toString());
            });
            if (this.dataLocalStorage.project!=undefined) this.getCluster(parseInt(this.dataLocalStorage.project.split("|")[0]),parseInt(this.dataLocalStorage.projectInfoId),'edit');
        }else{
            if (this.dataLocalStorage.project!=undefined) this.getCluster(parseInt(this.dataLocalStorage.project.split("|")[0]),'0','add');
            this.model.productCode = this.dataLocalStorage.productCode;
            this.model.productName = this.dataLocalStorage.productName;
            // this.model.projectName = this.dataLocalStorage.project;
            this.projectID = this.dataLocalStorage.project.split("|")[0];
            this.cluster = this.dataLocalStorage.clusterCode;
            this.clusterID = this.cluster.id;
        }

    }

    clusterLoading = false;
    getCluster(projecid,projectinfo, action) {
        this.clusterLoading = true;
        this.listCluster = [];
        // this.myOptions = [];
        this.optionsModel = [];
        this.clusterItem = [];
        if (action=="add"){
            this._adminManageProject.getListAllCluster(projecid).finally(() => {
                this.clusterItem = this.listCluster;

                this.clusterLoading = false;
                setTimeout(() => {
                    $('.selectedcluster').selectpicker('refresh');
                }, 1000);
            }).subscribe(result => {
                // this.clusterItem = result.items;
                let dataCluster = result.items;
                if (dataCluster.length){
                    for(var i=0; i < dataCluster.length; i++){
                        for(var j=0; j < this.dataLocalStorage.clusterCode.length; j++){
                            if (this.dataLocalStorage.clusterCode[j] == dataCluster[i].clusterId){
                                this.listCluster.push({'clusterId':dataCluster[i].clusterId, 'clusterName':dataCluster[i].clusterName});
                                // this.clusterModel(dataCluster[i].clusterId);
                            }
                        }
                    }
                }
            });
        }else{
            this._adminManageProject.getAllCluster(projecid,projectinfo).finally(() => {
                this.clusterItem = this.listCluster;

                this.clusterLoading = false;
                setTimeout(() => {
                    $('.selectedcluster').selectpicker('refresh');
                }, 1000);
            }).subscribe(result => {
                let dataCluster = result.items;
                if (dataCluster.length){
                    for(var i=0; i < dataCluster.length; i++){
                        for(var j=0; j < this.dataLocalStorage.clusterCode.length; j++){
                            if (this.dataLocalStorage.clusterCode[j] == dataCluster[i].clusterId){
                                this.listCluster.push({'clusterId':dataCluster[i].clusterId, 'clusterName':dataCluster[i].clusterName});
                                // this.clusterModel(dataCluster[i].clusterId);
                            }
                        }
                    }
                }

            });
        }

        // let dataCluster=[];
        // this.dataLocalStorage.clusterCode.forEach(item => {
        //     dataCluster.push(item);
        // });
        // this.clusterModel = dataCluster;
        // setTimeout(() => {
        //     $('.cluster').selectpicker('refresh');
        // }, 1000);
    }

    unitTypeEvent(event = null) {
        if (event) {
            this.firstUnitType = event.first;
        } else {
            this.getListUnitType(this.projectId);
        }
    }

    getListUnitType(projectID: number): void {
        this.primeNgUnitType.records = [];
        this.primeNgUnitType.totalRecordsCount = this.primeNgUnitType.records.length;
        let dummy = [{
            'unitType': '2BR', 'price':
                'Rp 1.500.000'
        }, {
            'unitType': '3BR', 'price':
                'Rp 1.500.000'
        }, {
            'unitType': '4BR', 'price':
                'Rp 1.500.000'
        }];
        this.primeNgUnitType.showLoadingIndicator();
        this.primengDatatableHelper.records = dummy;
        this.primeNgUnitType.defaultRecordsCountPerPage = 5;
        this.primeNgUnitType.totalRecordsCount = dummy.length;
        this.primeNgUnitType.hideLoadingIndicator();

// this._adminServiceProxy.getKeyFeatures(projectID)
//     .subscribe(result => {
//         console.log("getKeyFeatures ", result.items);
//         this.primeNgUnitType.records = result.items;
//         this.primeNgUnitType.defaultRecordsCountPerPage = 5;
//         this.primeNgUnitType.totalRecordsCount = result.items.length;
//         this.primeNgUnitType.hideLoadingIndicator();
//     }, err => {
//         this.primeNgUnitType.hideLoadingIndicator();
//     });
    }


    onChange(event) {
    }

    r_control() {
        return {
            projectName: this.projectForm.controls['projectName'],
            productCode: this.projectForm.controls['productCode'],
            productName: this.projectForm.controls['productName'],
            category: this.projectForm.controls['category'],
            projectDesc: this.projectForm.controls['projectDesc'],
            ppprice: this.projectForm.controls['ppprice'],
            displayName: this.projectForm.controls['displayName'],
            activeStart: this.projectForm.controls['activeStart'],
            activeEnd: this.projectForm.controls['activeEnd'],
            status: this.projectForm.controls['status'],
            statusob: this.projectForm.controls['statusob'],
            statuspp: this.projectForm.controls['statuspp'],
            logo: this.projectForm.controls['logo'],
            banner: this.projectForm.controls['banner'],
            terms: this.projectForm.controls['terms'],
            cluster: this.projectForm.controls['cluster'],
            ppselect: this.projectForm.controls['ppselect']
        }
    }
    tes;

    pictureLogo(event) {
        this.LogoFileNamePastSrc = null;
        // this.LogoFileNamePastSrc = event.toString();
        //Get reference of FileUpload.
        var fileUpload = $("#logo")[0];
        // debugger
        //Check whether HTML5 is supported.
        if (typeof (fileUpload['files']) != "undefined") {
            //Initiate the FileReader object.
            var reader = new FileReader();
            //Read the contents of Image File.
            reader.readAsDataURL(fileUpload['files'][0]);
            reader.onload = function (e) {
                //Initiate the JavaScript Image object.
                var image = new Image();
                //Set the Base64 string return from FileReader as source.
                image.src = e.target['result'];
                image.onload = function () {
                    
                    //Determine the Height and Width.
                    var height = image.height;
                    var width = image.width;
                    if (height > 201 || width > 201) {
                        localStorage.setItem('allowupd', 'false');
                    } else{
                        localStorage.setItem('allowupd', 'true');
                    }
                };
            }
        } else {
          alert("This browser does not support HTML5.");
        }
        
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if(this.uploaded == 'true'){
                this.LogoFileNamePastSrc = event.toString();
            } else {
                this.LogoFileNamePastSrc = null;
            }    
        }, 500);
        
    }

    LogoUploaded(event): void {
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if(this.uploaded == 'true'){
                abp.notify.success('FileUploaded');
                this.LogoFileName = event.toString();  
            } else{
                this.LogoFileName = null;
                $("#logo").val(null);
                abp.notify.warn('height and width must be 200px x 200px below it');
            } 
            
        }, 800);
    }

    delLogoImage() {
        this.LogoFileName = null;
        $("#logo").val(null);
        this.LogoFileNamePastSrc = null;
    }

    delBannerImage() {
        this.BannerFileName = null;
        $("#banner").val(null);
        this.BannerFileNamePastSrc = null;
    }

    delTermsImage() {
        this.TermsFileName = null;
        $("#terms").val(null);
        this.TermsFileNamePastSrc = null;
    }

    pictureBanner(event) {
        this.BannerFileNamePastSrc = null;

        //Get reference of FileUpload.
        var fileUpload = $("#banner")[0];
        // debugger
        //Check whether HTML5 is supported.
        if (typeof (fileUpload['files']) != "undefined") {
            //Initiate the FileReader object.
            var reader = new FileReader();
            //Read the contents of Image File.
            reader.readAsDataURL(fileUpload['files'][0]);
            reader.onload = function (e) {
                //Initiate the JavaScript Image object.
                var image = new Image();
                //Set the Base64 string return from FileReader as source.
                image.src = e.target['result'];
                image.onload = function () {
                    
                    //Determine the Height and Width.
                    var height = image.height;
                    var width = image.width;
                    if (height > 121 || width > 1281) {
                        localStorage.setItem('allowupd', 'false');
                    } else{
                        localStorage.setItem('allowupd', 'true');
                    }
                };
            }
        } else {
          alert("This browser does not support HTML5.");
        }
        
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if(this.uploaded == 'true'){
                this.BannerFileNamePastSrc = event.toString();
            } else {
                this.BannerFileNamePastSrc = null;
            }    
        }, 500);
    }

    BannerUploaded(event): void {
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if(this.uploaded == 'true'){
                abp.notify.success('FileUploaded');
                this.BannerFileName = event.toString(); 
            } else{
                this.BannerFileName = null;
                $("#banner").val(null);
                abp.notify.warn('height and width must be 1280px x 120px or below it');
            } 
            
        }, 800);
    }

    pictureTerms(event) {
        this.TermsFileNamePastSrc = null;

        //Get reference of FileUpload.
        var fileUpload = $("#terms")[0];
        // debugger
        //Check whether HTML5 is supported.
        if (typeof (fileUpload['files']) != "undefined") {
            //Initiate the FileReader object.
            var reader = new FileReader();
            //Read the contents of Image File.
            reader.readAsDataURL(fileUpload['files'][0]);
            reader.onload = function (e) {
                //Initiate the JavaScript Image object.
                var image = new Image();
                //Set the Base64 string return from FileReader as source.
                image.src = e.target['result'];
                image.onload = function () {
                    
                    //Determine the Height and Width.
                    var height = image.height;
                    var width = image.width;
                    if (height > 831 || width > 1281) {
                        localStorage.setItem('allowupd', 'false');
                    } else{
                        localStorage.setItem('allowupd', 'true');
                    }
                };
            }
        } else {
          alert("This browser does not support HTML5.");
        }
        
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if(this.uploaded == 'true'){
                this.TermsFileNamePastSrc = event.toString();
            } else {
                this.TermsFileNamePastSrc = null;
            }    
        }, 500);
    }

    TermsUploaded(event): void {
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if(this.uploaded == 'true'){
                abp.notify.success('FileUploaded');
                this.TermsFileName = event.toString();
            } else{
                this.TermsFileName = null;
                $("#terms").val(null);
                abp.notify.warn('height and width must be 1280px x 830px or below it');
            } 
            
        }, 800);
       
    }

    projectLoading = false;

    getListProject(project) {
        this.projectLoading = true;
        this._adminServiceProxy.getListAllProject().finally(() => {
            setTimeout(() => {
                let projectID;
                if (project!=undefined) projectID = project.split("|")[0]
                this._projects.forEach(item => {
                    if (projectID == item.projectId){
                        this.model.projectName = item.projectCode + " - " + item.projectName;
                    }
                });
                $('.project').selectpicker('refresh');
                this.projectLoading = false;
            }, 0);
        }).subscribe(result => {
            this._projects = result.items;
        });
    }


    getListCategory() {
        this.projectLoading = true;
        this._adminPPOL.getDropdownCategoryType().finally(() => {
            setTimeout(() => {
                $('.category').selectpicker('refresh');
                this.projectLoading = false;
            }, 0);
        }).subscribe(result => {
            this._categorys = result;
        });
    }

    getProjectInformation(projectcode) {
        // this._adminManageProject.getProjectInfo(projectcode)
        //     .subscribe(result => {
        //         console.log('getProjectInfo', result);
        //         this.projectInfo = result;
        //     }, err => {
        //     });
    }

    information;
    location;
    siteplan;

    infoValue(data) {
        this.information = data;
    }

    locationValue(data) {
        this.location = data;
    }

    siteplanValue(data) {
        this.siteplan = data;
    }

    save() {
        this.validasi();        
        if (this.allowSave){
            localStorage.setItem("setPP","1");
            this.ppSetup.categoryTypeId = this.model.category;
            this.ppSetup.banner = this.BannerFileName;
            this.ppSetup.termAndCondition = this.TermsFileName;
            this.ppSetup.logo = this.LogoFileName;
            // this.model.activeStart = this.finalBirthDate1;
            // this.model.activeEnd = this.finalBirthDate2;
            this.ppSetup.startDate = this.finalBirthDate1;
            this.ppSetup.endDate = this.finalBirthDate2;
            this.ppSetup.isBuyPPCust = this.buyByCust;
            this.ppSetup.isBuyPPSales = this.buyBySales;
    // this.ppSetup.projectName = this.model.projectName;
            this.ppSetup.isActive = true;
            this.ppSetup.ppAmt = this.model.ppprice;
            this.ppSetup.productDesc = this.model.projectDesc;
            // this.ppSetup.productName = this.model.productName;
            // this.ppSetup.clusterID =

            if (this.ppSetup.logo !== null || this.ppSetup.logo !== undefined) {
                this.ppSetup.imageStatusLogo = 'updated'
            }

            if (this.ppSetup.banner !== null || this.ppSetup.banner !== undefined) {
                this.ppSetup.imageStatusBanner = 'updated'
            }

            if (this.ppSetup.termAndCondition !== null || this.ppSetup.termAndCondition !== undefined) {
                this.ppSetup.imageStatusTerm = 'updated'
            }
            setTimeout(() => {
                localStorage.setItem('createProduct', JSON.stringify(this.ppSetup));
                this.close();
                this.modalSave.emit(this.ppSetup);
            })
        }
    }

    // save() {
    //     this.validasi();
    //     this.findInvalidControls();
    //     console.log('this.allowSave', this.allowSave);
    //     let projectName;
    //     this._projects.forEach(item => {
    //         console.log('item', item);
    //         if (item.projectId == this.model.projectName.split("|")[0]) projectName = item.projectName;
    //     });
    //     this.createDto.projectCode = this.model.projectName.split("|")[1];
    //     this.createDto.productCode = this.model.productCode;
    //     this.createDto.categoryTypeId = this.model.category;
    //     // this.createDto.banner = this.BannerFileName;
    //     // this.createDto.termAndCondition = this.TermsFileName;
    //     // this.createDto.logo = this.LogoFileName;
    //     this.createDto.startDate = this.finalBirthDate1;
    //     this.createDto.endDate = this.finalBirthDate2;
    //     this.createDto.isBuyPPCust = false;
    //     this.createDto.isBuyPPSales = true;
    //     this.createDto.projectName = projectName;
    //     this.createDto.isActive = true;
    //     this.createDto.ppAmt = this.model.ppprice;
    //     this.createDto.productDesc = this.model.projectDesc;
    //     this.createDto.productName = this.model.productName;
    //     this.createDto.productDesc = this.model.projectDesc;
    //     this.createDto.clusterID = [];
    //     // let projectCluster: Project_clusters[] = [];
    //
    //     // if (this.clusterItem){
    //     //     this.clusterItem.forEach(item => {
    //     //         projectCluster.push(this.itemCluster(item.clusterID));
    //     //     });
    //     // }
    //
    //
    //     console.log('create dto project', this.createDto);
    //     this._adminPPOL.createProductPPOnline(this.createDto)
    //         .finally(() => this.saving = false)
    //         .subscribe(result => {
    //             console.log('result', result);
    //             this.message.success("Add New Product has beed saved !!")
    //                 .done(() => {
    //                 });
    //         }, err => {
    //             this.message.error(err.message)
    //                 .done(() => {
    //                     console.error("createProductPPOnline ", err.message);
    //                 });
    //         });
    // }

    itemCluster(projectInfoId: number, clusterId: number) {
        let item;
        item.projectInfoId = projectInfoId;
        item.clusterId = clusterId;
        return item;
    }

    getListUnit(item): void {
        this.primeNgUnitType.records = [];
        this.primeNgUnitType.totalRecordsCount = this.primeNgUnitType.records.length;

        this.primeNgUnitType.showLoadingIndicator();
        if (item != undefined) {
            this._adminServiceProxy.getKeyFeatures(item)
                .subscribe(result => {
                    this.primeNgUnitType = result.items;
                    this.primeNgUnitType.records = result.items;
                    this.primeNgUnitType.defaultRecordsCountPerPage = 5;
                    this.primeNgUnitType.totalRecordsCount = result.items.length;
                    this.primeNgUnitType.hideLoadingIndicator();
                }, err => {
                    this.primeNgUnitType.hideLoadingIndicator();
                });
        }
    }

    finalBirthDate1;
    finalBirthDate2;

    onSelectedDate(date, type) {
        let dateInput = moment(date).format('DD/MM/YYYY');
        if (type === "start") {
            this.model.activeStart = dateInput;
            // this.finalBirthDate1 = dateInput;
            this.finalBirthDate1 = moment(date).format('YYYY-MM-DD');

        } else {
            // this.finalBirthDate2 = dateInput;
            this.finalBirthDate2 = moment(date).format('YYYY-MM-DD');
            this.model.activeEnd = dateInput;
        }
    }

    allowSave;

    validasi() {
        this.allowSave = true;
        let comparedate = this.compare(this.model.activeStart, this.model.activeEnd, '', '', 0);
        if ((comparedate == false) && (this.model.activeEnd != undefined)) { // End date must be greater than start date    
            this.message.error('End date must be greater than Start date!');
            this.allowSave = false;
        }
    }

    compare(dateTimeA, dateTimeB, dateTimeC, dateTimeD, type) {
        var momentA = moment(dateTimeA, "DD/MM/YYYY");
        var momentB = moment(dateTimeB, "DD/MM/YYYY");
        if (type == 0) {
            if (momentA >= momentB) return false;
            else if (momentA < momentB) return true;
        } else if (type == 1) {
            var momentC = moment(dateTimeC, "DD/MM/YYYY");
            var momentD = moment(dateTimeD, "DD/MM/YYYY");
            if (((momentA >= momentC) && (momentA <= momentD))) {
                return false;
            }
            else {
                return true;
            }
        }
    }

    keyValue(data) {
        // let item = new Key_features;
        // item.keyFeatures = data.keyFeatures;

        // if (data.id){
        //     for (var i=0; i < this.projectKeyFeatures.length; i++){
        //         if (data.id == i){
        //             this.projectKeyFeatures[i].keyFeatures = data.keyFeatures;
        //         }
        //     }
        // }else{
        //     this.projectKeyFeatures = [...this.projectKeyFeatures, item];
        // }

        // this.primeNgUnitType.showLoadingIndicator();
        // console.log("getKeyFeatures ", this.projectKeyFeatures);
        // this.primeNgUnitType.records = this.projectKeyFeatures;
        // this.primeNgUnitType.defaultRecordsCountPerPage = 5;
        // this.primeNgUnitType.totalRecordsCount = this.projectKeyFeatures.length;
        // this.primeNgUnitType.hideLoadingIndicator();
    }


    findInvalidControls() {
        const invalid = [];
        const controls = this.projectForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
    }


    close(): void {
        this.modal.hide();
        // $('.modal').empty();
    }
}
