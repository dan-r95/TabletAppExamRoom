import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { UserService } from "../user.service"
import { User } from "../user";
import { Router } from "@angular/router";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";

@Component({
	selector: "Login",
	moduleId: module.id,
	templateUrl: "./login.component.html",
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	@ViewChild("password") password: ElementRef;
	@ViewChild("confirmPassword") confirmPassword: ElementRef;

	user: User
	userPasswords: string[] = ['1234', '5678', '0000', '1111']
	constructor(private userService: UserService, private router: Router) {
		this.user = new User()
	}

	ngOnInit(): void {
	}

	login(): void {
		console.log(this.user)
		if (!this.user.password) {
			alert({ message: "Please provide an password." });
			return;
		}
		console.log(this.user)
		console.log(this.user.password)
		console.log(this.userPasswords.indexOf(this.user.password))
		if (this.userPasswords.indexOf(this.user.password) > -1) {
			this.router.navigate(["/home", { id: this.user.password }]);
		}
	}
}