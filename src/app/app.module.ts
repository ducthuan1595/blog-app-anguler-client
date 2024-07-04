import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SystemComponent } from './system/system.component';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './system/dashboard/dashboard.component';
import { BlogComponent } from './blog/blog.component';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './services/auth.service';
import { ManageComponent } from './system/manage/manage.component';
import { AuthInterceptor } from './auth.interceptor.spec';
import { ManageBlogComponent } from './manage-blog/manage-blog.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { RelavePostComponent } from './post-detail/relave-post/relave-post.component';
import { AccountComponent } from './account/account.component';
import { MyBlogsComponent } from './account/my-blogs/my-blogs.component';
import { ViewComponent } from './system/view/view.component';
import { PendingInterceptor } from './pedding.interceptor.spec';
import { LoadingSpinnerComponent } from './shares/loadingSpinner.component';


@NgModule({
  declarations: [
    AppComponent,
    SystemComponent,
    AuthComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    DashboardComponent,
    BlogComponent,
    ManageComponent,
    ManageBlogComponent,
    PostDetailComponent,
    RelavePostComponent,
    AccountComponent,
    MyBlogsComponent,
    ViewComponent,
    LoadingSpinnerComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [
    AuthGuard,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: PendingInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: LoadingSpinnerComponent, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
