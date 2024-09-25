import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { User } from '../models/User';
import { Friends } from '../models/Friends';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // Hier werden die Adressen, der funktionen in der Server.js gespeichert
  private registerUrl : string = 'http://localhost:8080/api/register';
  private userUrl : string = 'http://localhost:8080/api/userlist';
  private addFriendUrl : string = 'http://localhost:8080/api/addFriend';
  private searchFriendUrl : string = 'http://localhost:8080/api/searchFriend';
  private checkFriendUrl : string = 'http://localhost:8080/api/checkFriend';
  
  user: Observable<any>;


  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  // Dies ist die Funktion, die den Username und das Passwort von dem 
  // Frontend bekommt und diese mit der userUrl an den Server sendet.
  // Anschließend wir ein User Objekt als antwort erwartet.
  getUser(username: string, passwort: string): Observable<User>{
    this.user = this.http.get<User>(this.userUrl + "/" + username + "/" + passwort);
    return this.user;

  }
  // Dies ist die Funktion, die die Variablen fuer die Registrierung von dem
  // Frontend bekommt und diese als jason Objekt mit der registerUrl an den Server sendet.
  // Anschließend wir etwas von Typ any als antwort erwartet.
  register(name: string, username: string, address: string, email: string, passwort: string): Observable<any>{
    
    return this.http.post<any>(this.registerUrl, {
      "name" : name, 
      "username" : username, 
      "address" : address, 
      "email" : email,
      "passwort" : passwort
    });
  }

  // Diese Funktion bekommt den username, vom 
  // Frontend, welcher als Variable mit der userUrl an den Server gesendet wird.
  // Anschließend wir ein User Objekt, mit dem username den wir and den server geschickt
  //haben, als antwort erwartet.
  getUserByUsername(username: string): Observable<User>{
    this.user = this.http.get<User>(this.userUrl + "/" + username );
    return this.user;

  }

  // Dies ist die Funktion, die die Variablen fuer das Hinzufügen eines Freundes vom 
  // Frontend bekommt und diese als json Objekt mit der addFriendUrl an den Server sendet.
  // Anschließend wird etwas von Typ any als Antwort erwartet.
  addFriend(username1: String, username2: String): Observable<any>{
    return this.http.post<any>(this.addFriendUrl, {
      "username1" : username1,
      "username2" : username2,
    });
  }

  // Dies ist die Funktion, die die Variablen fuer das Anfordern, der Freundesliste, vom 
  // Frontend bekommt und diese als String mit der searchFriendUrl an den Server sendet.
  // Anschließend wird Array von Typ User als Antwort erwartet.
  getFriends(username: String) : Observable<User[]>{
    return this.http.get<User[]>(this.searchFriendUrl + "/" + username);
  }

  // Dies ist die Funktion, die die Variablen fuer das Ueberprüfen, der Freundesliste, vom 
  // Frontend bekommt und diese jeweils als String mit der checkFriendUrl an den Server sendet.
  // Anschließend wird Objekt von Typ Friends als Antwort erwartet.
  checkFreund(username: String, friendUsername: String): Observable<Friends> {
    return this.http.get<Friends>(this.checkFriendUrl + "/" + username + "/" + friendUsername);
  }

}
