import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { environment } from 'src/environments/environment';
import { ArticleType } from 'src/types/article.type';
import {  CommentType } from 'src/types/comment.type';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
})
export class ArticleDetailComponent implements OnInit {
  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  serverStatikPath: string = environment.serverStatikPath;
  isLogged: boolean = false;
  showedComments: CommentType[] = [];
  showMoreComments: CommentType[] = [];
  offset: number = 3;
  textComment: string = '';

  isLoading = false;

  constructor(
    private articleServise: ArticleService,
    private _snackBar: MatSnackBar,
    private activatedrout: ActivatedRoute,
    private authService: AuthService,
    private commentService: CommentService,
  
  ) {}

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    this.activatedrout.params.subscribe((params) => {
      this.articleServise.getArticle(params['url']).subscribe({
        next: (data) => {
          this.article = data;
          this.showedComments = this.article.comments;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка получения статьи');
          }
        },
      });

      this.articleServise.getRelatedArticles(params['url']).subscribe({
        next: (data) => {
          this.relatedArticles = data;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка получения статей');
          }
        },
      });
    });
  }

  showMore() {
    this.isLoading = true;
    this.commentService
      .getComments(this.article.id, this.offset)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (data) => {
          this.showMoreComments = data.comments;
          this.offset = this.offset + this.showMoreComments.length;
          this.showedComments.push(...this.showMoreComments);
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка получения комментариев');
          }
        },
      });
  }

  addComment() {
    if (this.textComment === '') {
      this._snackBar.open(
        'Комменарий не отправлен. введите текст комментария.',
      );
    } else {
      this.commentService
        .addComments(this.article.id, this.textComment)
        .subscribe({
          next: (data) => {
            if (!data.error) {
              this.commentService.getComments(this.article.id, 0).subscribe({
                next: (data) => {
                  this.textComment = '';
                  let newComment = data.comments[0];
                  this.offset = this.offset + 1;
                  this.offset = this.offset + this.showMoreComments.length;
                  this.showedComments = [newComment, ...this.showedComments];
                },
                error: (errorResponse: HttpErrorResponse) => {
                  if (errorResponse.error && errorResponse.error.message) {
                    this._snackBar.open(errorResponse.error.message);
                  } else {
                    this._snackBar.open('Ошибка получения комментариев');
                  }
                },
              });
            }
            this._snackBar.open(data.message);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка отправки комментария');
            }
          },
        });
    }
  }
}
