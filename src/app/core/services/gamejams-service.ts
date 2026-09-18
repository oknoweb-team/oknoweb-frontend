import { Observable } from "rxjs"
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GameJam } from "../models/gamejams.model";

@Injectable({
  providedIn: 'root'
})
export class GameJamsService {
  constructor(private http: HttpClient) { }

  apiUrl: string = "/api";

  getGameJams(): Observable<GameJam[]> {
    return this.http.get<GameJam[]>(this.apiUrl + "/gamejams");
  }
}
