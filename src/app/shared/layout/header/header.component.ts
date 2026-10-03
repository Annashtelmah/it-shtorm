import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from '../../services/user.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { UserInfoType } from 'src/types/user-info.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userName: string = 'Александр';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {
    this.isLogged = authService.getIsLoggedIn();
    this.requestUserInfo();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      this.requestUserInfo();
    });
  }

  requestUserInfo() {
    if (this.isLogged) {
      this.userService.getUserInfo().subscribe({
        next: (data: DefaultResponseType | UserInfoType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            this._snackBar.open((data as DefaultResponseType).message);
            throw new Error((data as DefaultResponseType).message);
          }

          this.userName = (data as UserInfoType).name;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка запроса информации о пользователе');
          }
        },
      });
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.doLogout();
      },
      error: () => {
        this.doLogout();
      },
    });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
