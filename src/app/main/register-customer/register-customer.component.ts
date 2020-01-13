import { Component, OnInit, Injector, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    CustomerMemberServiceProxy,
    ListProvinceResultDto,
    ListCountryResultDto,
    ListCityResultDto,
    ListNationResultDto,
    DocumentUpload,
    ListPostCodeResultDto,
    SignUpCustomerInputDto,
    CreateUpdateCustomerInputDto,
    IDocumentUpload,
    TransactionServiceProxy,
    UnitTrUnitReservedDto,
    UpdateTRUnitReserved,
    MyCustomerSPServiceProxy,
    GetListMaritalStatusResultDto
} from '@shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { ScriptLoaderService } from '@shared/common/_services/script-loader.service';
import { ValidationService } from 'app/main/share/validation.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { DropimageComponent } from '../dropimage/dropimage.component';

export class TypeCard {
    typeCard: any;
}

export class DataAccountCtrl {
    birthplace: any;
    country: any;
    fullname: any;
    occupation: any;
    birthdate: any;
    email: any;
    city: any;
    nation: any;
    phone: any;
    relativesNumber: any;
    postcode: any;
    province: any;
    marcode: any;
    corresponden: any;
    ktp1: any;
    npwp1: any;
    gender: any;
    image_ktp: any;
    image_npwp: any;
    image_kkeluarga: any;
    image_ktppasangan: any;
}

export class Datakitas {
    birthplace: any;
    country: any;
    fullname: any;
    birthdate: any;
    email: any;
    city: any;
    nation: any;
    phone: any;
    relativesNumber: any;
    postcode: any;
    province: any;
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
    country: any;
    companyname: any;
    established: any;
    email2: any;
    ktp2: any;
    npwp2: any;
    city: any;
    nation: any;
    province: any;
    postcode: any;
    phone: any;
    relativesNumber: any;
    corresponden: any;
    image_ktp_dir: any;
    image_npwp: any;
    image_tdd: any;
    occupation: any;
}

@Component(
    {
        selector: 'app-register-customer',
        templateUrl: './register-customer.component.html',
        animations: [appModuleAnimation()],
        styleUrls: ['./register-customer.component.css']
    }
)

export class RegisterCustomerComponent extends AppComponentBase implements OnInit {
    @ViewChild('SampleDatePicker') sampleDatePicker: ElementRef;
    @ViewChild('SampleDatePicker2') sampleDatePicker2: ElementRef;
    @ViewChild('SampleDatePicker3') sampleDatePicker3: ElementRef;
    @ViewChild(DropzoneComponent) dropzonRef: DropzoneComponent;
    @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;
    @ViewChild("resetktp") resetktp: DropimageComponent;
    @ViewChild("resetnpwp") resetnpwp: DropimageComponent;
    @ViewChild("resetkk") resetkk: DropimageComponent;
    @ViewChild("resetkitas") resetkitas: DropimageComponent;
    @ViewChild("resetpass") resetpass: DropimageComponent;
    @ViewChild("resetnpwp") reseresetnpwptkk: DropimageComponent;
    @ViewChild("resetktpdir") resetktpdir: DropimageComponent;
    @ViewChild("resetnpwpdir") resetnpwpdir: DropimageComponent;
    @ViewChild("resettdpdir") resettdpdir: DropimageComponent;

    customerForm: FormGroup;
    public selectedDate: any;
    public selectedDate2: any;
    public selectedDate3: any;
    public dateTimePickerOptions: any;
    public type = 'component';
    public disabled = false;
    selectedType: any = 0;
    optiondatepicker: any;
    sub;
    params_url;
    params_update;
    test_mobile;
    typecard;
    maritals = [];
    idtypes = [];
    country: ListCountryResultDto[] = [];
    citys: ListCityResultDto[] = [];
    nations: ListNationResultDto[] = [];
    postcodes: ListPostCodeResultDto[] = [];
    provinces: ListProvinceResultDto[] = [];
    paramregister: CreateUpdateCustomerInputDto = new CreateUpdateCustomerInputDto;
    signUpParamregister: SignUpCustomerInputDto = new SignUpCustomerInputDto;
    document: DocumentUpload = new DocumentUpload;
    documetMap: DocumentUpload[];
    nationID;
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
    bookingtime;
    chk_ktp1;
    chk_kitas;
    chk_tdp;
    dataUnit: UnitTrUnitReservedDto[] = [];
    model_update: UpdateTRUnitReserved = new UpdateTRUnitReserved;
    allowUpdateUnit;
    item_type;
    finalBirthDate1;
    finalBirthDate2;
    finalBirthDate3;
    bankID: any = [];
    actionLabel;
    bypp;
    dataLocalStorage: any = [];
    _country;
    _cntry;
    form_builder_card = {
        'typeCard': [null],
        'ktp1': [null]
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
        'occupation':[null],
        'image_ktp': [null],
        'image_npwp': [null]
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
        'passport': [null],
        'image_kitas': [null],
        'image_passport': [null],
        'image_npwp': [null],
        'image_passpassangan': [null],
        'occupation':[null]
    };

