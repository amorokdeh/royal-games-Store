import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Spiel } from '../models/Spiel'; 
import {Injectable } from '@angular/core';


@Injectable({
    providedIn:'root'
})

export class SpielService {

    constructor(private http: HttpClient) {}

    //Serveraddressen
    private addSpielUrl : string = 'http://localhost:8080/api/bibpost';
    private alleSpieleUrl : string = 'http://localhost:8080/api/alleSpiele';
    private bestimmtesSpielUrl: string = 'http://localhost:8080/api/BestimmesSpiel';
    private spielBibUrl: string = 'http://localhost:8080/api/spielBibliothek';
    private checkBibUrl: string = 'http://localhost:8080/api/checkBibliothek';


    httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})}

    // Dies ist die Funktion, die alle Spiele, die verfügbar sind anfordert. 
    // Anschließend wird ein Array von Typ Spiel, als Antwort erwartet.
    getAlleSpiel(): Observable<Spiel[]> {
        return this.http.get<Spiel[]>(this.alleSpieleUrl)
    }

    // Dies ist die Funktion, die die Variablen fuer das hinzufügen eines Spiels, von dem 
    // Frontend bekommt und diese als json Objekt mit der addSpielUrl an den Server sendet.
    // Anschließend wird etwas von Typ Spiel als Antwort erwartet.
    addSpiel(spielerID: String, spielID: String): Observable<Spiel> {
        return this.http.post<Spiel>(this.addSpielUrl,
            {
                "spielerID" : spielerID,
                "spielID" : spielID
            });
    }

    // Dies ist die Funktion, die die Variablen fuer das anfordern der info, des mitgegebenen Spiele-Namen's
    // vom Frontend bekommt und diese als String mit der bestimmtesSpielUrl an den Server sendet.
    // Anschließend wird ein Array von Typ Spiel als Antwort erwartet.
    getSpielInformations(name: String): Observable<Spiel>{
        return this.http.get<Spiel>(this.bestimmtesSpielUrl + "/" + name)
    }

    // Dies ist die Funktion, die alle Spiele die in der Tabelle Bibliothek verfügbar sind anfordert. 
    // Anschließend wird ein Array von Typ Spiel als Antwort erwartet.
    getBibliothek(spielerID: String): Observable<Spiel[]>{
        return this.http.get<Spiel[]>(this.spielBibUrl + "/" + spielerID);

    }

    // Dies ist die Funktion, die die Variablen fuer das filtern, nach den Spielen die der jewilige Nutzer
    // in seiner Bibliothek hat. Die noetigen Informationen werden als Parameter vom Frontend uebergeben
    // und jeweils als String mit der checkBibUrl an den Server sendet.
    // Anschließend wird ein Objekt von Typ Spiel als Antwort erwartet.
    checkBib(spielerID: String, spielID: String): Observable<Spiel> {
        return this.http.get<Spiel>(this.checkBibUrl + "/" + spielerID + "/" + spielID);
    }

}

