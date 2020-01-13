import { Component, OnInit, Injector, ViewChild, ViewEncapsulation, ElementRef, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  CustomerMemberServiceProxy,
  ListProvinceResultDto,
  TransactionServiceProxy,
  ListCountryResultDto,
  ListCityResultDto,
  ListNationResultDto,
  DocumentUpload,
  ListPostCodeResultDto,
  UpdateCustomerInputDto,
  CreateUpdateCustomerInputDto,
  DetailCustomerResultDto,
  UpdateTRUnitReserved,
  UnitTrUnitReservedDto,
  IDocumentUpload,
  GetListMaritalStatusResultDto
} from '@shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { ValidationService } from 'app/main/share/validation.service';
import { AppSessionService } from '@shared/common/session/app-session.service';

export class TypeCard {
  typeCard: any;
}

export class DataAccountCtrl {
  psCode: any;
  birthplace: any;
  country: any;
  fullname: any;
  birthdate: any;
  email: any;
  city: any;
  nation: any;
  phone: any;
  relativesNumber: any;
  province: any;
  postcode: any;
  marcode: any;
  corresponden: any;
  ktp1: any;
  npwp1: any;
  gender: any;
  image_ktp: any;
  image_npwp: any;
  image_kkeluarga: any;
  image_ktppasangan: any;
  occupation: any;
}

export class Datakitas {
  psCode: any;
  birthplace: any;
  country: any;
  fullname: any;
  birthdate: any;
  email: any;
  city: any;
  nation: any;
  phone: any;
  relativesNumber: any;
  province: any;
  postcode: any;
  marcode: any;
  corresponden: any;
  kitas: any;
  passport: any;
  gender: any;
  image_kitas: any;
  image_passport: any;
  image_npwp: any;
  image_passpassangan: any;
  occupation: any;
}

export class Dttperusahan {
  psCode: any;
  country2: any;
  companyname: any;
  established: any;
  email2: any;
  ktp2: any;
  npwp2: any;
  city: any;
  postcode: any;
  province: any;
  corresponden: any;
  image_ktp_dir: any;
  image_npwp: any;
  image_tdd: any;
  nation: any;
  phone: any;
  relativesNumber: any;
  occupation: any;
}

@Component(
  {
    selector: 'app-update-customer',
    templateUrl: './update-customer.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./update-customer.component.css']
  }
)

export class UpdateCustomerComponent extends AppComponentBase implements OnInit {
  @ViewChild('SampleDatePicker') sampleDatePicker: ElementRef;
  @ViewChild('SampleDatePicker2') sampleDatePicker2: ElementRef;
  @ViewChild('SampleDatePicker3') sampleDatePicker3: ElementRef;
  @ViewChild(DropzoneComponent) dropzonRef: DropzoneComponent;
  @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;

  @Input() getSelectedPsCode: string;

  customerForm: FormGroup;
  public selectedDate: any;
  public dateTimePickerOptions: any;
  public type = 'component';
  public disabled = false;
  optiondatepicker: any;
  cityCode;
  typecard = 1;
  country: ListCountryResultDto[] = [];
  provinces: ListProvinceResultDto[] = [];
  citys: ListCityResultDto[] = [];
  nations: ListNationResultDto[] = [];
  postcodes: ListPostCodeResultDto[] = [];
  maritals = [];
  idtypes = [];
  paramregister: CreateUpdateCustomerInputDto = new CreateUpdateCustomerInputDto;
  document: DocumentUpload = new DocumentUpload;
  model_update: UpdateTRUnitReserved = new UpdateTRUnitReserved;
  documetMap: DocumentUpload[];
  detail: DetailCustomerResultDto;
  sub;
  params_url;
  params_update;
  testing;
  chk_ktp1;
  chk_kitas;
  chk_tdp;
  finalBirthDate1;
  finalBirthDate2;
  finalBirthDate3;
  finalPsCode;
  isFinishOrder;
  byPP;
  bankID;
  orderID;
  dataLocalStorage: any = [];

  inputMasks: any;
  readerfile: FileReader = new FileReader();
  base64textString: string;

  model_ctrl: DataAccountCtrl = new DataAccountCtrl;
  _model_ktp: DataAccountCtrl = new DataAccountCtrl;

  type_ctrl: TypeCard = new TypeCard;
  _type_ctrl: TypeCard = new TypeCard;

  model_dtt: Dttperusahan = new Dttperusahan;
  _model_dtt: Dttperusahan = new Dttperusahan;

  model_kitas: Datakitas = new Datakitas;
  _model_kitas: Datakitas = new Datakitas;

  form_builder_card = {
    'typeCard': [null]
  }

