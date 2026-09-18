import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubmissionEditPayload, TagCategoryInfo, TagInfo } from '../models/submit.model';
import {
  CommunityContent,
  CommunityContentPayload,
  GameJamPayload,
} from '../models/gamejams.model';

@Injectable({
  providedIn: 'root',
})
export class PanelService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = '/api/panel';

  private authHeaders(username: string, password: string): Record<string, string> {
    return { Authorization: 'Basic ' + btoa(username + ':' + password) };
  }

  private authHeadersFromStorage(): Record<string, string> {
    const username = localStorage.getItem('admin_username') || 'none';
    const password = localStorage.getItem('admin_password') || 'none';

    return this.authHeaders(username, password);
  }

  validateLogin(): Observable<Object> {
    return this.http.get(this.apiUrl + '/login', { headers: this.authHeadersFromStorage() });
  }

  validateUser(username: string, password: string): Observable<Object> {
    return this.http.get(this.apiUrl + '/login', { headers: this.authHeaders(username, password) });
  }

  getSubmissions(): Promise<Response> {
    return fetch(this.apiUrl + '/submissions', { headers: this.authHeadersFromStorage() });
  }

  rejectSubmission(submissionId: string) {
    return this.http.post(this.apiUrl + '/submissions/' + submissionId + '/reject', null, {
      headers: this.authHeadersFromStorage(),
    });
  }

  pendSubmission(submissionId: string) {
    return this.http.post(this.apiUrl + '/submissions/' + submissionId + '/pend', null, {
      headers: this.authHeadersFromStorage(),
    });
  }

  postReview(submissionId: string, review: object) {
    return this.http.post(this.apiUrl + '/submissions/' + submissionId + '/reviews', review, {
      headers: this.authHeadersFromStorage(),
    });
  }

  deleteReview(submissionId: string, reviewId: number) {
    return this.http.post(
      this.apiUrl + '/submissions/' + submissionId + '/reviews/' + reviewId + '/delete',
      null,
      { headers: this.authHeadersFromStorage() },
    );
  }

  editSubmission(submissionId: string, payload: SubmissionEditPayload): Observable<Object> {
    return this.http.post(this.apiUrl + '/submissions/' + submissionId + '/edit', payload, {
      headers: this.authHeadersFromStorage(),
    });
  }

  postTag(tag: TagInfo) {
    return this.http.post(this.apiUrl + '/tags', tag, { headers: this.authHeadersFromStorage() });
  }

  editTag(tag: string, editedTag: TagInfo) {
    return this.http.post(this.apiUrl + '/tags/' + tag + '/edit', editedTag, {
      headers: this.authHeadersFromStorage(),
    });
  }

  deleteTag(tag: string) {
    return this.http.post(this.apiUrl + '/tags/' + tag + '/delete', null, {
      headers: this.authHeadersFromStorage(),
    });
  }

  postCategory(category: TagCategoryInfo) {
    return this.http.post(this.apiUrl + '/tags/categories/', category, {
      headers: this.authHeadersFromStorage(),
    });
  }

  editCategory(category: string, editedCategory: TagCategoryInfo) {
    return this.http.post(this.apiUrl + '/tags/categories/' + category + '/edit', editedCategory, {
      headers: this.authHeadersFromStorage(),
    });
  }

  deleteCategory(category: string) {
    return this.http.post(this.apiUrl + '/tags/categories/' + category + '/delete', null, {
      headers: this.authHeadersFromStorage(),
    });
  }

  postGameJam(gamejam: GameJamPayload) {
    return this.http.post(this.apiUrl + '/gamejams', gamejam, {
      headers: this.authHeadersFromStorage(),
    });
  }

  postGameJamContent(id: string, contentIds: string[]) {
    return this.http.post(this.apiUrl + '/gamejams/' + id + '/content', contentIds, {
      headers: this.authHeadersFromStorage(),
    });
  }

  postCommunityContent(content: CommunityContentPayload) {
    return this.http.post(this.apiUrl + '/community/content', content, {
      headers: this.authHeadersFromStorage(),
    });
  }

  deleteCommunityContent(id: string) {
    return this.http.post(this.apiUrl + '/community/content/'+id+"/remove", null, {
      headers: this.authHeadersFromStorage(),
    });
  }
}
