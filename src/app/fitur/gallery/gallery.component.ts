import { Component, Injector, ViewChild, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { AdminServiceProxy, AdminManageProjectServiceProxy, BookingHistoryServiceProxy, ProjectServiceProxy, ListProjectResultDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { GalleryModalDetailComponent } from './gallery-modal-detail.component';

export class FormControl {
  project: any;
}

export class images {
  image: any;
  img_address: any;
}
export class GalleryDto {
  imageTemp: any;
  projectInfoID: number;
  imageURL: string;
  imageAlt: string;
  sortNo: number;
  galleryID: number;
  imageStatus: string;
}
@Component({
  selector: 'gallerySubModul',
  templateUrl: './gallery.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})

export class GalleryComponent extends AppComponentBase {
  @ViewChild('dataTable') dataTable: DataTable;
  @ViewChild('galleryBookingModal') detailGalleryModal: GalleryModalDetailComponent;

  @Input() getSelectedProject: number;
  @Output() galleryChange = new EventEmitter();

  selectionForm: FormGroup;
  _projects: ListProjectResultDto[];
  model: any = [];
  browsers;
  memberCode;
  type;
  myproject: any;
  model_img: images = new images;
  dataGallery;
  first = 0;
  gallery: any = [];
  cancelLoading;
  form_control: FormControl = new FormControl;
  _form_control: FormControl = new FormControl;
  formGroup: FormGroup;
  show_gallery;
  projectGallery: any = [];

  form_builder_selection = {
    'project': [null, Validators.compose([Validators.required])],
    'legend': [null, Validators.compose([Validators.required])]
  }

  constructor(injector: Injector,
    private _appSessionService: AppSessionService,
    _fb: FormBuilder,
    private _adminService: AdminServiceProxy,
    private _adminManageProject: AdminManageProjectServiceProxy) {
    super(injector);
    this.selectionForm = _fb.group(this.form_builder_selection);
    this.form_control = this.r_control();
  }

  ngOnInit(): void {
    this.memberCode = this._appSessionService.user.userName;
    this.galleryChanged();
    this.show_gallery = true;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      $('#gallery .ui-paginator-rpp-options').after('items per page');
    }, 0);
  }

  ngOnChanges() {
    if (this.getSelectedProject !== undefined) {
      this.getLatestList(this.getSelectedProject);
      this.getManageProject(this.getSelectedProject);
    }
  }

  r_control() {
    return {
      project: this.selectionForm.controls['project'],
      legend: this.selectionForm.controls['legend']
    }
  }

  getLatestList(projectInfoID: number) {
    this.gallery = [];
    this.primengDatatableHelper.records = [];
    this.first = 0;
    if (projectInfoID != undefined) {
      this.primengDatatableHelper.showLoadingIndicator();
      this._adminService.getGalleryProjectList(projectInfoID)
        .subscribe(result => {
          this.projectGallery = result.items;

          this.primengDatatableHelper.records = result.items;
          this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
          this.primengDatatableHelper.totalRecordsCount = result.items.length;
          this.primengDatatableHelper.hideLoadingIndicator();
          this.galleryChanged();
        }, () => {
          this.primengDatatableHelper.hideLoadingIndicator();
        });
    }
  }

  galleryValue(data) {
    var copy = Object.assign({}, data);
    if (data.methodStatus === "Update") {
      this.projectGallery[data.id].imageAlt = copy.imageAlt;
      this.projectGallery[data.id].imageURL = copy.imageTemp;
      this.projectGallery[data.id].imageTemp = copy.imageURL;
      this.projectGallery[data.id].sortNo = copy.sortNo;
      this.projectGallery[data.id].imageStatus = copy.imageStatus;
    } else {
      let item = new GalleryDto;
      item.imageURL = data.imageTemp;
      item.imageAlt = data.imageAlt;
      item.imageTemp = data.imageURL;
      item.sortNo = data.sortNo;
      item.imageStatus = data.imageStatus;
      this.projectGallery = [...this.projectGallery, item];
    }

    this.primengDatatableHelper.showLoadingIndicator();
    this.primengDatatableHelper.records = this.projectGallery;
    this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
    this.primengDatatableHelper.totalRecordsCount = this.projectGallery.length;
    this.primengDatatableHelper.hideLoadingIndicator();
    this.galleryChanged();
  }

  getManageProject(projectInfoID) {
    if (projectInfoID != undefined) {
      this._adminManageProject.getDetailManageProject(projectInfoID).finally(() => {
        setTimeout(() => {
        }, 0);
      }).subscribe(result => {
        if (JSON.parse(result.displaySetting)) {
          let displayForm = JSON.parse(result.displaySetting);
          this.show_gallery = displayForm.gallery;
        }
      }, () => {
        this.primengDatatableHelper.records = [];
        this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
        this.primengDatatableHelper.totalRecordsCount = 0;
        this.primengDatatableHelper.hideLoadingIndicator();
      });

    }
  }

  getGalleryEvent(event = null) {
    if (event) {
      this.first = event.first;
    } else {
      this.getLatestList(this.getSelectedProject);
    }
  }

  deleteGallery(index) {
    this.message.confirm(
      "Are you sure to delete this gallery ?",
      isConfirmed => {
        if (isConfirmed) {
          this.projectGallery[index].imageStatus = "false";
          // this.projectGallery.splice(index, 1);
          // this.projectGallery = [...this.projectGallery];

          this.primengDatatableHelper.showLoadingIndicator();
          this.primengDatatableHelper.records = this.projectGallery;
          this.primengDatatableHelper.defaultRecordsCountPerPage = 5;
          this.primengDatatableHelper.totalRecordsCount = this.projectGallery.length;
          this.primengDatatableHelper.hideLoadingIndicator();

          this.galleryChanged();
        }
      }
    );
  }

  galleryChanged() { // You can give any function name 
    this.model.show_gallery = this.show_gallery;
    this.model.projectGallery = this.projectGallery;
    this.galleryChange.emit(this.model);
  }

  removefile() {
    //   this._model_ktp.image_npwp = null;
  }

  onSending(data): void {
    let file = data[0];
    let base64image;
    setTimeout(() => {
      base64image = file.dataURL.replace('data:' + file.type + ';base64', '');
      this.model_img.image = base64image;
    }, 3000);
  }
}
