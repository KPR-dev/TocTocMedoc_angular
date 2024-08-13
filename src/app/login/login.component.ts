import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EpharmaService } from '../epharma.service';
import { SingPayService } from '../services/singpay.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { forkJoin, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';



class ProductQuantity {
  produitCIP!: string;
  quantity!: number;
  produitName!: string;
  prix_vente!: number;
}

class Cart {
  pharmacyName!: string;
  pharmacyId!: string;
  products!: ProductQuantity[];
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.scss'],

})
export class LoginComponent implements OnInit {

  public loading = false;
  public isFinished = false;

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
  addressProduit: any[] = [];

  listTarif: any[] = [];
  selectedProduit: any;
  verifiedPharmacies: any[] = [];
  selectedPharmacy: any;
  commandeResult: any = { start: false };


  quantity!: number;
  buyer!: string;
  buyerPhone!: string;
  buyerEmail!: string;
  pharmacieChoisi!: string;
  smserror: any;

  disponibilites: any[] = [];

  currentPageIndex: number = 0;
  pageCount: number = 0;
  totalCount: number = 0;
  creditUser: number = 0;
  nombreProduit: number = 0;
  totalPrixVente: number = 0;
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
  showSnackbar6: boolean = false;
  showSnackbarError: boolean = false;
  showSnackbarError1: boolean = false;
  showSnackbarError2: boolean = false;
  showSnackbarError3: boolean = false;
  showSnackbarError4: boolean = false;
  showSnackbarError5: boolean = false;
  showSnackbarError6: boolean = false;
  changerPass: boolean = false;
  form1: boolean = false;
  contrat: boolean = false;
  modal_modification1: boolean = false;
  formModification1: boolean = false;
  modal_verifier: boolean = false;
  form_modal_verifier: boolean = false;
  modal_info_tarif_user: boolean = false;
  verifier_commander: boolean = false;
  modal_commander: boolean = true;
  verifier_pharmacie: boolean = false
  ajout_pharmacy: boolean = true;
  test: any;

  receivedData: any;
  receivedCompte: any;
  receiveToken: any;
  constructor(private epharmaService: EpharmaService, private singPayService: SingPayService, private router: Router, private dataService: DataService) { }



