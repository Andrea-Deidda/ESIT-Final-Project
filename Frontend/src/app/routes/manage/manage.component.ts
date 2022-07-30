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

  constructor(private shadowService: ShadowService, private router: Router) { }

  
  inputFirstThreshold!: number; //si deve fare per tutti e 6 
  inputSecondThresholdMin!: number;
  inputSecondThresholdMax!: number;
  inputThirdThresholdMin!: number;
  inputThirdThresholdMax!: number;
  inputFourthThreshold!: number;

  radioButton!: string;
  
  status!: string;

  ngOnInit(): void {
    this.getStatus();
  }

  onSubmit(){
    if(this.inputFirstThreshold != undefined) 
    {
      console.log("sicuro > " + this.inputFirstThreshold);
      console.log("rischio basso (< " + this.inputSecondThresholdMin + " && > " + this.inputSecondThresholdMax + ")" );
      console.log("rischio medio (< " + this.inputThirdThresholdMin + " && > " + this.inputThirdThresholdMax + ")" );
      console.log("alto < " + this.inputFourthThreshold);
    }

    if(this.radioButton != undefined)
      console.log(this.radioButton);
      this.shadowService.setProtocoll(this.radioButton).subscribe(response => {
        console.log(response);
      }), (err: any) => {
          console.log(err);
    }
    window.alert("Options submitted"); //messaggio che informa l'utente dell'avenuto cambiamento
  }

  reloadPage() {
    window.location.reload();
  }

  getStatus(){
    this.shadowService.getStatus().subscribe(( response : any) => {
      //console.log(response.state.reported.protocollo)
      this.status = response.state.reported.protocollo;
      console.log(this.status);
      if (this.status == 'ble'){
        this.status = 'Bluetooth'
      } else {
        this.status = 'Wi-Fi'
      }
    })
  }
}
