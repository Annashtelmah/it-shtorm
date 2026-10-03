import { Component, Input, OnInit } from '@angular/core';
import { CommentType } from 'src/types/comment.type';
import { CommentService } from '../../services/comment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefaultResponseType } from 'src/types/default-response.type';
import { ActionCommentType } from 'src/types/action-comment.type';

@Component({
  selector: 'comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit {
  @Input() comment!: CommentType;
  commentWithoutUserAction: { like: number; dislike: number } = {
    like: 0,
    dislike: 0,
  };
  userAction: { like: boolean; dislike: boolean } = {
    like: false,
    dislike: false,
  };
  action: string = '';
  constructor(
    private commentService: CommentService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.commentWithoutUserAction = {
      like: this.comment.likesCount,
      dislike: this.comment.dislikesCount,
    };
    this.commentService.getActionForComment(this.comment.id).subscribe({
      next: (data) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        if ((data as ActionCommentType[]).length > 0) {
          this.action = (data as ActionCommentType[])[0].action;
          if ((data as ActionCommentType[])[0].action === 'like') {
            this.userAction.like = true;
            this.commentWithoutUserAction.like--;
          } else if ((data as ActionCommentType[])[0].action === 'dislike') {
            this.userAction.dislike = true;
            this.commentWithoutUserAction.dislike--;
          }
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message);
        } else {
          this._snackBar.open('Ошибка получения действия');
        }
      },
    });
  }

  applyActionLike() {
    this.comment.likesCount = this.commentWithoutUserAction.like;
    this.comment.dislikesCount = this.commentWithoutUserAction.dislike;
    this.commentService.applyAction(this.comment.id, 'like').subscribe({
      next: (data) => {
        if (!data.error) {
          this._snackBar.open('Ваш голос учтен');
          this.userAction.like = !this.userAction.like;
          if (this.userAction.like) {
            this.comment.likesCount++;
          }
          this.userAction.dislike = false;
        } else {
          this._snackBar.open(data.message);
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message);
        } else {
          this._snackBar.open('Ошибка отправки действия');
        }
      },
    });
  }

  applyActionDislike() {
    this.comment.likesCount = this.commentWithoutUserAction.like;
    this.comment.dislikesCount = this.commentWithoutUserAction.dislike;
    this.commentService.applyAction(this.comment.id, 'dislike').subscribe({
      next: (data) => {
        if (!data.error) {
          this._snackBar.open('Ваш голос учтен');
          this.userAction.like = false;
          this.userAction.dislike = !this.userAction.dislike;
          if (this.userAction.dislike) {
            this.comment.dislikesCount++;
          }
        } else {
          this._snackBar.open(data.message);
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message);
        } else {
          this._snackBar.open('Ошибка отправки действия');
        }
      },
    });
  }

  applyActionViolate() {
    this.commentService.applyAction(this.comment.id, 'violate').subscribe({
      next: (data) => {
        if (!data.error) {
          this._snackBar.open('Жалоба отправлена');
        } else {
          this._snackBar.open(data.message);
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message);
        } else {
          this._snackBar.open('Ошибка отправки жалобы');
        }
      },
    });
  }
}
