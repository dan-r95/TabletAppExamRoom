import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WebView } from "tns-core-modules/ui/web-view";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./detail.component.html"
})
export class DetailComponent implements OnInit {
    selected = {};

    constructor(private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.selected = JSON.parse(params["selected"]);
        });
    }

	ngOnInit(): void {
		console.log("detail")
		console.log(this.selected)
	}
}
