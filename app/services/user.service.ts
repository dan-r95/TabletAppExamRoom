import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { HttpResponse, HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { User } from "../user";

@Injectable({
	providedIn: 'root',
})
export class UserService {

	serverAdress: string;

	user: User;


	constructor(private http: Http, private client: HttpClient) { }

	login(user: User): Observable<{}> {
		alert("login")
		// if (!user.email || !user.password) {
		//     return throwError("Please provide both an email address and password.");
		// }
		if (user.email == "1") {
			return of(new HttpResponse({ status: 200 }));
		}
	}

	setServerAdress(address): void {
		if (this.serverAdress) {
			this.serverAdress = address;
		}

	}

	public setUser(user: User) {
		this.user = user;
	}

	public getUser(): User {
		return this.user
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
				`Backend returned code ${error.status}, ` +
				`body was: ${error.error}`);
		}
		// return an observable with a user-facing error message
		return throwError(
			'Something bad happened; please try again later.');
	};

    /*
            return this.http.post(
                Config.apiUrl + "user/" + Config.appKey,
                JSON.stringify({
                    username: user.email,
                    email: user.email,
                    password: user.password
                }),
                { headers: this.getCommonHeaders() }
            ).pipe(
                catchError(this.handleErrors)
            );
        }
    */

	public sendSolution(solution: any): Observable<any> {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			})
		};
		return this.client.post(this.serverAdress, JSON.stringify(solution), httpOptions).pipe(
			catchError(this.handleError)
		);
	}

	handleErrors(error: Response) {
		console.log(JSON.stringify(error.json()));
		return Observable.throw(error);
	}
}