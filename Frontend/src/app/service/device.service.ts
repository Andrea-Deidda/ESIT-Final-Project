import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeviceData } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http : HttpClient) { }

  baseURL = 'http://localhost:3000/device/all'
  baseURL2 = 'http://localhost:3000/device?deviceId='
  

  getAllDevice(){
    return this.http.get<any>(this.baseURL)
  }

getDeviceById(deviceId){
  return this.http.get<any>(this.baseURL2 + deviceId)
}

}
