import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EpharmaService {

  constructor(private http: HttpClient) { }

  getAllProduit(page: number, count: number) {
    return this.http.get(`${environment.apiURL}/open-api/produit/${page}/${count}`, {
      headers: {
        "x-api-key": environment.apiKey,
      }
    })
  }

  getDisponibiliteProduit(cip: any, pharmacy: any) {
    return this.http.post(`${environment.apiURL}/open-api/disponibilite`, {
      pharmacy,
      cips: [cip]
    }, {
      headers: {
        "x-api-key": environment.apiKey,
        "content-type": "application/json"
      },
    })
  }

  reservationProduit(cip: any, quantity: number, buyer: any, buyerPhone: any, buyerEmail: any, pharmacy: any) {
    return this.http.post(`${environment.apiURL}/open-api/reservation`, {
      pharmacy,
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
