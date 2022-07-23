import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { WelcomeComponent } from './routes/welcome/welcome.component';
import { DetailsComponent } from './routes/details/details.component';
import { ManageComponent } from './routes/manage/manage.component';

const routes: Routes = [
  { path: "", redirectTo :'/welcome', pathMatch: 'full'},
  { path: "dashboard", component: DashboardComponent},
  { path: "welcome", component: WelcomeComponent},
  { path: "details/:deviceId", component: DetailsComponent},
  { path: "manage", component: ManageComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
