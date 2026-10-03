import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { activeParamsType } from 'src/types/active-params.type';
import { AppliedFilterType } from 'src/types/applied-filter.type';
import { ArticleType } from 'src/types/article.type';
import { CategotyType } from 'src/types/categiry.type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  articles: ArticleType[] = [];
  categories: CategotyType[] = [];
  openFilter: boolean = false;
  activeParams: activeParamsType = {
    categories: [],
  };
  appliedFilters: AppliedFilterType[] = [];
  pages: number[] = [];

  constructor(
    private articleService: ArticleService,
    private _snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private activatedRout: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;

        this.activatedRout.queryParams
        .pipe(debounceTime(500))
        .subscribe((params) => {
          const activeParams: activeParamsType = {
            categories: [],
          };
          if (params.hasOwnProperty('categories')) {
            activeParams.categories = Array.isArray(params['categories'])
              ? params['categories']
              : [params['categories']];
          }
          if (params.hasOwnProperty('page')) {
            activeParams.page = +params['page'];
          }

          this.activeParams = activeParams;
          this.appliedFilters = [];
          this.activeParams.categories.forEach((url) => {
            const categiry = this.categories.find((item) => item.url === url);
            if (categiry) {
              this.appliedFilters.push({
                name: categiry?.name,
                urlParam: url,
              });
            }
          });

          this.articleService.getArticles(this.activeParams).subscribe({
            next: (data) => {
              this.pages = [];
              for (let i = 1; i <= data.pages; i++) {
                this.pages[i - 1] = i;
              }
              this.articles = data.items;
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
      },

      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message);
        } else {
          this._snackBar.open('Ошибка получения статей');
        }
      },
    });
  }

  toggle(event: Event): void {
    event.stopPropagation();
    this.openFilter = !this.openFilter;
  }
  clickFilter(event: Event) {
    event.stopPropagation();
  }

  close(): void {
    if (this.openFilter) {
      this.openFilter = false;
    }
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    debugger;
    this.activeParams.categories = this.activeParams.categories.filter(
      (item) => item !== appliedFilter.urlParam,
    );

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: { categories: this.activeParams.categories },
    });
  }

  @HostListener('document:click') onClickAnywhere(): void {
    this.close();
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams,
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams,
      });
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams,
      });
    }
  }
}
