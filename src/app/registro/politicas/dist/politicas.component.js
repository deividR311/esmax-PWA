"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PoliticasComponent = void 0;
var core_1 = require("@angular/core");
var PoliticasComponent = /** @class */ (function () {
    function PoliticasComponent(dialog) {
        this.dialog = dialog;
    }
    PoliticasComponent_1 = PoliticasComponent;
    PoliticasComponent.prototype.ngOnInit = function () {
    };
    PoliticasComponent.prototype.openDialog = function () {
        this.dialog.open(PoliticasComponent_1, {
            autoFocus: false,
            maxHeight: '90vh' // you can adjust the value as per your view
        });
    };
    var PoliticasComponent_1;
    PoliticasComponent = PoliticasComponent_1 = __decorate([
        core_1.Component({
            selector: 'app-politicas',
            templateUrl: './politicas.component.html',
            styleUrls: ['./politicas.component.css']
        })
    ], PoliticasComponent);
    return PoliticasComponent;
}());
exports.PoliticasComponent = PoliticasComponent;
