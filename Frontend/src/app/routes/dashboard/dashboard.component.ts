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
  }



  getAllDevice(){
    this.deviceService.getAllDevice().subscribe( (response : any) => {
      this.devices = response;
      console.log(this.devices);
    })
  }

  
  goToDetails(deviceId){
    console.log(deviceId)
    this.router.navigateByUrl('/details/' + deviceId)
  }

}
