import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class SingPayService {
  constructor(private http: HttpClient) { }

  // externalisation singpay
  externalisation(amount: any, url_success: any, url_error: any) {
    const headers = new HttpHeaders({
      'x-client-id': '4e950565-d2ab-4962-bcc8-538acbc5cb2d',
      'x-client-secret': 'eb17623132dd53833168cf022f7dab09b88a8930bdce191f761d39f16a548d3d',
      'x-wallet': '655cb86504e9de35cdfbca9f',
      'Content-Type': 'application/json'
    });

    const body = {
      portefeuille: "655cb86504e9de35cdfbca9f",
      // reference: "MF1600",
      reference: "PHARMACIES241",
      redirect_success: url_success, // TODO: Ici mettre la redirection quand ça réussit
      redirect_error: url_error, // TODO: Ici mettre la redirection quand ça réussit
      amount: amount,
      isTransfer: false
    };

    return this.http.post('https://gateway.singpay.ga/v1/ext', body, {headers});
  }


}

