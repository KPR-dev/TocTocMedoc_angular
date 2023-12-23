import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EpharmaService } from '../epharma.service';
import { SingPayService } from '../services/singpay.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

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
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.scss']
})
export class AcceuilComponent implements OnInit {
  receivedData: any;
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
  grille: any;

  listTarif: any[] = [];
  selectedProduit: any;
  verifiedPharmacies: any[] = [];
  selectedPharmacy: any;
  commandeResult: any = { start: false };


  quantity!: number;
  buyer!: string;
  buyerPhone!: string;
  buyerEmail!: string;
  smserror: any;

  disponibilites: any[] = [];

  currentPageIndex: number = 0;
  pageCount: number = 0;
  totalCount: number = 0;
  creditUser: number = 0;

  hasResult = false;

  carts: Cart[] = [];

  showCart: boolean = false;
  showMdpForm: boolean = false;
  changeMdp: boolean = false;
  modal_register: boolean = false;
  modal_text: boolean = false;
  modal: boolean = false;
  modal_modification: boolean = false;
  formInscription: boolean = false;
  formConnexion: boolean = false;
  formModification: boolean = false;
  modal_tarif: boolean = false;
  loader: boolean = false;
  loginFormVisible: boolean = false;
  InscriptionFormVisible: boolean = false;
  registerFormVisible: boolean = false;
  ResetPassword: boolean = false;
  isLoggedIn: boolean = false;
  showSnackbar: boolean = false;
  showSnackbar1: boolean = false;
  showSnackbar2: boolean = false;
  showSnackbar3: boolean = false;
  showSnackbar4: boolean = false;
  showSnackbar5: boolean = false;
  showSnackbarError: boolean = false;
  showSnackbarError1: boolean = false;
  showSnackbarError2: boolean = false;
  showSnackbarError3: boolean = false;
  showSnackbarError4: boolean = false;
  showSnackbarError5: boolean = false;
  changerPass: boolean = false;
  form1: boolean = false;
  contrat: boolean = false;
  modal_modification1: boolean = false;
  formModification1: boolean = false;
  modal_verifier: boolean = false;
  form_modal_verifier: boolean = false;
  modal_info_tarif_user: boolean = false;


  constructor(private epharmaService: EpharmaService, private singPayService: SingPayService , private router: Router, private dataService: DataService) { }

  // @HostListener('window:popstate', ['$event'])
  // onPopState(event: Event): void {
  //   // Vérifier l'état de connexion
  //   if (environment.token === null) {
  //     // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  //     this.router.navigate(['/login']);
  //   }
  //   else{
  //     this.router.navigate(['/acceuil']);
  //   }
  // }


  ngOnInit(): void {

    console.log('tok', environment.token)
    this.loadAllProduit();
    this.loadAllTarif()
    this.checkAuthenticationStatus();
    this.grilleTarifaire()
    this.showSnackbar = false;
    this.showSnackbar1 = false;
    this.showSnackbar2 = false;
    this.showSnackbar3 = false;
    this.showSnackbar4 = false;
    this.showSnackbar5 = false;
    this.showSnackbarError = false
    this.showSnackbarError1 = false
    this.showSnackbarError2 = false
    this.showSnackbarError3 = false
    this.showSnackbarError4 = false
    this.showSnackbarError5 = false
    this.receivedData = this.dataService.getSharedData();
  }

