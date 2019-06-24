import { Component, ViewChild, ElementRef } from "@angular/core";
import { UserService } from "../user.service"
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

	@ViewChild('password') input;

	// define here the possible login codes 
	user: User
	correctUserPasswords: string[] = ['1234', '5678', '0000', '1111', '2222', '3333']
	failedLoginAttemps: number = 0

	constructor(private userService: UserService, private router: Router) {
		this.user = new User();
		this.feedback = new Feedback();
	}

	tryLogin(args): void {
		//let textField = <TextField>args.object;
		//console.log(args)
		if (this.failedLoginAttemps >= 3) {
			this.feedback.warning({
				message: "Zu viele Versuche, warte 20s!..."
			});
			//console.log(textField)
			/*textField.editable = false;
			setTimeout(() => {
				//textField.editable = true;
				this.login()
			},
				10000);*/
		}
		else { this.login() }
	}


	login(): void {
		if (!this.user.password) {
			this.feedback.warning({ message: "Bitte Passwort angeben" });
			return;
		}
		if (this.correctUserPasswords.indexOf(this.user.password) > -1) {
			this.userService.setUser(this.user)
			this.router.navigate(["/home", { id: this.user.password }]);
		} else {
			this.feedback.warning({ message: "Falsches Passwort" });
			this.user.password = ''
			this.failedLoginAttemps++
		}
	}

}