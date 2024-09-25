import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Spiel } from '../models/Spiel';
import { SpielService } from '../services/spiel.service';
import { Observable } from 'rxjs';
import { ExchangeService} from '../services/exchange.service';
import { User } from '../models/User';

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})

export class ShopComponent implements OnInit {


  images = []


  addSpielForm;
  spiele: Spiel[];
  newSpiel: Observable<Spiel>;
  user: User;
  loggedIn:string = 'false';
  searchedGame:String;


  constructor(private spielService: SpielService, 
              private formBuilder: FormBuilder,
              private data : ExchangeService) {
      this.addSpielForm = this.formBuilder.group({
        name: ''
      });
  }

  userEingelogt(): boolean {
    if(this.loggedIn === 'true') {
      this.user = this.data.getUser()
      return true;
    }
    return false;
  }

  public ngOnInit() {
    this.spielService.getAlleSpiel().subscribe((spiele: Spiel[]) =>{
      this.spiele = spiele
      for(let sp of spiele){
        let link = '../../assets/' + sp.name + '.jpg';
        this.images.push({
          imageSrc: link,
          imageAlt: 'spiel'
        });
      }
    })

    this.data.currentMessageSwitch.subscribe(message => this.loggedIn = message);
  }

  addSpiel(spielDaten) {
    this.userEingelogt()
    this.spielService.checkBib(this.user.spielerID, spielDaten).subscribe((spiele: Spiel) =>{
      if(spiele != null) {
        alert("Nicht geklappt. Das Spiel darf nur einmal gekauft werden");
      } else {
        this.newSpiel = this.spielService.addSpiel(this.user.spielerID, spielDaten);
        this.newSpiel.subscribe(data => {
        alert("Das Spiel wurde erfolgreich gekauft")
      }) 
      }
    });
    
  }

  newMessage(spiel){
    this.data.changeMessage(spiel)
  }

}
