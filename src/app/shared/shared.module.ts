import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './components/article-cart/article-cartd.component';
import { RouterModule } from '@angular/router';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { CategotyFilterComponent } from './components/categoty-filter/categoty-filter.component';
import { TransformTextPipe } from './pipes/transform-text.pipe';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { DialogElementComponent } from './components/dialog-element/dialog-element.component';

import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogConsultationComponent } from './components/dialog-consultation/dialog-consultation.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    ArticleCardComponent,
    ServiceCardComponent,
    CategotyFilterComponent,
    TransformTextPipe,
    CommentCardComponent,
    DialogElementComponent,
    DialogConsultationComponent,
    LoaderComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule,FormsModule, MatDialogModule, RouterModule],
  exports: [
    ArticleCardComponent,
    ServiceCardComponent,
    CategotyFilterComponent,
    TransformTextPipe,
    CommentCardComponent,
    DialogElementComponent,
    DialogConsultationComponent,
    LoaderComponent
  ],
})
export class SharedModule {}
