import { Component, Injector, ViewChild, ViewEncapsulation, Input,Output,EventEmitter } from '@angular/core';
import {
  RoleServiceProxy,
  RoleListDto,
  AdminServiceProxy,
  GetListAllProjectResultDto,
  GetDetailSitePlanResultDto,
  CreateOrUpdateDetailSitePlanInputDto,
  AdminManageProjectServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { DatePipe } from '@angular/common';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SiteplanModalDetailComponent } from './siteplan-modal-detail.component';
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";

export class FormControl {
  project: any;
  legend: any;
  images: any;
}

export class images {
  siteplan: any;
}

@Component({
  selector: 'siteplanSubModul',
  templateUrl: './siteplan.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})

export class SiteplanComponent extends AppComponentBase {
  @ViewChild('dataTable') dataTable: DataTable;
  @ViewChild('siteplanBookingModal') detailSiteplanModal: SiteplanModalDetailComponent;
  @Input() getSelectedProject:number;

  selectionForm: FormGroup;
  _projects: GetListAllProjectResultDto[];
  _siteplans: GetDetailSitePlanResultDto;
  browsers;
  memberCode;
  chk_legend;
  type;
  myproject: any;
  //for image
  model_img: images = new images;
  form_control: FormControl = new FormControl;
  //for ng-model
  _form_control: FormControl = new FormControl;
  formGroup: FormGroup;
  public uploader: FileUploader;
  public temporaryPictureUrl: string;
  private temporaryPictureFileName: string;
  private _uploaderOptions: FileUploaderOptions = {};
  uploadedFileName = null;
  uploadedFileNamePastSrc = null;
  uploadedFileNamePast = null;
  @Output() siteplanChange = new EventEmitter();
  show_siteplan;
  model:any=[];
  imgUpdated;

  optionsFile = {
    max_file_size: 1048576,
    type: 'jpg|jpeg|png',
    url: 'UploadSitePlanImage',
    pictureUrl: 'SitePlanImage',
  }

  form_builder_selection = {
    'project': [null, Validators.compose([Validators.required])],
    'legend': [null, Validators.compose([Validators.required, Validators.maxLength(1000)])],
    'images': [null],
  }

  constructor(injector: Injector,
    private _appSessionService: AppSessionService,
    private _fb: FormBuilder,
    private _adminService: AdminServiceProxy,
    private _adminManageProject: AdminManageProjectServiceProxy) {
    super(injector);
    this.selectionForm = _fb.group(this.form_builder_selection);
    this.form_control = this.r_control();
  }

  ngOnInit(): void {
    this.memberCode = this._appSessionService.user.userName;
    this.siteplanChanged();
    this.show_siteplan = true;
    this.imgUpdated="";
  }

  ngOnChanges() {
      if (this.getSelectedProject !== undefined) {
          this._form_control.legend = "";
          this.model_img.siteplan = "";

          // this.getDetailSitePlan(this.getSelectedProject);
          this.getManageProject(this.getSelectedProject);
      }
  }

  r_control() {
    return {
      project: this.selectionForm.controls['project'],
      legend: this.selectionForm.controls['legend'],
      images: this.selectionForm.controls['images']
    }
  }

  pictureUrl(event) {
    this.uploadedFileNamePastSrc = event.toString();
    this.siteplanChanged();
  }

  delImage() {
    this.uploadedFileName = null;
    $("input[type='file']").val(null);
    this.model.image = null;
    this.uploadedFileNamePastSrc = null;    
    this.imgUpdated="removed";
    this.siteplanChanged();
  }

  imgUploaded(event): void {
    abp.notify.success('File Uploaded');
    this.imgUpdated="updated";
    this.uploadedFileName = event.toString();
  }

  // getDetailSitePlan(projectid) {
  //   if (projectid!=undefined){
  //     this._adminService.getDetailSitePlan(projectid).subscribe(result => {
  //       this._form_control.legend = result.sitePlansLegend;
  //       this.uploadedFileNamePastSrc = result.sitePlansImageUrl;
  //       setTimeout(() => {
  //       }, 0);
  //     });
  //   }
  // }

  getManageProject(projectInfoID){    
    if (projectInfoID!=undefined){
      this._adminManageProject.getDetailManageProject(projectInfoID).finally(() => {
          setTimeout(() => {
          }, 0);
      }).subscribe(result => {
          this.uploadedFileNamePastSrc= result.sitePlansImageUrl;          
          if (JSON.parse(result.displaySetting)){
              let displayForm = JSON.parse(result.displaySetting);
              this.show_siteplan = displayForm.siteplan;
          }    
          this.siteplanChanged();
      }, err => {
          this.uploadedFileName = null;
          this.uploadedFileNamePastSrc = null;
          this.uploadedFileNamePast = null;
      });
    }
  }
  
  siteplanChanged() {    
      console.log('siteplan',this.show_siteplan);
      let imgStatus;  
      this.model.sitePlansImageUrl = this.uploadedFileName;
      this.model.imageSitePlanStatus = this.imgUpdated;

      this.model.show_siteplan = this.show_siteplan;
      this.siteplanChange.emit(this.model);
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.selectionForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
      if (this._form_control.legend == undefined || this._form_control.legend == '') {
        this.chk_legend = true;
      }
    }
    return invalid;
  }
}
