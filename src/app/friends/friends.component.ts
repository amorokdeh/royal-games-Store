import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthGuard } from '../auth.guard';
import { Friends } from '../models/Friends';
import { User } from '../models/User';
import { AuthService } from '../services/auth.service';
import { ExchangeService } from '../services/exchange.service';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit  {
 
  searchUser:String;
  loggedIn:string = 'false';
  user: User;
  friend: Observable<User>;
  friends: User[];
  checkFriend:Observable<Friends>;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private data : ExchangeService) {}
    
  public ngOnInit() {
    this.data.currentMessageSwitch.subscribe(message => this.loggedIn = message);
    this.userEingelogt();
    setInterval(() => {         
      if(this.loggedIn === 'true') {
        this.authService.getFriends(this.user.username).subscribe((friends: User[]) => {
          this.friends = friends;
        });
      }
    }, 500);
  }

  userEingelogt(): boolean {
    if(this.loggedIn === 'true') {
      this.user = this.data.getUser()
      return true;
    }
    return false;
  }
  addFriend(loginData) {
    //Get-Methode um entsprechenden User aus der Datenbank zu ziehen
    this.authService.getUserByUsername(loginData).subscribe((newFriend: User) => {

      if(newFriend != null) {

        if(newFriend.username == this.user.username){
          alert("Du kannst dich nicht selbst hinzufügen!")
          return;
        }
        this.checkFriend = this.authService.checkFreund(this.user.username, newFriend.username);
        this.checkFriend.subscribe((friend: Friends) =>{
          if(friend != null){
            
            alert("Nicht geklappt. Freund kann nur einmal hinzufügt werden!")
            
          } else {
            
            this.friend = this.authService.addFriend(newFriend.username, this.user.username);
                this.friend.subscribe(data => {
                  //erfolgreich
                  alert("Freund erfolgreich hinzufügt!")
                  window.location.reload();
                })
          }
        })
      } else {
      //nicht erfolgreich war, wird eine kurze Meldung ausgegeben
        alert("Spieler nicht gefunden!")
      }
    });
  }

}
