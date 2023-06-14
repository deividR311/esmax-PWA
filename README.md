# AutoPwa

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

## Development server

ng serve --host 0.0.0.0

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Environments available

Desarrollo `ng build`
QA `ng build --configuration=qa`
Producción `ng build --configuration=production `

## Post Build Script
postbuild.sh Empaqueta las diferentes versiones `npm run postbuild`

`ng build --configuration=qa && ./postbuild.sh`



