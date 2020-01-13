import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DropzoneDirective, DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-dropimage',
  templateUrl: './dropimage.component.html',
  styleUrls: ['./dropimage.component.css']
})
export class DropimageComponent extends AppComponentBase {

  @ViewChild(DropzoneComponent) dropzonRef: DropzoneComponent;
  @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;

  @Input()
  label: string;

  @Input()
  id: string;

  @Output()
  onChangefile: EventEmitter<any> = new EventEmitter();

  @Output()
  onRemovefile: EventEmitter<any> = new EventEmitter();

  error: string = null;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  public config: DropzoneConfigInterface = {
    url: 'jahahah',
    maxFiles: 1,
    clickable: true,
    maxFilesize: 50,
    acceptedFiles: 'image/*',
  };

  onSending(data): void {
    // alert("onSending");
    // console.log("onSending ", data);
    data.id = this.id;
    this.onChangefile.emit(data);
    this.error = null;
  }

  removefile() {
    this.dropzonRef.directiveRef.reset();
    this.onRemovefile.emit(this.id);
    if (this.error !== null) {
      this.error = null;
    }
  }

  onerror(data): void {
    let file = data[0];
    if (!file.accepted) {
      this.error = data[1];
      this.removefile()

    }
  }

}
