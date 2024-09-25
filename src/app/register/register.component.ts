import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import sha256 from 'crypto-js/sha256';
import { Router } from '@angular/router';
import { ExchangeService } from '../services/exchange.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


  registrationForm;
  newUser: Observable<any>;
  secretKey = "u9bxzswZGCe8p5BtlxTYJtes2OaKPr2Q"
  encPassword;
  decPassword;

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private data: ExchangeService
    ) {

      this.registrationForm = this.formBuilder.group({

        name: ['', [Validators.required]],
        username: ['', [Validators.required]],
        address: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        passwort: ['', [Validators.required]]
      });
    }

    get name(){
      return this.registrationForm.get('name')
    };

    get username(){
      return this.registrationForm.get('username')
    };

    get address(){
      return this.registrationForm.get('address')
    };

    get email(){
      return this.registrationForm.get('email')
    };

    get passwort(){
      return this.registrationForm.get('passwort')
    };

  public encryptPassword(password:string) {
    this.encPassword = sha256(password, this.secretKey).toString();
  }

  ngOnInit(): void {} 

  register(registerDaten) {
    //Überprüft alle Felde
    if(this.isEmpty(registerDaten.name[0], "Name") || 
       this.isEmpty(registerDaten.username[0], "Benutzername") || 
       this.isEmpty(registerDaten.address[0], "Adresse") || 
       this.isEmpty(registerDaten.email[0], "E-mail") || 
       this.isEmpty(registerDaten.passwort[0], "Passwort")) {
      return;
    }
    this.encryptPassword(registerDaten.passwort);
    //Überprüft ob Benutzername bereits existiert.
    this.authService.getUserByUsername(registerDaten.username).subscribe((user: User) => {
      if(user == null) {
        this.newUser = this.authService.register(registerDaten.name, registerDaten.username, registerDaten.address,registerDaten.email, this.encPassword);
        this.newUser.subscribe(data => {
          alert('Du hast dich erfolgreich registriert!')
          this.router.navigate(['/login']);
    })
      } else {
        alert('Benutzername existiert bereits ')
      }
    })
  }

  isEmpty(str, Message) : boolean{
    if(!str || str.length === 0){
      alert(Message + ' Darf nicht leer sein')
      return true;
    } else {
      return false;
    }
  }

}