  allerVersNouvellePage() {
    this.router.navigate(['/tarif']);
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

  grilleTarifaire(){
    this.hasResult = false;
    this.grille = []
    this.epharmaService.getAllPriceCredit().subscribe({
      next: (response: any) => {
        this.grille = response;
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  loadAllTarif() {
    this.listTarif = [];
    this.epharmaService.getAllTarif().subscribe({
      next: (response: any) => {
        this.listTarif = response
      }, error: (err) => {
        console.log(err);
      }
    })
  }
  checkAuthenticationStatus() {
    const authToken = environment.token
    console.log('authToken =', authToken)
    this.isLoggedIn = !!authToken;
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
    this.formInscription = true
    this.form1 = true
    // console.log("ça passe")
  }

  open_reset_password(){
    this.ResetPassword = true
    this.changerPass = true
  }

  open_tarif(){
    this.modal_tarif = true
  }

  open_inscription(){
    this.loginFormVisible = true
  }

  open_modal_modification(){
    this.modal_modification = true
    this.formModification = true
    this.epharmaService.getUserId(environment.user_id).subscribe({
      next: (response: any) => {
        console.log('information user =', response);
        this.users.lastname = response.user.lastname
        this.users.firstname = response.user.firstname
        this.users.email = response.user.email
        this.users.phone = response.user.phone
        this.users.credit = response.credit
        return true

      },
      error: (error) => {
        console.error('Erreur lors de la connexion :', error);
      }
    });
  }

  open_verifier(){
    this.modal_verifier = true
  }
  updatePassword(){

    console.log(this.password.value)
    this.users.password = this.password.value
    if (this.password.value === this.confirm_password.value) {
      this.epharmaService.updateMdp(environment.user_id, this.users.password).subscribe({
        next: (response: any) => {
          console.log('mdp user =', response);
          this.showMdpForm = false
          this.showSnackbar3 = true;
          setTimeout(() => {
            this.showSnackbar3 = false;
            this.changeMdp = false
          }, 2000);

          return true
        },
        error: (error) => {
          this.smserror = error.error.detail
          this.showSnackbarError3 = true;
          setTimeout(() => {
            this.showSnackbarError3 = false;
          }, 2000);
        }
      });
    }
    else{
      console.log('les mots de passe ne sont pas identique !')
      this.smserror = "les mots de passe ne sont pas identique !";
      setTimeout(() => {
        this.showSnackbarError3 = false;
      }, 2000);
    }
  }

  forminvisible(){

    if (this.users.password === this.users.confirm_password) {
      this.form1 = false
      this.contrat = true
    }
    else{

      this.smserror = "les mots de passe ne sont pas identique !"
      this.showSnackbarError1 = true;
      setTimeout(() => {
        this.showSnackbarError1 = false;
      }, 2000);
    }

  }

  profil(){
    this.modal_modification1 = true
    this.formModification1 = true
  }



  clickTarif(idTarif: any, price: any){
    console.log('tarif = ',idTarif)
    environment.tarif_id = idTarif
    this.modal_tarif = false
    this.formInscription = true
    this.contrat = false
    this.modal_register = false
    // this.PayToSingPay(200)
    this.epharmaService.getSubscribeCompte2(environment.id_compte, idTarif.toString(), price).subscribe({
      next: (response: any) => {
        console.log('compte subscribe =', response);
        this.loader = false
        this.modal_register = false
      },
      error: (error) => {
        console.error('Erreur lors d enregistrement :', error);
      }
    });
  }

  open_info_user_tarif(){
    this.modal_info_tarif_user = true
  }

  // clickTarifInfoUser(idTarif: any){
  //   console.log('tarif = ',idTarif)

  //   this.epharmaService.getSubscribeCompte(environment.id_compte, idTarif.toString()).subscribe({
  //     next: (response: any) => {
  //       console.log('compte subscribe =', response);
  //       this.modal_info_tarif_user = false
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors d enregistrement :', error);
  //     }
  //   });
  // }

  // submitCompteUser(){
  //   const formData = {
  //     idTarif: environment.tarif_id
  //   }

  //   this.epharmaService.getSubscribeCompte(formData).subscribe({
  //     next: (response: any) => {
  //       console.log('compte subscribe =', response);
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors d enrefistrement :', error);
  //     }
  //   });
  // }

  getCompteUser(id: number){
    this.epharmaService.getUserId(id).subscribe({
      next: (response: any) => {
        console.log('compte réussi =', response);
      },
      error: (error) => {
        console.error('Erreur lors d enrefistrement :', error);
      }
    });
  }

  deconnexion(){
    location.reload();
  }

  submitRegistrationForm() {
    if (this.users.lastname && this.users.email && this.users.phone && this.users.password) {
      try {
        const formData = {
          lastname: this.users.lastname,
          // firstname: this.users.firstname,
          email: this.users.email,
          phone: this.users.phone,
          role: 'USER',
          password: this.users.password,

        };


        console.log('users =', formData);

        if (this.users.password === this.users.confirm_password) {
          this.epharmaService.AddUser(formData).subscribe({
            next: (response: any) => {
              console.log('enregistrement réussi =', response);
              this.videForm()

              this.formInscription = false
              this.formInscription = false
              this.loader = true
              this.showSnackbar1 = true;
              setTimeout(() => {
                this.showSnackbar1 = false;
              }, 2000);

              this.modal_text = true
              this.epharmaService.getUserId(response.id).subscribe({
                next: (response: any) => {
                  console.log('idcompte =', response)
                  environment.id_compte = response.id
                  environment.user_id = response.user.id
                  setTimeout(() => {
                    this.modal_tarif = true
                  }, 1000);

                }
              })
            },
            error: (error) => {
              this.smserror = error.error.detail
              this.showSnackbarError1 = true;
              setTimeout(() => {
                this.showSnackbarError1 = false;
              }, 2000);
            }
          });
        }
        else{
          console.log('incorrect mdp !!!')
        }
      } catch(error) {
       console.error('errer du catch :', error);
      }
    } else {
      console.error('remplir le formulaire');
    }
  }

  videForm(){
    this.users.lastname = '',
    this.users.firstname = '',
    this.users.email = '',
    this.users.phone = '',
    this.users.password = ''
  }
  annulerText(){
    this.modal_text = false
    this.modal_register = false
    this.contrat = false
  }

  accepterText(){
    this.modal_text = false
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
            environment.token = response.token.access_token
            this.dataService.setSharedToken(environment.token);
            environment.user_id = response.user.id
            environment.user = response
            this.dataService.setSharedData(response);
            console.log('token = ', environment.token)
            this.formConnexion = true
            this.showSnackbar = true;
            setTimeout(() => {
              this.showSnackbar = false;
              this.loginFormVisible = false;
              this.modal_register = false;
              this.router.navigate(['/login']);
            }, 2000);

            this.epharmaService.getUserId(response.user.id).subscribe({
              next: (response: any) => {
                console.log('compte = ', response)
                environment.id_compte = response.id
                this.dataService.setSharedCompte(response.id);

              },

            });

            return response.token.access_token

          },
          error: (error) => {

            this.showSnackbarError = true;
            this.smserror = error.error.detail;
            setTimeout(() => {

              this.showSnackbarError = false;
            }, 2000);

          }
        });
      } catch {
        // ... (votre bloc catch existant)
      }
    } else {
      console.error('Veuillez fournir un nom d\'utilisateur et un mot de passe.');
      alert('Veuillez fournir un nom d\'utilisateur et un mot de passe')
    }
  }


