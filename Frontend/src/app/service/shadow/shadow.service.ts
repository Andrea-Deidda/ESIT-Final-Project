import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShadowService {

  constructor(private http: HttpClient) { }

  baseURL = 'http://localhost:3000/shadow'


  setProtocoll(protocoll: string){
    return this.http.post(this.baseURL + '/update/' + protocoll, {})

}

  getStatus(){
    return this.http.get<any>(this.baseURL);
  }

}