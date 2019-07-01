import { Component, ViewChild, ElementRef } from "@angular/core";
import { UserService } from "~/services/user.service"
import { User } from "../user";
import { Router } from "@angular/router";
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { TextField } from "tns-core-modules/ui/text-field";

@Component({
    selector: "Login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css']

})
export class LoginComponent {
    private feedback: Feedback;

    @ViewChild("password", { static: false }) input: ElementRef;

    // define here the possible login codes 
    user: User
    correctUserPasswords: string[] = ['1234', '5678', '0000', '1111', '2222', '3333']
    failedLoginAttemps: number
    lengthVar = "4";

    constructor(private userService: UserService, private router: Router) {
        this.user = new User();
        this.feedback = new Feedback();
        this.failedLoginAttemps = 0;
    }

    waitWhenLoginLimitReached(): void {
        if (this.failedLoginAttemps >= 3) {
            this.feedback.warning({
                message: "Zu viele Versuche, warte 20s!...",
                duration: 18000
            });
            this.user.password = ''
            this.lengthVar = "0"
            setTimeout(() => {
                this.lengthVar = "4";
                this.login()
            },
                10000);
        }
    }


    login(): void {
        if (!this.user.password) {
            this.feedback.warning({ message: "Bitte Passwort angeben", duration: 2000 });
            return;
        }
        if (this.correctUserPasswords.indexOf(this.user.password) > -1) {
            this.feedback.success({ message: "Korrekt! :)", duration: 1000 });
            console.log('success now sending solution!')
            this.userService.setUser(this.user)
            this.userService.setSolution(this.user);
            this.userService.sendSolutionToSever();
            this.router.navigate(["/home", { id: this.user.password }]);
        } else {
            this.feedback.warning({ message: "Falsches Passwort", duration: 2000 });
            this.user.password = ''
            this.failedLoginAttemps++
            this.waitWhenLoginLimitReached()
        }
    }

}