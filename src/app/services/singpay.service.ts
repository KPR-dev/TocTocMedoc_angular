import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class SingPayService {
  constructor(private http: HttpClient) { }

  genererChaineAleatoire(longueur: number): string {
    const caracteres: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let chaineAleatoire: string = '';

    for (let i: number = 0; i < longueur; i++) {
        const indiceAleatoire: number = Math.floor(Math.random() * caracteres.length);
        chaineAleatoire += caracteres.charAt(indiceAleatoire);
    }

    return chaineAleatoire;
  }

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
      reference: this.genererChaineAleatoire(10),
      redirect_success: url_success, // TODO: Ici mettre la redirection quand ça réussit
      redirect_error: url_error, // TODO: Ici mettre la redirection quand ça échoue
      amount: amount,
      isTransfer: false
    };
// "disbursement": "string",
    return this.http.post('https://gateway.singpay.ga/v1/ext', body, {headers});
  }


}
