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

    public setServerAdress(address): void {
        this.serverAdress = address;
    }

    public setUser(user: User) {
        console.log(user)
        this.user = user;
    }

    public getUser(): User {
        return this.user
    }

    private handleError(error: HttpErrorResponse) {
        console.log(error)

        dialogs.alert('Something bad happened; please try again later.')
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };

    public setSolution(user: User): void {
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