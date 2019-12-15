import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DeviceType } from "tns-core-modules/ui/enums";
import { device } from "tns-core-modules/platform";
import { WebView } from "tns-core-modules/ui/web-view";
import { Page } from "tns-core-modules/ui/page";
import { isAndroid } from "tns-core-modules/platform"
import { UserService } from "~/services/user.service";
import * as data from '../data'
import * as application from "tns-core-modules/application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application";

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

    SERVERADRESS: string = 'http://192.168.43.9:8888';

    constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
    }


    select(args) {
        console.log("select" + this.selectedUser);
        switch (this.selectedUser) {
            case '1234':
                this.selected = data.data_user_simple_1[args.index]; break;
            case '5678':
                this.selected = data.data_user_simple_2[args.index]; break;
            case '0000':
                this.selected = data.data_user_middle_1[args.index]; break;
            case '1111':
                this.selected = data.data_user_middle_2[args.index]; break;
            case '2222':
                this.selected = data.data_user_hard_1[args.index]; break;
            case '3333':
                this.selected = data.data_user_hard_2[args.index]; break;
        }



        // For phone users we need to navigate to another page to show the detail view.
        if (!this.isTablet) {
            this.router.navigate(["/detail"], {
                queryParams: { selected: JSON.stringify(this.selected) }
            });
        }
    }

    ngOnInit(): void {

        if (isAndroid) {
            application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
                data.cancel = true;
            });
        }
        // dont go back via hardware buttons (android)


        // set the solution and data to the logged in user
        this.sub = this.route.params.subscribe(params => {
            this.selectedUser = params['id']; // (+) converts string 'id' to a number
            this.updateSelectedData();
        });
    }

    updateSelectedData(): void {
        switch (this.selectedUser) {
            case '1234':
                this.data = data.data_user_simple_1;
                this.selected = data.data_user_simple_1[0];
                break;
            case '5678':
                this.data = data.data_user_simple_2;
                this.selected = data.data_user_simple_2[0];
                break;
            case '0000':
                this.data = data.data_user_middle_1;
                this.selected = data.data_user_middle_1[0];

            case '1111':
                this.data = data.data_user_middle_2;
                this.selected = data.data_user_middle_2[0];
                break;
            case '2222':
                this.data = data.data_user_hard_1;
                this.selected = data.data_user_hard_1[0];
                break;
            case '3333':
                this.data = data.data_user_hard_2;
                this.selected = data.data_user_hard_2[0];
                break;
        }
    }

    logout(): void {
        this.data = [];
        this.selected = {};
        this.solution = {}
        this.selectedUser = '';
        this.router.navigate(['/login']);
    }


}

// handling WebView load finish event
export function onWebViewLoaded(webargs) {
    console.log('webview loaded')
    const page: Page = <Page>webargs.object.page;
    const webview: WebView = <WebView>webargs.object;
    console.log(webview.android.getSettings)
    if (isAndroid) {
        webview.android.getSettings().setSupportZoom(false);
        webview.android.getSettings().setDisplayZoomControls(false);
        webview.android.getSettings().setBuiltInZoomControls(false);
    }
}



