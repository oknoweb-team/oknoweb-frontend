import { Observable } from "rxjs"
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommunityContent } from "../models/gamejams.model";

@Injectable({
  providedIn: 'root'
})
export class CommunityContentService {
  constructor(private http: HttpClient) { }

  apiUrl: string = "/api";

  getCommunityContent(): Observable<CommunityContent[]> {
    return this.http.get<CommunityContent[]>(this.apiUrl + "/community/content");
  }
}
