import { Component, OnInit } from '@angular/core';
import { EpharmaService } from './epharma.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  produits: any;
  filteredProduit: any[] = [];

  disponibilites: any[] = [];

  constructor(private epharmaService: EpharmaService) { }

  ngOnInit(): void {
    this.loadAllProduit();
  }

  loadAllProduit() {
    this.epharmaService.getAllProduit().subscribe({
      next: (response) => {
        this.produits = response;
        this.filteredProduit = this.produits.items.filter((p: any) => p.photoURL != null);
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  verify(cip: any) {
    this.epharmaService.getDisponibiliteProduit(cip).subscribe({
      next: (response: any) => {
        console.log(response);
        this.disponibilites.push(response.disponibilites[0]);
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  applyFilter(event: any) {
    const value = event.target.value.toLowerCase().trim();
    console.log(value);
    this.filteredProduit = this.produits.items.filter((p: any) => p.photoURL != null && p.libelle && p.libelle.toLowerCase().trim().includes(value));
  }

  getLastDisponibiliteByCIP(cip: any) {
    const founds = this.disponibilites.filter((d: any) => d.cip == cip);
    if (founds.length == 0) {
      return null;
    }
    return founds[founds.length - 1].success ? founds[founds.length - 1].isAvailable : false;
  }


  commander(produit: any) {
    const quantity = prompt("Quantité", "1");
    const buyer = prompt("Votre nom complet");
    const buyerPhone = prompt("Votre numéro de téléphone");
    const buyerEmail = prompt("Votre adresse email");
    this.epharmaService.reservationProduit(produit.CIP, Number.parseInt(quantity!), buyer, buyerPhone, buyerEmail).subscribe({
      next: (response) => {
        console.log(response);
        alert(JSON.stringify(response));
      }, error: (err) => {
        console.log(err);
      }
    })
  }

}
