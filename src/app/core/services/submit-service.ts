import { Observable } from "rxjs"
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SubmissionReview, SubmitInfo, SubmitPayload, TagCategoryInfo, TagInfo } from "../models/submit.model";

@Injectable({
  providedIn: 'root'
})
export class SubmitService {
  constructor(private http: HttpClient) {}

  apiUrl: string = "/api";

  submitNew(payload: SubmitPayload): Observable<SubmitInfo>
  {
    return this.http.post<SubmitInfo>(this.apiUrl + '/submit', payload);
  }

  getReviews(id: string): Observable<SubmissionReview[]>
  {
    return this.http.get<SubmissionReview[]>(this.apiUrl+"/submissions/"+id+"/reviews");
  }

  getSubmissions(): Observable<SubmitInfo[]>
  {
    return this.http.get<SubmitInfo[]>(this.apiUrl + "/submissions");
  }

  getSubmissionsCount(): Observable<number>
  {
    return this.http.get<number>(this.apiUrl + "/submissions/verified/count");
  }

  getSubmission(id: string): Observable<SubmitInfo>
  {
    return this.http.get<SubmitInfo>(this.apiUrl + "/submissions/" + id);
  }

  getSubmissionHorizontalCover(id: string): Observable<Blob>
  {
    return this.http.get(this.apiUrl + "/submissions/" + id + "/cover_horizontal", { responseType: 'blob' } );
  }

  getSubmissionVerticalCover(id: string): Observable<Blob>
  {
    return this.http.get(this.apiUrl + "/submissions/" + id + "/cover_vertical", { responseType: 'blob' } );
  }

  getCategories(): Observable<TagCategoryInfo[]>
  {
    return this.http.get<TagCategoryInfo[]>(this.apiUrl + "/tags/categories");
  }

  getCategoriesNotPanelOnly(): Observable<TagCategoryInfo[]>
  {
    return this.http.get<TagCategoryInfo[]>(this.apiUrl + "/tags/categories/notPanelOnly");
  }

  getTags(): Observable<TagInfo[]>
  {
    return this.http.get<TagInfo[]>(this.apiUrl + "/tags");
  }

  getTagsInCategory(category:string): Observable<string[]>
  {
    return this.http.get<string[]>(this.apiUrl + "/tags/categories/" + category)
  }
}
