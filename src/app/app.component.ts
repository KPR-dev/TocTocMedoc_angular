import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EpharmaService } from './epharma.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


class ProductQuantity {
  produitCIP!: string;
  quantity!: number;
  produitName!: string;
}

class Cart {
  pharmacyName!: string;
  pharmacyId!: string;
  products!: ProductQuantity[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  registerForm = new FormGroup({
    firstname: new FormControl("", [Validators.required]),
    lastname: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    confirm_password: new FormControl("", [Validators.required]),

  })

  get lastname(): FormControl {
    return this.registerForm.get("lastname") as FormControl;
  }
  get firstname(): FormControl {
    return this.registerForm.get("firstname") as FormControl;
  }
  get email(): FormControl {
    return this.registerForm.get("email") as FormControl;
  }
  get phone(): FormControl {
    return this.registerForm.get("phone") as FormControl;
  }
  get password(): FormControl {
    return this.registerForm.get("password") as FormControl;
  }
  get confirm_password(): FormControl {
    return this.registerForm.get("confirm_password") as FormControl;
  }


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

  currentPageIndex: number = 0;
  pageCount: number = 0;
  totalCount: number = 0;

  hasResult = false;

  carts: Cart[] = [];

  showCart: boolean = false;

  modal_register: boolean = false;
  loginFormVisible: boolean = false;
  registerFormVisible: boolean = false;
  ResetPassword: boolean = false;
  isLoggedIn: boolean = false;


  constructor(private epharmaService: EpharmaService) { }



  ngOnInit(): void {
    this.loadAllProduit();
  }

  loadAllProduit() {
    this.hasResult = false;
    this.filteredProduit = [];
    this.epharmaService.getAllProduit(this.currentPageIndex, environment.pageItemCount).subscribe({
      next: (response: any) => {
        this.produits = response;
        this.hasResult = true;
        this.pageCount = response.pageCount;
        this.filteredProduit = this.produits.items;
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  openCartView() {
    this.showCart = true;
  }

  nextPage() {
    this.currentPageIndex++;
    if (this.currentPageIndex >= this.pageCount) {
      this.currentPageIndex = this.pageCount - 1;
    } else {
      this.loadAllProduit();
    }
  }

  previousPage() {
    this.currentPageIndex--;
    if (this.currentPageIndex < 0) {
      this.currentPageIndex = 0;
    } else {
      this.loadAllProduit();
    }
  }


  open_register() {
    this.modal_register = true;
    // console.log("ça passe")
  }

  open_reset_password(){
    this.ResetPassword = true
  }

  submitRegistrationForm() {
    if (this.users.lastname && this.users.firstname && this.users.email && this.users.phone && this.users.password) {
      try {
        const formData = {
          lastname: this.users.lastname,
          firstname: this.users.firstname,
          email: this.users.email,
          phone: this.users.phone,
          role: 'USER',
          password: this.users.password,
        };
        console.log('users =', formData);
        this.epharmaService.AddUser(formData).subscribe({
          next: (response: any) => {
            console.log('enregistrement réussi =', response);
            this.modal_register = false
          },
          error: (error) => {
            console.error('Erreur lors d enrefistrement :', error);
          }
        });
      } catch {
        // ... (votre bloc catch existant)
      }
    } else {
      console.error('remplir le formulaire');
    }
  }

  users: any = {
    username: '',
    password: ''
  };
  loggedInUser: any;

  submitLoginForm() {
    if (this.users.username && this.users.password) {
      try {
        const formData = new FormData();
        formData.append('grant_type', 'password');
        formData.append('username', this.users.username);
        formData.append('password', this.users.password);

        console.log('users =', formData);

        this.epharmaService.PostUsers(formData).subscribe({
          next: (response: any) => {
            console.log('connexion réussie =', response);
            this.loggedInUser = response.user;
            environment.token = response.token.access_token
            console.log('token = ', environment.token)
            this.modal_register = false
            this.toggleForms()
            return response.token.access_token

          },
          error: (error) => {
            console.error('Erreur lors de la connexion :', error);
          }
        });
      } catch {
        // ... (votre bloc catch existant)
      }
    } else {
      console.error('Veuillez fournir un nom d\'utilisateur et un mot de passe.');
    }
  }






  toggleForms() {
    //  Bascule entre les formulaires d'inscription et de connexion
    this.loginFormVisible = !this.loginFormVisible;
    this.registerFormVisible = !this.registerFormVisible;

  }
  //Ma fonction

  verify(cip: any) {
    this.selectedProduit = this.filteredProduit.find(p => p.CIP === cip);
    this.verifiedPharmacies = [];
    for (let i = 0; i < environment.pharmacies.length; i++) {
      this.epharmaService.getDisponibiliteProduit(cip, environment.pharmacies[i]).subscribe({
        next: (response: any) => {
          if (response.disponibilites && response.disponibilites.length > 0) {
            this.disponibilites.push(response.disponibilites[0]);
            for (let j = 0; j < response.disponibilites.length; j++) {
              if (response.disponibilites[j].isAvailable) {
                // Display pharmacy for commande
                if (response.pharmacy) {
                  this.verifiedPharmacies.push(response.pharmacy);
                }
              }
            }
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }


  // verify(cip: any) {
  //   this.selectedProduit = this.filteredProduit.find(p => p.CIP == cip);
  //   this.verifiedPharmacies = [];
  //   for (let i = 0; i < environment.pharmacies.length; i++) {
  //     this.epharmaService.getDisponibiliteProduit(cip, environment.pharmacies[i]).subscribe({
  //       next: (response: any) => {
  //         this.disponibilites.push(response.disponibilites[0]);
  //         if (response.disponibilites) {
  //           for (let j = 0; j < response.disponibilites.length; j++) {
  //             if (response.disponibilites[j].isAvailable) {
  //               //Display pharmacy for commande
  //               this.verifiedPharmacies.push(response.pharmacy);
  //             }
  //           }
  //         }
  //       }, error: (err) => {
  //         console.log(err);
  //       }
  //     })
  //   }
  // }

  applyFilter(event: any) {
    const value = event.target.value.toLowerCase().trim();
    if (value == "") {
      this.filteredProduit = this.produits.items;
    } else {
      this.filteredProduit = this.produits.items.filter((p: any) => p.photoURL != null && p.libelle && p.libelle.toLowerCase().trim().includes(value));
    }
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

  commander(cart: Cart, cartIndex: number) {
    if (cart.products.length == 0) {
      alert("Vous n'avez aucun produit");
      return;
    }
    this.commandeResult = { start: true };
    const array = [];
    for (let i = 0; i < cart.products.length; i++) {
      array.push({
        cip: cart.products[i].produitCIP,
        quantity: cart.products[i].quantity
      })
    }
    this.epharmaService.reservationProduit(array, this.buyer, this.buyerPhone, this.buyerEmail, cart.pharmacyId).subscribe({
      next: (response: any) => {
        this.commandeResult = { start: false, success: true, message: "Votre commande a été envoyée avec succès à la pharmacie [" + cart.pharmacyName + "], Réservation " + response.result.reservation + ", TTC: " + response.result.ttc + " FCFA" };
        this.removeCart(cartIndex);
      }, error: (err) => {
        console.log(err);
        this.commandeResult = { start: false, success: false, message: "Votre commande a échouée !" };
      }
    })
  }

  clear() {
    this.selectedPharmacy = null;
    this.selectedProduit = null;
    this.showCart = false;
    this.commandeResult.start = false;
    this.commandeResult.success = null;
    this.quantity = 1;
    this.loginFormVisible = false;
    this.modal_register = false;
    this.ResetPassword = false
  }

  addToCart(productCIP: string, productName: string) {
    let index = -1;
    for (let i = 0; i < this.carts.length; i++) {
      if (this.carts[i].pharmacyId == this.selectedPharmacy._id) {
        index = i;
      }
    }
    if (index < 0) {
      this.carts.push({ pharmacyId: this.selectedPharmacy._id, pharmacyName: this.selectedPharmacy.nom, products: [] });
      index = this.carts.length - 1;
    }
    if (this.quantity) {
      let addNew = true;
      for (let i = 0; i < this.carts[index].products.length; i++) {
        if (this.carts[index].products[i].produitCIP == productCIP) {
          this.carts[index].products[i].quantity += this.quantity;
          addNew = false;
        }
      }
      if (addNew) {
        this.carts[index].products.push({ quantity: this.quantity, produitCIP: productCIP, produitName: productName })
      }
    }
    this.clear()
  }

  removeFromCart(productCIP: string, cartIndex: number) {
    for (let i = 0; i < this.carts[cartIndex].products.length; i++) {
      if (this.carts[cartIndex].products[i].produitCIP == productCIP) {
        this.carts[cartIndex].products.splice(i, 1);
        break;
      }
    }
    if (this.carts[cartIndex].products.length == 0) {
      this.carts.splice(cartIndex, 1);
    }
  }

  removeCart(cartIndex: number) {
    this.carts.splice(cartIndex, 1);
  }


}
