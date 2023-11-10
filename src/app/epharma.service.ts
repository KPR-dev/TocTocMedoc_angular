import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpharmaService {

  constructor(private http: HttpClient ) { }

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

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${environment.apiURL}/register`, userData);
  }

  sendRandomPassword(email: string): Observable<any> {
    // Générer un mot de passe aléatoire et l'envoyer par e-mail
    const randomPassword = this.generateRandomPassword();
    const body = { email, password: randomPassword };

    return this.http.post(`${environment.apiURL}/send-password`, body);
  }

  private generateRandomPassword() {
    // Logique de génération du mot de passe aléatoire (à implémenter selon vos besoins)
    // Retournez le mot de passe généré
  }
}
