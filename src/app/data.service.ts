// data.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private storageKey = 'sharedData';
  private storageCompte = 'sharedCompte';
  private storageToken = 'sharedToken';


  setSharedData(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  setSharedCompte(data: any) {
    localStorage.setItem(this.storageCompte, JSON.stringify(data));
  }
  setSharedToken(data: any) {
    localStorage.setItem(this.storageToken, JSON.stringify(data));
  }

  getSharedData() {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : null;
  }

  getSharedCompte() {
    const storedData = localStorage.getItem(this.storageCompte);
    return storedData ? JSON.parse(storedData) : null;
  }
  getSharedToken() {
    const storedData = localStorage.getItem(this.storageToken);
    return storedData ? JSON.parse(storedData) : null;
  }

  clearSharedData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.storageCompte);

  }
}