    form_builder_tdd = {
        'ktp2': [null, Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(16), ValidationService.numValidator])],
        'npwp2': [null],
        'province': [null],
        'email2': [null, Validators.compose([Validators.required, Validators.email])],
        'postcode': [null],
        'city': [null],
        'nation': [null],
        'companyname': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
        'country': [null],
        'established': [null],
        'phone': [null, Validators.compose([Validators.required, Validators.maxLength(15), ValidationService.numValidator])],
        'relativesNumber': [null, Validators.compose([Validators.required, Validators.maxLength(15), ValidationService.numValidator])],
        'corresponden': [null, Validators.compose([Validators.required, Validators.maxLength(1000)])],
        'image_ktp_dir': [null],
        'image_npwp': [null],
        'image_tdd': [null],
        'occupation': [null]
    };

    public config: DropzoneConfigInterface = {
        url: 'jahahah',
        maxFiles: 1,
        clickable: true,
        acceptedFiles: 'image/*,.pdf',
    };

    constructor(injector: Injector,
        private _router: Router,
        private _countryService: CustomerMemberServiceProxy,
        private _fb: FormBuilder,
        private _activeroute: ActivatedRoute,
        private _script: ScriptLoaderService,
        private _myCustomerSPS: MyCustomerSPServiceProxy,
        private _transaction: TransactionServiceProxy,
        private _appSessionService: AppSessionService,
        private _unitService: TransactionServiceProxy) {

        super(injector);
        this.dateTimePickerOptions = {
            locale: abp.localization.currentLanguage.name,
            // format: 'L'
        };
        this.customerForm = _fb.group(this.form_builder_card);
        this.type_ctrl = this.type_control();
        // this._type_ctrl.typeCard = 0;
        this.optiondatepicker = { endDate: '0d' };
    }

    memberCode;
    birthdate1;
    birthdate2;
    birthdate3;
    psCode;
    custID;
    pp;
    isPotential: boolean = true;

    kk = ""; kitas = ""; ktp = "";
    ktppasangan = ""; npwp = "";
    passport = ""; passportpassangan = "";
    dir = ""; tdp = "";


    iskk = false; iskitas = false; isktp = false;
    isktppasangan = false; isnpwp = false;
    ispassport = false; ispassportpassangan = false;
    isdir = false; istdp = false;

    potential: boolean = true;
    ngOnInit(): void {
        this.memberCode = this._appSessionService.user.userName;

        localStorage.removeItem('pscode');
        this.dataLocalStorage = {
            psCodeCust: undefined
        }
        this.dataLocalStorage = JSON.parse(localStorage.getItem("transaction"));

        const self = this;
        // this.item_type=[{'id':'0','name':'KTP'},{'id':'1','name':'KITAS'},{'id':'2','name':'Tanda Daftar Perusahaan'}]
        this.sub = this._activeroute.params.subscribe(params => {
            this.customerForm = this._fb.group(this.form_builder_ktp);
            this.model_ctrl = this.r_control();
            if (this.custID != undefined) this.getDetailPotentialCustomer(this.custID);
            this.getTypes();
            this.params_url = params;

            this.bypp = params.bypp;

            // if (params.bypp == )
            if (params.bypp == undefined) {
                this.bypp = params.potential;
            }
            console.log("byppp", this.bypp);

            if (params.potential != undefined || params.potentialID != undefined) {
                // this.getDetailPotentialCustomer(params.potentialID);
                this.actionLabel = 'Register';
                //this.bypp = 'true';
                this.custID = params.potentialID;
                this.isPotential = true;
            } else {
                this.actionLabel = 'Register';
                this.isPotential = false;
            }
            if (this.params_url.idNo != undefined) {
                this.allowUpdateUnit = true;
            } else {
                this.allowUpdateUnit = false;
            }
            if (this.bypp == 'false') {
                this.allowUpdateUnit = true;
            }
            if (params.custID != undefined) {
                this.custID = params.custID;
            }

            //model ktp
            this.birthdate1 = moment(this.params_url.birthDate, "DD/MM/YYYY");
            this.birthdate2 = moment(this.params_url.birthDate, "DD/MM/YYYY");
            this.birthdate3 = moment(this.params_url.birthDate, "DD/MM/YYYY");
            this.finalBirthDate1 = moment(this.params_url.birthDate).format('YYYY-MM-DD');
            this.finalBirthDate2 = moment(this.params_url.birthDate).format('YYYY-MM-DD');
            this.finalBirthDate3 = moment(this.params_url.birthDate).format('YYYY-MM-DD');
            this._model_ktp.fullname = this.params_url.name;
            this._model_ktp.birthdate = this.params_url.birthDate;
            this._model_ktp.ktp1 = this.params_url.idNo;
            this._model_ktp.occupation = this.params_url.jobCustomer;
            
            //model kitas
            this._model_kitas.fullname = this.params_url.name;
            this._model_kitas.birthdate = this.params_url.birthDate;
            this._model_kitas.kitas = this.params_url.idNo;
            this._model_kitas.occupation = this.params_url.jobCustomer;

            this._model_ktp.fullname = this.params_url.name;
            this._model_ktp.birthdate = this.params_url.birthDate;
            this._model_ktp.ktp1 = this.params_url.idNo;

            this._model_dtt.companyname = this.params_url.name;
            this._model_dtt.established = this.params_url.birthDate;
            this._model_dtt.ktp2 = this.params_url.idNo;
            this._model_dtt.occupation = this.params_url.jobCustomer;
        });
        this.bankID = JSON.parse(localStorage.getItem("bank"));

        this.getNation();
        this.getCountry();
        this.getMaritalStatus();
        this.refreshAll();
        this.getListJob();
    }

    typesLoading = false;
    getTypes() {
        this.typesLoading = true;
        this.idtypes = [
            { "typeId": "0", "typeName": "KTP" },
            { "typeId": "1", "typeName": "KITAS" },
            { "typeId": "2", "typeName": "Tanda Daftar Perusahaan" }
        ];
        this.idtypes.forEach(items => {
            if (items.typeName == "KTP") {
                this.typecard = items.typeId;
            }
        })
        this._type_ctrl.typeCard = this.typecard;
        setTimeout(() => {
            $('.type').selectpicker('refresh');
            this.typesLoading = false;

        }, 0);
    }

    idType: any;
    timeDate: any;
    getimage;
    occDesc;
    getDetailPotentialCustomer(id){
        this._myCustomerSPS.getDetailPotentialCustomer(id)
        .subscribe(result => {
            // this.params_update = result;
            this.timeDate = moment(result.birthDate).format('MM/DD/YYYY');
            this.getimage = result.idUpload;
            var documentType = result.documentType;
            this._model_ktp.image_ktp = result.idUpload;
            this._model_ktp.image_npwp = result.idUpload;
            this._model_kitas.image_kitas = result.idUpload;
            this._model_dtt.image_ktp_dir = result.idUpload;
            
            this._model_ktp.ktp1 =  result.idNumber;
            this._model_ktp.email = result.email;
            this._model_ktp.phone = result.phoneNumber;
            this._model_ktp.birthdate = moment(result.birthDate).format('MM/DD/YYYY');
            this._model_ktp.fullname = result.name;
            this._model_ktp.occupation = result.idJobCustomer;
            this._model_kitas.kitas = result.idNumber;
            this._model_kitas.email = result.email;
            this._model_kitas.phone = result.phoneNumber;
            this._model_kitas.birthdate = moment(result.birthDate).format('MM/DD/YYYY');
            this._model_kitas.fullname = result.name;
            this._model_kitas.occupation = result.jobCustomer;
            this._model_dtt.ktp2 = result.idNumber;
            // this._model_dtt. = result.phoneNumber;
            this._model_dtt.established = moment(result.birthDate).format('MM/DD/YYYY');
            this._model_dtt.companyname = result.name;
            this._model_dtt.email2 = result.email;
            this._model_dtt.occupation = result.jobCustomer;
            this.isktp = true;
            this.iskitas = true;
            this.istdp = true;
            this.occDesc = result.jobCustomer;

            // this._model_ktp.occupation = 5; 
            // return this.occDesc;
            console.log("occupation",this._model_ktp.fullname);
            console.log("data", result);
            this.getListJob();
        })
    }

    // occDesc;
    _jobList: any;
    jobLoading: boolean = true;
    getListJob() {
        this._countryService.getDropdownOccupation().finally(() => {
            this.jobLoading = false;
        }).subscribe(result => {
            console.log("res", result);
            this._jobList = result;
            result.forEach( items => {
                if(items.occupationDesc ==  this.occDesc){
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

    refreshAll() {
        this.citys = [], this.postcodes = [], this.provinces = [];
        $('.job').selectpicker('refresh');
        $('.province').selectpicker('refresh');
        $('.city').selectpicker('refresh');
        $('.postcode').selectpicker('refresh');
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
            country: this.customerForm.controls['country'],
            fullname: this.customerForm.controls['fullname'],
            occupation: this.customerForm.controls['occupation'],
            birthdate: this.customerForm.controls['birthdate'],
            email: this.customerForm.controls['email'],
            city: this.customerForm.controls['city'],
            nation: this.customerForm.controls['nation'],
            province: this.customerForm.controls['province'],
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
            image_ktppasangan: this.customerForm.controls['image_ktppasangan']
        };
    }

    kitas_control() {
        return {
            birthplace: this.customerForm.controls['birthplace'],
            country: this.customerForm.controls['country'],
            fullname: this.customerForm.controls['fullname'],
            birthdate: this.customerForm.controls['birthdate'],
            email: this.customerForm.controls['email'],
            city: this.customerForm.controls['city'],
            nation: this.customerForm.controls['nation'],
            province: this.customerForm.controls['province'],
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
            country: this.customerForm.controls['country'],
            email2: this.customerForm.controls['email2'],
            postcode: this.customerForm.controls['postcode'],
            city: this.customerForm.controls['city'],
            nation: this.customerForm.controls['nation'],
            province: this.customerForm.controls['province'],
            phone: this.customerForm.controls['phone'],
            relativesNumber: this.customerForm.controls['relativesNumber'],
            ktp2: this.customerForm.controls['ktp2'],
            npwp2: this.customerForm.controls['npwp2'],
            corresponden: this.customerForm.controls['corresponden'],
            established: this.customerForm.controls['established'],
            image_ktp_dir: this.customerForm.controls['image_ktp_dir'],
            image_npwp: this.customerForm.controls['image_npwp'],
            image_tdd: this.customerForm.controls['image_tdd'],
            occupation: this.customerForm.controls['occupation']
        };
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
                this.country.forEach(items => {
                    console.log("COUNTRY", items);
                    if (items.country == "Indonesia") {
                        this._country = items.urut;
                        this._cntry = items.country;
                        this.getProvince(this._cntry)
                    }
                })
                this._model_ktp.country = this._country;
                this._model_kitas.country = this._country;
                this._model_dtt.country = this._country;
            });
    }

    nationLoading = false;

    getNation() {
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
                this.nations.forEach(items => {
                    if (items.nationality == "Indonesian") {
                        this.nationID = items.nationID;
                    }
                })
            });
        this._model_ktp.nation = this.nationID;
        this._model_kitas.nation = this.nationID;
        this._model_dtt.nation = this.nationID;
    }

    provinceLoading = false;

    getProvince(countryId) {
        this.provinceLoading = true;
        this._countryService.getProvince(countryId)
            .finally(() => {
                setTimeout(() => {
                    $('.province').selectpicker('refresh');
                    this.provinceLoading = false;
                }, 0);
            }).subscribe(result => {
                this.provinces = result;
            });
    }

    cityLoading = false;

    getCity(provinceCode) {
        this.cityLoading = true;
        this._countryService.getCity(provinceCode)
            .finally(() => {
                setTimeout(() => {
                    $('.city').selectpicker('refresh');
                    this.cityLoading = false;
                }, 0);
            }).subscribe(result => {
                this.citys = result;
            });
    }

    postcodeLoading = false;

    getPostCode(cityCode) {
        this.postcodeLoading = true;
        this._countryService.getPostCode(cityCode)
            .finally(() => {
                setTimeout(() => {
                    $('.postcode').selectpicker('refresh');
                    this.postcodeLoading = false;
                }, 0);
            }).subscribe(result => {
                this.postcodes = result;
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
        this._type_ctrl.typeCard = value;
        if (value == 2) {
            this.getNation();
            this.getCountry();
            this.getMaritalStatus();
            this.refreshAll();
            this.customerForm = this._fb.group(this.form_builder_tdd);
            this.model_dtt = this.dtt_control();
            if (this.custID!=undefined) this.getDetailPotentialCustomer(this.custID);  
            // this.getListJob();                     
        } else if (value == 1) {
            this.getNation();
            this.getCountry();
            this.getMaritalStatus();
            this.refreshAll();
            this.customerForm = this._fb.group(this.form_builder_kitas);
            this.model_kitas = this.kitas_control();
            if (this.custID!=undefined) this.getDetailPotentialCustomer(this.custID); 
            // this.getListJob();
            this.iskitas = true;  
        } else {
            this.getNation();
            this.getCountry();
            this.getMaritalStatus();
            this.refreshAll();
            this.customerForm = this._fb.group(this.form_builder_ktp);
            this.model_ctrl = this.r_control();
            if (this.custID!=undefined) this.getDetailPotentialCustomer(this.custID);   
            // this.getListJob();
        }

        setTimeout(() => {
            $('.province').selectpicker('refresh');
            $('.city').selectpicker('refresh');
            $('.postcode').selectpicker('refresh');
        }, 0);
    }

    onChangeCountry(obj): void {
        this.country.forEach(items => {
            if (items.urut == obj) {
                let _cntry = items.country;
                this.getProvince(_cntry);
            }
        })
        this.citys = [], this.postcodes = [], this.provinces = [];
        setTimeout(() => {
            $('.province').selectpicker('refresh');
            $('.city').selectpicker('refresh');
            $('.postcode').selectpicker('refresh');
        }, 0);

    }

    onChangeProvince(obj): void {
        this.citys = [], this.postcodes = [];
        setTimeout(() => {
            $('.city').selectpicker('refresh');
            $('.postcode').selectpicker('refresh');
        }, 0);
        if (obj != undefined) {
            this.getCity(obj.provinceCode);
        }
    }

    onChangeCity(obj): void {

        if (obj != undefined) {
            this.getPostCode(obj.cityCode);
        } else {
            setTimeout(() => {
                $('.postcode').selectpicker('refresh');
            }, 0);
        }
    }

    registerLoading = false;

    
    register() {

        
        this.registerLoading = true;

        this.paramregister = new CreateUpdateCustomerInputDto;
        this.signUpParamregister = new SignUpCustomerInputDto;

        if (this._type_ctrl.typeCard == '0') {
            let documentMap: DocumentUpload[];
            let model_ktp = this._model_ktp;
            if (this.custID != undefined) this.paramregister.potentialCustID = this.custID;
            this.paramregister.idType = '1';
            this.paramregister.memberCode = this.memberCode;
            this.paramregister.address = model_ktp.corresponden;
            this.paramregister.birthDate = this.timeDate;
            this.paramregister.birthPlace = model_ktp.birthplace;
            this.paramregister.relativesNumber = model_ktp.relativesNumber;
            if (model_ktp.city != undefined) {
                this.paramregister.city = model_ktp.city.cityName;
            }
            this.paramregister.country = this._cntry;
            if (model_ktp.province != undefined) {
                this.paramregister.province = model_ktp.province.provinceName;
            }
            if (model_ktp.postcode != undefined) {
                this.paramregister.postCode = model_ktp.postcode.postCode;
            }
            this.paramregister.email = model_ktp.email;
            this.paramregister.marCode = model_ktp.marcode;
            this.paramregister.name = model_ktp.fullname;
            this.paramregister.nationID = this.nationID;
            this.paramregister.npwp = model_ktp.npwp1;
            this.paramregister.sex = model_ktp.gender;
            this.paramregister.idNo = model_ktp.ktp1;
            this.paramregister.number = model_ktp.phone;
            this.paramregister.occID = model_ktp.occupation;
            
            if (this.custID!=undefined) this.signUpParamregister.potentialCustID =this.custID;
            this.signUpParamregister.idType = '1';
            this.signUpParamregister.memberCode = this.memberCode;
            this.signUpParamregister.address = model_ktp.corresponden;
            this.signUpParamregister.birthDate = this.finalBirthDate1;
            this.signUpParamregister.birthPlace = model_ktp.birthplace;
            if (model_ktp.city != undefined) {
                this.signUpParamregister.city = model_ktp.city.cityName;
            }
            this.signUpParamregister.country = this._cntry;
            if (model_ktp.province != undefined) {
                this.signUpParamregister.province = model_ktp.province.provinceName;
            }
            if (model_ktp.postcode != undefined) {
                this.signUpParamregister.postCode = model_ktp.postcode.postCode;
            }
            this.signUpParamregister.email = model_ktp.email;
            this.signUpParamregister.marCode = model_ktp.marcode;
            this.signUpParamregister.name = model_ktp.fullname;
            this.signUpParamregister.nationID = this.nationID;
            this.signUpParamregister.npwp = model_ktp.npwp1;
            this.signUpParamregister.sex = model_ktp.gender;
            this.signUpParamregister.idNo = model_ktp.ktp1;
            this.signUpParamregister.number = model_ktp.phone;
            this.signUpParamregister.relativesNumber = model_ktp.relativesNumber;
            this.signUpParamregister.occID = model_ktp.occupation;
            console.log('occupation', model_ktp.occupation);

            documentMap = [
                this.itemdocument('KTP', model_ktp.image_ktp),
                this.itemdocument('KK', model_ktp.image_kkeluarga),
                this.itemdocument('NPWP', model_ktp.image_npwp),
                this.itemdocument('KTPC', model_ktp.image_ktppasangan),
            ];
            let getIndex = documentMap.findIndex(x => x.documentBinary == null);
           // documentMap.splice(getIndex);
            // let documentSendAPI =[];

            // documentMap.forEach(item => {
            //     if (item.documentBinary != null){
            //         documentSendAPI.push({
            //             'documentType' : item.documentType,
            //             'documentBinary' : item.documentBinary
            //         })
            //     }
            // });

            this.paramregister.document = documentMap;
            this.signUpParamregister.document = documentMap;

            if (this.isPotential == true) {
                this._countryService.createUpdateCustomer(this.paramregister)
                    .finally(() => {
                        setTimeout(() => {
                            // this.resetForm();
                            this.registerLoading = false;
                        }, 0);
                    })
                    .subscribe((result) => {
                        console.log('result', result);
                        if (result.message == 'Phone Number Already Exist') {
                            this.message.error('Phone Number Already Exist');
                        } else {
                            this.psCode = result.message;
                            if (result == null || result == undefined) {
                                this.message.error('No success to register data');
                            } else if (result.message == "KTP/Kitas already exist") {
                                this.message.error('KTP/KITAS is already exist, Please Check Your KTP!');
                                setTimeout(() => {
                                    location.reload();
                                }, 1000);
                                // } else if (this.paramregister.potentialCustID == null || this.paramregister.potentialCustID == undefined) {
                                //     this.message.error(result.message);
                            } else {
                                if (result.message !== null) {
                                    this.message.success('Customer Registered Successfully')
                                        .done(() => {
                                            if (this.bypp == 'true') {
                                                this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { customerCode: result.message, ppOrderID: localStorage.getItem('orderID') } });
                                            }

                                            if (this.pp == 'true') {
                                                this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { psCode: result.message, ppOrderID: localStorage.getItem('orderID') } });
                                            }
                                            else {
                                                if (this.allowUpdateUnit == true) {
                                                    this.updateTrUnit(this.psCode);
                                                }
                                            }
                                        });
                                }
                            }
                        }
                    });
            } else if (this.isPotential == false) {
                this._countryService.signUpCustomer(this.signUpParamregister)
                    .finally(() => {
                        setTimeout(() => {
                            // this.resetForm();
                            this.registerLoading = false;
                        }, 0);
                    })
                    .subscribe((result) => {
                        console.log('result', result);

                        if (result.message == 'Phone Number Already Exist') {
                            this.message.error('Phone Number Already Exist');
                        } else {
                            if (result == null || result == undefined) {
                                this.message.error('No success to register data');
                            } else if (result.psCode == null && result.message == "KTP/KITAS is already exist, Please Check Your KTP!") {
                                this.message.error('KTP/KITAS is already exist, Please Check Your KTP!');
                            } else if (result.psCode == null || result.psCode == '' || result.psCode == undefined) {
                                this.message.error(result.message);
                            } else {
                                this.message.success('Customer Registered Successfully')
                                    .done(() => {
                                        if (this.bypp == 'true') {
                                            this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { psCode: result.psCode, customerCode: this.dataLocalStorage.psCodeCust, ppOrderID: localStorage.getItem('orderID') } });
                                        }

                                        if (this.pp == 'true') {
                                            this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { psCode: result.psCode, customerCode: this.dataLocalStorage.psCodeCust, ppOrderID: localStorage.getItem('orderID') } });
                                        }
                                        else {
                                            if (this.allowUpdateUnit == true) {
                                                this.updateTrUnit(result.psCode);
                                            }
                                        }
                                    });
                            }
                        }
                    });
            }


        } else if (this._type_ctrl.typeCard == '2') {
            let documentMap: DocumentUpload[];
            let model_register = this._model_dtt;
            if (this.custID != undefined) this.paramregister.potentialCustID = this.custID;
            this.paramregister.idType = '7';
            this.paramregister.memberCode = this.memberCode;
            this.paramregister.address = model_register.corresponden;
            if (model_register.country != undefined) {
                this.paramregister.country = this._cntry;
            }
            if (model_register.postcode != undefined) {
                this.paramregister.postCode = model_register.postcode.postCode;
            }
            this.paramregister.email = model_register.email2;
            this.paramregister.name = model_register.companyname;
            this.paramregister.npwp = model_register.npwp2;
            if (model_register.province != undefined) {
                this.paramregister.province = model_register.province.provinceName;
            }
            this.paramregister.idNo = model_register.ktp2;
            this.paramregister.sex = 'L';
            this.paramregister.birthDate = this.timeDate;
            this.paramregister.marCode = '0';
            this.paramregister.nationID = this.nationID;
            if (model_register.city != undefined) {
                this.paramregister.birthPlace = model_register.city.cityName;
                this.paramregister.city = model_register.city.cityName;
            }
            this.paramregister.number = model_register.phone;
            this.paramregister.relativesNumber = model_register.relativesNumber;
            this.paramregister.occID = model_register.occupation;

            if (this.custID!=undefined) this.signUpParamregister.potentialCustID =this.custID;
            this.signUpParamregister.idType = '7';
            this.signUpParamregister.memberCode = this.memberCode;
            this.signUpParamregister.address = model_register.corresponden;
            if (model_register.country != undefined) {
                this.signUpParamregister.country = this._cntry;
            }
            if (model_register.postcode != undefined) {
                this.signUpParamregister.postCode = model_register.postcode.postCode;
            }
            this.signUpParamregister.email = model_register.email2;
            this.signUpParamregister.name = model_register.companyname;
            this.signUpParamregister.npwp = model_register.npwp2;
            if (model_register.province != undefined) {
                this.signUpParamregister.province = model_register.province.provinceName;
            }
            this.signUpParamregister.idNo = model_register.ktp2;
            this.signUpParamregister.number = model_register.phone;
            this.signUpParamregister.relativesNumber = model_register.relativesNumber;
            this.signUpParamregister.sex = 'L';
            this.signUpParamregister.birthDate = this.finalBirthDate3;
            this.signUpParamregister.marCode = '0';
            this.signUpParamregister.nationID = this.nationID;
            this.signUpParamregister.occID = model_register.occupation;
            if (model_register.city != undefined) {
                this.signUpParamregister.birthPlace = model_register.city.cityName;
                this.signUpParamregister.city = model_register.city.cityName;
            }
            documentMap = [
                this.itemdocument('KTPP', model_register.image_ktp_dir),
                this.itemdocument('NPWP', model_register.image_npwp),
                this.itemdocument('KTPC', model_register.image_ktp_dir),
            ];
            let getIndex = documentMap.findIndex(x => x.documentBinary == null);
            documentMap.splice(getIndex);
            this.paramregister.document = documentMap;
            this.signUpParamregister.document = documentMap;
            if (this.isPotential == true) {
                this._countryService.createUpdateCustomer(this.paramregister)
                    .finally(() => {
                        setTimeout(() => {
                            // this.resetForm();
                            this.registerLoading = false;
                        }, 0);
                    })
                    .subscribe((result) => {
                        console.log('result', result);
                        if (result.message == 'Phone Number Already Exist') {
                            this.message.error('Phone Number Already Exist');
                        } else {
                            this.psCode = result.message;
                            if (result == null || result == undefined) {
                                this.message.error('No success to register data');
                            } else if (result.message == "KTP/Kitas already exist") {
                                this.message.error('KTP/KITAS is already exist, Please Check Your KTP!');
                                setTimeout(() => {
                                    location.reload();
                                }, 1000);
                                // } else if (this.paramregister.potentialCustID == null || this.paramregister.potentialCustID == undefined) {
                                //     this.message.error(result.message);
                            } else {
                                if (result.message != null) {
                                    this.message.success('Customer Update Successfully');
                                    if (this.bypp == 'true') {
                                        this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { psCode: result.message, customerCode: this.dataLocalStorage.psCodeCust, ppOrderID: localStorage.getItem('orderID') } });
                                    } if (this.pp == 'true') {
                                        this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { psCode: result.message, ppOrderID: localStorage.getItem('orderID') } });
                                    } else {
                                        if (this.allowUpdateUnit == true) {
                                            this.updateTrUnit(this.psCode);
                                        }
                                    }
                                }
                            }
                        }
                    });
            } else if (this.isPotential == false) {
                this._countryService.signUpCustomer(this.signUpParamregister)
                    .finally(() => {
                        setTimeout(() => {
                            // this.resetForm();
                            this.registerLoading = false;
                        }, 0);
                    })
                    .subscribe((result) => {
                        console.log('result', result);

                        if (result.message == 'Phone Number Already Exist') {
                            this.message.error('Phone Number Already Exist');
                        } else {
                            if (result == null || result == undefined) {
                                this.message.error('No success to register data');
                            } else if (result.psCode == null && result.message == "KTP/KITAS is already exist, Please Check Your KTP!") {
                                this.message.error('KTP/KITAS is already exist, Please Check Your KTP!');
                            } else if (result.psCode == null || result.psCode == '' || result.psCode == undefined) {
                                this.message.error(result.message);
                            } else {
                                this.message.success('Customer Registered Successfully')
                                    .done(() => {
                                        if (this.bypp == 'true') {
                                            this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { psCode: result.psCode, customerCode: this.dataLocalStorage.psCodeCust, ppOrderID: localStorage.getItem('orderID') } });
                                        }

                                        if (this.pp == 'true') {
                                            this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { psCode: result.psCode, customerCode: this.dataLocalStorage.psCodeCust, ppOrderID: localStorage.getItem('orderID') } });
                                        }
                                        else {
                                            if (this.allowUpdateUnit == true) {
                                                this.updateTrUnit(result.psCode);
                                            }
                                        }
                                    });
                            }
                        }
                    });
            }

        } else {
            let documentMap: DocumentUpload[];
            let model_kitas = this._model_kitas;
            if (this.custID != undefined) this.paramregister.potentialCustID = this.custID;
            this.paramregister.idType = '5';
            this.paramregister.memberCode = this.memberCode;
            this.paramregister.address = model_kitas.corresponden;
            this.paramregister.birthDate = this.timeDate;
            this.paramregister.birthPlace = model_kitas.birthplace;
            if (model_kitas.city != undefined) {
                this.paramregister.city = model_kitas.city.cityName;
            }
            this.paramregister.country = this._cntry;
            if (model_kitas.postcode != undefined) {
                this.paramregister.postCode = model_kitas.postcode.postCode;
            }
            this.paramregister.email = model_kitas.email;
            this.paramregister.marCode = model_kitas.marcode;
            if (model_kitas.province != undefined) {
                this.paramregister.province = model_kitas.province.provinceName;
            }
            this.paramregister.name = model_kitas.fullname;
            this.paramregister.nationID = this.nationID;
            this.paramregister.npwp = model_kitas.passport;
            this.paramregister.sex = model_kitas.gender;
            this.paramregister.idNo = model_kitas.kitas;
            this.paramregister.number = model_kitas.phone;
            this.paramregister.relativesNumber = model_kitas.relativesNumber;
            this.paramregister.occID = model_kitas.occupation;

            if (this.custID!=undefined) this.signUpParamregister.potentialCustID =this.custID;
            this.signUpParamregister.idType = '5';
            this.signUpParamregister.memberCode = this.memberCode;
            this.signUpParamregister.address = model_kitas.corresponden;
            this.signUpParamregister.birthDate = this.finalBirthDate3;
            this.signUpParamregister.birthPlace = model_kitas.birthplace;
            if (model_kitas.city != undefined) {
                this.signUpParamregister.city = model_kitas.city.cityName;
            }
            this.signUpParamregister.country = this._cntry;
            if (model_kitas.postcode != undefined) {
                this.signUpParamregister.postCode = model_kitas.postcode.postCode;
            }
            this.signUpParamregister.email = model_kitas.email;
            this.signUpParamregister.marCode = model_kitas.marcode;
            if (model_kitas.province != undefined) {
                this.signUpParamregister.province = model_kitas.province.provinceName;
            }
            this.signUpParamregister.name = model_kitas.fullname;
            this.signUpParamregister.nationID = this.nationID;
            this.signUpParamregister.npwp = model_kitas.passport;
            this.signUpParamregister.sex = model_kitas.gender;
            this.signUpParamregister.idNo = model_kitas.kitas;
            this.signUpParamregister.number = model_kitas.phone;
            this.signUpParamregister.relativesNumber = model_kitas.relativesNumber;
            this.signUpParamregister.occID = model_kitas.occupation;

            documentMap = [
                this.itemdocument('KITAS', model_kitas.image_kitas),
                this.itemdocument('PASS', model_kitas.image_passport),
                this.itemdocument('NPWP', model_kitas.image_npwp),
                // this.itemdocument('passportpassangan', model_kitas.image_passpassangan),
            ];
            this.paramregister.document = documentMap;
            this.signUpParamregister.document = documentMap;
            if (this.isPotential == true) {
                this._countryService.createUpdateCustomer(this.paramregister)
                    .finally(() => {
                        setTimeout(() => {
                            // this.resetForm();
                            this.registerLoading = false;
                        }, 0);
                    })
                    .subscribe((result) => {
                        console.log('result', result);

                        if (result.message == 'Phone Number Already Exist') {
                            this.message.error('Phone Number Already Exist');
                        } else {
                            this.psCode = result.message;
                            if (result == null || result == undefined) {
                                this.message.error('No success to register data');
                            } else if (result.message == "KTP/Kitas already exist") {
                                this.message.error('KTP/KITAS is already exist, Please Check Your KTP!');
                                setTimeout(() => {
                                    location.reload();
                                }, 1000);
                                // } else if (this.paramregister.potentialCustID == null || this.paramregister.potentialCustID == undefined) {
                                //     this.message.error(result.message);
                            } else {
                                if (result.message = "Success") {
                                    this.message.success('Customer Registered Successfully')
                                        .done(() => {
                                            if (this.bypp == 'true') {
                                                this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { customerCode: this.dataLocalStorage.psCodeCust, ppOrderID: localStorage.getItem('orderID') } });
                                            }

                                            if (this.pp == 'true') {
                                                this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { psCode: result.message, ppOrderID: localStorage.getItem('orderID') } });
                                            }
                                            else {
                                                if (this.allowUpdateUnit == true) {
                                                    this.updateTrUnit(this.psCode);
                                                }
                                            }
                                        });
                                }
                            }
                        }
                    });
            } else if (this.isPotential == false) {
                this._countryService.signUpCustomer(this.signUpParamregister)
                    .finally(() => {
                        setTimeout(() => {
                            // this.resetForm();
                            this.registerLoading = false;
                        }, 0);
                    })
                    .subscribe((result) => {
                        console.log('result', result);
                        if (result.message == 'Phone Number Already Exist') {
                            this.message.error('Phone Number Already Exist');
                        } else {
                            if (result == null || result == undefined) {
                                this.message.error('No success to register data');
                            } else if (result.psCode == null && result.message == "KTP/KITAS is already exist, Please Check Your KTP!") {
                                this.message.error('KTP/KITAS is already exist, Please Check Your KTP!');
                            } else if (result.psCode == null || result.psCode == '' || result.psCode == undefined) {
                                this.message.error(result.message);
                            } else {
                                this.message.success('Customer Registered Successfully')
                                    .done(() => {
                                        if (this.bypp == 'true') {
                                            this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { psCode: result.psCode, customerCode: this.dataLocalStorage.psCodeCust, ppOrderID: localStorage.getItem('orderID') } });
                                        }

                                        if (this.pp == 'true') {
                                            this._router.navigate(['app/pponline/transaction-summary'], { queryParams: { psCode: result.psCode, customerCode: this.dataLocalStorage.psCodeCust, ppOrderID: localStorage.getItem('orderID') } });
                                        }
                                        else {
                                            if (this.allowUpdateUnit == true) {
                                                this.updateTrUnit(result.psCode);
                                            }
                                        }
                                    });
                            }
                        }
                    });
            }

        }
    }

    updateTrUnit(pscode) {
        this._transaction.getTrUnitReserved(this._appSessionService.userId)
            .subscribe((res) => {
                for (var i = 0; i < res.length; i++) {
                    let val: UnitTrUnitReservedDto = new UnitTrUnitReservedDto();
                    val.unitID = res[i].unitID;
                    this.dataUnit.push(val);
                    this.model_update.psCode = pscode; //'26896747';
                    this.model_update.unit = this.dataUnit;
                    this._unitService.updatePsCodeTrUnitReserved(this.model_update)
                        .subscribe((updateResult) => {
                            localStorage.setItem("pscode", pscode);
                            if (this.dataLocalStorage !== undefined) {
                                this._router.navigate(['/app/main/booking-unit-confirm/']);
                            }
                        });
                }
            });
    }

    invalidBirthdate = false;

    dateSelected(birthdate) {
        let dateInput = moment(birthdate).format('MM/DD/YYYY');
        this._model_ktp.birthdate = dateInput;
        if (new Date(dateInput.toString()) > new Date()) this.invalidBirthdate = true;
        else {
            this.invalidBirthdate = false;
            this.finalBirthDate1 = moment(birthdate).format('YYYY-MM-DD');
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

    resetChangeType() {
        this.customerForm.reset();
        this.getNation(), this.getCountry();

        if (this._type_ctrl.typeCard == '0') {
            this._model_ktp.fullname = '';
            this._model_ktp.birthplace = '';
            this._model_ktp.birthdate = '';
            this._model_ktp.email = '';
            this._model_ktp.phone = '';
            this._model_ktp.corresponden = '';
            this._model_ktp.ktp1 = '';
            this._model_ktp.npwp1 = '';
            this._model_ktp.image_npwp = undefined;
            this._model_ktp.image_ktp = undefined;
            this._model_ktp.image_kkeluarga = undefined;
            this._model_ktp.image_ktppasangan = undefined;

            this._model_ktp.city = '';
            this._model_ktp.postcode = '';
            this._model_ktp.marcode = '';
            setTimeout(() => {
                $('.marital').selectpicker('refresh');
                $('.city').selectpicker('refresh');
                $('.postcode').selectpicker('refresh');
            }, 0);

        } else if (this._type_ctrl.typeCard == '1') {
            this._model_kitas.fullname = '';
            this._model_kitas.birthplace = '';
            this._model_kitas.birthdate = '';
            this._model_kitas.email = '';
            this._model_kitas.phone = '';
            this._model_kitas.corresponden = '';
            this._model_kitas.kitas = '';
            this._model_kitas.passport = '';

            this._model_kitas.image_kitas = undefined;
            this._model_kitas.image_passport = undefined;
            this._model_kitas.image_npwp = undefined;
            this._model_kitas.image_passpassangan = undefined;

            this._model_kitas.city = '';
            this._model_kitas.postcode = '';
            this._model_kitas.marcode = '';
            setTimeout(() => {
                $('.marital').selectpicker('refresh');
                $('.city').selectpicker('refresh');
                $('.postcode').selectpicker('refresh');
            }, 0);

        } else if (this._type_ctrl.typeCard == '2') {
            this._model_dtt.companyname = '';
            this._model_dtt.corresponden = '';
            this._model_dtt.established = '';
            this._model_dtt.email2 = '';
            this._model_dtt.ktp2 = '';
            this._model_dtt.npwp2 = '';
            this._model_dtt.phone = '';

            this._model_dtt.image_ktp_dir = undefined;
            this._model_dtt.image_npwp = undefined;
            this._model_dtt.image_tdd = undefined;
            this._model_dtt.city = '';
            this._model_dtt.postcode = '';
            setTimeout(() => {
                $('.city').selectpicker('refresh');
                $('.postcode').selectpicker('refresh');
            }, 0);

        }
    }

    resetForm() {
        this.customerForm.reset();
        this.getNation(), this.getCountry();

        if (this._type_ctrl.typeCard == '0') {
            this.resetktp.removefile();
            this.resetnpwp.removefile();
            this.resetkk.removefile();
            this._model_ktp.image_npwp = undefined;
            this._model_ktp.image_ktp = undefined;
            this._model_ktp.image_kkeluarga = undefined;
            this._model_ktp.image_ktppasangan = undefined;

            this._model_ktp.city = '';
            this._model_ktp.postcode = '';
            this._model_ktp.marcode = '';
            setTimeout(() => {
                $('.marital').selectpicker('refresh');
                $('.city').selectpicker('refresh');
                $('.postcode').selectpicker('refresh');
            }, 0);

        } else if (this._type_ctrl.typeCard == '1') {
            this.resetkitas.removefile();
            this.resetpass.removefile();
            this.resetnpwp.removefile();
            this._model_kitas.image_kitas = undefined;
            this._model_kitas.image_passport = undefined;
            this._model_kitas.image_npwp = undefined;
            this._model_kitas.image_passpassangan = undefined;

            this._model_kitas.city = '';
            this._model_kitas.postcode = '';
            this._model_kitas.marcode = '';
            setTimeout(() => {
                $('.marital').selectpicker('refresh');
                $('.city').selectpicker('refresh');
                $('.postcode').selectpicker('refresh');
            }, 0);

        } else if (this._type_ctrl.typeCard == '2') {
            this.resetktpdir.removefile();
            this.resetnpwpdir.removefile();
            this.resettdpdir.removefile();
            this._model_dtt.image_ktp_dir = undefined;
            this._model_dtt.image_npwp = undefined;
            this._model_dtt.image_tdd = undefined;
            this._model_dtt.city = '';
            this._model_dtt.postcode = '';
            setTimeout(() => {
                $('.city').selectpicker('refresh');
                $('.postcode').selectpicker('refresh');
            }, 0);

        }

    }

    itemdocument(documentType: string, documentBinary: string) {

        if (documentBinary != null) {
            let document = new DocumentUpload;
            document.documentBinary = documentBinary;
            document.documentType = documentType;
            return document;
        } else {
            let document = new DocumentUpload;
            document.documentBinary = null;
            document.documentType = documentType;
            return document;
        }
        
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

    inputmaskphone() {
        return {
            'mask': '999999999999'
        };
    }

    onSending(data): void {

        debugger
        let testing = [];
        let file = data[0];
        let formData = data[2];
        let base64image;
        setTimeout(() => {
            base64image = file.dataURL.replace('data:' + file.type + ';base64,', '');
            if (this._type_ctrl.typeCard == '0') {
                if (data.id === 'KTP') {
                    this._model_ktp.image_ktp = base64image;
                } 
                if (data.id === 'NPWP') {
                    this._model_ktp.image_npwp = base64image;
                }
                if (data.id === 'KK') {
                    this._model_ktp.image_kkeluarga = base64image;
                } 
                if (data.id === 'KTPC') {
                    this._model_ktp.image_ktppasangan = base64image;
                }
            } else if (this._type_ctrl.typeCard == '1') {
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

    // model_kitas.image_kitas
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
            if (this._type_ctrl.typeCard == '0') {
                // if (controls['ktp1'].invalid){
                //   this.chk_ktp1=true;
                // }
                if (this._model_ktp.ktp1 == undefined || this._model_ktp.ktp1 == '' || this._model_ktp.ktp1.length != '16') {
                    this.chk_ktp1 = true;
                }
            } else if (this._type_ctrl.typeCard == '1') {
                if (this._model_kitas.kitas == undefined || this._model_kitas.kitas == '' || this._model_kitas.kitas.length != '15') {
                    this.chk_kitas = true;
                }
                // if (controls['kitas'].invalid) {
                //   this.chk_kitas = true;
                // }
            } else if (this._type_ctrl.typeCard == '2') {
                // if (controls['ktp2'].invalid){
                //   this.chk_tdp=true;
                // }
                if (this._model_dtt.ktp2 == undefined || this._model_dtt.ktp2 == '' || this._model_dtt.ktp2.length != '16') {
                    this.chk_tdp = true;
                }
            }
        }
        return invalid;
    }

}
