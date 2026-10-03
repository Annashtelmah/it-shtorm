import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { activeParamsType } from 'src/types/active-params.type';
import { ArticleType } from 'src/types/article.type';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private http: HttpClient) {}

  getPopularArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getRelatedArticles(url:string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/'+ url);
  }

  getArticles(
    params: activeParamsType,
  ): Observable<{ count: string; pages: number; items: ArticleType[] }> {
    return this.http.get<{
      count: string;
      pages: number;
      items: ArticleType[];
    }>(environment.api + 'articles', {
      params: params,
    });
  }

    getArticle(url:string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/'+ url);
  }
}
