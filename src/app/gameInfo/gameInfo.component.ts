import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Spiel } from '../models/Spiel';
import { SpielService } from '../services/spiel.service';
import { ExchangeService } from '../services/exchange.service';


@Component({
  selector: 'app-gameInfo',
  templateUrl: './gameInfo.component.html',
  styleUrls: ['./gameInfo.component.scss'],
})


export class GameInfoComponent implements OnInit {

  public spielName : string;

  spiele: Spiel;

  constructor(private spielService: SpielService, 
              private data : ExchangeService ) {}

  public ngOnInit() {

    //Spielnam wird über exchangeservice eingelesen
    this.data.currentMessage.subscribe(message => this.spielName = message)

    //Spiel-Informationen werden aus der Datenbank gelesen
    this.spielService.getSpielInformations(this.spielName).subscribe((spiele: Spiel) =>{
      this.spiele = spiele
    })
  }
}
