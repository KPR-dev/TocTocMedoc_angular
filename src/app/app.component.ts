import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EpharmaService } from './epharma.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  produits: any;
  filteredProduit: any[] = [];

  selectedProduit: any;
  verifiedPharmacies: any[] = [];
  selectedPharmacy: any;
  commandeResult: any = { start: false };

  quantity!: number;
  buyer!: string;
  buyerPhone!: string;
  buyerEmail!: string;

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
    this.selectedProduit = this.filteredProduit.find(p => p.CIP == cip);
    this.verifiedPharmacies = [];
    for (let i = 0; i < environment.pharmacies.length; i++) {
      this.epharmaService.getDisponibiliteProduit(cip, environment.pharmacies[i]).subscribe({
        next: (response: any) => {
          this.disponibilites.push(response.disponibilites[0]);
          if (response.disponibilites) {
            for (let j = 0; j < response.disponibilites.length; j++) {
              if (response.disponibilites[j].isAvailable) {
                //Display pharmacy for commande
                this.verifiedPharmacies.push(response.pharmacy);
              }
            }
          }
        }, error: (err) => {
          console.log(err);
        }
      })
    }
  }

  applyFilter(event: any) {
    const value = event.target.value.toLowerCase().trim();
    this.filteredProduit = this.produits.items.filter((p: any) => p.photoURL != null && p.libelle && p.libelle.toLowerCase().trim().includes(value));
  }

  getLastDisponibiliteByCIP(cip: any) {
    const founds = this.disponibilites.filter((d: any) => d.cip == cip);
    if (founds.length == 0) {
      return null;
    }
    return founds[founds.length - 1].success ? founds[founds.length - 1].isAvailable : false;
  }

  select(pharmacy: any) {
    this.selectedPharmacy = pharmacy;
  }

  commander() {
    this.commandeResult = { start: true };
    this.epharmaService.reservationProduit(this.selectedProduit.CIP, this.quantity, this.buyer, this.buyerPhone, this.buyerEmail, this.selectedPharmacy._id).subscribe({
      next: (response: any) => {
        this.commandeResult = { start: false, success: true, message: "Votre commande a été envoyée avec succès, Réservation " + response.result.reservation + ", TTC: " + response.result.ttc + " FCFA"};
      }, error: (err) => {
        console.log(err);
        this.commandeResult = { start: false, success: false, message: "Votre commande a échouée !"};
      }
    })
  }

  clear(){
    this.selectedPharmacy = null;
    this.selectedProduit = null;
  }

}
