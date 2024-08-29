import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})


export class MyPayGaService {
  constructor(private http: HttpClient) {}

  myPayGaApi(phone: string, amount: string, pseudo: string, email: string, takeIdtarif: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.token}`
    });
    return this.http.post(`${environment.api}/my_pay_ga/subscribe_pricing`, {
      client_phone: phone,
      amount: amount.toString(),
      lastname: pseudo,
      rate_id: takeIdtarif,
      email: email
    }, { headers })
  }
}
