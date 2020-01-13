import { Component, Injector, ViewChild, ViewEncapsulation, Input,Output, EventEmitter } from '@angular/core';
import {
    ProjectServiceProxy, ListProjectResultDto, AdminServiceProxy,
    GetDetailTowerResultDto,AdminManageProjectServiceProxy, ItemDetailsDto, Key_features,
    CreateOrUpdateSocialMediaProjectInputDto
} from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { DatePipe } from '@angular/common';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Paginator } from "primeng/primeng";
import { EditorModule } from "primeng/primeng";
import { PrimengDatatableHelper } from "@shared/helpers/PrimengDatatableHelper";

import { KeyFeatureComponent } from './keyfeature.component';
import { SocialMediaComponent } from './socialmedia.component';
import { TowerComponent } from './tower.component';
import { PreviewInformationComponent } from './preview-information.component';

export class info {
    projectID: any
    projectDesc: any
    projectDeveloper: any
    projectWebsite: any
    projectMarketingOffice: any
    projectMarketingPhone: any
    show_desc: any
    show_key: any
    show_projectdetail: any
    show_marketing: any
    show_sosmed: any
    keyfeature: any
    socialmedia: any
}
export class socialmedia{
    projectInfoID: number;
    sosialMediaID: number;
    socialMediaLink: string;
    socialMediaLinkID: number;
    isActive: boolean;
    socialMediaName: string;
}

