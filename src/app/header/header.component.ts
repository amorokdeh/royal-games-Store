import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthGuard } from '../auth.guard';
import { ExchangeService } from '../services/exchange.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../models/User';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: User;
  name: String;
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  constructor(private auth: AuthGuard,
              private data: ExchangeService,
              private router: Router,
              private authService: AuthService
              ) {}

  private permission;
  buttonInOut:string = "Login";
  loggedIn: string = 'false';

  //Methode die überprüft, ob ein Nutzer eingeloggt ist. Falls nicht, wird ein Alert ausgerufen
  getPermission(){
    this.permission = this.auth.canActivate(); 
    if (this.permission === 'false') {
      alert("Du musst dich zuerst anmelden, um auf diesen Bereich zugreifen zu können")
    }
  }

  logout() {
    this.auth.changePermissionFalse();
    this.data.switchFunctions
    this.loggedIn = 'false';
    this.buttonInOut = 'Login';
    this.data.setUser(null);
    window.localStorage.removeItem('user');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

  userEingelogt(): boolean {
    if(this.loggedIn === 'true') {
      this.user = this.data.getUser()
      this.name = this.user.name;
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.data.currentMessageLogin.subscribe(message => this.buttonInOut = message)
    this.data.currentMessageSwitch.subscribe(message => this.loggedIn = message)
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

}
