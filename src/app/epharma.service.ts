import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SingPayService } from './services/singpay.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';
import { of } from 'rxjs';

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

  changerPassword(email: string) {

    return this.http.put(`${environment.api}/user/recovery_password/${email}`, {});
  }

  getUserId(id: number) {
    return this.http.get(`${environment.api}/account/get_by_user_id/${id}`);
  }

  updateUser(id: number, formData: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.token}`
    });
    return this.http.put(`${environment.api}/user/update/${id}`, formData, { headers });
  }

  updateMdp(id: number, password: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.token}`
    });
    console.log('mpd user verif', password)
    return this.http.put(`${environment.api}/user/update_password/${id}?new_password=${password}`, null, { headers });
  }

  getAllTarif() {
    return this.http.get(`${environment.api}/rate/all`);
  }

  //Route pour afficher tout les produits
  getAllProduit(page: number, count: number) {
    return this.http.get(`${environment.apiURL}/all_products/${page}/${count}`, {

    })
  }


  PayToSingPay(amount: any, rateId: string) {
    // Construire l'URL avec les paramètres token et tarif_id
    const token = environment.token;
    const url_success = `http://51.68.46.67:8000/sing_pay_api/url_success/${token}/${rateId}`;

    // Appeler la fonction externalisation avec la nouvelle URL
    this.singPayService.externalisation(amount, url_success, null).subscribe({
      next: (response: any) => {
        console.log('Singpay =', response);
        console.log('token =', token);
        console.log('rateId =', rateId);
        window.open(response.link, '_blank'); // Redirection vers l'interface de Singpay
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement :', error);

        // Vérifiez si l'erreur contient un message explicite
        if (error.error && error.error.message) {
          console.error('Message d\'erreur de SingPay :', error.error.message);
        }

        // Redirection vers la page actuelle en cas d'erreur
        window.location.href = window.location.href;
      }
    });

  }



  // PayToSingPay(amount: any, url_success: any, url_error: any) {
  //   this.singPayService.externalisation(amount, url_success, url_error).subscribe({
  //     next: (response: any) => {
  //       console.log('Singpay =', response);
  //       window.open(response.link, '_blank'); // TODO: J'ai fais une redirection pour l'interface de singpay
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors d enregistrement :', error);
  //     }
  //   })
  // }


  // getSubscribeCompte(idcompte: number, rateId: string, price: any) {
  //   const params = { rate_id: rateId };  // je cree un objet avec le paramètre de requête
  //   const options = { params };  // j'ajoute les paramètres à la configuration de la requête

  //   this.PayToSingPay(price, rateId)// TODO: Appelle de la consommationo du service Singpay

  //    return this.http.put(`${environment.api}/account/subscribe_rate/${idcompte}`, null, options);
  // }

  getSubscribeCompte(idcompte: number, rateId: string, price: any): Observable<any> {
    const params = { rate_id: rateId };
    const options = { params };

    this.PayToSingPay(price, rateId);

    // Utilisez `of` pour créer un observable qui émet une seule valeur puis se termine
    return of('Subscription completed');
  }

  getSubscribeCompte2(idcompte: number, rateId: string, price: any): Observable<any> {
    const params = { rate_id: rateId };
    const options = { params };

    this.singPayInscription(environment.user_id, price, rateId);

    // Utilisez `of` pour créer un observable qui émet une seule valeur puis se termine
    return of('Subscription completed');
  }

  singPayInscription(id: number, amount: any, rateId: string){
    const token = environment.token;
    const url_success = `http://51.68.46.67:8000/sing_pay_api/url_success_by_user_id/${id}/${rateId}`;

    // Appeler la fonction externalisation avec la nouvelle URL
    this.singPayService.externalisation(amount, url_success, null).subscribe({
      next: (response: any) => {
        console.log('Singpay =', response);
        console.log('token =', token);
        console.log('rateId =', rateId);
        window.open(response.link, '_blank'); // Redirection vers l'interface de Singpay
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement :', error);

        // Vérifiez si l'erreur contient un message explicite
        if (error.error && error.error.message) {
          console.error('Message d\'erreur de SingPay :', error.error.message);
        }

        // Redirection vers la page actuelle en cas d'erreur
        window.location.href = window.location.href;
      }
    });
  }


  souscrireCredit(idcompte: number, credit: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.token}`
    });
    return this.http.put(`${environment.api}/account/spent/${idcompte}?credit=${credit}`, null, { headers: headers });
  }

  getLibelleTarif(libelle: string) {
    return this.http.get(`${environment.api}/price_list/get_by_libelle/${libelle}`, {

    })
  }

  getAllPriceCredit() {
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
    }, { headers });
  }

  //Route pour add  les produits
//   reservationProduit(produits: any[], buyer: any, buyerPhone: any, buyerEmail: any, pharmacy: any) {

//     const requestBody = {
//         pharmacy: pharmacy,
//         buyer: buyer,
//         buyerPhone: buyerPhone,
//         buyerEmail: buyerEmail,
//         produits: produits
//     };
//     // Utilisez la requête HTTP POST en incluant le corps de la requête
//     return this.http.post(`${environment.apiURL}/reservation`, requestBody);
// }



  reservationProduit(produits: any[], buyer: any, buyerPhone: any, buyerEmail: any, pharmacy: any) {
     const headers = new HttpHeaders({
       'Authorization': `Bearer ${environment.token}`
     });
    return this.http.post(`${environment.apiURL}/reservation`, {
      pharmacy,
      buyer,
      buyerPhone,
      buyerEmail,
      produits
    }, {headers: headers })
  }

  getAllProductsBySearch(libelle: string) {
    return this.http.get(`${environment.apiURL}/products_by_search/${libelle}`)
  }
}