@Component({
    selector: 'informationSubModul',
    templateUrl: './information.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class InformationComponent extends AppComponentBase {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('textEditor') textEditor: EditorModule;

    @ViewChild('towerModal') towerModal: TowerComponent;
    @ViewChild('keyfeatureModal') keyfeatureModal: KeyFeatureComponent;
    @ViewChild('socialModal') socialModal: SocialMediaComponent;
    @ViewChild('previewInformationModal') previewInformationModal: PreviewInformationComponent;

    @ViewChild(DropzoneComponent) dropzonRef: DropzoneComponent;
    @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;

    @Input() getSelectedProject:number;
    @Output() infoChange = new EventEmitter();

    text1: any;

    // first
    firstTower = 0;
    firstKeyFiture = 0;
    firstsocial = 0;

    _keyFeatures: any = [];
    _towers: any = [];
    _social: any = [];

    //datatable
    primeNgTowers: any;
    primeNgKeyFeatures: any;
    primeNgSocial: any;
    _projects: ListProjectResultDto[];
    projectKeyFeatures: Key_features[] = [];
    projectSosmed: any = [];

    // _detailInformation: any = [];

    browsers;
    memberCode;
    type;
    myproject: any;
    _model: info = new info;
    dataLocation;
    noPreview = true;
    projectId: any;
    changeProject: any;
    description: '';
    _form_control_project: any;
    infoForm: FormGroup;
    
    form_builder_model = {
        'projectID': [null],
        'projectDesc': [null],
        'projectDeveloper': [null],
        'projectWebsite': [null],
        'projectMarketingOffice':[null],
        'projectMarketingPhone': [null],
        'show_desc': [null],
        'show_key': [null],
        'show_projectdetail': [null],
        'show_marketing': [null],
        'show_sosmed': [null]
    }

    // _model: CreateOrUpdateProjectInfoDto = new CreateOrUpdateProjectInfoDto;

    constructor(injector: Injector,
        private _appSessionService: AppSessionService,
        private _script: ScriptLoaderService,
        private _projectService: ProjectServiceProxy,
        private _adminServiceProxy: AdminServiceProxy,
        private _adminManageProject: AdminManageProjectServiceProxy,
        private _fb: FormBuilder) {
        super(injector);
        this.infoForm = _fb.group(this.form_builder_model);
        this._model = this.r_control();
    }

    ngOnInit() {
        this.memberCode = this._appSessionService.user.userName;

        this.primeNgTowers = new PrimengDatatableHelper();
        this.primeNgKeyFeatures = new PrimengDatatableHelper();
        this.primeNgSocial = new PrimengDatatableHelper();
        // this.informationChanged();
        this.setdefault();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {   
            $('#keyfeatures .ui-paginator-rpp-options').after('items per page');
            $('#socialmedia .ui-paginator-rpp-options').after('items per page');

        }, 0);
        
    }

    setdefault(){        
        this._model.projectID = "";
        this._model.projectDesc = "";
        this._model.projectDeveloper = "";
        this._model.projectWebsite = "";
        this._model.projectMarketingOffice = "";
        this._model.projectMarketingPhone = "";
        this._model.show_desc = true;
        this._model.show_key = true;
        this._model.show_projectdetail = true;
        this._model.show_marketing = true;
        this._model.show_sosmed = true;
    }

    ngOnChanges() {
        if (this.getSelectedProject !== undefined) {
            this.getListKeyFiture(this.getSelectedProject);
            // this.getDetailInformation(this.getSelectedProject);
            this.getListSocial(this.getSelectedProject);
            this.getManageProject(this.getSelectedProject);
            setTimeout(() => {
                this.informationChanged();
                $('.project').selectpicker('refresh');
            }, 0);
        }
    }

    getManageProject(projectInfoID){
        if (projectInfoID!=undefined){
            this._adminManageProject.getDetailManageProject(projectInfoID).finally(() => {
                setTimeout(() => {
                }, 0);
            }).subscribe(result => {
                if (JSON.parse(result.displaySetting)){
                    let displayForm = JSON.parse(result.displaySetting);
                    this._model.show_desc = displayForm.desc;
                    this._model.show_key = displayForm.keyfeature;
                    this._model.show_projectdetail = displayForm.proj_detail;
                    this._model.show_marketing = displayForm.marketing;
                    this._model.show_sosmed = displayForm.sosmed;
                }
                
                this._model.projectDesc = result.projectDescription;
                this._model.projectDeveloper = result.projectDeveloper;
                this._model.projectWebsite = result.projectWebsite;
                this._model.projectMarketingPhone = result.projectMarketingPhone;
                this._model.projectMarketingOffice = result.projectMarketingOffice;
                // console.log('getManageProjectList', JSON.parse(result.displaySetting));
            }, err => {
                this.setdefault();
            });
        }
    }

    // getListTower(projectID: number) {
    //     this._towers = [];
    //     this.primeNgTowers.records = [];
    //     this.primeNgTowers.totalRecordsCount = this.primeNgTowers.records.length;
    //     if(projectID!=undefined){
    //         this.primeNgTowers.showLoadingIndicator();
    //         this._adminServiceProxy.getListTower(projectID)
    //             .subscribe(result => {
    //                 console.log('getTowerDetail ', result);
    //                 this.primeNgTowers.records = result.items;
    //                 this.primeNgTowers.defaultRecordsCountPerPage = 5;
    //                 this.primeNgTowers.totalRecordsCount = result.items.length;
    //                 this.primeNgTowers.hideLoadingIndicator();
    //             }, err => {
    //                 this.primeNgTowers.hideLoadingIndicator();
    //             });
    //     }
    // }

    keyValue(data) {
        let item = new Key_features;
        item.keyFeatures = data.keyFeatures;
        if (data.methodStatus==="Update"){         
            this.projectKeyFeatures[data.id].keyFeatures = data.keyFeatures;
        }else{
            this.projectKeyFeatures = [...this.projectKeyFeatures, item];
        }
        
        this.primeNgKeyFeatures.showLoadingIndicator();
        this.primeNgKeyFeatures.records = this.projectKeyFeatures;
        this.primeNgKeyFeatures.defaultRecordsCountPerPage = 5;
        this.primeNgKeyFeatures.totalRecordsCount = this.projectKeyFeatures.length;
        this.primeNgKeyFeatures.hideLoadingIndicator();
        this.informationChanged();
    }

    socialValue(data) { 
        let item = new socialmedia;
        item.sosialMediaID = data.sosialMediaID.split("|")[0];
        item.socialMediaName = data.sosialMediaID.split("|")[1];
        item.socialMediaLink = data.socialMediaLink;
        item.isActive = data.isActive;
        if (data.methodStatus==="Update"){       
            item.socialMediaLinkID = data.socialMediaLinkID;  
            this.projectSosmed[data.id].sosialMediaID = data.sosialMediaID.split("|")[0];
            this.projectSosmed[data.id].socialMediaName = data.sosialMediaID.split("|")[1];
            this.projectSosmed[data.id].socialMediaLink = data.socialMediaLink;
            this.projectSosmed[data.id].socialMediaLinkID = data.socialMediaLinkID;
            this.projectSosmed[data.id].isActive = data.isActive;
        }else{
            this.projectSosmed = [...this.projectSosmed, item];
        }

        this.primeNgSocial.showLoadingIndicator();
        this.primeNgSocial.records = this.projectSosmed;
        this.primeNgSocial.defaultRecordsCountPerPage = 5;
        this.primeNgSocial.totalRecordsCount = this.projectSosmed.length;
        this.primeNgSocial.hideLoadingIndicator();
        this.informationChanged();
    }

    itemKeyFeatures(keyfeatures: string) {
        let item = new Key_features;
        item.keyFeatures = keyfeatures;
        this.primeNgKeyFeatures.keyFeatures = [...this.primeNgKeyFeatures.keyFeatures, item];
        // return item;
    }

    getListKeyFiture(item): void {
        this.primeNgKeyFeatures.records = [];
        this.primeNgKeyFeatures.totalRecordsCount = this.primeNgKeyFeatures.records.length;

        this.primeNgKeyFeatures.showLoadingIndicator();
        if (item!=undefined){
            this._adminServiceProxy.getKeyFeatures(item)
                .subscribe(result => {
                    this.projectKeyFeatures = result.items;
                    this.primeNgKeyFeatures.records = result.items;
                    this.primeNgKeyFeatures.defaultRecordsCountPerPage = 5;
                    this.primeNgKeyFeatures.totalRecordsCount = result.items.length;
                    this.primeNgKeyFeatures.hideLoadingIndicator();
                    this.informationChanged();
                }, err => {
                    this.primeNgKeyFeatures.hideLoadingIndicator();
                });
        }
    }

    getListSocial(projectInfoID: number): void {
        this.primeNgSocial.records = [];
        this.primeNgSocial.totalRecordsCount = this.primeNgSocial.records.length;
        if(projectInfoID!=undefined){
            this.primeNgSocial.showLoadingIndicator();
            this._adminServiceProxy.getListSocialMediaProject(projectInfoID)
                .subscribe(result => {
                    this.projectSosmed = result.items;
                    this.primeNgSocial.records = result.items;
                    this.primeNgSocial.defaultRecordsCountPerPage = 5;
                    this.primeNgSocial.totalRecordsCount = result.items.length;
                    this.primeNgSocial.hideLoadingIndicator();
                    this.informationChanged();
                }, err => {
                    this.primeNgSocial.hideLoadingIndicator();
                });
        }
    }

    deleteSocial(projectId, socialMediaId): void {
        
        this.message.confirm(
        "Are you sure to delete this social media ?",
            isConfirmed => {
                if (isConfirmed) {

                    this.primeNgSocial.showLoadingIndicator();
                    this._adminServiceProxy.deleteSocialMediaProject(projectId, socialMediaId)
                        .finally(() => {
                            this.getListSocial(projectId);
                        })
                        .subscribe(result => {
                            this.message.success("Social Media Deleted Successfully")
                                .done(() => {
                                    this.primeNgSocial.hideLoadingIndicator();
                                });
                        }, err => {
                            this.message.error(err.message)
                                .done(() => {
                                    console.error("deleteSocialMediaProject ", err.message);
                                    this.primeNgSocial.hideLoadingIndicator();
                                });
                        });
                }

            }
        );        
    }

    informationChanged() { // You can give any function name     
        this._model.projectDesc = this._model.projectDesc;
        this._model.keyfeature = this.projectKeyFeatures;
        this._model.socialmedia = this.projectSosmed;
        this.infoChange.emit(this._model);
    }
    
    keyFitureEvent(event = null) {
        if (event) {
            this.firstKeyFiture = event.first;
        } else {
            this.getListKeyFiture(this.projectId);
        }
    }

    socialEvent(event = null) {
        if (event) {
            this.firstsocial = event.first;
        } else {
            this.getListSocial(this.projectId);
        }
    }

    r_control() {
        return {
            projectID: this.infoForm.controls['projectID'],
            projectDesc: this.infoForm.controls['projectDesc'],
            projectDeveloper: this.infoForm.controls['projectDeveloper'],
            projectWebsite: this.infoForm.controls['projectWebsite'],
            projectMarketingOffice: this.infoForm.controls['projectMarketingOffice'],
            projectMarketingPhone: this.infoForm.controls['projectMarketingPhone'],
            show_desc: this.infoForm.controls['show_desc'],
            show_key: this.infoForm.controls['show_key'],
            show_projectdetail: this.infoForm.controls['show_projectdetail'],
            show_marketing: this.infoForm.controls['show_marketing'],
            show_sosmed: this.infoForm.controls['show_sosmed'],
            keyfeature: this.infoForm.controls['keyfeature'],
            socialmedia: this.infoForm.controls['socialmedia'],
        }
    }

    // deleteKeyFeature(indeks, records){
    //     delete this.projectKeyFeatures[indeks];
    //     console.log('indeks', indeks);
    //     console.log('records', records);
    // }

    deleteKeyFeature(col){
        this.message.confirm(
          "Are you sure to delete this gallery ?",
          isConfirmed => {
                if (isConfirmed) {
                    this.projectKeyFeatures.splice(col, 1)
                    // for(let i=0; i<this.projectKeyFeatures.length;i++){
                    //     this.projectKeyFeatures[i].id = (i+1).toString()
                    // }
                    this.projectKeyFeatures = [...this.projectKeyFeatures];
                    this.primeNgKeyFeatures.showLoadingIndicator();
                    this.primeNgKeyFeatures.records = this.projectKeyFeatures;
                    this.primeNgKeyFeatures.defaultRecordsCountPerPage = 5;
                    this.primeNgKeyFeatures.totalRecordsCount = this.projectKeyFeatures.length;
                    this.primeNgKeyFeatures.hideLoadingIndicator();
                    this.informationChanged();
                }
            }
        );
    }

      deleteSocialMedia(col){
        this.message.confirm(
          "Are you sure to delete this gallery ?",
          isConfirmed => {
                if (isConfirmed) {
                    this.projectSosmed.splice(col, 1);
                    this.projectSosmed = [...this.projectSosmed];
                    this.primeNgSocial.showLoadingIndicator();
                    this.primeNgSocial.records = this.projectSosmed;
                    this.primeNgSocial.defaultRecordsCountPerPage = 5;
                    this.primeNgSocial.totalRecordsCount = this.projectSosmed.length;
                    this.primeNgSocial.hideLoadingIndicator();
                    this.informationChanged();
                }
            }
        );
  
        }

}
