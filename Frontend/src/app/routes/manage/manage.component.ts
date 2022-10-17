import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ShadowService } from '../../service/shadow/shadow.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  constructor(private shadowService: ShadowService, private router: Router) {
  }

  inputSafeRiskThreshold!: string;
  inputLowRiskThresholdMin!: string;
  inputLowRiskThresholdMax!: string;
  inputMediumRiskThresholdMin!: string;
  inputMediumRiskThresholdMax!: string;
  inputHighRiskThreshold!: string;

  radioButton!: string;

  status!: string;

  ngOnInit(): void {
    this.getStatus();
  }

  onSubmit(){
    console.log(this.inputLowRiskThresholdMax)
    if( parseInt(this.inputSafeRiskThreshold) < parseInt(this.inputLowRiskThresholdMax) ||
      parseInt(this.inputLowRiskThresholdMax) < parseInt(this.inputLowRiskThresholdMin) ||
        parseInt(this.inputLowRiskThresholdMin) < parseInt(this.inputMediumRiskThresholdMax) ||
          parseInt(this.inputMediumRiskThresholdMax) < parseInt(this.inputMediumRiskThresholdMin) ||
            parseInt(this.inputMediumRiskThresholdMin) < parseInt(this.inputHighRiskThreshold)) {

      console.log(typeof this.inputSafeRiskThreshold);
      window.alert("Invalid threshold values!");

    } else {
      if (this.radioButton == undefined) {
        window.alert("Select a communication protocol!");

      } else {

        console.log(this.radioButton);
        console.log("sicuro oltre " + this.inputSafeRiskThreshold + " metri");
        console.log("rischio basso tra " + this.inputLowRiskThresholdMin + " e " + this.inputLowRiskThresholdMax + " metri");
        console.log("rischio medio tra " + this.inputMediumRiskThresholdMin + " e " + this.inputMediumRiskThresholdMax + " metri");
        console.log("rischio alto entro " + this.inputHighRiskThreshold + " metri");

        this.shadowService.setProtocoll(this.radioButton + '-' + this.inputSafeRiskThreshold +
          '-' + this.inputLowRiskThresholdMin + '-' + this.inputLowRiskThresholdMax + '-' +
          this.inputMediumRiskThresholdMin + '-' + this.inputMediumRiskThresholdMax + '-' + this.inputHighRiskThreshold)
          .subscribe(response => {
            console.log(response);
          }), (err: any) => {
          console.log(err);
        }

        window.alert("Options submitted!"); //messaggio che informa l'utente dell'avenuto cambiamento
      }
    }
  }

  reloadPage() {
    window.location.reload();
  }

  getStatus(){
    this.shadowService.getStatus().subscribe(( response : any) => {
      console.log(response.state.reported.protocollo)
      this.status = response.state.reported.protocollo.split("-", 1);
      this.inputSafeRiskThreshold = response.state.reported.protocollo.split("-")[1];
      this.inputLowRiskThresholdMin = response.state.reported.protocollo.split("-")[2];
      this.inputLowRiskThresholdMax = response.state.reported.protocollo.split("-")[3];
      this.inputMediumRiskThresholdMin = response.state.reported.protocollo.split("-")[4];
      this.inputMediumRiskThresholdMax = response.state.reported.protocollo.split("-")[5];
      this.inputHighRiskThreshold = response.state.reported.protocollo.split("-")[6];

      response.state.reported.protocollo = this.status + "-" + this.inputSafeRiskThreshold + "-" + this.inputLowRiskThresholdMin + "-" +
        this.inputLowRiskThresholdMax + "-" + this.inputMediumRiskThresholdMin + "-" + this.inputMediumRiskThresholdMax + "-"
        + this.inputHighRiskThreshold;

      console.log(this.status);
      console.log(this.inputSafeRiskThreshold);
      console.log(this.inputLowRiskThresholdMin);
      console.log(this.inputLowRiskThresholdMax);
      console.log(this.inputMediumRiskThresholdMin);
      console.log(this.inputMediumRiskThresholdMax);
      console.log(this.inputHighRiskThreshold);
      if (this.status == 'ble'){
        this.status = 'Bluetooth'
      } else {
        this.status = 'Wi-Fi'
      }
    })
  }
}
