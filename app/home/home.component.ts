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
            name: "Bulbasaur",
            src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
            description: "Bulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun’s rays, the seed grows progressively larger."
        });
       
    }
}
