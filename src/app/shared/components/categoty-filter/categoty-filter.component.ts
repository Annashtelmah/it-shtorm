import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { activeParamsType } from 'src/types/active-params.type';
import { CategotyType } from 'src/types/categiry.type';

@Component({
  selector: 'categoty-filter',
  templateUrl: './categoty-filter.component.html',
  styleUrls: ['./categoty-filter.component.scss'],
})
export class CategotyFilterComponent implements OnInit {
  @Input() category: CategotyType | null = null;
  check = false;
  activeParams: activeParamsType = {
    categories: [],
  };
  constructor(
    private router: Router,
    private activatedRout: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRout.queryParams.subscribe((params) => {
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
      if (this.category?.url) {
        if (this.activeParams.categories.includes(this.category?.url)) {
          this.check = true;
        } else this.check = false;
      }
    });
  }

  updateFilterParam(url: string) {
    this.check = !this.check;
    if (
      this.activeParams.categories &&
      this.activeParams.categories.length > 0
    ) {
      const existingTypeParams = this.activeParams.categories.find(
        (item) => item === url,
      );
      if (existingTypeParams && !this.check) {
        this.activeParams.categories = this.activeParams.categories.filter(
          (item) => item !== url,
        );
      } else {
        if (!existingTypeParams && this.check) {
          this.activeParams.categories = [...this.activeParams.categories, url];
          // this.activeParams.categories.push(url);
        }
      }
    } else if (this.check) {
      this.activeParams.categories = [url];
    }
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: { categories: this.activeParams.categories },
    });
  }
}
