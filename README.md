# product-hydra-sales-web
> The Sales-Web frontend for the Green Coco Land web app. 

This Project using Angular ABP, For details feautures you can check this link https://aspnetboilerplate.com/Pages/Documents/Feature-Management.

The most difficult project that i have made is

1. Diagrammatic 
Diagram yang menampilkan Unit & Floor berdasarkan Project & Cluster yang dipilih.
Metode yang dipakai adalah mencocokan antara header(unitcode) dan floor untuk menampilkan unit tsb.
Component yang digunakan : https://l-lin.github.io/angular-datatables/.
Source Code : \src\app\main\diagrammatic

2. Siteplan SVG
Denah yang menampilkan lokasi/letak Unit berdasarkan Project & Cluster yang dipilih.
Metode yang dipakai adalah mencocokan antara images svg dari server dengan units dari get API untuk diassign ke dalam component maps SVG.
Component yang digunakan : https://mapsvg.com/
Source Code : \src\app\main\diagrammatic &
src\assets\mapsvg\js\svg-siteplan-templates



## Background

This is the frontend for a single-page application serving  [Green
Cocoland](https://green-cocoland.com/), a coconut oil  plantation. It's an
Angular 5 single-page app stripped from the [ASP.NET Boilerplate by
Volosoft](https://www.aspnetzero.com) library. Documentation on ASP.NET
Boilerplate is [here](https://www.aspnetzero.com/Documents).

### Backend

This project uses another repo as the backend.

- **Hydra Backend**: https://gitlab.com/neogeekscamp/hydra-be-dotnetcore 


## Install

### Development Prerequisites

The project is developed using the following programs. Install them if you
don't have them locally installed. Try to get the exact versions, which have
been proven to work.

- Visual Studio 2017 or Visual Studio 2019 (Community Edition)
  - [Visual Studio 2017 (Community Edition)](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=15) 
  - [Visual Studio 2019 (Community Edition)](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)
- [Node.js 10.6.1](https://nodejs.org/dist/v10.16.1/)
- [Typescript 2.0](https://www.typescriptlang.org/)
- [yarn 1.17.3](https://yarnpkg.com/en/)

Make sure you don't download 32-bit installers for 64-bit computers and vice
versa.

### Yarn installation

After installing [npm](https://npmjs.com), run the following in the command
line.

```sh
npm install -g yarn@1.17.3
```

### Building the frontend solution

- Open a command line and run the following command. Use a high network
timeout due to some packages causing timeouts.

```sh
yarn install --network-timeout 1000000
```

If yarn fails due to a bug, try the following.

```sh
npm install
yarn install --network-timeout 1000000
```


## Running 

- Inside the folder containing the frontend *.sln* file, run the following.

```sh
yarn run start
```

- Open a browser and go to http://localhost:4200.
- At the login screen, use the following credentials. These are [ASP.NET Boilerplate's defaults](https://aspnetboilerplate.com/Pages/Documents/Articles/Developing-MultiTenant-SaaS-ASP.NET-CORE-Angular/index.html).
  - **Username**: admin
  - **Password**: 123qwe
- Change the password when prompted.

Note that instead of using `yarn run start`, you can try using the following
command to use [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/).

```sh
npm run hmr
```


## Common Issues

> The frontend is not listening to the correct port.

- Open *nswag/service.config.nswag* with Notepad or Visual Studio.
- Replace the following line in with the location of the swagger service you 
are referencing.

```json
  "swaggerGenerator": {
    "fromSwagger": {
        "url": "http://YOUR_DOMAIN_NAME_OR_IP/swagger/v1/swagger.json",
        "output": null
    }
  },
 ```

- Open *src/assets/appconfig.json* with Notepad or Visual Studio.
- Replace the following line in with the location of the swagger service you 
are referencing.

```json
    "remoteServiceBaseUrl": "http://YOUR_DOMAIN_NAME_OR_IP",
```

> Response status code does not indicate success: 500 (Internal Server Error).

Go to the backend project and check *App_Data/Logs/Logs.txt* and check for any issues
with http://YOUR_DOMAIN_NAME_OR_IP/swagger/v1/swagger.json. Then fix them.


> npm run gets stuck on 90% chunk assets processing.

Try turning off source mapping. Source mapping maps typescript file lines to
the transpiled javascript file lines, making debugging easier. The problem is
that this can take a very long time.

If debugging is not a priority, try running the app using the following command.

```sh
yarn run ng serve --sourcemap=false --port=4200
```

Note, use ```yarn run``` instead of ```npm run``` because sometimes npm run
does not take the sourcemap or port parameters.


> Strange things with datepicker directive/which datepicker directive are we using.

We are **not** using the datepicker from ngx-bootstrap. We have our
own datepicker directive in app\shared\common\timing\date-picker.component.ts.

This may actually be a good thing because we have closer control and access
to the full features of JQuery's datepicker. As of writing this. ngx's datepicker
cannot handle "only displaying months".


> Dropdowns don't disappear on changing views.

This depends on where the dropdown is.

If the dropdown is in a grid, you're out of luck. You have to use the 
non-Angular bootstrap dropdown and add some code to manually delete
the dropdown. So say the dropdown button is supposed to go to
some page, replace the ```[routerLink]``` directive with something 
like this.

```typescript
    goToPage(): void {
        this._router.navigate(['/app/target-page/', 'parameter']);

        let buggyDropdown = document.getElementsByClassName('dropdown-menu tether-element')[0];
        if (buggyDropdown != null) buggyDropdown.remove();
    }
```

Note that using the ```BsDropDownModule``` dropdown inside a
primefaces grid may cause the dropdown to not open at all.

Otherwise your dropdowns must use the ```BsDropDownModule``` 
from ```ngx-bootstrap```.  If the dropdown has something 
like ```data-toggle="dropdown"```, it's not using that module 
and is incorrect.

To use the module, make sure the following lines are on the 
xxx.module.ts file that serves your component.

```typescript
import { BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        BsDropdownModule.forRoot(),
...
```

Then replace the dropdown with something like below.

```html
            <div class="btn-group" normalizePosition dropdown>
                <button dropdownToggle
                        class="dropdown-toggle btn btn-sm btn-primary"
                        aria-controls="dropdown-basic">
                    <i class="fa fa-cog"></i><span class="caret"></span> {{l("Actions")}}
                </button>
                <ul *dropdownMenu class="dropdown-menu">
                    <li role="menuitem">
                        <a class="dropdown-item">{{l('Details')}}</a>
                    </li>
                </ul>
            </div>
```

> Error: "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.

> TODO: Find a fix for this.


> "Found the synthetic property @routerTransition. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.",

If both `BrowserAnimationmodule` and `NoopAnimationModule` are already in 
the *root.module.ts* file, make sure that the page's component.ts file 
has the following lines.

```typescript
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    ...
    animations: [appModuleAnimation()]
})
```


> http://BACKEND/AbpUserConfiguration/GetAll returns a 500 status error

Try clearing the cookies in your browser.


