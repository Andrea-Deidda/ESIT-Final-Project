import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from '../../service/device.service';
import { DeviceData } from '../../models/data.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private deviceService: DeviceService) { }

  dataEntry: DeviceData
  deviceId: string

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.params['deviceId'];
    this.fetchEntry();
  }

  fetchEntry(){
    this.deviceService.getDeviceById(this.deviceId).subscribe( (res: any ) => {
      this.dataEntry = res;
    })
  }

}
