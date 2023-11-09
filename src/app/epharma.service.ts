import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EpharmaService {

  constructor(private http: HttpClient) { }

  //Route pour afficher tout les produits
  getAllProduit(page: number, count: number) {
    return this.http.get(`${environment.apiURL}/all_products/${page}/${count}`, {

    })
  }

  //Route pour add  les produits disponible
  getDisponibiliteProduit(cip:any, pharmacy: any) {
    return this.http.post(`${environment.apiURL}/disponibility_product`,{
      pharmacy,
      cips: [cip]
    });
  }

  //Route pour add  les produits
  reservationProduit(produits: any[], buyer: any, buyerPhone: any, buyerEmail: any, pharmacy: any) {
    const requestData = {
      pharmacy,
      buyer,
      buyerPhone,
      buyerEmail,
      produits
    };
    return this.http.post(`${environment.apiURL}/reservation`, requestData);
  }
  // reservationProduit(produits: any[], buyer: any, buyerPhone: any, buyerEmail: any, pharmacy: any) {
  //   return this.http.post(`${environment.apiURL}/open-api/reservation`, {
  //     pharmacy,
  //     buyer,
  //     buyerPhone,
  //     buyerEmail,
  //     produits
  //   },)
  // }
}
