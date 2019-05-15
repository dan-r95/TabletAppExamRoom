import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { DetailRoutingModule } from "./detail-routing.module";
import { DetailComponent } from "./detail.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        DetailRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        DetailComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class DetailModule { }
