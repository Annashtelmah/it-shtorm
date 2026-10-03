import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { BlogComponent } from './blog/blog.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BlogComponent,
    ArticleDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ArticleRoutingModule
  ]
})
export class ArticleModule { }
