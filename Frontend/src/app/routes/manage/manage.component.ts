import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  constructor() { }

  inputFirstThreshold: number; //si deve fare per tutti e 6 

  inputFourthThreshold: number;

  radioButton1: string;
  radioButton2: string;

  ngOnInit(): void {

  }

 
  onSubmit(){
    if(this.inputFirstThreshold != undefined)
      console.log(this.inputFirstThreshold);
    if(this.radioButton1 != undefined)
      console.log(this.radioButton1);
    if(this.radioButton2 != undefined)  
      console.log(this.radioButton2);
    }
    
  }
