import { Component, OnInit } from '@angular/core';
import { User } from '../models/User'
import { AuthService } from '../services/auth.service';
import { ExchangeService} from '../services/exchange.service';
import { SpielService } from '../services/spiel.service';
import { Spiel } from '../models/Spiel';

@Component({
  selector: 'app-bib',
  templateUrl: './bib.component.html',
  styleUrls: ['./bib.component.scss']
})
export class BibComponent implements OnInit {

  user: User;
  spiele: Spiel[];
  username : String;
  loggedIn: string = 'false';

  constructor(private authService: AuthService,
              private data: ExchangeService,
              private spielService: SpielService) { }


  ngOnInit(): void {
    this.data.currentMessageSwitch.subscribe(message => this.loggedIn = message)
    if(this.loggedIn === 'true') {
      //Der eingeloggte Nutzer wird geladen
      this.user = this.data.getUser()
      this.username = this.user.username;
      //Alle Spiele in der Bibliothek vom Nutzer werden vom Server geladen
      this.spielService.getBibliothek(this.user.spielerID).subscribe((spiele: Spiel[]) => {
        this.spiele = spiele;
      });
    }
  }

  userEingelogt(): boolean {
    this.ngOnInit()
    if(this.loggedIn === 'true') {
      return true;
    } else {
      return false;  
    }
  }
}
