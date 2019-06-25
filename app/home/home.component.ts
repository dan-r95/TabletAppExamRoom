import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute, NavigationEnd } from "@angular/router";
import { DeviceType } from "tns-core-modules/ui/enums";
import { device } from "tns-core-modules/platform";
import { WebView, LoadEventData } from "tns-core-modules/ui/web-view";
import { Page } from "tns-core-modules/ui/page";
import { isIOS, isAndroid } from "tns-core-modules/platform"
import { UserService } from "~/services/user.service";
import * as data from '../data'
import { catchError } from "rxjs/operators";
import { RouterExtensions } from "nativescript-angular";
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

  SERVERADRESS: string = '192.168.43.9:8888';

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
  }


  select(args) {
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

    if (!isAndroid) {
      return;
    }
    // dont go back via hardware buttons (android)
    application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
      data.cancel = true;
    });

    // set the solution and data to the logged in user
    this.sub = this.route.params.subscribe(params => {
      this.selectedUser = params['id']; // (+) converts string 'id' to a number
      this.updateSelectedData();
      this.sendSolutionToServer();
    });
  }


  sendSolutionToServer(): boolean {
    this.userService.setServerAdress(this.SERVERADRESS);
    this.userService.sendSolution(this.solution).subscribe(next => { console.log(next) }, err => { console.log(err) });
    return false;
  }

  updateSelectedData(): void {
    switch (this.selectedUser) {
      case '1234':
        this.data = data.data_user_simple_1;
        this.solution = data.solution_simple_1; break;
      case '5678':
        this.data = data.data_user_simple_2;
        this.solution = data.solution_simple_2; break;
      case '0000':
        this.data = data.data_user_middle_1;
        this.solution = data.solution_middle_1;
      case '1111':
        this.data = data.data_user_middle_2;
        this.solution = data.solution_middle_2; break;
      case '2222':
        this.data = data.data_user_hard_1;
        this.solution = data.solution_hard_1; break;
      case '3333':
        this.data = data.data_user_hard_2;
        this.solution = data.solution_hard_2; break;
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
  const vm = page.bindingContext;
  const webview: WebView = <WebView>webargs.object;
  console.log(webview.android.getSettings)
  if (isAndroid) {
    webview.android.getSettings().setSupportZoom(false);
    webview.android.getSettings().setDisplayZoomControls(false);
    webview.android.getSettings().setBuiltInZoomControls(false);
  }
}



