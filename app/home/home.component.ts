import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { DeviceType } from "ui/enums";
import { HtmlView } from "tns-core-modules/ui/html-view";
import { device } from "platform";
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    isTablet: boolean = device.deviceType === DeviceType.Tablet;
    data_user1 = [];
    data_user2 = [];
    data_user3 = [];
    data_user4 = [];
    data_user5 = [];
    data_user6 = [];
    data_user7 = [];
    data_user8 = [];
    data_user9 = [];
    selected = {};

    selectedUser = {};

    constructor(private route: ActivatedRoute) { }

    select(args) {
        switch (this.selectedUser) {
            case '1234': this.selected = this.data_user1[args.index];
            case '5678': this.selected = this.data_user2[args.index];
            case '0000': this.selected = this.data_user3[args.index];
            case '1111': this.selected = this.data_user4[args.index];
        }


        // For phone users we need to navigate to another page to show the detail view.
        if (!this.isTablet) {
            this.router.navigate(["/detail"], {
                queryParams: { selected: JSON.stringify(this.selected) }
            });
        }
    }

    ngOnInit(): void {

        this.route.paramMap.pipe(
            switchMap(params => {
                // (+) before `params.get()` turns the string into a number
                this.selectedUser = +params.get('id');
            })
        );

        this.data_user1.push({
            name: "Einkaufsliste",
            src: "",
            description: `Kryptonit 10µg
            Fischfutter 2x
            Brot 1x
            Stickstoff 20l
            Kaffee: 
            Zum Frühstück trinke ich einen Pott Kaffee  und einen Espresso . 
            Oder ich trinke einen Pott Kaffee und einen Latte Macchiato .
            Was ist das Fazit?
`       });
        this.data_user1.push({
            name: "Hinweis",
            src: "",
            description: `bla blub  `
        });
        this.data_user2.push({
            name: "Einkaufsliste",
            src: "",
            description: `Kryptonit 10µg
            Fischfutter 2x
            Brot 1x
            Stickstoff 20l
            Kaffee: 
            Zum Frühstück trinke ich einen Pott Kaffee  und einen Espresso . 
            Oder ich trinke einen Pott Kaffee und einen Latte Macchiato .
            Was ist das Fazit?
`       });
        this.data_user2.push({
            name: "Hinweis",
            src: "",
            description: `bla blub  `
        });
        this.data_user3.push({
            name: "Einkaufsliste",
            src: "",
            description: `Kryptonit 10µg
            Fischfutter 2x
            Brot 1x
            Stickstoff 20l
            Kaffee: 
            Zum Mittag trinke ich nie keinen Pott Kaffee , oder einen Espresso . 
            Und dazu trinke ich stets einen Latte Macchiato .            
            Was ist das Fazit?
`       });
        this.data_user3.push({
            name: "Hinweis",
            src: "",
            description: `bla blub  `
        });
        this.data_user4.push({
            name: "Einkaufsliste",
            src: "",
            description: `<ul> <li>Kryptonit 10µg</li>
            <li>Fischfutter 2x</li>
            <li>Brot 1x</li>
            <li>Stickstoff 20l</li>
            <li>Kaffee:<br>
            Abends trinke ich keinen Pott Kaffee <img src="pott.jpg" alt=""> oder keinen Espresso <img src="espresso.jpg" alt="">.<br> Oder ich trinke nichts davon: Espresso <img src="espresso.jpg" alt=""> und keinen Latte Macchiato <img src="macchiato.jpg" alt="">.<br>          
            Was ist das Fazit?</li></ul>
 `       });

        this.data_user4.push({
            name: "Hinweis",
            src: "",
            description: `bla blub  `
        });

    }
}
