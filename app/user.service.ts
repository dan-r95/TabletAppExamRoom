import { Injectable } from "@angular/core";
import { Http, Headers, Response} from "@angular/http";
import { HttpResponse } from '@angular/common/http';
import { Observable, throwError, of} from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { User } from "./user";
//import { Config } from "../config";
import { LoginModule } from './login/login.module';



@Injectable( {
    providedIn: 'root',
})
export class UserService {
    constructor(private http: Http) { }

    login(user: User): Observable<{}> {
        alert("login")
        // if (!user.email || !user.password) {
        //     return throwError("Please provide both an email address and password.");
        // }
        if (user.email == "1") {
            return of(new HttpResponse({ status: 200 }));
        }
    }
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
    
        getCommonHeaders() {
            let headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", Config.authHeader);
            return headers;
        }
    */
    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}