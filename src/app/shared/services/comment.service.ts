import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActionCommentType } from 'src/types/action-comment.type';
import { AllCommentType, CommentType } from 'src/types/comment.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  getComments(id: string, offset: number = 0): Observable<AllCommentType> {
    return this.http.get<AllCommentType>(
      environment.api + 'comments?offset=' + offset + '&article=' + id,
    );
  }

  //  getComments(id: string, offset: number = 0, delayMs: number = 3000): Observable<AllCommentType> {
  
  //   const url = `${environment.api}comments?offset=${offset}&article=${id}`;

  //   return timer(delayMs).pipe(
  //     switchMap(() => this.http.get<AllCommentType>(url))
  //   );
  // }

  applyAction(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(
      environment.api + 'comments/' + id + '/apply-action',
      { action },
    );
  }
  getActionForComment(
    id: string,
  ): Observable<ActionCommentType[] | DefaultResponseType> {
    return this.http.get<ActionCommentType[] | DefaultResponseType>(
      environment.api + 'comments/' + id + '/actions',
    );
  }

  addComments(id: string, text: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: text,
      article: id,
    });
  }
}
