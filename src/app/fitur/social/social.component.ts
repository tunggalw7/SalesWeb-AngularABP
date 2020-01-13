import {Component, Injector, ViewChild, ViewEncapsulation} from '@angular/core';
import {
    GetListSocialMediaResultDto, IGetListSocialMediaResultDto, AdminServiceProxy
} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from '@shared/common/app-component-base';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {DataTable} from 'primeng/components/datatable/datatable';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import {Paginator} from "primeng/primeng";

export class FormControl {
    project: any;
}

export class images {
    image: any;
    img_address: any;
}

@Component({
    templateUrl: './social.component.html',
    // styleUrls: './social.component.css',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class SocialComponent extends AppComponentBase {
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    selectionForm: FormGroup;
    browsers;
    memberCode;
    filterText = '';
    first = 0;
    type;
    myproject: any;
    model_img: images = new images;

    form_control: FormControl = new FormControl;
    _form_control: FormControl = new FormControl;
    formGroup: FormGroup;

    form_builder_selection = {
        'project': [null, Validators.compose([Validators.required])],
        'legend': [null, Validators.compose([Validators.required])]
    }

    constructor(injector: Injector,
                private _fb: FormBuilder,
                private _adminServiceProxy: AdminServiceProxy) {
        super(injector);
        this.selectionForm = _fb.group(this.form_builder_selection);
        this.form_control = this.r_control();
    }

    ngOnInit(): void {
        this.getLatestList()
    }
    ngAfterViewInit(): void {
        setTimeout(() => {   
            $('.ui-paginator-rpp-options').after('items per page');
        }, 0);
    }
    r_control() {
        return {
            project: this.selectionForm.controls['project'],
            legend: this.selectionForm.controls['legend']
        }
    }

    getLatestList(event = null): void {
        if (event) {
            this.first = event.first;
        } else {
            this.first = 0;
            this.primengDatatableHelper.showLoadingIndicator();
            this._adminServiceProxy.getAllListSocialMedia().subscribe(result => {
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.defaultRecordsCountPerPage = 10;
                this.primengDatatableHelper.totalRecordsCount = result.items.length;
                this.primengDatatableHelper.hideLoadingIndicator();
            }, err => {
                this.primengDatatableHelper.hideLoadingIndicator();
            });
        }
    }

    deleteSocial(record): void {
        this.message.confirm(
            "Are you sure to delete this social media ?",
            "Delete " + record.socialMediaName,
            isConfirmed => {
                if (isConfirmed) {
                    this._adminServiceProxy.deleteSosialMedia(record.socialMediaID)
                    .subscribe(() => {
                        this.message.success("Social Media Deleted Successfully")
                            .done(() => {
                               this.getLatestList();
                            });
                    });
                }

            }
        );
    }
}
