import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './routes/welcome/welcome.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceService } from './service/device.service';
import { FooterComponent } from './component/footer/footer.component';
import { HeaderComponent } from './component/header/header.component';
import { DetailsComponent } from './routes/details/details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageComponent } from './routes/manage/manage.component';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    DetailsComponent,
    ManageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DeviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
