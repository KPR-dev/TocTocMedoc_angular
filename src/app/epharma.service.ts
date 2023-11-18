import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpharmaService {

  constructor(private http: HttpClient) { }

  //Route pour authentification

  PostUsers(formData: FormData) {
    return this.http.post(`${environment.api}/auth/login`, formData);
  }

  AddUser(formData: any) {
    return this.http.post(`${environment.api}/user/add`, formData);
  }

  getUserId(id: number) {
    return this.http.get(`${environment.api}/account/get_by_user_id/${id}`);
  }

  updateUser(id: number, formData: any) {
    return this.http.put(`${environment.api}/user/update/${id}`, formData);
  }

  getAllTarif(){
    return this.http.get(`${environment.api}/rate/all`);
  }

  //Route pour afficher tout les produits
  getAllProduit(page: number, count: number) {
    return this.http.get(`${environment.apiURL}/all_products/${page}/${count}`, {

    })
  }

  getSubscribeCompte(idtarif: number, idcompte: number){
    return this.http.put(`${environment.api}/account/subscribe_rate/${idcompte}`, {
      rate_id: idtarif
    });
  }



  //Route pour add  les produits disponible
  getDisponibiliteProduit(cip: any, pharmacy: any) {
    return this.http.post(`${environment.apiURL}/disponibility_product`, {
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
