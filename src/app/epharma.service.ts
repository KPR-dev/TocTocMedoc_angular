import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EpharmaService {

  constructor(private http: HttpClient) { }

  getAllProduit() {
    return this.http.get(`${environment.apiURL}/open-api/produit/14/100`, {
      headers: {
        "x-api-key": "dbab1b45-f454-4568-9fcc-47692b8e6319"
      }
    })
  }

  getDisponibiliteProduit(cip: any) {
    return this.http.post(`${environment.apiURL}/open-api/disponibilite`, {
      pharmacy: "6259ac72e657f409c30ace5f",
      cips: [cip]
    }, {
      headers: {
        "x-api-key": "dbab1b45-f454-4568-9fcc-47692b8e6319",
        "content-type": "application/json"
      },
    })
  }

  reservationProduit(cip: any, quantity: number, buyer: any, buyerPhone: any, buyerEmail: any) {
    return this.http.post(`${environment.apiURL}/open-api/reservation`, {
      pharmacy: "6259ac72e657f409c30ace5f",
      buyer,
      buyerPhone,
      buyerEmail,
      produits: [{ cip, quantity }]
    }, {
      headers: {
        "x-api-key": "dbab1b45-f454-4568-9fcc-47692b8e6319",
        "content-type": "application/json"
      },
    })
  }
}
