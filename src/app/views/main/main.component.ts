import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { delay, filter, Subscription } from 'rxjs';
import { DialogElementComponent } from 'src/app/shared/components/dialog-element/dialog-element.component';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ArticleType } from 'src/types/article.type';
import { ServiceType } from 'src/types/service.type copy';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  articles: ArticleType[] = [];
  bannerOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: false,
  };

  reviewsOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    autoHeight: true,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 2,
      },

      1040: {
        items: 3,
      },
    },
    nav: false,
  };

  services: ServiceType[] = [
    {
      id: '1',
      title: 'Создание сайтов',
      description:
        'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      image: 'services1.png',
      price: '7 500₽',
    },
    {
      id: '2',
      title: 'Продвижение',
      description:
        'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      image: 'services2.png',
      price: '3 500₽',
    },
    {
      id: '3',
      title: 'Реклама',
      description:
        'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      image: 'services3.png',
      price: '1 000₽',
    },
    {
      id: '4',
      title: 'Копирайтинг',
      description:
        'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      image: 'services4.png',
      price: '750₽',
    },
  ];
  reviewsStaticPath = '/assets/images/reviews/';
  reviews = [
    {
      image: 'reviews_1.png',
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      image: 'reviews_2.png',
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      image: 'reviews_3.png',
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
    {
      image: 'reviews_2.png',
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
  ];
  private fragmentSubscription!: Subscription;

  //@ViewChild('popup') popup!:TemplateRef<ElementRef>;
  constructor(
    private articleService: ArticleService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fragmentSubscription = this.route.fragment
      .pipe(
        filter((fragment) => !!fragment),
        delay(200), 
      )
      .subscribe((fragment) => {
        if (fragment) {
          this.scrollToElement(fragment);
        }
      });
    this.articleService.getPopularArticles().subscribe({
      next: (data: ArticleType[]) => {
        this.articles = data.slice(0, 4);
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message);
        } else {
          this._snackBar.open('Ошибка получения популярных статей');
        }
      },
    });
  }

  ngOnDestroy(): void {
    if (this.fragmentSubscription) {
      this.fragmentSubscription.unsubscribe();
    }
  }

  private scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  openDialog(service: string) {
    this.dialog.open(DialogElementComponent, {
      data: {
        service: service,
      },
    });
  }
}