  ngOnInit(): void {
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
    this.showSnackbar6 = false;
    this.showSnackbarError = false
    this.showSnackbarError1 = false
    this.showSnackbarError2 = false
    this.showSnackbarError3 = false
    this.showSnackbarError4 = false
    this.showSnackbarError5 = false
    this.showSnackbarError6 = false
    this.loading = false;
    this.isFinished = false;
    this.receivedData = this.dataService.getSharedData();
    this.receivedCompte = this.dataService.getSharedCompte();
    this.receiveToken = this.dataService.getSharedToken();
    console.log('user = ', this.receivedData)
    console.log('compte = ', this.receivedCompte)
    console.log('token store= ', this.receiveToken)

    // this.loggedInUser = this.receivedData.user.id
    this.loggedInUser = this.receivedData.user.lastname
    environment.user_id = this.receivedData.user.id
    environment.token = this.receiveToken
    environment.id_compte = this.receivedCompte
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

  //Nouvelle fonctionnalité de recherche des produits depuis la bare de recherche ttm
  searchProducts(event: any): void {
    const inputValue = event.target.value;
    if (inputValue.length >= 3) {
      this.hasResult = false;
      this.filteredProduit = [];
      this.epharmaService.getAllProductsBySearch(inputValue).subscribe({
        next: (response: any) => {
          this.hasResult = true;
          this.filteredProduit = response
        }, error: (err) => {
          console.log(err);
        }
      })
      console.log("ça arrive ici: ", inputValue)
    }
  }

  grilleTarifaire() {
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
    console.log('authToken =', environment.token)
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

  open_reset_password() {
    this.ResetPassword = true
    this.changerPass = true
  }

  open_tarif() {
    this.modal_tarif = true
  }

  open_inscription() {
    this.loginFormVisible = true
  }

  logout() {
    this.dataService.clearSharedData();
    this.router.navigate(['/acceuil']);
    console.log('Utilisateur déconnecté');
  }

  open_modal_modification() {
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

  open_verifier() {
    this.modal_verifier = true
  }
  updatePassword() {

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
    else {
      console.log('les mots de passe ne sont pas identique !')
      this.smserror = "les mots de passe ne sont pas identique !";
      setTimeout(() => {
        this.showSnackbarError3 = false;
      }, 2000);
    }
  }

  forminvisible() {

    if (this.users.password === this.users.confirm_password) {
      this.form1 = false
      this.contrat = true
    }
    else {

      this.smserror = "les mots de passe ne sont pas identique !"
      this.showSnackbarError1 = true;
      setTimeout(() => {
        this.showSnackbarError1 = false;
      }, 2000);
    }

  }

  profil() {
    this.modal_modification1 = true
    this.formModification1 = true
  }

  clickTarif(idTarif: any, price: any) {
    console.log('tarif = ', idTarif)
    environment.tarif_id = idTarif
    this.modal_tarif = false
    this.formInscription = true
    this.contrat = false
    this.modal_register = false
    this.epharmaService.getSubscribeCompte(environment.id_compte, idTarif.toString(), price).subscribe({
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

  clickCommande(commande: string) {
    try {
      this.epharmaService.getLibelleTarif(commande).subscribe({
        next: (response: any) => {

          this.creditUser = response.credit
          this.verifier_commander = true
          this.modal_commander = false
        },
        error: (error) => {
        }
      });
    } catch {
      // ... (votre bloc catch existant)
    }

  }

  close_verif_commande() {
    this.verifier_commander = false
    this.modal_commander = true
  }

  open_info_user_tarif() {
    this.modal_info_tarif_user = true
  }



  clickTarifInfoUser(idTarif: any, price: any) {

    this.epharmaService.getSubscribeCompte(environment.id_compte, idTarif.toString(), price).subscribe({
      next: (response: any) => {
        this.modal_info_tarif_user = false
        setTimeout(() => {
          this.open_modal_modification();
        }, 900);


      },
      error: (error) => {
        console.error('Erreur lors d enregistrement :', error);
      }
    });
  }

  PayToSingPay(price: any) {
    this.singPayService.externalisation(price, 'url_success', 'url_error').subscribe({
      next: (response: any) => {
        window.open(response.link, '_blank'); // TODO: J'ai fais une redirection pour l'interface de singpay
      },
      error: (error) => {
        console.error('Erreur lors d enregistrement :', error);
      }
    })
  }

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

  getCompteUser(id: number) {
    this.epharmaService.getUserId(id).subscribe({
      next: (response: any) => {
        console.log('compte réussi =', response);
      },
      error: (error) => {
        console.error('Erreur lors d enrefistrement :', error);
      }
    });
  }

  deconnexion() {
    location.reload();
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
              console.log('user', environment.user_id)
              this.epharmaService.getUserId(response.id).subscribe({
                next: (response: any) => {
                  console.log('idcompte =', response.id)
                  environment.id_compte = response.id
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
        else {
          console.log('incorrect mdp !!!')
        }
      } catch (error) {
        console.error('errer du catch :', error);
      }
    } else {
      console.error('remplir le formulaire');
    }
  }

  videForm() {
    this.users.lastname = '',
      this.users.firstname = '',
      this.users.email = '',
      this.users.phone = '',
      this.users.password = ''
  }
  annulerText() {
    this.modal_text = false
    this.modal_register = false
    this.contrat = false
  }

  accepterText() {
    this.modal_text = false
  }

  users: any = {
    username: '',
    password: ''
  };
  loggedInUser: any;



  updateForm() {
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
  //Ma fonction
  clickVerify(libelle: string, cp: any) {
    this.epharmaService.getUserId(environment.user_id).subscribe({
      next: (response: any) => {
        this.users.credit = response.credit
        return true
      },
      error: (error) => {
        console.error('Erreur lors de la connexion :', error);
      }
    });

    try {
      this.epharmaService.getLibelleTarif(libelle).subscribe({
        next: (response: any) => {
          let requests = [];
          let addresses: string[] = [];
          this.creditUser = response.credit;
          this.modal_verifier = true;
          this.form_modal_verifier = true;
          this.loading = true;
          this.isFinished = false;
          let test1: any[] = [];

          for (let i = 0; i < environment.pharmacies.length; i++) {
            requests.push(
              this.epharmaService.getDisponibiliteProduit(cp, environment.pharmacies[i]).pipe(
                tap((res: any) => {
                  if (res.disponibilites[0].isAvailable) {
                    addresses.push(res.pharmacy.adresse); // Mettre à jour l'adresse ici
                    test1.push(res.disponibilites);
                    if (addresses.length > 0) {
                      this.loading = false;
                      this.addressProduit = addresses;
                    } else {
                      this.loading = true;
                    }
                  }
                }),
                catchError(err => {
                  console.error(`Erreur pour la pharmacie ${environment.pharmacies[i]}:`, err);
                  return of(null); // Retourner null en cas d'erreur pour ne pas interrompre forkJoin
                })
              )
            );
          }

          forkJoin(requests).subscribe({
            next: () => {
              // Filtrer les résultats pour enlever les null
              // this.addressProduit = addresses;
              environment.produit = cp;
              // Envoyer le message ici après que toutes les requêtes soient terminées
              this.loading = false;
              this.isFinished = true;
              this.test = test1
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des disponibilités des produits:', err);
              this.loading = false;
            }
          });
        },
        error: (error) => {
          console.error('Erreur lors de la récupération du libellé tarif:', error);
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Erreur non gérée:', error);
      this.loading = false;
    }
  }

  validerCredit(credit: number) {
    this.epharmaService.souscrireCredit(environment.id_compte, credit).subscribe({
      next: (response: any) => {
        console.log('credit enlever =', response);
        this.users.credit = response.credit
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

  validerCommande(credit: number) {
    this.epharmaService.getUserId(environment.user_id).subscribe({
      next: (response: any) => {
        console.log('information user =', response);

        this.users.credit = response.credit

        return true

      },
      error: (error) => {
        console.error('Erreur lors de la connexion :', error);
      }
    });
    this.epharmaService.souscrireCredit(environment.id_compte, credit).subscribe({
      next: (response: any) => {
        console.log('credit enlever =', response);
        this.showSnackbar6 = true;
        setTimeout(() => {
          this.showSnackbar6 = false;
          this.verifier_commander = false
        }, 2000);
        this.verify(environment.produit)

      },
      error: (error) => {
        this.smserror = error.error.detail
        this.showSnackbarError6 = true;
        setTimeout(() => {
          this.showSnackbarError6 = false;
        }, 2000);
      }
    });
  }

  changePassword() {
    console.log(this.email.value)
    this.epharmaService.changerPassword(this.email.value).subscribe({
      next: (response: any) => {
        console.log('change mdp =', response);
        this.changerPass = false
        this.showSnackbar5 = true;
        setTimeout(() => {
          this.showSnackbar5 = false;
          this.ResetPassword = false
        }, 2000);
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  addresseProduit(cip: any) {
    for (let i = 0; i < environment.pharmacies.length; i++) {
      this.epharmaService.getDisponibiliteProduit(cip, environment.pharmacies[i]).subscribe({
        next: (response: any) => {
          this.addressProduit = response.pharmacy.adresse
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
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
    console.log('nom pharmacy = ', environment.pharmacy)


    console.log('nom = ', pharmacy.nom)

    if (environment.pharmacy === 'pharmacy') {

      this.selectedPharmacy = pharmacy;
      environment.pharmacy = pharmacy.nom


    } else if (pharmacy.nom === environment.pharmacy) {
      this.selectedPharmacy = pharmacy;
      environment.pharmacy = pharmacy.nom
    } else {
      this.verifier_pharmacie = true
      this.ajout_pharmacy = false
      this.pharmacieChoisi = environment.pharmacy
    }

  }

  // commander(cart: Cart, cartIndex: number) {
  //   if (cart.products.length == 0) {
  //     alert("Vous n'avez aucun produit");
  //     return;
  //   }
  //   this.commandeResult = { start: true };
  //   const array = [];
  //   for (let i = 0; i < cart.products.length; i++) {
  //     array.push({
  //       cip: cart.products[i].produitCIP,
  //       quantity: cart.products[i].quantity
  //     })
  //   }
  //   this.epharmaService.reservationProduit(array, this.buyer, this.buyerPhone, this.buyerEmail, cart.pharmacyId).subscribe({
  //     next: (response: any) => {
  //       this.commandeResult = { start: false, success: true, message: "Votre commande a été envoyée avec succès à la pharmacie [" + cart.pharmacyName + "], Réservation " + response.result.reservation + ", TTC: " + response.result.ttc + " FCFA" };
  //       this.removeCart(cartIndex);
  //     }, error: (err) => {
  //       console.log(err);
  //       this.commandeResult = { start: false, success: false, message: "Votre commande a échouée !" };
  //     }
  //   })
  // }

  //Ma fonction
  commander(cart: Cart, cartIndex: number, credit: number) {
    this.epharmaService.souscrireCredit(environment.id_compte, credit).subscribe({
      next: (response: any) => {
        console.log('credit enlever =', response);
        this.showSnackbar6 = true;
        setTimeout(() => {
          this.showSnackbar6 = false;
          this.verifier_commander = false
        }, 2000);

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

          }
          , error: (err) => {
            console.log(err);
            this.modal_verifier = true
            this.form_modal_verifier = true
            this.commandeResult = { start: false, success: false, message: "Votre commande a échouée !" };
          }
        })

        this.verify(environment.produit)

      },
      error: (error) => {
        this.smserror = error.error.detail
        this.showSnackbarError6 = true;
        setTimeout(() => {
          this.showSnackbarError6 = false;
        }, 4000);
      }
    });

  }

  open_mdp() {
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
    this.verifier_pharmacie = false
    this.ajout_pharmacy = true

  }
  clearInfoTarifUser() {
    this.modal_info_tarif_user = false
  }

  clearModification() {
    this.modal_modification1 = false
    this.changeMdp = false
    this.ResetPassword = false;
    this.modal_info_tarif_user = false
  }

  addToCart(productCIP: string, productName: string, prix_vente: number) {
    console.log("pharmacy = ", this.selectedPharmacy);

    let index = this.carts.findIndex(cart => cart.pharmacyId === this.selectedPharmacy._id);

    if (index < 0) {
      this.carts.push({
        pharmacyId: this.selectedPharmacy._id,
        pharmacyName: this.selectedPharmacy.nom,
        products: []
      });
      index = this.carts.length - 1;
    }

    if (this.quantity) {
      let productIndex = this.carts[index].products.findIndex(product => product.produitCIP === productCIP);

      if (productIndex >= 0) {
        // Mise à jour du total en soustrayant l'ancien coût du produit
        this.totalPrixVente -= this.carts[index].products[productIndex].prix_vente * this.carts[index].products[productIndex].quantity;
        // Mise à jour de la quantité
        this.carts[index].products[productIndex].quantity += this.quantity;
        // Ajout du nouveau coût au total
        this.totalCount = prix_vente * this.quantity;
        this.totalPrixVente += this.totalCount;
      } else {
        // Ajout du nouveau produit
        this.carts[index].products.push({
          quantity: this.quantity,
          produitCIP: productCIP,
          produitName: productName,
          prix_vente: prix_vente
        });
        // Ajout du prix du nouveau produit au total
        this.totalPrixVente += prix_vente * this.quantity;
      }

      console.log("Total des prix de vente :", this.totalPrixVente);
      console.log("panier :", this.carts);
    }

    this.nombreProduit = this.carts[index].products.length;
    console.log('cart = ', this.carts[index].products.length);
    console.log('nom pharmacy2 = ', environment.pharmacy);
  }


  removeFromCart(productCIP: string, cartIndex: number) {
    let productIndex = this.carts[cartIndex].products.findIndex(product => product.produitCIP === productCIP);

    if (productIndex >= 0) {
      // Soustraction du coût total du produit retiré
      this.totalPrixVente -= this.carts[cartIndex].products[productIndex].prix_vente * this.carts[cartIndex].products[productIndex].quantity;

      this.carts[cartIndex].products.splice(productIndex, 1);

      if (this.carts[cartIndex].products.length === 0) {
        this.carts.splice(cartIndex, 1);
      }
    }

    // Mise à jour du nombre total de produits après suppression
    this.nombreProduit = this.carts.reduce((total, cart) => total + cart.products.length, 0);
  }

  removeCart(cartIndex: number) {
    if (this.carts[cartIndex]) {
      for (let product of this.carts[cartIndex].products) {
        // Soustraction du coût total des produits dans le panier supprimé
        this.totalPrixVente -= product.prix_vente * product.quantity;
      }

      this.carts.splice(cartIndex, 1);
    }

    // Mise à jour du nombre total de produits après suppression du panier
    this.nombreProduit = this.carts.reduce((total, cart) => total + cart.products.length, 0);
  }
}
