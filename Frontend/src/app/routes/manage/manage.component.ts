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
    this.inputSafeRiskThreshold = 10
    this.inputLowRiskThresholdMin = 3
    this.inputLowRiskThresholdMax = 10
    this.inputMediumRiskThresholdMin = 1
    this.inputMediumRiskThresholdMax = 3
    this.inputHighRiskThreshold = 1
  }

  inputSafeRiskThreshold!: number;
  inputLowRiskThresholdMin!: number;
  inputLowRiskThresholdMax!: number;
  inputMediumRiskThresholdMin!: number;
  inputMediumRiskThresholdMax!: number;
  inputHighRiskThreshold!: number;

  radioButton!: string;

  status!: string;

  ngOnInit(): void {
    this.getStatus();
  }

  onSubmit(){

    if( this.inputSafeRiskThreshold < this.inputLowRiskThresholdMax ||
        this.inputLowRiskThresholdMax < this.inputLowRiskThresholdMin ||
        this.inputLowRiskThresholdMin < this.inputMediumRiskThresholdMax ||
        this.inputMediumRiskThresholdMax < this.inputMediumRiskThresholdMin ||
        this.inputMediumRiskThresholdMin < this.inputHighRiskThreshold) {

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
      //console.log(response.state.reported.protocollo)
      this.status = response.state.reported.protocollo.split("-", 1);
      console.log(this.status);
      if (this.status == 'ble'){
        this.status = 'Bluetooth'
      } else {
        this.status = 'Wi-Fi'
      }
    })
  }
}
