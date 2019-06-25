import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WebView } from "tns-core-modules/ui/web-view";
import { Router, NavigationExtras, NavigationEnd } from "@angular/router";
import { UserService } from "~/services/user.service";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./detail.component.html"
})
export class DetailComponent implements OnInit {
    selected = {};

	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
        this.route.queryParams.subscribe(params => {
            this.selected = JSON.parse(params["selected"]);
        });
    }

	ngOnInit(): void {
	}

	onNavBtnTap(): void {
		this.router.navigate(["/home", { id: this.userService.getUser().password }]);
	}
}
