import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { DeviceType } from "ui/enums";
import { device } from "platform";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    isTablet: boolean = device.deviceType === DeviceType.Tablet;
    data = [];
    selected = {};

    constructor(private router: Router) {}

    select(args) {
        this.selected = this.data[args.index];

        // For phone users we need to navigate to another page to show the detail view.
        if (!this.isTablet) {
            this.router.navigate(["/detail"], {
                queryParams: { selected: JSON.stringify(this.selected) }
            });
        }
    }

    ngOnInit(): void {
        this.data.push({
            name: "Einkaufsliste",
            src: "",
            description: `EINKAUFSLISTE:  Kryptonit 10µg
Fischfutter 2x
Brot 1x
Stickstoff 20l
Kaffee:
Zum Frühstück trinke ich einen Pott Kaffee  und einen Espresso . 
Oder ich trinke einen Pott Kaffee und einen Latte Macchiato .
Was ist das Fazit?
` });
        this.data.push({
            name: "Anderes",
            src: "",
            description: `foo bar  `
        });
       
    }
}
