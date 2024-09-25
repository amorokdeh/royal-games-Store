import { Injectable } from '@angular/core';
import {BehaviorSubject } from 'rxjs';
import { User } from '../models/User';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../auth.guard';

@Injectable({
    providedIn:'root'
})

export class ExchangeService{

    //Basic Variablenaustausch
    private messageSource = new BehaviorSubject('default');
    currentMessage = this.messageSource.asObservable();

    //Variable zum Login
    private messageLogin = new BehaviorSubject('Login');
    currentMessageLogin = this.messageLogin.asObservable();

    private messageSwitch = new BehaviorSubject('false');
    currentMessageSwitch = this.messageSwitch.asObservable();
    public user: User;

    constructor(private auth: AuthGuard){
        // Wenn der user von getUser, nicht leer ist, dann werden die zwei BehaviorSubject's mit "logout"
        // und "true" als Observable gesetzt. Das heißt das wenn jemand angemeldet ist, dann hat der
        // Nutzer die Moeglichkeit sich auszuloggen.
        this.getUser();
        if(this.user != null) {
            this.messageLogin = new BehaviorSubject('Logout');
            this.currentMessageLogin = this.messageLogin.asObservable();

            this.messageSwitch = new BehaviorSubject('true');
            this.currentMessageSwitch = this.messageSwitch.asObservable();

            this.auth.changePermissionTrue();
        }
    }


    //Basic Variablenaustausch
    changeMessage(message: string){
        this.messageSource.next(message);
    }

    //Loginvariable
    changeLogin(message: string){
        this.messageLogin.next(message);
    }

    switchFunctions(message: string) {
        this.messageSwitch.next(message);
    }

    //User-Objektaustausch
    public getUser(): User {
        if (this.user) {
            return this.user;
        }

        var storageUser = window.localStorage.getItem('user');
        if (storageUser) {
            try {
            this.user = JSON.parse(storageUser);
            } catch (e) {
            window.localStorage.removeItem('user');
            }
        }
        return this.user;
    }

    //User-Objektaustausch
    public setUser(user: User): void {
        window.localStorage.setItem('user', JSON.stringify(user));
        this.user = user;
    }

}