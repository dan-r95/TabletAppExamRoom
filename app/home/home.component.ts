import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute, NavigationEnd } from "@angular/router";
import { DeviceType } from "tns-core-modules/ui/enums";
import { device } from "tns-core-modules/platform";
import { WebView, LoadEventData } from "tns-core-modules/ui/web-view";
import { Page } from "tns-core-modules/ui/page";
import { isIOS, isAndroid } from "tns-core-modules/platform"
import { UserService } from "~/user.service";
import * as data from '../data'
import { catchError } from "rxjs/operators";

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

	solution: any;

	selectedUser: string;
	private sub: any;

	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
		router.events.subscribe((val) => {
			console.log(val)
		});
	}


	select(args) {
		switch (this.selectedUser) {
			case '1234':
				this.selected = data.data_user_simple_1[args.index];
			case '5678':
				this.selected = data.data_user_simple_2[args.index];
			case '0000':
				this.selected = data.data_user_middle_1[args.index];
			case '1111':
				this.selected = data.data_user_middle_2[args.index];
			case '2222':
				this.selected = data.data_user_hard_1[args.index];
			case '3333':
				this.selected = data.data_user_hard_2[args.index];
		}



		// For phone users we need to navigate to another page to show the detail view.
		if (!this.isTablet) {
			this.router.navigate(["/detail"], {
				queryParams: { selected: JSON.stringify(this.selected) }
			});
		}
	}

	ngOnInit(): void {
		console.log('init component')
		// set the solution and data to the logged in user
		this.sub = this.route.params.subscribe(params => {
			this.selectedUser = params['id']; // (+) converts string 'id' to a number
			this.updateSelectedData();
			this.sendSolutionToServer();
		});
	}


	sendSolutionToServer(): boolean {
		this.userService.setServerAdress('141.56.232.23:8888');
		this.userService.sendSolution(this.solution);
		return false;
	}

	updateSelectedData(): void {
		switch (this.selectedUser) {
			case '1234':
				this.data = data.data_user_simple_1;
				this.solution = data.solution_simple_1;
			case '5678':
				this.data = data.data_user_simple_2;
				this.solution = data.solution_simple_2;
			case '0000':
				this.data = data.data_user_middle_1;
				this.solution = data.solution_middle_1;
			case '1111':
				this.data = data.data_user_middle_2;
				this.solution = data.solution_middle_2;
			case '2222':
				this.data = data.data_user_hard_1;
				this.solution = data.solution_hard_1;
			case '3333':
				this.data = data.data_user_hard_2;
				this.solution = data.solution_hard_2;
		}

	}
}




// handling WebView load finish event
export function onWebViewLoaded(webargs) {
	const page: Page = <Page>webargs.object.page;
	const vm = page.bindingContext;
	const webview: WebView = <WebView>webargs.object;
	webview.ensureDomNode()
	vm.set("result", "WebView is still loading...");
	vm.set("enabled", false);

	webview.on(WebView.loadFinishedEvent, (args: LoadEventData) => {
		let message = "";
		if (!args.error) {
			message = `WebView finished loading of ${args.url}`;
		} else {
			message = `Error loading ${args.url} : ${args.error}`;
		}

		vm.set("result", message);
	});

	if (isAndroid) {
		webview.android.getSettings().setDisplayZoomControls(false);
		webview.android.getSettings().setBuiltInZoomControls(false);
	}


}



