import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { MainComponent } from './views/main/main.component';
import { UserModule } from './views/user/user.module';
import { PrivacyPolicyComponent } from './views/privacy-policy/privacy-policy.component';
import { ArticleModule } from './views/article/article.module';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: MainComponent },
      { path: 'policy', component: PrivacyPolicyComponent },
      {
        path: '',
        loadChildren: () =>
          import('./views/user/user.module').then((m) => UserModule),
      },
       {
        path: '',
        loadChildren: () =>
          import('./views/article/article.module').then((m) => ArticleModule),
      },
    ],
  },
];
const routerOptions: ExtraOptions = {
  anchorScrolling: 'disabled', 
  scrollPositionRestoration: 'enabled', 
  scrollOffset: [0, 100], 
  onSameUrlNavigation: 'reload', 
};
@NgModule({
  imports: [
    RouterModule.forRoot(routes, routerOptions),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
