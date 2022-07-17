import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './routes/welcome/welcome.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';


const routes: Routes = [
  { path: "", redirectTo :'/welcome', pathMatch: 'full'},
  { path: "welcome", component: WelcomeComponent},
  { path: "dashboard", component: DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
