import { Component, Injector, ViewChild, ViewEncapsulation, Input, Output,EventEmitter } from '@angular/core';
import { ProjectServiceProxy, ListProjectResultDto, AdminServiceProxy,AdminManageProjectServiceProxy, CreateProjectLocationInputDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { LocationModalDetailComponent } from './location-modal.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { DatePipe } from '@angular/common';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";
export class gmaps {
  latitude: any;
  longitude: any;
  maps_address: any;
}

export class images {
  image: any;
  img_address: any;
}

@Component({
  selector: 'locationSubModul',
  templateUrl: './location.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]

})
export class LocationComponent extends AppComponentBase {
  @ViewChild('dataTable') dataTable: DataTable;
  @ViewChild('previewModal') previewModal: LocationModalDetailComponent;

  @ViewChild(DropzoneComponent) dropzonRef: DropzoneComponent;
  @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;

  @Input() getSelectedProject:number;

  model_location: CreateProjectLocationInputDto = new CreateProjectLocationInputDto;
  browsers;
  memberCode;
  type;
  myproject: any;
  model_map: gmaps = new gmaps;
  model_img: images = new images;
  dataLocation;

  noPreview = true;
  _projects: ListProjectResultDto[];
  public uploader: FileUploader;
  public temporaryPictureUrl: string;
  private temporaryPictureFileName: string;
  private _uploaderOptions: FileUploaderOptions = {};
  uploadedFileName = null;
  uploadedFileNamePastSrc = null;
  uploadedFileNamePast = null;
  @Output() locationChange = new EventEmitter();
  @Output() displayChange = new EventEmitter();
  show_location;
  imgUpdated;

  optionsFile = {
    max_file_size: 1048576,
    type: 'jpg|jpeg|png',
    url: 'UploadProjectLocationImage',
    pictureUrl: 'LocationImg',
  }
  constructor(
    injector: Injector,
    private _appSessionService: AppSessionService,
    private _script: ScriptLoaderService,
    private _projectService: ProjectServiceProxy,
    private _adminService: AdminServiceProxy,
    private _adminManageProject: AdminManageProjectServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.memberCode = this._appSessionService.user.userName;
    this.locationChanged();
    this.imgUpdated = "";

    this.show_location = true;
  }

  ngOnChanges() {

      if (this.getSelectedProject !== undefined) {
          this.setClear();

          // this.getLocation(this.getSelectedProject);
          this.getManageProject(this.getSelectedProject);
      }
  }

  setClear(){    
    this.model_map.latitude = "";
    this.model_map.longitude = "";
    this.model_map.maps_address = "";
    this.model_img.img_address = "";
    this.type = undefined;
    this.uploadedFileNamePastSrc = null;
    this.uploadedFileName = null;
  }

  // getLocation(projecid) {
  //   console.log('masuk getlocatoin');
  //   this._adminService.getDetailProjectLocation(projecid).subscribe(result => {
  //     console.log('masuk getLocation',result);
      
  //     this.model_map.latitude = result.latitude;
  //     this.model_map.longitude = result.longitude;
  //     this.model_map.maps_address = result.projectAddress;
  //     this.model_img.img_address = result.projectAddress;
  //     this.uploadedFileNamePastSrc = result.locationImageURL;

  //     this.dataLocation = result;      
  //     this.locationChange.emit( this.dataLocation);
  //   });
  // }

  
  getManageProject(projectInfoID){
      this._adminManageProject.getDetailManageProject(projectInfoID).finally(() => {
          setTimeout(() => {
          }, 0);
      }).subscribe(result => {
          // debugger
          let locationImg = result.locationImageUrl.split("-")[0];
          if (result.longitude==0){
            // if (locationImg!=undefined){
              this.type = 2;
            // }
          }else{
            this.type = 1;
          }
          this.model_map.latitude = result.latitude;
          this.model_map.longitude = result.longitude;
          this.model_map.maps_address = result.projectAddress;
          // this.model_img.img_address = result.projectAddress;
          this.uploadedFileNamePastSrc = result.locationImageUrl;
          this.dataLocation = result;      
          if (JSON.parse(result.displaySetting)){
              let displayForm = JSON.parse(result.displaySetting);
              this.show_location = displayForm.location;
          } 
          this.locationChanged();

      }, err => {
          this.setClear();
      });
  }

  pictureUrl(event) {
    this.uploadedFileNamePastSrc = event.toString();
  }

  delImage() {
    this.uploadedFileName = null;
    $("input[type='file']").val(null);
    this.model_img.image = null;
    this.uploadedFileNamePastSrc = null;
    this.imgUpdated = "removed";
    this.locationChanged();
  }

  imgUploaded(event): void {
    abp.notify.success('FileUploaded');
    this.imgUpdated = "updated";
    this.uploadedFileName = event.toString();
    this.locationChanged();
  }

  
  locationChanged() { // You can give any function name
      console.log('show_location', this.show_location);      
      let dataLocation = this.onSave(); 
      this.locationChange.emit(dataLocation);
      this.displayChange.emit(this.show_location);
  }

  onSave() {
    let modelLocation;
    let imgStatus;
    // if ((this.uploadedFileName == "" || this.uploadedFileName == null)){
    //   imgStatus = "";
    // }else if ((this.uploadedFileName == "" || this.uploadedFileName == null) && (this.uploadedFileNamePastSrc == null) && (this.imgUpdated==true)){
    //   imgStatus = "removed";
    // }else{
    //   imgStatus = "updated";
    // }
    modelLocation = {
      "projectId": this.getSelectedProject,
      "latitude": this.model_map.latitude == undefined ? '' : this.model_map.latitude,
      "longitude": this.model_map.longitude == undefined ? '' : this.model_map.longitude,
      "projectAddress": this.model_map.maps_address == undefined ? '' : this.model_map.maps_address,
      "locationImageURL": this.uploadedFileName == "" || this.uploadedFileName == null ? null : this.uploadedFileName,
      "imageStatus": this.imgUpdated,
      "display": this.show_location
    }
    
    return modelLocation;
  }

  preview(type, projectId) {
    localStorage.setItem("loc_lat", this.model_map.latitude);
    localStorage.setItem("loc_lng", this.model_map.longitude);
    this.previewModal.show(type, projectId);
  }

  loadData(type){
    if (type==1){
      this.uploadedFileName == ""; 
      this.delImage(); 
    }else{    
      this.model_map.latitude = 0;
      this.model_map.longitude = 0;
    }
    this.locationChanged();
  }
}
