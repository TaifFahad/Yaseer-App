import { Injectable } from '@angular/core';
import { collectionData, doc, docData, Firestore,getDoc } from '@angular/fire/firestore';
import { collection } from '@angular/fire/firestore';
import { addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

export interface account {
  id?: string;
  username: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  password: string;
  profileImageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore,private authService: AuthService) { }

  // Fetch all accounts
  getAcc(): Observable<account[]> {
    const accountRef = collection(this.firestore, 'driver');
    return collectionData(accountRef, { idField: 'id' }) as Observable<account[]>;
  }

  // Fetch account by ID
  getAccById(id: string): Observable<account> {
    const accountRef = doc(this.firestore, `Driver/${id}`);
    return docData(accountRef, { idField: 'id' }) as Observable<account>;
  }

  // Add a new account
  addAcc(account: account) {
    const accountRef = collection(this.firestore, 'Driver');
    return addDoc(accountRef, account);
  }

  // Delete an account by ID
  deleteAcc(account: account) {
    const accountRef = doc(this.firestore, `Driver/${account.id}`);
    return deleteDoc(accountRef);
  }

  // Update an account by ID
  updateAcc(account: account) {
    const accountRef = doc(this.firestore, `Driver/${account.id}`);
    return updateDoc(accountRef, {
      username: account.username,
      idNumber: account.idNumber,
      phoneNumber: account.phoneNumber,
      email: account.email,
      password: account.password,
      profileImageUrl: account.profileImageUrl // Add this line to update the profile image URL
    });
  }
  async getDriverData() {
    const driverID = this.authService.getCurrentUserId();
    if (!driverID) return null; // Return null if there's no user ID

    const driverDocRef = doc(this.firestore, 'Driver', driverID);
    const driverDoc = await getDoc(driverDocRef);

    if (driverDoc.exists()) {
      return driverDoc.data(); // Return the driver data
    } else {
      console.error('No such document!');
      return null; // Return null if no document found
    }

    }  }

