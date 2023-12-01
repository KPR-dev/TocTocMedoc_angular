import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SingPayService } from './services/singpay.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpharmaService {

  constructor(private http: HttpClient, private singPayService: SingPayService) { }

  //Route pour authentification

  PostUsers(formData: FormData) {
    return this.http.post(`${environment.api}/auth/login`, formData);
  }

  AddUser(formData: any) {
    return this.http.post(`${environment.api}/user/add`, formData);
  }

  changerPassword(email: string){

    return this.http.put(`${environment.api}/user/recovery_password/${email}`, {});
  }

  getUserId(id: number) {
    return this.http.get(`${environment.api}/account/get_by_user_id/${id}`);
  }

  updateUser(id: number, formData: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.token}`
    });
    return this.http.put(`${environment.api}/user/update/${id}`, formData, {headers});
  }

  updateMdp(id: number, password: any){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.token}`
    });
    console.log('mpd user verif', password)
    return this.http.put(`${environment.api}/user/update_password/${id}?new_password=${password}`,null, {headers});
  }

  getAllTarif(){
    return this.http.get(`${environment.api}/rate/all`);
  }

  //Route pour afficher tout les produits
  getAllProduit(page: number, count: number) {
    return this.http.get(`${environment.apiURL}/all_products/${page}/${count}`, {

    })
  }

  PayToSingPay(amount: any, url_success: any, url_error: any) {
    this.singPayService.externalisation(amount, url_success, url_error).subscribe({
      next: (response: any) => {
        console.log('Singpay =', response);
        window.open(response.link, '_blank'); // TODO: J'ai fais une redirection pour l'interface de singpay
      },
      error: (error) => {
        console.error('Erreur lors d enregistrement :', error);
      }
    })
    return true
  }

  getSubscribeCompte(idcompte: number, rateId: string, price: any) {
    const params = { rate_id: rateId };  // je cree un objet avec le paramètre de requête
    const options = { params };  // j'ajoute les paramètres à la configuration de la requête

    this.PayToSingPay(price, "url_succes", "url_error")// TODO: Appelle de la consommationo du service Singpay

    return this.http.put(`${environment.api}/account/subscribe_rate/${idcompte}`, null, options);
  }

  souscrireCredit(idcompte: number, credit: number){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.token}`
    });
    return this.http.put(`${environment.api}/account/spent/${idcompte}?credit=${credit}`,null, { headers: headers });
  }

  getLibelleTarif(libelle: string){
    return this.http.get(`${environment.api}/price_list/get_by_libelle/${libelle}`, {

    })
  }

  getAllPriceCredit(){
    return this.http.get(`${environment.api}/price_list/all`, {

    })
  }

  //Route pour add  les produits disponible
  getDisponibiliteProduit(cip: any, pharmacy: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.token}`
    });
    return this.http.post(`${environment.apiURL}/disponibility_product`, {
      pharmacy: pharmacy,
      cip: cip
    }, {headers});
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
