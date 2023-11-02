import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FeedComponent } from './feed/feed.component';
import { DetectComponent } from './detect/detect.component'
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'detect', component: DetectComponent},

  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'detect', component: DetectComponent},
  { path: '**', redirectTo: 'feed' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
