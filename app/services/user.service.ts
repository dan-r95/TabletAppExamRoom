import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { request } from "tns-core-modules/http";
import { Observable } from "rxjs";
import { User } from "../user";
import { solution_simple_1, solution_simple_2, solution_middle_1, solution_middle_2, solution_hard_1, solution_hard_2 } from '../data'

@Injectable({
    providedIn: 'root',
})
export class UserService {

    serverAdress: string;
    user: User;
    solution: any;

    constructor() {
        this.serverAdress = 'http://192.168.43.9:8888'
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

    public setSolution(): void {
        console.log(this.user.password);
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

    public async sendSolutionToSever(solution: any = this.solution): Promise<any> {
        console.log(this.serverAdress)
        console.log(solution)
        try {
            request({
                url: this.serverAdress,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify(this.solution)
            }).then((response) => {
                console.log(response);
                const result = response.content.toJSON();
            }, (e) => {
                alert(e)
            });

        } catch (error) {
            alert(error)
        }


    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}