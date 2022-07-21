import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './routes/welcome/welcome.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { DetailsComponent } from './routes/details/details.component';
import { ManageComponent } from './routes/manage/manage.component';


const routes: Routes = [
  { path: "", redirectTo :'/welcome', pathMatch: 'full'},
  { path: "welcome", component: WelcomeComponent},
  { path: "dashboard", component: DashboardComponent},
  { path: "details/:deviceId", component: DetailsComponent},
  { path: "manage", component: ManageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
