import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { SystemComponent } from './system/system.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './system/dashboard/dashboard.component';
import { BlogComponent } from './blog/blog.component';
import { AuthGuard } from './auth-guard.service';
import { ManageComponent } from './system/manage/manage.component';
import { ManageBlogComponent } from './manage-blog/manage-blog.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { AccountComponent } from './account/account.component';
import { ViewComponent } from './system/view/view.component';
import { VefiryOtpComponent } from './vefiry-otp/vefiry-otp.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'blog',
    component: BlogComponent,
    children: [
      {
        path: ':categoryId',
        component: BlogComponent
      },
    ]
  },
  {
    path: "blog-detail/:id/:categoryId",
    component: PostDetailComponent
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {

      path: 'verify-otp/:email/:username',
      component: VefiryOtpComponent

  },
  {
    path: 'manage-blog',
    component: ManageBlogComponent,
  },
  {
    path: 'manage-blog/:postId',
    component: ManageBlogComponent,
  },
  {
    path: "account",
    component: AccountComponent,
  },
  {
    path: "notification",
    component: AccountComponent,
  },
  {
    path: 'system',
    component: SystemComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'view/:postId',
        component: ViewComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage',
        component: ManageComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
