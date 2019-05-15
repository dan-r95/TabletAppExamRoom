// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { enableProdMode } from '@angular/core';

import { AppModule } from "./app.module";

enableProdMode();
platformNativeScriptDynamic().bootstrapModule(AppModule);


/*here is no flag to enable the production mode via the NativeScrtip CLI.
However, there is a--release flag which you can use with the NativeScript 
CLIto generate an optimized release build for your mobile application(more here).
*/