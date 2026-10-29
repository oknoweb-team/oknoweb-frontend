import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubmissionEditPayload, TagCategoryInfo, TagInfo } from '../models/submit.model';
import {
  CommunityContent,
  CommunityContentPayload,
  GameJamPayload,
} from '../models/gamejams.model';
import { LoginInfo } from '../models/panel.model';

@Injectable({
  providedIn: 'root',
})
export class PanelService {
  constructor(
    private http: HttpClient
  ) { }

  private apiUrl: string = '/api/panel';

  login(username: string, password: string): Observable<LoginInfo> {
    return this.http.post<LoginInfo>(this.apiUrl + '/login', {
      "username": username,
      "password": password
    });
  }

  checkLogin(): Observable<Object> {
    return this.http.get(this.apiUrl + '/check_login');
  }

  getSubmissions(): Promise<Response> {
    return fetch(this.apiUrl + '/submissions');
  }

  rejectSubmission(submissionId: string) {
    return this.http.post(this.apiUrl + '/submissions/' + submissionId + '/reject', null);
  }

  pendSubmission(submissionId: string) {
    return this.http.post(this.apiUrl + '/submissions/' + submissionId + '/pend', null);
  }

  postReview(submissionId: string, review: object) {
    return this.http.post(this.apiUrl + '/submissions/' + submissionId + '/reviews', review);
  }

  deleteReview(submissionId: string, reviewId: number) {
    return this.http.post(
      this.apiUrl + '/submissions/' + submissionId + '/reviews/' + reviewId + '/delete',
      null,
    );
  }

  editSubmission(submissionId: string, payload: SubmissionEditPayload): Observable<Object> {
    return this.http.post(this.apiUrl + '/submissions/' + submissionId + '/edit', payload);
  }

  postTag(tag: TagInfo) {
    return this.http.post(this.apiUrl + '/tags', tag);
  }

  editTag(tag: string, editedTag: TagInfo) {
    return this.http.post(this.apiUrl + '/tags/' + tag + '/edit', editedTag);
  }

  deleteTag(tag: string) {
    return this.http.post(this.apiUrl + '/tags/' + tag + '/delete', null);
  }

  postCategory(category: TagCategoryInfo) {
    return this.http.post(this.apiUrl + '/tags/categories/', category);
  }

  editCategory(category: string, editedCategory: TagCategoryInfo) {
    return this.http.post(this.apiUrl + '/tags/categories/' + category + '/edit', editedCategory);
  }

  deleteCategory(category: string) {
    return this.http.post(this.apiUrl + '/tags/categories/' + category + '/delete', null);
  }

  postGameJam(gamejam: GameJamPayload) {
    return this.http.post(this.apiUrl + '/gamejams', gamejam);
  }

  postGameJamContent(id: string, contentIds: string[]) {
    return this.http.post(this.apiUrl + '/gamejams/' + id + '/content', contentIds);
  }

  postCommunityContent(content: CommunityContentPayload) {
    return this.http.post(this.apiUrl + '/community/content', content);
  }

  deleteCommunityContent(id: string) {
    return this.http.post(this.apiUrl + '/community/content/' + id + "/remove", null);
  }
}
