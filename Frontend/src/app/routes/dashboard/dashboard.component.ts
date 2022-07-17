import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceService } from '../../service/device.service';
import { DeviceData } from '../../models/data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private deviceService: DeviceService, private router: Router) { }

  devices: DeviceData;


  ngOnInit(): void {
    this.getAllDevice();
    //this.getProva();
  }



  getAllDevice(){
    this.deviceService.getAllDevice().subscribe( (response : any) => {
      this.devices = response;
      console.log(this.devices);
    })
  }

  
  getProva(){
     this.deviceService.getDeviceProva().subscribe(( response : any) =>{
      this.devices=response;
      //console.log(this.devices.payload);
         })
   }

  goToDetails(id){
    this.router.navigateByUrl('/details/' + id)
  }

}