  updateForm(){
    console.log('ID =', environment.user_id)
    try {
      const formData = {
        lastname: this.users.lastname,
        firstname: this.users.firstname,
        email: this.users.email,
        phone: this.users.phone,
        role: 'USER',
        id: environment.user_id
      };


      console.log('users modification =', formData);

      this.epharmaService.updateUser(environment.user_id, formData).subscribe({
        next: (response: any) => {
          console.log('modification réussi =', response);


          this.showSnackbar2 = true;
            setTimeout(() => {
              this.showSnackbar2 = false;
              this.modal_modification1 = false
              this.formModification1 = false
            }, 2000);
        },
        error: (error) => {
          this.smserror = error.error.detail
          this.showSnackbarError2 = true;
            setTimeout(() => {
              this.showSnackbarError2 = false;
            }, 2000);
        }
      });
    } catch {
      // ... (votre bloc catch existant)
    }
  }




  toggleForms() {
    //  Bascule entre les formulaires d'inscription et de connexion
    this.loginFormVisible = !this.loginFormVisible;
    this.registerFormVisible = !this.registerFormVisible;

  }
  PayToSingPay(price: any) {
    this.singPayService.externalisation(price, 'url_success', 'url_error').subscribe({
      next: (response: any) => {
        console.log('Singpay =', response);
        this.modal_tarif = false
        this.modal_register = false
        this.loader = false
        window.open(response.link, '_blank'); // TODO: J'ai fais une redirection pour l'interface de singpay
      },
      error: (error) => {
        console.error('Erreur lors d enregistrement :', error);
      }
    })
  }
  //Ma fonction
  clickVerify(libelle: string, cp: any){
    console.log('ID =', environment.user_id)
    try {
      this.epharmaService.getLibelleTarif(libelle).subscribe({
        next: (response: any) => {
          this.creditUser = response.credit
          console.log('credit reçu =', response.credit);
          this.modal_verifier = true
          this.form_modal_verifier = true
          environment.produit = cp

        },
        error: (error) => {
        }
      });
    } catch {
      // ... (votre bloc catch existant)
    }
  }

  validerCredit(credit: number){
    this.epharmaService.souscrireCredit(environment.id_compte, credit).subscribe({
      next: (response: any) => {
        console.log('credit enlever =', response);
        this.form_modal_verifier = false
        this.showSnackbar4 = true;
        setTimeout(() => {
          this.showSnackbar4 = false;
          this.modal_verifier = false
        }, 2000);
        this.verify(environment.produit)

      },
      error: (error) => {
        this.smserror = error.error.detail
        this.showSnackbarError4 = true;
        setTimeout(() => {
          this.showSnackbarError4 = false;
        }, 2000);
      }
    });
  }

  changePassword(){
    console.log(this.email.value)
    this.epharmaService.changerPassword(this.email.value).subscribe({
      next: (response: any) => {
        console.log('change mdp =', response);
        this.changerPass = false
        this.showSnackbar5 = true;
          setTimeout(() => {
            this.showSnackbar5 = false;
            this.ResetPassword = false
          }, 4000);
      },
      error: (error) => {
        if (this.email.value === '') {
          this.smserror = 'Entrez une adresse mail'
          this.showSnackbarError5 = true;
            setTimeout(() => {
              this.showSnackbarError5 = false;
            }, 4000);
        }
        else{
          this.smserror = error.error.detail
          this.showSnackbarError5 = true;
            setTimeout(() => {
              this.showSnackbarError5 = false;
            }, 4000);
        }

       console.log(error)
      }
    });
  }

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

  open_mdp(){
    this.changeMdp = true
    this.showMdpForm = true
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
    this.modal_modification = false
    this.formModification = false
    this.modal_tarif = false
    this.modal_verifier = false

  }
  clearInfoTarifUser(){
    this.modal_info_tarif_user = false
  }

  clearModification(){
    this.modal_modification1 = false
    this.changeMdp = false
    this.ResetPassword = false;
    this.modal_info_tarif_user = false
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
