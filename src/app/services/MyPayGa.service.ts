import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})


export class MyPayGaService {
  constructor(private http: HttpClient) {}

  myPayGaApi(phone: string, amount: string, pseudo: string, email: string, token: number, takeIdtarif: number){
    return this.http.post(`${environment.api}/my_pay_ga/subscribe_pricing`, {
      client_phone: phone,
      amount: amount.toString(),
      lastname: pseudo,
      email: email,
      token: token,
      takeId: takeIdtarif,
    })
  }
}
