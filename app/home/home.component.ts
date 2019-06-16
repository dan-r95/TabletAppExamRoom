import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { DeviceType } from "tns-core-modules/ui/enums";
import { device } from "tns-core-modules/platform";
import { WebView, LoadEventData } from "tns-core-modules/ui/web-view";
import { Page } from "tns-core-modules/ui/page";
import { isIOS, isAndroid } from "tns-core-modules/platform"

@Component({
	selector: "Home",
	moduleId: module.id,
	templateUrl: "./home.component.html",
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	isTablet: boolean = device.deviceType === DeviceType.Tablet;

	data = [];
	data_user1 = [];
	data_user2 = [];
	data_user3 = [];
	data_user4 = [];
	data_user5 = [];
	data_user6 = [];
	data_user7 = [];
	data_user8 = [];
	selected = {};

	selectedUser: string;
	private sub: any;

	constructor(private route: ActivatedRoute, private router: Router) { }

	select(args) {
		switch (this.selectedUser) {
			case '1234': this.selected = this.data_user4[args.index];
				this.data = this.data_user4;
			case '5678': this.selected = this.data_user2[args.index];
				this.data = this.data_user2;
			case '0000': this.selected = this.data_user3[args.index];
				this.data = this.data_user3;
			case '1111': this.selected = this.data_user4[args.index];
				this.data = this.data_user4;
		}



		// For phone users we need to navigate to another page to show the detail view.
		if (!this.isTablet) {
			this.router.navigate(["/detail"], {
				queryParams: { selected: JSON.stringify(this.selected) }
			});
		}
	}

	ngOnInit(): void {

		this.sub = this.route.params.subscribe(params => {
			this.selectedUser = params['id']; // (+) converts string 'id' to a number
			// In a real app: dispatch action to load the details here.
			switch (this.selectedUser) {
				case '1234':
					this.data = this.data_user1;
				case '5678':
					this.data = this.data_user2;
				case '0000':
					this.data = this.data_user3;
				case '1111':
					this.data = this.data_user4;
			}
			console.log(this.data)
		});


		this.data_user1.push({
			name: "Einkaufsliste",
			src: "",
			description: `
			<!doctype html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<title>cceos</title>
			</head>
			<body>
			<div style="font-size: 18px">
			<ul> 
				<li>Kryptonit 10µg</li>
            	<li>Fischfutter 2x</li>
            	<li>Brot 1x</li>
            	<li>Stickstoff 20l</li>
            Zum Frühstück trinke ich einen Pott Kaffee <img src="https://facebook.github.io/react-native/docs/assets/favicon.png" width="40px" height="40px" alt="">  und einen Espresso <img src="https://facebook.github.io/react-native/docs/assets/favicon.png" width="40px" height="40px" alt="">. 
            Oder ich trinke einen Pott Kaffee <img src="https://facebook.github.io/react-native/docs/assets/favicon.png" width="40px" height="40px" alt=""> und einen Latte Macchiato <img src="https://facebook.github.io/react-native/docs/assets/favicon.png" width="40px" height="40px" alt="">.
            Was ist das Fazit?
`       });
		this.data_user1.push({
			name: "Hinweis",
			src: "",
			description: `<html><style type="text/css">
			.tg  {border-collapse:collapse;border-spacing:0; style="font-size: 18px";}
			.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
			.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
			.tg .tg-0lax{text-align:left;vertical-align:top}
			</style>
			<table class="tg">
			<tr>
				<th class="tg-0lax">Fach</th>
				<th class="tg-0lax">Datum</th>
			</tr>
			<tr>
				<td class="tg-0lax">Grundlagen der Informatik 1</td>
				<td class="tg-0lax">11.3.2020</td>
			</tr>
			<tr>
				<td class="tg-0lax">Grundlagen der Informatik 1 WdH</td>
				<td class="tg-0lax">11.3.2002</td>
			</tr>
			</table></html>  `
		});
		this.data_user2.push({
			name: "Einkaufsliste",
			src: "",
			description: `
			<!doctype html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<title>cceos</title>
			</head>
			<body>
			<div style="font-size: 18px">
			<ul> 
				<li>Kryptonit 10µg</li>
            	<li>Fischfutter 2x</li>
            	<li>Brot 1x</li>
            	<li>Stickstoff 20l</li>
				<li>Kaffee:<br>Zum Frühstück trinke ich einen Pott Kaffee  <img src="https://facebook.github.io/react-native/docs/assets/favicon.png" width="40px" height="40px" alt=""> und einen Espresso <img src="https://facebook.github.io/react-native/docs/assets/favicon.png" width="40px" height="40px" alt="">. 
            Oder ich trinke einen Pott Kaffee <img src="https://facebook.github.io/react-native/docs/assets/favicon.png" width="40px" height="40px" alt=""> und einen Latte Macchiato <img src="https://facebook.github.io/react-native/docs/assets/favicon.png" width="40px" height="40px" alt=""> .
            Was ist das Fazit?
			</li>
			</ul>
			</div>
			</body</html>
`       });
		this.data_user2.push({
			name: "Hinweis",
			src: "",
			description: `<html><style type="text/css">
			.tg  {border-collapse:collapse;border-spacing:0; style="font-size: 18px";}
			.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
			.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
			.tg .tg-0lax{text-align:left;vertical-align:top}
			</style>
			<table class="tg">
			<tr>
				<th class="tg-0lax">Fach</th>
				<th class="tg-0lax">Datum</th>
			</tr>
			<tr>
				<td class="tg-0lax">Grundlagen der Informatik 1</td>
				<td class="tg-0lax">11.3.2020</td>
			</tr>
			<tr>
				<td class="tg-0lax">Grundlagen der Informatik 1 WdH</td>
				<td class="tg-0lax">11.3.2002</td>
			</tr>
			</table></html>  `
		});
		this.data_user3.push({
			name: "Einkaufsliste",
			src: "",
			description: 'https://stackoverflow.com/questions/39379394/how-to-set-the-background-transparent-to-a-nativescript-webview'
		});
		this.data_user3.push({
			name: "Hinweis",
			src: "",
			description: `<html><style type="text/css">
			.tg  {border-collapse:collapse;border-spacing:0; style="font-size: 18px";}
			.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
			.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
			.tg .tg-0lax{text-align:left;vertical-align:top}
			</style>
			<table class="tg">
			<tr>
				<th class="tg-0lax">Fach</th>
				<th class="tg-0lax">Datum</th>
			</tr>
			<tr>
				<td class="tg-0lax">Grundlagen der Informatik 1</td>
				<td class="tg-0lax">11.3.2020</td>
			</tr>
			<tr>
				<td class="tg-0lax">Grundlagen der Informatik 1 WdH</td>
				<td class="tg-0lax">11.3.2002</td>
			</tr>
			</table></html>  `
		});
		this.data_user4.push({
			name: "Einkaufsliste",
			src: "",
			description: `
			<!doctype html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<title>cceos</title>
			</head>
			<body>
			<div style="font-size: 18px">
			<ul> 
				<li>Kryptonit 10µg</li>
            	<li>Fischfutter 2x</li>
            	<li>Brot 1x</li>
            	<li>Stickstoff 20l</li>
				<li>Kaffee:<br>Abends trinke ich keinen Pott Kaffee
				<img src="https://facebook.github.io/react-native/docs/assets/favicon.png" width="40px" height="40px" alt="">
				oder keinen Espresso 
				<img src="https://facebook.github.io/react-native/docs/assets/favicon.png" width="40px" height="40px" alt="">.<br>
				Oder ich trinke nichts davon: Espresso 
				<img src="https://facebook.github.io/react-native/docs/assets/favicon.png" alt="" width="40px" height="40px"> 
				und keinen Latte Macchiato <img src="https://facebook.github.io/react-native/docs/assets/favicon.png" width="40px" height="40px" alt="">.<br>          
				Was ist das Fazit?</li>
			</ul>
			</div>
			</body</html>
 `       });

		this.data_user4.push({
			name: "Klausurtermine",
			src: "",
			description: `<html><style type="text/css">
			.tg  {border-collapse:collapse;border-spacing:0; style="font-size: 18px";}
			.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
			.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
			.tg .tg-0lax{text-align:left;vertical-align:top}
			</style>
			<table class="tg">
			<tr>
				<th class="tg-0lax">Fach</th>
				<th class="tg-0lax">Datum</th>
			</tr>
			<tr>
				<td class="tg-0lax">Grundlagen der Informatik 1</td>
				<td class="tg-0lax">11.3.2020</td>
			</tr>
			<tr>
				<td class="tg-0lax">Grundlagen der Informatik 1 WdH</td>
				<td class="tg-0lax">11.3.2002</td>
			</tr>
			</table></html>  `
		});

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
		console.log(`WebView message - ${message}`);
	});

	if (isAndroid) {
		webview.android.getSettings().setDisplayZoomControls(false);
		webview.android.getSettings().setBuiltInZoomControls(false);
	} 


}



