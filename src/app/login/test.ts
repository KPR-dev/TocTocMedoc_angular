try {
  this.epharmaService.getLibelleTarif(libelle).subscribe({
    next: (response: any) => {
      let addresses: any [] = [];

      for (let i = 0; i < environment.pharmacies.length; i++) {
        this.epharmaService.getDisponibiliteProduit(cp, environment.pharmacies[i]).subscribe({
          next: (response: any) => {
            addresses.push(response.pharmacy.adresse);
          },
          error: (err) => {
            console.log(err);
            // this.loading = false;
          }
        });
      }
      this.addressProduit = addresses
      console.log('address = ',  this.addressProduit)
      this.creditUser = response.credit
      console.log('credit reçu =', response.credit);
      this.modal_verifier = true
      this.form_modal_verifier = true
      environment.produit = cp
      // this.loading = false;
    },
    error: (error) => {
      console.log("erreur de la deuxième fonction")
      // this.loading = false;
    }
  });
} catch {
  // ... (votre bloc catch existant)
}
