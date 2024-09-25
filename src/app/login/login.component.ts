import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import sha256 from 'crypto-js/sha256';
import { AuthGuard } from '../auth.guard';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ExchangeService } from '../services/exchange.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm;
  secretKey = "u9bxzswZGCe8p5BtlxTYJtes2OaKPr2Q"
  encPassword;
  notAuthorized = true;
  userCheck: User;
  permission:boolean = false;
  
  constructor(private authService: AuthService,
  private formBuilder: FormBuilder,
  private auth: AuthGuard,
  private router: Router,
  private data: ExchangeService) {

      this.loginForm = this.formBuilder.group({
        
      username: '',
      passwort: ''
    })
  }

  ngOnInit(): void {
  }

  //Methode zum einloggen eine Spieler
  getUser(loginData) {
    //Verschlüsselt das eingegebene Passwort mit SHA256
    this.encPassword = sha256(loginData.passwort, this.secretKey).toString();
    //Get-Methode um entsprechenden User aus der Datenbank zu ziehen
    this.authService.getUser(loginData.username, this.encPassword).subscribe((user: User) => {
    //Übergabe des Spieler in einer Variable des Typs User
    this.userCheck = user
    //Wenn user nicht null, dann war Loginprozess erfolgreich
      if(user != null) {
        this.changePermissionTrue();
        this.permission = this.auth.canActivate();
        //Automatische Weiterleitung zum Shop
        this.router.navigate(['/shop'])
        //Loginbutton wird geswitched
        this.switchButtonMessage();
        this.switchFunctionsReserv();
        this.data.setUser(this.userCheck);
      } else {
      //Falls der Login nicht erfolgreich war, wird eine kurze Meldung ausgegeben
        alert("Das hat leider nicht geklappt!")
      }
    });
  }

  //Setzt den Text im Loginbutton auf Logout, wenn Spieler sich erfolgreich angemeldet hat
  switchButtonMessage() {
    this.data.changeLogin('Logout');
  }
  //Wechselt die Funktion des Login Buttons auf die Funktion des Logout Buttons
  switchFunctionsReserv() {
    this.data.switchFunctions('true');
  }
  //Setzt die Variable in auth.guard.ts auf "true"
  changePermissionTrue() {
    this.auth.changePermissionTrue();
  }
  //Setzt die Variable in auth.guard.ts auf "false"
  changePermissionFalse() {
    this.auth.changePermissionFalse();
  }


}