  form_builder_ktp = {
    'birthplace': [null, Validators.compose([Validators.maxLength(50)])],
    'country': [null],
    'fullname': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
    'birthdate': [null],
    'city': [null],
    'nation': [null],
    'province': [null],
    'email': [null, Validators.compose([Validators.required, Validators.email])],
    'phone': [null, Validators.compose([Validators.required, Validators.maxLength(15), ValidationService.numValidator])],
    'relativesNumber': [null, Validators.compose([Validators.required, Validators.maxLength(15), ValidationService.numValidator])],
    'postcode': [null],
    'marcode': [null],
    'corresponden': [null, Validators.compose([Validators.required, Validators.maxLength(1000)])],
    'ktp1': [null, Validators.compose([Validators.required, Validators.minLength(15), Validators.maxLength(16), ValidationService.numValidator])],
    'npwp1': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(15), ValidationService.numValidator])],
    'gender': [null, Validators.compose([Validators.required])],
    'occupation': [null]
    // 'image_ktp': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
    // 'image_npwp': [null],
    // 'image_kkeluarga': [null],
    // 'image_ktppasangan': [null]
  };

  form_builder_kitas = {
    'birthplace': [null],
    'country': [null],
    'fullname': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
    'birthdate': [null],
    'city': [null],
    'nation': [null],
    'email': [null, Validators.compose([Validators.required, Validators.email])],
    'phone': [null, Validators.compose([Validators.required, Validators.maxLength(15), ValidationService.numValidator])],
    'relativesNumber': [null, Validators.compose([Validators.required, Validators.maxLength(15), ValidationService.numValidator])],
    'postcode': [null],
    'marcode': [null],
    'province': [null],
    'corresponden': [null, Validators.compose([Validators.required, Validators.maxLength(1000)])],
    'gender': [null, Validators.compose([Validators.required])],
    'kitas': [null, Validators.compose([Validators.required, Validators.maxLength(15), ValidationService.numValidator])],
    'occupation': [null]
    // 'passport': [null],
    // 'image_kitas': [null],
    // 'image_passport': [null],
    // 'image_npwp': [null],
    // 'image_passpassangan': [null]
  };

  form_builder_tdd = {
    'ktp2': [null, Validators.compose([Validators.required, Validators.minLength(15), Validators.maxLength(16), ValidationService.numValidator])],
    'npwp2': [null],
    'province': [null],
    'email2': [null, Validators.compose([Validators.required, Validators.email])],
    'postcode': [null],
    'city': [null],
    'nation': [null],
    'companyname': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
    'country2': [null],
    'established': [null],
    'phone': [null, Validators.compose([Validators.required, Validators.maxLength(15), ValidationService.numValidator])],
    'relativesNumber': [null, Validators.compose([Validators.required, Validators.maxLength(15), ValidationService.numValidator])],
    'corresponden': [null, Validators.compose([Validators.required, Validators.maxLength(1000)])],
    'occupation': [null]
    // 'image_ktp_dir': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
    // 'image_npwp': [null],
    // 'image_tdd': [null],
  };

  public config: DropzoneConfigInterface = {
    url: 'jahahah',
    maxFiles: 1,
    clickable: true,
    acceptedFiles: 'image/*,.pdf',
  };

  constructor(
    injector: Injector, private _router: Router,
    private _countryService: CustomerMemberServiceProxy,
    private _unitService: TransactionServiceProxy,
    private _activeroute: ActivatedRoute,
    private _appSessionService: AppSessionService,
    private _transaction: TransactionServiceProxy,
    private _script: ScriptLoaderService,
    private _fb: FormBuilder) {
    super(injector);

    this.dateTimePickerOptions = {
      locale: abp.localization.currentLanguage.name,
      format: 'L'
    };

    this.customerForm = _fb.group(this.form_builder_card);
    this.type_ctrl = this.type_control();
    // this._type_ctrl.typeCard = 1;
    this.optiondatepicker = { endDate: '0d' };
  }

  memberCode;
  kk = ""; kitas = ""; ktp = "";
  ktppasangan = ""; npwp = "";
  passport = ""; passportpassangan = "";
  dir = ""; tdp = "";

  iskk = false; iskitas = false; isktp = false;
  isktppasangan = false; isnpwp = false;
  ispassport = false; ispassportpassangan = false;
  isdir = false; istdp = false;
  pporderID;
  ngOnInit(): void {
    this.memberCode = this._appSessionService.user.userName;
    if (this.getSelectedPsCode != undefined) {
      this.isFinishOrder = true;
      this.finalPsCode = this.getSelectedPsCode;
      this.getDetailCustomerbyPsCode(this.finalPsCode);
    } else {
      this.sub = this._activeroute.params
        .subscribe(params => {
          this.isFinishOrder = false;
          this.finalPsCode = params.psCode;
          this.byPP = params.bypp;
          let transaction = JSON.parse(localStorage.getItem('transaction'));

          this.dataLocalStorage.psCodeCust = params.psCode;
          if (this.dataLocalStorage !== undefined) {
            // localStorage.setItem('transaction', JSON.stringify(this.dataLocalStorage));
          }
          this.getDetailCustomerbyPsCode(this.finalPsCode);
        });
    }
    // this.getListJob();
  }

  occDesc;
  getDetailCustomerbyPsCode(psCode) {
    this.updateLoading = true;
    this._countryService.getDetailCustomer(psCode)
      .finally(() => {
        this.getListJob();
        setTimeout(() => {
          this.updateLoading = false;
        }, 3000);
      }).subscribe(result => {
        this.params_update = result;
        this.occDesc = this.params_update.occupation;

        this.getTypes();
        this.getMaritalStatus();

        this.getCountry();
        this.getNation(this.params_update.nationID);
        this.getProvince(this.params_update.country, 'onInit');
        this.getCity(this.params_update.provinceCode, 'onInit');
        this.getPostCode(this.params_update.cityCode, 'onInit');

        for (let i = 0; i < this.params_update.documentImages.length; i++) {

          var documentType = this.params_update.documentImages[i].documentType;
          var documentImage = this.params_update.documentImages[i].documentImage;

          if (documentType === "KK") {
            this.kk = documentImage;
            this._model_ktp.image_kkeluarga = documentImage;
            if (documentImage != null) this.iskk = true;
          }
          if (documentType === "KITAS") {
            this.kitas = documentImage;
            this._model_kitas.image_kitas = documentImage;
            if (documentImage != null) this.iskitas = true;
          }
          if (documentType === "KTP") {
            this.ktp = documentImage;
            this._model_ktp.image_ktp = documentImage;
            if (documentImage != null) this.isktp = true;
          }
          if (documentType === "KTPC") {
            this.ktppasangan = documentImage;
            this._model_kitas.image_passpassangan = documentImage;
            if (documentImage != null) this.isktppasangan = true;
          }
          if (documentType === "NPWP") {
            this.npwp = documentImage;
            this._model_kitas.image_npwp = documentImage;
            this._model_ktp.image_npwp = documentImage;
            this._model_dtt.image_npwp = documentImage;
            if (documentImage != null) this.isnpwp = true;
          }
          if (documentType === "PASS") {
            this.passport = documentImage;
            this._model_kitas.image_passport = documentImage;
            if (documentImage != null) this.ispassport = true;
          }
          if (documentType === "passportpassangan") {
            this.passportpassangan = documentImage;
            this._model_kitas.image_passpassangan = documentImage;
            if (documentImage != null) this.ispassportpassangan = true;
          }
          if (documentType === "KTPP") {
            this.dir = documentImage;
            this._model_dtt.image_ktp_dir = documentImage;
            if (documentImage != null) this.isdir = true;
          }
          if (documentType === "TDP") {
            this.tdp = documentImage;
            this._model_dtt.image_tdd = documentImage;
            if (documentImage != null) this.istdp = true;
          }
        }

        //model ktp
        this._type_ctrl.typeCard = this.params_update.idType;
        this._model_ktp.corresponden = this.params_update.address;
        this._model_ktp.birthdate = moment(this.params_update.birthDate).format('DD/MM/YYYY');
        this.finalBirthDate1 = moment(this.params_update.birthDate).format('YYYY-MM-DD');
        this._model_ktp.birthplace = this.params_update.birthPlace;
        this._model_ktp.country = this.params_update.country;
        this._model_ktp.email = this.params_update.email;
        this._model_ktp.ktp1 = this.params_update.idNo;
        this._model_ktp.marcode = this.params_update.marCode;
        this._model_ktp.fullname = this.params_update.name;
        this._model_ktp.npwp1 = this.params_update.npwp;
        this._model_ktp.phone = this.params_update.phone;
        this._model_ktp.relativesNumber = this.params_update.relativesphone;
        this._model_ktp.psCode = this.params_update.psCode;
        this._model_ktp.gender = this.params_update.sex;
        // this._model_ktp.occupation = this.params_update.occupation;
        //model kitas
        this._type_ctrl.typeCard = this.params_update.idType;
        this._model_kitas.corresponden = this.params_update.address;
        this._model_kitas.birthdate = moment(this.params_update.birthDate).format('DD/MM/YYYY');
        this.finalBirthDate2 = moment(this.params_update.birthDate).format('YYYY-MM-DD');
        this._model_kitas.birthplace = this.params_update.birthPlace;
        this._model_kitas.country = this.params_update.country;
        this._model_kitas.email = this.params_update.email;
        this._model_kitas.kitas = this.params_update.idNo;
        this._model_kitas.marcode = this.params_update.marCode;
        this._model_kitas.fullname = this.params_update.name;
        this._model_kitas.passport = this.params_update.npwp;
        this._model_kitas.phone = this.params_update.phone;
        this._model_kitas.relativesNumber = this.params_update.relativesphone;
        this._model_kitas.psCode = this.params_update.psCode;
        this._model_kitas.gender = this.params_update.sex;
        //model perusahaan
        this._type_ctrl.typeCard = this.params_update.idType;
        this._model_dtt.psCode = this.params_update.psCode;
        this._model_dtt.corresponden = this.params_update.address;
        this._model_dtt.companyname = this.params_update.name;
        this._model_dtt.country2 = this.params_update.country;
        this._model_dtt.established = moment(this.params_update.birthDate).format('DD/MM/YYYY')
        this.finalBirthDate3 = moment(this.params_update.birthDate).format('YYYY-MM-DD');
        this._model_dtt.email2 = this.params_update.email;
        this._model_dtt.ktp2 = this.params_update.idNo;
        this._model_dtt.npwp2 = this.params_update.npwp;
        this._model_dtt.phone = this.params_update.phone;
        this._model_dtt.relativesNumber = this.params_update.relativesphone;

        setTimeout(() => {
          $('.country').selectpicker('refresh');
          $('.nation').selectpicker('refresh');
          $('.province').selectpicker('refresh');
          $('.city').selectpicker('refresh');
          $('.postcode').selectpicker('refresh');
          // $('.marital').selectpicker('refresh');
        }, 0);
      });
  }

  refreshArea() {
    this._model_ktp.province = '';
    this._model_kitas.province = '';
    this._model_dtt.province = '';
    this._model_ktp.city = '';
    this._model_kitas.city = '';
    this._model_dtt.city = '';
    this._model_ktp.postcode = '';
    this._model_kitas.postcode = '';
    this._model_dtt.postcode = '';
  }

  typesLoading = false;
  getTypes() {
    this.typesLoading = true;
    this.idtypes = [
      { "typeId": "1", "typeName": "KTP" },
      { "typeId": "5", "typeName": "KITAS" },
      { "typeId": "7", "typeName": "Tanda Daftar Perusahaan" }
    ];

    setTimeout(() => {
      $('.types').selectpicker('refresh');
      this.typesLoading = false;
    }, 0);
  }

  _jobList: any;
  jobLoading: boolean = true;
  getListJob() {
    this._countryService.getDropdownOccupation().finally(() => {
      this.jobLoading = false;
    }).subscribe(result => {
      this._jobList = result;
      result.forEach(items => {
        if (items.occupationDesc == this.occDesc) {
          this._model_ktp.occupation = items.occupationID;
          this._model_dtt.occupation = items.occupationID;
          this._model_kitas.occupation = items.occupationID;
        }
      })

      setTimeout(() => {
        $('.job').selectpicker('refresh');
      }, 0);
    });
  }

  countryLoading = false;
  getCountry() {
    this.countryLoading = true;
    this._countryService.getCountry()
      .finally(() => {
        setTimeout(() => {
          $('.country').selectpicker('refresh');
          this.countryLoading = false;
        }, 0);
      })
      .subscribe(result => {
        this.country = result;
      });
  }

  nationLoading = false;
  getNation(nationId) {
    this.nationLoading = true;
    this._countryService.getNation()
      .finally(() => {
        setTimeout(() => {
          $('.nation').selectpicker('refresh');
          this.nationLoading = false;
        }, 0);
      })
      .subscribe(result => {
        this.nations = result;
        this._model_ktp.nation = nationId;
        this._model_kitas.nation = nationId;
        this._model_dtt.nation = nationId;
      });
  }

  provinceLoading = false;
  getProvince(countryId, event) {
    this.provinceLoading = true;
    this._countryService.getProvince(countryId)
      .finally(() => {
        setTimeout(() => {
          $('.province').selectpicker('refresh');
          this.provinceLoading = false;
        }, 0);
      }).subscribe(result => {
        this.provinces = result;
        if (event == "onInit") {
          this._model_ktp.province = this.params_update.provinceCode + '|' + this.params_update.province;
          this._model_kitas.province = this.params_update.provinceCode + '|' + this.params_update.province;
          this._model_dtt.province = this.params_update.provinceCode + '|' + this.params_update.province;
        }
      });
  }

  cityLoading = false;
  getCity(provinceCode, event) {
    this.cityLoading = true;
    this._countryService.getCity(provinceCode)
      .finally(() => {
        setTimeout(() => {
          $('.city').selectpicker('refresh');
          this.cityLoading = false;
        }, 0);
      }).subscribe(result => {
        this.citys = result;
        if (event == "onInit") {
          this._model_ktp.city = this.params_update.cityCode + '|' + this.params_update.city;
          this._model_kitas.city = this.params_update.cityCode + '|' + this.params_update.city;
          this._model_dtt.city = this.params_update.cityCode + '|' + this.params_update.city;
        }
      });
  }

  postcodeLoading = false;
  getPostCode(cityCode, event) {
    this.postcodeLoading = true;
    this._countryService.getPostCode(cityCode)
      .finally(() => {
        setTimeout(() => {
          $('.postcode').selectpicker('refresh');
          this.postcodeLoading = false;
        }, 0);
      }).subscribe(result => {
        this.postcodes = result;
        if (event == "onInit") {
          this._model_ktp.postcode = this.params_update.postCode;
          this._model_kitas.postcode = this.params_update.postCode;
          this._model_dtt.postcode = this.params_update.postCode;
        }
      });
  }

  maritalLoading = false;
  getMaritalStatus() {
    this.maritalLoading = true;
    this._countryService.getListMaritalStatus()
      .finally(() => {
        setTimeout(() => {
          $('.marital').selectpicker('refresh');
          this.maritalLoading = false;
        }, 0);
      }).subscribe(result => {
        this.maritals = result;
      });
  }

  onChangeType(value) {
    if (value == 7) {
      this.customerForm = this._fb.group(this.form_builder_tdd);
      this.model_dtt = this.dtt_control();
    } else if (value == 5) {
      this.customerForm = this._fb.group(this.form_builder_kitas);
      this.model_kitas = this.kitas_control();
    } else {
      this.customerForm = this._fb.group(this.form_builder_ktp);
      this.model_ctrl = this.r_control();
    }
  }

  onChangeCountry(obj): void {
    this.citys = [], this.postcodes = [], this.provinces = [];
    setTimeout(() => {
      $('.province').selectpicker('refresh');
      $('.city').selectpicker('refresh');
      $('.postcode').selectpicker('refresh');
      $('.postcode').selectpicker('refresh');
      this.refreshArea();
    }, 0);

    if (obj !== undefined || obj !== "" || obj !== null) {
      this.getProvince(obj, 'onChange');
    }
  }

  onChangeProvince(obj): void {
    this.citys = [], this.postcodes = [];
    setTimeout(() => {
      $('.city').selectpicker('refresh');
      $('.postcode').selectpicker('refresh');
    }, 0);

    if (obj !== undefined || obj !== "" || obj !== null) {
      obj = obj.target.value;
      let provinceCode = obj;
      let ifSplit = obj.indexOf("|");
      if (ifSplit !== -1) provinceCode = obj.split("|")[0];
      else provinceCode = obj;
      this.getCity(provinceCode, 'onChange');
    }
  }

  onChangeCity(obj): void {
    if (obj !== undefined || obj !== "" || obj !== null) {
      obj = obj.target.value;
      let cityCode = obj;
      let ifSplit = obj.indexOf("|");
      if (ifSplit !== -1) cityCode = obj.split("|")[0];
      else cityCode = obj;
      this.getPostCode(cityCode, 'onChange');
    } else {
      setTimeout(() => {
        $('.postcode').selectpicker('refresh');
      }, 0);
    }
  }

  isPersonals;
  getlistCustomer() {
    this.updateLoading = true;
    let nameCust, birthdateCust, idNoCust;
    if (this._type_ctrl.typeCard == 1) {
      nameCust = this._model_ktp.fullname;
      birthdateCust = this.finalBirthDate1;
      idNoCust = this._model_ktp.ktp1;

      let documentMap: DocumentUpload[];
      let model_ktp = this._model_ktp;
      this.paramregister.idType = '1';
      this.paramregister.memberCode = this.memberCode;
      this.paramregister.address = model_ktp.corresponden;
      this.paramregister.psCode = this.finalPsCode;
      this.paramregister.birthDate = this.finalBirthDate1;
      this.paramregister.birthPlace = model_ktp.birthplace;
      this.paramregister.city = model_ktp.city.split("|")[1];
      this.paramregister.country = model_ktp.country;
      this.paramregister.postCode = model_ktp.postcode;
      this.paramregister.email = model_ktp.email;
      this.paramregister.province = model_ktp.province.split("|")[1];
      this.paramregister.marCode = model_ktp.marcode;
      this.paramregister.name = model_ktp.fullname;
      this.paramregister.nationID = model_ktp.nation;
      this.paramregister.npwp = model_ktp.npwp1 == undefined ? ' ' : model_ktp.npwp1;
      this.paramregister.sex = model_ktp.gender;
      this.paramregister.idNo = model_ktp.ktp1;
      this.paramregister.number = model_ktp.phone;
      this.paramregister.relativesNumber = model_ktp.relativesNumber;
      this.paramregister.occID = model_ktp.occupation;

      documentMap = [
        this.itemdocument('KTP', model_ktp.image_ktp),
        this.itemdocument('KK', model_ktp.image_kkeluarga),
        this.itemdocument('NPWP', model_ktp.image_npwp),
        this.itemdocument('KTPC', model_ktp.image_ktppasangan),
      ];
      this.paramregister.document = documentMap;

    } else if (this._type_ctrl.typeCard == 7) {
      nameCust = this._model_dtt.companyname;
      birthdateCust = this.finalBirthDate3;
      idNoCust = this._model_dtt.ktp2;
      let documentMap: DocumentUpload[];
      let model_register = this._model_dtt;
      this.paramregister.idType = '7';
      this.paramregister.memberCode = this.memberCode;
      this.paramregister.psCode = model_register.psCode;
      this.paramregister.address = model_register.corresponden;
      this.paramregister.country = model_register.country2;
      this.paramregister.postCode = model_register.postcode;
      this.paramregister.email = model_register.email2;
      this.paramregister.name = model_register.companyname;
      this.paramregister.npwp = model_register.npwp2;
      this.paramregister.idNo = model_register.ktp2;
      this.paramregister.province = model_register.province.split("|")[1];
      this.paramregister.number = model_register.phone;
      this.paramregister.relativesNumber = model_register.relativesNumber;
      this.paramregister.sex = 'L';
      this.paramregister.birthDate = this.finalBirthDate3;
      this.paramregister.marCode = '0';
      this.paramregister.nationID = model_register.nation;
      this.paramregister.birthPlace = model_register.city;
      this.paramregister.city = model_register.city.split("|")[1];
      this.paramregister.occID = model_register.occupation;
      documentMap = [
        this.itemdocument('KTPP', model_register.image_ktp_dir),
        this.itemdocument('NPWP', model_register.image_npwp),
        this.itemdocument('TDP', model_register.image_tdd),
      ];

      this.paramregister.document = documentMap;
    } else {
      nameCust = this._model_kitas.fullname;
      birthdateCust = this.finalBirthDate2;
      idNoCust = this._model_kitas.kitas;
      let documentMap: DocumentUpload[];
      let model_kitas = this._model_kitas;
      this.paramregister.idType = '5';
      this.paramregister.memberCode = this.memberCode;
      this.paramregister.address = model_kitas.corresponden;
      this.paramregister.birthDate = this.finalBirthDate2;
      this.paramregister.birthPlace = model_kitas.birthplace;
      this.paramregister.psCode = this.finalPsCode;
      this.paramregister.city = model_kitas.city.split("|")[1];
      this.paramregister.country = model_kitas.country;
      this.paramregister.province = model_kitas.province.split("|")[1];
      this.paramregister.postCode = model_kitas.postcode;
      this.paramregister.email = model_kitas.email;
      this.paramregister.marCode = model_kitas.marcode;
      this.paramregister.name = model_kitas.fullname;
      this.paramregister.nationID = model_kitas.nation;
      this.paramregister.npwp = model_kitas.passport;
      this.paramregister.sex = model_kitas.gender;
      this.paramregister.idNo = model_kitas.kitas;
      this.paramregister.number = model_kitas.phone;
      this.paramregister.relativesNumber = model_kitas.relativesNumber;
      this.paramregister.occID = model_kitas.occupation;
      documentMap = [
        this.itemdocument('KITAS', model_kitas.image_kitas),
        this.itemdocument('PASS', model_kitas.image_passport),
        this.itemdocument('NPWP', model_kitas.image_npwp),
        // this.itemdocument('passportpassangan', model_kitas.image_passpassangan),
      ];

      this.paramregister.document = documentMap;
    }
    let memberCode = '';
    if (this._appSessionService.user != undefined) memberCode = this._appSessionService.user.userName;
    this._countryService.getListCustomer(nameCust, birthdateCust, idNoCust, memberCode)
      .finally(() => {
        if (this.isPersonals == true) {
          this._countryService.createUpdateCustomer(this.paramregister)
            .finally(() => {
              setTimeout(() => {
                // this.customerForm.reset();
                this.updateLoading = false;
              }, 0);
            })
            .subscribe((result) => {
              if (result.message == 'Phone Number Already Exist') {
                this.message.error('Phone Number Already Exist');
                // this.notify.success('success, member is updated');          
              } else if (result.message == 'KTP/Kitas already exist') {
                this.message.error('KTP/KITAS is already exist, Please Check Your KTP!');
                // this.notify.success('success, member is updated');          
              } else {
                this.message.success('Customer Updated Successfully').done(() => {
                  if (this.byPP == "true") {
                    this._router.navigate(['app/pponline/transaction-summary'], {
                      queryParams: {
                        customerCode: this.dataLocalStorage.psCodeCust,
                        customerName: nameCust,
                        ppOrderID: localStorage.getItem('orderID')
                      }
                    });
                    // this._router.navigate(['app/pponline/transaction-summary/']);
                  } else {
                    this._router.navigate(['app/main/booking-unit-confirm/']);
                  }
                });
              }
            });
        } else {
          this.registerCustomer(this.paramregister);
        }
      })
      .subscribe(result => {
        this.isPersonals = result.items[0].isPersonals;
      });
  }

  registerCustomer(param) {
    this._countryService.createUpdateCustomer(param)
      .finally(() => {
      })
      .subscribe((result) => {

        if (result.message == 'Phone Number Already Exist') {
          this.message.error('Phone Number Already Exist');
          // this.notify.success('success, member is updated');          
        } else if (result.message == 'KTP/Kitas already exist') {
          this.message.error('KTP/KITAS is already exist, Please Check Your KTP!');
          // this.notify.success('success, member is updated');          
        } else {
          this.message.success('Customer Updated Successfully').done(() => {
            if (this.byPP == "true") {
              this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { customerCode: this.dataLocalStorage.psCodeCust, ppOrderID: localStorage.getItem('orderID') } });
              // this._router.navigate(['app/pponline/transaction-summary/']);
            } else {
              this._router.navigate(['app/main/booking-unit-confirm/']);
            }
          });
        }
      });
  }

  updateTrUnit(pscode) {
    this._transaction.getTrUnitReserved(this._appSessionService.userId)
      .subscribe((res) => {
        let val: UnitTrUnitReservedDto = new UnitTrUnitReservedDto();
        let dataUnit = [];
        for (var i = 0; i < res.length; i++) {
          val.unitID = res[i].unitID;
          dataUnit.push(val);
        }
        if (res.length) {
          this.model_update.psCode = pscode; //'26896747';
          this.model_update.unit = dataUnit;
          this.model_update.bankID1 = this.bankID.bankID1;
          this.model_update.bankID2 = this.bankID.bankID2;
          this._unitService.updatePsCodeTrUnitReserved(this.model_update)
            .finally(() => {
              localStorage.removeItem('bank');
            })
            .subscribe((updateResult) => {
              localStorage.setItem("pscode", pscode);
              this._router.navigate(['/app/main/booking-unit-confirm/']);
            });
        }
      });
  }

  updateLoading = false;
  register() {
    // this.updateLoading = true;
    this.paramregister = new CreateUpdateCustomerInputDto;

    if (this._type_ctrl.typeCard == 1) {
      let documentMap: DocumentUpload[];
      let model_ktp = this._model_ktp;

      this.paramregister.idType = '1';
      this.paramregister.address = model_ktp.corresponden;
      this.paramregister.psCode = this.finalPsCode;
      this.paramregister.birthDate = this.finalBirthDate1;
      this.paramregister.birthPlace = model_ktp.birthplace;
      this.paramregister.city = model_ktp.city.split("|")[1];
      this.paramregister.country = model_ktp.country;
      this.paramregister.postCode = model_ktp.postcode;
      this.paramregister.email = model_ktp.email;
      this.paramregister.province = model_ktp.province.split("|")[1];
      this.paramregister.marCode = model_ktp.marcode;
      this.paramregister.name = model_ktp.fullname;
      this.paramregister.nationID = model_ktp.nation;
      this.paramregister.npwp = model_ktp.npwp1 == undefined ? ' ' : model_ktp.npwp1;
      this.paramregister.sex = model_ktp.gender;
      this.paramregister.idNo = model_ktp.ktp1;
      this.paramregister.number = model_ktp.phone;
      this.paramregister.relativesNumber = model_ktp.relativesNumber;
      this.paramregister.occID = model_ktp.occupation;
      documentMap = [
        this.itemdocument('KTP', model_ktp.image_ktp),
        this.itemdocument('KK', model_ktp.image_kkeluarga),
        this.itemdocument('NPWP', model_ktp.image_npwp),
        this.itemdocument('KTPC', model_ktp.image_ktppasangan),
      ];

      this.paramregister.document = documentMap;
      this._countryService.createUpdateCustomer(this.paramregister)
        .finally(() => {
          setTimeout(() => {
            // this.customerForm.reset();
            this.updateLoading = false;
          }, 0);
        })
        .subscribe((result) => {
          if (result.message == 'Phone Number Already Exist') {
            this.message.error('Phone Number Already Exist');
            // this.notify.success('success, member is updated');          
          } else {
            this.message.success('Customer Updated Successfully').done(() => {
              if (!this.isFinishOrder) this._router.navigate(['app/main/booking-unit-confirm/']);
            });
          }
        });

    } else if (this._type_ctrl.typeCard == 7) {
      let documentMap: DocumentUpload[];
      let model_register = this._model_dtt;

      this.paramregister.idType = '7';
      this.paramregister.psCode = model_register.psCode;
      this.paramregister.address = model_register.corresponden;
      this.paramregister.country = model_register.country2;
      this.paramregister.postCode = model_register.postcode;
      this.paramregister.email = model_register.email2;
      this.paramregister.name = model_register.companyname;
      this.paramregister.npwp = model_register.npwp2;
      this.paramregister.idNo = model_register.ktp2;
      this.paramregister.province = model_register.province.split("|")[1];
      this.paramregister.number = model_register.phone;
      this.paramregister.relativesNumber = model_register.relativesNumber;
      this.paramregister.sex = 'L';
      this.paramregister.birthDate = this.finalBirthDate3;
      this.paramregister.marCode = '0';
      this.paramregister.nationID = model_register.nation;
      this.paramregister.birthPlace = model_register.city;
      this.paramregister.city = model_register.city.split("|")[1];
      this.paramregister.occID = model_register.occupation;
      documentMap = [
        this.itemdocument('KTPP', model_register.image_ktp_dir),
        this.itemdocument('NPWP', model_register.image_npwp),
        this.itemdocument('TDP', model_register.image_tdd),
      ];

      this.paramregister.document = documentMap;
      this._countryService.createUpdateCustomer(this.paramregister)
        .finally(() => {
          setTimeout(() => {
            // this.customerForm.reset();
            this.updateLoading = false;
          }, 0);
        })
        .subscribe((result) => {
          if (result.message == 'Phone Number Already Exist') {
            this.message.error('Phone Number Already Exist');
            // this.notify.success('success, member is updated');          
          } else {
            this.message.success('Customer Updated Successfully').done(() => {
              if (!this.isFinishOrder) this._router.navigate(['app/main/booking-unit-confirm/']);
            });
          }
        });

    } else {
      let documentMap: DocumentUpload[];
      let model_kitas = this._model_kitas;

      this.paramregister.idType = '5';
      this.paramregister.address = model_kitas.corresponden;
      this.paramregister.birthDate = this.finalBirthDate2;
      this.paramregister.birthPlace = model_kitas.birthplace;
      this.paramregister.psCode = this.finalPsCode;
      this.paramregister.city = model_kitas.city.split("|")[1];
      this.paramregister.country = model_kitas.country;
      this.paramregister.province = model_kitas.province.split("|")[1];
      this.paramregister.postCode = model_kitas.postcode;
      this.paramregister.email = model_kitas.email;
      this.paramregister.marCode = model_kitas.marcode;
      this.paramregister.name = model_kitas.fullname;
      this.paramregister.nationID = model_kitas.nation;
      this.paramregister.npwp = model_kitas.passport;
      this.paramregister.sex = model_kitas.gender;
      this.paramregister.idNo = model_kitas.kitas;
      this.paramregister.number = model_kitas.phone;
      this.paramregister.relativesNumber = model_kitas.relativesNumber;
      this.paramregister.occID = model_kitas.occupation;
      documentMap = [
        this.itemdocument('KITAS', model_kitas.image_kitas),
        this.itemdocument('PASS', model_kitas.image_passport),
        this.itemdocument('NPWP', model_kitas.image_npwp),
        // this.itemdocument('passportpassangan', model_kitas.image_passpassangan),
      ];

      this.paramregister.document = documentMap;

      this._countryService.createUpdateCustomer(this.paramregister)
        .finally(() => {
          setTimeout(() => {
            // this.customerForm.reset();
            this.updateLoading = false;
          }, 0);
        })
        .subscribe((result) => {
          if (result.message == 'Phone Number Already Exist') {
            this.message.error('Phone Number Already Exist');
            // this.notify.success('success, member is updated');          
          } else {
            this.message.success('Customer Updated Successfully').done(() => {
              if (!this.isFinishOrder) this._router.navigate(['app/main/booking-unit-confirm/']);
            });
          }
        });

    }
  }

  type_control() {
    return {
      typeCard: this.customerForm.controls['typeCard'],
    };
  }

  r_control() {
    return {
      typeCard: this.customerForm.controls['typeCard'],
      birthplace: this.customerForm.controls['birthplace'],
      psCode: this.customerForm.controls['psCode'],
      country: this.customerForm.controls['country'],
      province: this.customerForm.controls['province'],
      fullname: this.customerForm.controls['fullname'],
      birthdate: this.customerForm.controls['birthdate'],
      email: this.customerForm.controls['email'],
      city: this.customerForm.controls['city'],
      nation: this.customerForm.controls['nation'],
      phone: this.customerForm.controls['phone'],
      relativesNumber: this.customerForm.controls['relativesNumber'],
      postcode: this.customerForm.controls['postcode'],
      marcode: this.customerForm.controls['marcode'],
      corresponden: this.customerForm.controls['corresponden'],
      gender: this.customerForm.controls['gender'],
      ktp1: this.customerForm.controls['ktp1'],
      npwp1: this.customerForm.controls['npwp1'],
      kitas: this.customerForm.controls['kitas'],
      passport: this.customerForm.controls['passport'],
      image_ktp: this.customerForm.controls['image_ktp'],
      image_npwp: this.customerForm.controls['image_npwp'],
      image_kkeluarga: this.customerForm.controls['image_kkeluarga'],
      image_ktppasangan: this.customerForm.controls['image_ktppasangan'],
      occupation: this.customerForm.controls['occupation']
    };
  }

  kitas_control() {
    return {
      birthplace: this.customerForm.controls['birthplace'],
      psCode: this.customerForm.controls['psCode'],
      country: this.customerForm.controls['country'],
      fullname: this.customerForm.controls['fullname'],
      birthdate: this.customerForm.controls['birthdate'],
      email: this.customerForm.controls['email'],
      city: this.customerForm.controls['city'],
      province: this.customerForm.controls['province'],
      nation: this.customerForm.controls['nation'],
      phone: this.customerForm.controls['phone'],
      relativesNumber: this.customerForm.controls['relativesNumber'],
      postcode: this.customerForm.controls['postcode'],
      marcode: this.customerForm.controls['marcode'],
      corresponden: this.customerForm.controls['corresponden'],
      gender: this.customerForm.controls['gender'],
      kitas: this.customerForm.controls['kitas'],
      passport: this.customerForm.controls['passport'],
      image_kitas: this.customerForm.controls['image_ktp'],
      image_npwp: this.customerForm.controls['image_npwp'],
      image_passport: this.customerForm.controls['image_kkeluarga'],
      image_passpassangan: this.customerForm.controls['image_ktppasangan'],
      occupation: this.customerForm.controls['occupation']
    };
  }

  dtt_control() {
    return {
      companyname: this.customerForm.controls['companyname'],
      psCode: this.customerForm.controls['psCode'],
      country2: this.customerForm.controls['country2'],
      email2: this.customerForm.controls['email2'],
      province: this.customerForm.controls['province'],
      postcode: this.customerForm.controls['postcode'],
      city: this.customerForm.controls['city'],
      ktp2: this.customerForm.controls['ktp2'],
      npwp2: this.customerForm.controls['npwp2'],
      nation: this.customerForm.controls['nation'],
      phone: this.customerForm.controls['phone'],
      relativesNumber: this.customerForm.controls['relativesNumber'],
      corresponden: this.customerForm.controls['corresponden'],
      established: this.customerForm.controls['established'],
      image_ktp_dir: this.customerForm.controls['image_ktp_dir'],
      image_npwp: this.customerForm.controls['image_npwp'],
      image_tdd: this.customerForm.controls['image_tdd'],
      occupation: this.customerForm.controls['occupation']
    };
  }

  invalidBirthdate = false;
  dateSelected(birthdate) {
    let dateInput = moment(birthdate).format('MM/DD/YYYY');
    this._model_ktp.birthdate = birthdate;
    if (new Date(dateInput.toString()) > new Date()) this.invalidBirthdate = true;
    else {
      this.invalidBirthdate = false;
      this.finalBirthDate1 = moment(dateInput).format('YYYY-MM-DD');
    }
  }

  invalidBirthdate2 = false;
  dateSelected2(birthdate) {
    let dateInput = moment(birthdate).format('MM/DD/YYYY');
    this._model_kitas.birthdate = dateInput;
    if (new Date(dateInput.toString()) > new Date()) this.invalidBirthdate2 = true;
    else {
      this.invalidBirthdate2 = false;
      this.finalBirthDate2 = moment(birthdate).format('YYYY-MM-DD');
    }
  }

  invalidBirthdate3 = false;
  dateSelected3(birthdate) {
    let dateInput = moment(birthdate).format('MM/DD/YYYY');
    this._model_dtt.established = dateInput;
    if (new Date(dateInput.toString()) > new Date()) this.invalidBirthdate3 = true;
    else {
      this.invalidBirthdate3 = false;
      this.finalBirthDate3 = moment(birthdate).format('YYYY-MM-DD');
    }
  }

  itemdocument(documentType: string, documentBinary: string) {
    let document = new DocumentUpload;
    document.documentBinary = documentBinary;
    document.documentType = documentType;
    return document;
  }

  valuechange(item) {
    this.chk_ktp1 = false;
  }

  valuechange_kitas() {
    this.chk_kitas = false;
  }

  valuechange_tdp() {
    this.chk_tdp = false;
  }

  inputmasnpwp() {
    return {
      'mask': '99.999.999.9-999.999'
    };
  }

  inputmaskktp() {
    return {
      'mask': '9999999999999999'
    };
  }

  inputmaskpass() {
    return {
      'mask': '999.99999.99999'
    };
  }

  onSending(data): void {
    let testing = [];
    let file = data[0];
    let formData = data[2];
    let base64image;

    setTimeout(() => {
      base64image = file.dataURL.replace('data:' + file.type + ';base64,', '');
      if (this._type_ctrl.typeCard == 1) {
        if (data.id === 'NPWP') {
          this._model_ktp.image_npwp = base64image;
        } else if (data.id === 'KTP') {
          this._model_ktp.image_ktp = base64image;
        } else if (data.id === 'KK') {
          this._model_ktp.image_kkeluarga = base64image;
        } else if (data.id === 'KTPC') {
          this._model_ktp.image_ktppasangan = base64image;
        }
      } else if (this._type_ctrl.typeCard == 5) {
        if (data.id === 'KITAS') {
          this._model_kitas.image_kitas = base64image;
        } else if (data.id === 'PASS') {
          this._model_kitas.image_passport = base64image;
        } else if (data.id === 'NPWP') {
          this._model_kitas.image_npwp = base64image;
        } else if (data.id === 'passpasangan') {
          this._model_kitas.image_passpassangan = base64image;
        }
      } else {
        if (data.id === 'KTPP') {
          this._model_dtt.image_ktp_dir = base64image;
        } else if (data.id === 'NPWP') {
          this._model_dtt.image_npwp = base64image;
        } else if (data.id === 'TDP') {
          this._model_dtt.image_tdd = base64image;
        }
      }
    }, 3000);
  }

  removefile(id: string) {
    if (id === 'NPWP') {
      this.isnpwp = false;
      this._model_ktp.image_npwp = null;
    } else if (id === 'KTP') {
      this.isktp = false;
      this._model_ktp.image_ktp = null;
    } else if (id === 'KK') {
      this.iskk = false;
      this._model_ktp.image_kkeluarga = null;
    } else if (id === 'KTPC') {
      this.isktppasangan = false;
      this._model_ktp.image_ktppasangan = null;
    } else if (id === 'KITAS') {
      this.iskitas = false;
      this._model_kitas.image_kitas = null;
    } else if (id === 'PASS') {
      this.ispassport = false;
      this._model_kitas.image_passport = null;
    } else if (id === 'passpasangan') {
      this._model_kitas.image_passpassangan = null;
    } else if (id === 'KTPP') {
      this.isdir = false;
      this._model_dtt.image_ktp_dir = null;
    } else if (id === 'TDP') {
      this.istdp = false;
      this._model_dtt.image_tdd = null;
    }
  }


  findInvalidControls() {
    const invalid = [];
    const controls = this.customerForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
      if (this._type_ctrl.typeCard == '1') {
        if (controls['ktp1'].invalid) {
          this.chk_ktp1 = true;
        }
      } else if (this._type_ctrl.typeCard == '5') {
        if (controls['kitas'].invalid) {
          this.chk_kitas = true;
        }
      } else if (this._type_ctrl.typeCard == '7') {
        if (controls['ktp2'].invalid) {
          this.chk_tdp = true;
        }
      }
    }
    return invalid;
  }

}
