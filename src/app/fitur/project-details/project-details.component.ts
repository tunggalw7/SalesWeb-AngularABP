import { Component, OnInit, Output, Injector, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import {
    ProjectServiceProxy,
    Project_clusters,
    Key_features,
    GetListAllProjectResultDto,
    AdminManageProjectServiceProxy,
    AdminServiceProxy,
    CreateOrUpdateProjectInputDto,
    AdminNewProjectServiceProxy,
    CreateUpdateProjectInfoUniversalInputDto,
    CreateProductPPOnlineInputDto,
    CreateOrUpdateSocialMediaProjectInputDto,
    CreateGalleryInputDto,
    AdminProductSetupServiceProxy,
    InsertProjectOLBookingInputDto,
    GetDiagramaticTypeListDto
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DataTable, TabView } from "primeng/primeng";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { SelectItem } from "primeng/primeng";
import { Router, ActivatedRoute } from '@angular/router';
import { AddNewProductComponent } from "@app/fitur/add-new-product/add-new-product.component";
import { ProductSetupOBComponent } from '@app/fitur/product-setup-ob/product-setup-ob.component';
import { PrimengDatatableHelper } from "@shared/helpers/PrimengDatatableHelper";

export class FormControl {
    projectInfoID: any;
    projectCode: any;
    productCode: any;
    productName: any;
    diagrammaticType: any;
    status: any;
    statusob: any;
    statuspp: any;
    logo: any;
    cluster: any;
}

export class FormControlOB {
    project: any;
}

@Component({
    selector: 'project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ProjectDetailsComponent extends AppComponentBase implements OnInit {
    @ViewChild('datatable') datatable: DataTable;
    @ViewChild('tabView') tabView: TabView;
    @ViewChild('select') selectElRef;
    @ViewChild('addNewProduct') addNewProduct: AddNewProductComponent;
    @ViewChild('productSetupOB') productSetupOB: ProductSetupOBComponent;
    @Output() getProject: EventEmitter<any> = new EventEmitter<any>();

    createDto: CreateUpdateProjectInfoUniversalInputDto = new CreateUpdateProjectInfoUniversalInputDto();
    createPPDto: CreateProductPPOnlineInputDto = new CreateProductPPOnlineInputDto();
    createOLBooking: InsertProjectOLBookingInputDto = new InsertProjectOLBookingInputDto();
    _projects_ob: GetListAllProjectResultDto[];
    _projects: GetListAllProjectResultDto[];
    _digrammaticTypes: GetDiagramaticTypeListDto[];
    msProjectClustersDTO: any = [];

    selectedClusterText: any[] = [];
    selectedClusterTemp: any[] = [];
    selectedCluster: any[] = [];
    setClusterSelected: any[] = [];
    clusterSelected: any[] = [];
    modelCluster: any[] = [];
    clusterIdTemp: any = [];
    listCluster = [];
    LogoFileName = null;
    LogoFileNamePastSrc = null;
    projectLogo;
    getItemProject;
    selectedProject: any;
    itemStatusOB: any = [];
    itemStatusPP: any = [];
    projectCode: any;
    projectId;
    productID;
    projectinfoid;
    projectName;
    clusterItem;
    projectInfo;

    // For setting show / hide panel
    displayName;
    show_gallery;
    show_unittype;
    show_location;
    show_siteplan;
    displaySetting: any = [];

    // variable for another component
    information;
    location;
    siteplan;

    getLoading = false;
    saving: boolean = false;
    setUpNew = true;
    projectLoading = false;
    clusterLoading = false;
    statusobLoading = false;
    statusppLoading = false;
    saveUniversalLoading = false;
    imgUpdated = false;
    statusExistPPOL;
    allowSaveOB;

    first = 0;
    filterText = '';
    getparams;
    gallery: any = [];
    getdataPP;
    memberCode;
    myproject: any;
    clusterValue = [];
    actionCluster: any;
    optionsModel: number[] = [];
    clusterModel;
    setproductOB;
    uploaded;

    selectionForm: FormGroup;
    projectForm: FormGroup;
    model: FormControl = new FormControl;
    _form_control: FormControl = new FormControl;
    form_control: FormControl = new FormControl;

    form_builder_setupob = {
        'project': [null, Validators.compose([Validators.required])]
    }

    form_builder_selection = {
        'projectCode': [null, Validators.compose([Validators.required])],
        'productCode': [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
        'productName': [null, Validators.compose([Validators.required])],
        'diagrammaticType': [null, Validators.compose([Validators.required])],
        'status': [null],
        'statusob': [null],
        'statuspp': [null],
        'logo': [null],
        'cluster': [null],
    }

    optionsLogo = {
        max_file_size: 1048576,
        type: 'jpg|jpeg|png',
        url: 'UploadProjectImage',
        pictureUrl: 'ProjectInfoLogo',
        max_width: 1024,
        max_height: 768,
    }

    constructor(injector: Injector,
        private _fb: FormBuilder,
        private _projectService: ProjectServiceProxy,
        private _adminServiceProxy: AdminServiceProxy,
        private _adminNewProject: AdminNewProjectServiceProxy,
        private _adminManageProject: AdminManageProjectServiceProxy,
        private _activeroute: ActivatedRoute,
        private _adminProductSetup: AdminProductSetupServiceProxy,
        private _router: Router) {
        super(injector);
        this.projectForm = this._fb.group(this.form_builder_selection);
        this.form_control = this.r_control();
        this.selectionForm = this._fb.group(this.form_builder_setupob);
        this.itemStatusOB = [{ 'display': 'Show', 'value': true }, { 'display': 'Hide', 'value': false }];
        this.itemStatusPP = [{ 'display': 'Show', 'value': true }, { 'display': 'Hide', 'value': false }];
    }

    ngOnInit() {
        localStorage.removeItem("setPP");
        localStorage.removeItem("setOB");
        localStorage.removeItem('projectPPOlId');
        this.model.status = true;

        this.getListProject();
        this.getListDiagrammaticType();

        this.msProjectClustersDTO = {
            projectInfoId: 0,
            clusterId: 0
        };
        // this.getManageProject(2064);
        this._activeroute.params.subscribe(params => {
            if (params.id != undefined) {
                this.actionCluster = 'edit';
                this.projectinfoid = params.id;
                this.getManageProject(params.id);
            } else {
                this.actionCluster = 'add';
            }
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.model.statusob = false;
            this.model.statuspp = false;
            this.refreshSetup();
        }, 1000);
    }

    modalSaveProduct(event) {
        this.getdataPP = event;
    }

    refreshSetup() {
        setTimeout(() => {
            $('.statusob').selectpicker('refresh');
            $('.statuspp').selectpicker('refresh');
            $('.diagrammatic-type').selectpicker('refresh');
        }, 0);
    }

    getManageProject(projectInfoID) {
        this.optionsModel = [];
        this.statusobLoading = true;
        this.statusppLoading = true;
        this._adminManageProject.getDetailManageProject(projectInfoID).finally(() => {
            setTimeout(() => {
                if (this.selectedCluster.length) {
                    let dataCluster = [];
                    this.selectedCluster.forEach(item => {
                        dataCluster.push(item.clusterID);
                    });
                    this.clusterModel = dataCluster;
                    setTimeout(() => {
                        $('.cluster').selectpicker('refresh');
                    }, 0);
                }
            }, 0);
        }).subscribe(result => {
            this.getCluster(result.projectID);
            this.model.productCode = result.productCode;
            this.model.productName = result.displayName;
            this.projectName = result.projectName;
            this.productID = result.productPPID;
            this.model.projectCode = result.projectID + "|" + result.projectCode;
            this.model.projectInfoID = result.projectInfoID;
            this.model.diagrammaticType = result.diagramaticTypeId;
            this.selectedCluster = result.listCluster;
            this.model.status = result.status;
            this.LogoFileNamePastSrc = result.projectLogo;
            this.selectedProject = projectInfoID;
            this.imgUpdated = true;
            // this.refreshSetup();
            this.statusExistPPOL = result.isPPOlActive;
            setTimeout(() => {
                this.model.statusob = result.isOBActive;
                this.model.statuspp = result.isPPOlActive;
                this.statusobLoading = false;
                this.statusppLoading = false;
                this.refreshSetup();
            }, 2000);

        }, err => {
            this.model.projectInfoID = undefined;
            this.setClear();
        });
    }

    setClear() {
        this.projectCode = "";
        this.model.projectInfoID = undefined;
        // this.model.status = result.projectCode;
        // this.model.statusob = undefined;
        // this.model.statuspp = undefined;
        // this.selectedProject = undefined;
    }

    getCluster(projecid) {
        this.clusterLoading = true;
        this.listCluster = [];
        this.optionsModel = [];
        if (this.actionCluster == "add") {
            this._adminManageProject.getClusterListResult(projecid).finally(() => {
                this.clusterLoading = false;
            }).subscribe(result => {
                this.clusterItem = result.items;
                if (this.clusterItem.length) {
                    this.clusterItem.forEach(item => {
                        this.listCluster.push({ 'id': item.clusterId, 'name': item.clusterName });
                    });
                }

                setTimeout(() => {
                    $('.cluster').selectpicker('refresh');
                }, 0);
            });
        } else {
            this._adminManageProject.getAllCluster(projecid, this.projectinfoid).finally(() => {
                this.clusterLoading = false;
            }).subscribe(result => {
                this.clusterItem = result.items;
                if (this.clusterItem.length) {
                    this.clusterItem.forEach(item => {
                        this.listCluster.push({ 'id': item.clusterId, 'name': item.clusterName });
                    });
                }

                setTimeout(() => {
                    $('.cluster').selectpicker('refresh');
                }, 0);
            });
        }
    }


    pictureLogo(event) {
        // this.LogoFileNamePastSrc = event.toString();
        this.LogoFileNamePastSrc = null;
        // this.LogoFileNamePastSrc = event.toString();
        //Get reference of FileUpload.
        var fileUpload = $("#productLogo")[0];
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
                image.src = e.target['result'].toString();
                image.onload = function () {

                    //Determine the Height and Width.
                    var height = image.height;
                    var width = image.width;
                    if (height > 768 || width > 1024) {
                        localStorage.setItem('allowupd', 'false');
                    } else {
                        localStorage.setItem('allowupd', 'true');
                    }
                };
            }
        } else {
            alert("This browser does not support HTML5.");
        }

        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if (this.uploaded == 'true') {
                this.LogoFileNamePastSrc = event.toString();
            } else {
                this.LogoFileNamePastSrc = null;
            }
        }, 500);
    }

    LogoUploaded(event): void {
        // abp.notify.success('FileUploaded');
        // this.LogoFileName = event.toString();
        setTimeout(() => {
            this.uploaded = localStorage.getItem('allowupd');
            if (this.uploaded == 'true') {
                this.statusDelete = false;
                abp.notify.success('FileUploaded');
                this.LogoFileName = event.toString();
            } else {
                this.LogoFileName = null;
                $("#productLogo").val(null);
                abp.notify.warn('height and width must be 1024px x 768px below it');
            }

        }, 800);
    }

    statusDelete = false;
    delImage() {
        this.LogoFileName = null;
        $("input[type='file']").val(null);
        this.model.logo = null;
        this.LogoFileNamePastSrc = null;
        this.statusDelete = true;
    }

    getListProject() {
        this.projectLoading = true;
        this._adminServiceProxy.getListAllProject().finally(() => {
            setTimeout(() => {
                $('.project').selectpicker('refresh');
                this.projectLoading = false;
            }, 0);
        }).subscribe(result => {
            this._projects = result.items;
        });
    }

    onChangeProject(obj) {
        if (obj) {
            var projectID = obj.split("|")[0];
            this.model.cluster = [];
            this.listCluster = [];
            if (projectID) {
                // this.getProject.emit(projectID);
                this.projectId = projectID;
                this.getCluster(projectID);
                if (!isNaN(this.projectId)) {
                }
                // this.getManageProject(projectID);
                this.getLoading = false;
            }
        } else {
            this.refreshSetup();
        }
    }

    infoValue(data) {
        this.information = data;
    }

    galleryValue(data) {
        this.gallery = data;
    }

    unitValue(data) {
        this.show_unittype = data;
    }

    locationValue(data) {
        this.location = data;
    }

    displaylocationValue(data) {
        this.show_location = data;
    }

    siteplanValue(data) {
        this.show_siteplan = data.show_siteplan
        this.siteplan = data;
    }

    settingForm() {
        return {
            'desc': this.information.show_desc, 'keyfeature': this.information.show_key, 'marketing': this.information.show_marketing,
            'proj_detail': this.information.show_projectdetail, 'sosmed': this.information.show_sosmed, 'gallery': this.gallery.show_gallery,
            'unittype': this.show_unittype, 'location': this.show_location, 'siteplan': this.show_siteplan
        };
    }

    save() {
        this.saveUniversalLoading = true;
        this._adminProductSetup.getProductSetupListResult(this.model.projectCode.split("|")[0], this.clusterModel).finally(() => {
            setTimeout(() => {
                //validasi setup pp ?
                let setPP = localStorage.getItem("setPP");

                if (setPP == null && (this.model.statuspp == true || this.model.statuspp == "true") && (this.actionCluster == 'add')) {
                    this.message.info("Please Setup PPOnline!!");
                    this.saveUniversalLoading = false;
                } else if (this.allowSaveOB == false && (this.model.statusob == true || this.model.statusob == "true")) {
                    this.message.info("Please Setup Online Booking!!");
                    this.saveUniversalLoading = false;
                } else {
                    //declare
                    let displaySetting = this.settingForm();
                    let socialmedia = [];
                    this.clusterIdTemp = [];
                    let keyfeatures: Key_features[] = [];
                    let projectSosmed: CreateOrUpdateSocialMediaProjectInputDto[] = [];
                    let projectGallery: CreateGalleryInputDto[] = [];
                    let projectCluster: Project_clusters[] = [];

                    this.createDto.projectID = this.projectId;
                    if (this.model.projectInfoID) this.createDto.projectInfoID = this.model.projectInfoID;
                    if (this.model.projectInfoID == undefined) this.model.projectInfoID = 0;

                    this.createDto.displayName = this.model.productName;
                    this.createDto.displaySetting = JSON.stringify(displaySetting);
                    let imgStatus;
                    if ((this.LogoFileName == "" || this.LogoFileName == null) && (this.imgUpdated == true) && this.statusDelete != true) {
                        imgStatus = "";
                    } else if ((this.LogoFileName == "" || this.LogoFileName == null) && this.statusDelete == true) {
                        imgStatus = "removed";
                    } else {
                        imgStatus = "updated";
                    }

                    if (this.LogoFileName != null) {
                        this.createDto.imgLogo = this.LogoFileName;
                    }

                    this.createDto.imageLogoStatus = imgStatus;
                    this.createDto.status = this.model.status;
                    this.createDto.productCode = this.model.productCode;
                    this.createDto.projectDesc = this.information.projectDesc;
                    this.createDto.projectStatus = true;
                    this.createDto.isOBActive = this.model.statusob;
                    this.createDto.isPPOlActive = this.model.statuspp;
                    this.createDto.projectDeveloper = this.information.projectDeveloper;
                    this.createDto.projectWebsite = this.information.projectWebsite;
                    this.createDto.projectMarketingOffice = this.information.projectMarketingOffice;
                    this.createDto.projectMarketingPhone = this.information.projectMarketingPhone;
                    this.createDto.diagramaticTypeId = this.model.diagrammaticType;

                    this.information.socialmedia.forEach(item => {
                        socialmedia.push({
                            "projectInfoID": this.model.projectInfoID,
                            "sosialMediaID": item.sosialMediaID,
                            "socialMediaLink": item.socialMediaLink,
                            "socialMediaLinkID": item.sosialMediaID,
                            "isActive": item.isActive
                        });
                    });

                    this.information.socialmedia.forEach(item => {
                        projectSosmed.push(this.itemSocial(item));
                    });

                    this.gallery.projectGallery.forEach(item => {
                        item.imageStatus = item.imageStatus.toString();
                        projectGallery.push(this.itemGallery(item));
                    });

                    this.createDto.sosialMedia = projectSosmed;
                    this.createDto.gallery = projectGallery;

                    //location
                    if (this.location.latitude == "") { this.createDto.latitude = 0; }
                    else { this.createDto.latitude = this.location.latitude; }
                    if (this.location.longitude == "") { this.createDto.longitude = 0; }
                    else { this.createDto.longitude = this.location.longitude; }
                    if (this.location.locationImageURL != null) {
                        this.createDto.locationImageURL = this.location.locationImageURL;
                    }
                    this.createDto.locationImageStatus = this.location.imageStatus;
                    this.createDto.projectAddress = this.location.projectAddress;

                    //siteplan
                    if (this.siteplan.sitePlansImageUrl != null) {
                        this.createDto.sitePlansImageUrl = this.siteplan.sitePlansImageUrl;
                    }
                    this.createDto.imageSitePlanStatus = this.siteplan.imageSitePlanStatus;

                    //cluster
                    if (this.clusterModel.length) {
                        this.clusterModel.forEach(item => {
                            projectCluster.push(this.itemCluster(item));
                        });
                    } else {
                        if (this.clusterItem) {
                            this.clusterItem.forEach(item => {
                                projectCluster.push(this.itemCluster(item.clusterID));
                            });
                        }
                    }

                    this.createDto.trKeyFeatures = this.information.keyfeature;
                    this.createDto.msProjectClusters = projectCluster;
                    if (!this.projectName) {
                        this._projects.forEach(item => {
                            if (item.projectId == this.model.projectCode.split("|")[0]) this.projectName = item.projectName;
                        });
                    }

                    if (localStorage.getItem('setPP') == '1') {
                        this.createDto.ppSetup = this.saveSetupPP();
                    }

                    this._adminNewProject.createUpdateProjectInfoUniversal(this.createDto)
                        .finally(() => this.saving = false)
                        .subscribe(result => {
                            if (result) {
                                this.message.success("Manage Project Saved Successfully")
                                    .done(() => {
                                        this.saveUniversalLoading = false;
                                        this._router.navigate(['/app/fitur/manage-project/']);
                                    });
                            }
                        }, err => {
                            this.message.error(err.message)
                                .done(() => {
                                    this._router.navigate(['/app/fitur/manage-project/']);
                                });
                        });
                }
            }, 0);
        }).subscribe(result => {
            this.allowSaveOB = true;
            for (var i = 0; i < result.items.length; i++) {
                if (result.items[i].periodStart == undefined) {
                    this.allowSaveOB = false;
                }
            }
        });
    }

    saveSetupPP() {
        //Setup pp?
        if (this.productID != undefined) this.createPPDto.projectPPID = this.productID;
        if ((localStorage.getItem('projectPPOlId'))) this.createPPDto.projectPPID = parseInt(localStorage.getItem('projectPPOlId'));
        // this.createPPDto.projectPPID = this.model.projectCode.split("|")[0];
        // this.createPPDto.projectCode = this.model.projectCode.split("|")[1];
        this.createPPDto.categoryTypeId = this.getdataPP.categoryTypeId;
        this.createPPDto.banner = this.getdataPP.banner;
        this.createPPDto.termAndCondition = this.getdataPP.termAndCondition;
        this.createPPDto.logo = this.getdataPP.logo;
        this.createPPDto.startDate = this.getdataPP.startDate;
        this.createPPDto.endDate = this.getdataPP.endDate;
        this.createPPDto.isBuyPPCust = this.getdataPP.isBuyPPCust;
        this.createPPDto.isBuyPPSales = this.getdataPP.isBuyPPSales;
        // this.createPPDto.projectName = this.projectName;
        this.createPPDto.isActive = this.getdataPP.isActive;
        this.createPPDto.ppAmt = this.getdataPP.ppAmt;
        // this.createPPDto.productDesc =this.getdataPP.productDesc;
        // this.createPPDto.productCode = this.model.productCode;
        // this.createPPDto.productName =this.model.productName;
        if (this.getdataPP.logo) this.createPPDto.imageStatusLogo = this.getdataPP.imageStatusLogo;
        if (this.getdataPP.banner) this.createPPDto.imageStatusBanner = this.getdataPP.imageStatusBanner;
        if (this.getdataPP.termAndCondition) this.createPPDto.imageStatusTerm = this.getdataPP.imageStatusTerm;
        return this.createPPDto;
    }

    itemKeyFeatures(keyfeatures: string) {
        let item = new Key_features;
        // item.projectInfoId = projectInfoId;
        item.keyFeatures = keyfeatures;
        return item;
    }

    itemSocial(data) {
        let item = new CreateOrUpdateSocialMediaProjectInputDto;
        if (this.model.projectInfoID == undefined) this.model.projectInfoID = 0;
        // item.projectInfoId = projectInfoId;
        item.projectInfoID = 0;
        // item.projectInfoID = this.model.projectInfoID;
        item.sosialMediaID = data.sosialMediaID;
        item.socialMediaLink = data.socialMediaLink;
        item.socialMediaLinkID = data.socialMediaLinkID;
        item.isActive = data.isActive;
        return item;
    }

    itemGallery(data) {
        let item = new CreateGalleryInputDto;

        item.projectInfoID = this.model.projectInfoID;

        if (data.galleryId != undefined) item.galleryID = data.galleryId;
        data.imageTemp != undefined ? item.imageURL = data.imageTemp : item.imageURL = data.imageURL;

        item.imageAlt = data.imageAlt;
        item.imageStatus = data.imageStatus;
        item.sortNo = data.sortNo;

        return item;
    }

    itemCluster(clusterId: number) {
        let item = new Project_clusters;
        item.clusterId = clusterId;
        return item;
    }

    setupPP() {
        localStorage.removeItem("getDataSetupPPOL");
        var setPP = {
            'productCode': this.model.productCode, 'projectInfoId': this.projectinfoid,
            'action': this.actionCluster, 'productName': this.model.productName, 'project': this.model.projectCode,
            'clusterCode': this.clusterModel, 'productID': this.productID
        };
        // Put the object into storage
        localStorage.setItem('getDataSetupPPOL', JSON.stringify(setPP));
        // this._router.navigate(['/app/fitur/add-new-product/']);
    }

    setupOB(item) {
        if (this.model.projectCode == undefined) {
            this.message.info("Please Select a Project!!");
        } else if (this.clusterModel == undefined || !this.clusterModel.length) {
            this.message.info("Please Select a Cluster!!");
        } else {
            var setOB = { 'cluster': this.clusterModel };
            localStorage.setItem('clusterOB', JSON.stringify(setOB));
            if (this.model.projectInfoID) this.createOLBooking.projectInfoID = this.model.projectInfoID;
            this.createOLBooking.projectID = this.model.projectCode.split("|")[0];
            this.createOLBooking.status = true;
            this.createOLBooking.clusterID = this.clusterModel;

            this._adminNewProject.insertProjectOLBooking(this.createOLBooking)
                .finally(() => this.saving = false)
                .subscribe(result => {
                }, err => {
                    this.message.error(err.message)
                        .done(() => {
                        });
                });
            window.open('/app/fitur/product-ob/' + parseInt(this.model.projectCode.split("|")[0]), "_blank");
        }
    }

    r_control() {
        return {
            projectInfoID: this.projectForm.controls['projectInfoID'],
            projectCode: this.projectForm.controls['projectCode'],
            productCode: this.projectForm.controls['productCode'],
            productName: this.projectForm.controls['productName'],
            diagrammaticType: this.projectForm.controls['diagrammaticType'],
            status: this.projectForm.controls['status'],
            statusob: this.projectForm.controls['statusob'],
            statuspp: this.projectForm.controls['statuspp'],
            logo: this.projectForm.controls['logo'],
            cluster: this.projectForm.controls['cluster'],
        }
    }

    diagrammaticTypeLoading = false;
    getListDiagrammaticType() {
        this.diagrammaticTypeLoading = true;
        this._adminNewProject.getDropdownDiagramaticType()
            .finally(() => {
                setTimeout(() => {
                    $('.diagrammatic-type').selectpicker('refresh');
                    this.diagrammaticTypeLoading = false;
                }, 0);
            }).subscribe(result => {
                this._digrammaticTypes = result;
            });
    }
}
