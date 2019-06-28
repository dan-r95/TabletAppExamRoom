import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpResponse, HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { User } from "../user";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { solution_simple_1, solution_simple_2, solution_middle_1, solution_middle_2, solution_hard_1, solution_hard_2 } from '../data'

@Injectable({
    providedIn: 'root',
})
export class UserService {

    serverAdress: string;
    user: User;
    private feedback: Feedback
    solution: any;

    constructor(private http: Http, private client: HttpClient) {
        this.feedback = new Feedback();
        this.serverAdress = ''
    }

    public login(user: User): Observable<{}> {
        alert("login")
        // if (!user.email || !user.password) {
        //     return throwError("Please provide both an email address and password.");
        // }
        if (user.email == "1") {
            return of(new HttpResponse({ status: 200 }));
        }
    }

    public setServerAdress(address): void {
        this.serverAdress = address;
    }

    public setUser(user: User) {
        this.user = user;
    }

    public getUser(): User {
        return this.user
    }

    private handleError(error: HttpErrorResponse) {
        console.log(error)
		/*if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {*/
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        if (error.status) {
            /*this.feedback.warning({
              message: `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`, duration: 2000 });*/
        } else {
            /*this.feedback.warning({
              message: `Backend returned code ${error}`, duration: 2000
            }); */
        }
        //}

        alert('Something bad happened; please try again later.')

        // inputType property can be dialogs.inputType.password, dialogs.inputType.text, or dialogs.inputType.email.
        /*console.log(this.setServerAdress)
        dialogs.prompt({
            message: "Whoops, server verbindung failed! Neue IP eingeben",
            okButtonText: "OK",
            inputType: dialogs.inputType.text,
            defaultText: this.serverAdress,
        }).then(r => {
            console.log("Dialog result: " + r.result + ", text: " + r.text);
            this.setServerAdress(r.text)
            this.sendSolution();
        });*/

        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };

    public setSolution(user): void {
        if (this.user.password !== undefined) {
            switch (this.user.password) {
                case '1234':
                    this.solution = solution_simple_1; break;
                case '5678':
                    this.solution = solution_simple_2; break;
                case '0000':
                    this.solution = solution_middle_1; break;
                case '1111':
                    this.solution = solution_middle_2; break;
                case '2222':
                    this.solution = solution_hard_1; break;
                case '3333':
                    this.solution = solution_hard_2; break;
            }
        }
    }

    public sendSolution(solution: any = this.solution): Observable<any> {
        console.log(this.serverAdress)

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