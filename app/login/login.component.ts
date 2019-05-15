import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service"
import {User} from "../user";
import { Router } from "@angular/router";

@Component({
	selector: "Login",
	moduleId: module.id,
	templateUrl: "./login.component.html",
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	user: User
	constructor(private userService: UserService, private router: Router) {
		
	}

	ngOnInit(): void {
		this.user = new User
	}

	login(): void {
		//this.userService.login(this.user).subscribe(() => 
		this.router.navigate(["/home"])
		//, (error)=> {})
	}
}