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

  p: number =1;
  protocollo: any;
  device: any;

  constructor(private deviceService: DeviceService, private router: Router) { }

  devices: DeviceData[] = [];
  deviceDataLoader=false;

  ngOnInit(): void {
    this.getAllDevice();
  }


  getAllDevice(){
    this.deviceService.getAllDevice().subscribe( (response : any) => {
      this.devices = response;
      console.log(this.devices);
      this.deviceDataLoader = true
    })
  }

  goToDetails(deviceId: string){
    console.log(deviceId)
    this.router.navigateByUrl('/details/' + deviceId)
  }

  key: string = 'distance';
  reverse: boolean = false;
  sort(key: string){
    this.key = key;
    this.reverse = !this.reverse;
  }

  SearchDeviceName(){
    if(this.protocollo ==""){
      this.ngOnInit();
    } else{
      this.devices = this.devices.filter(res =>{
        return res.protocollo.toLocaleLowerCase().match(this.protocollo.toLocaleLowerCase());
      })
    }
  }

}
