import { Injectable } from '@angular/core';
import { collectionData, doc, docData, Firestore } from '@angular/fire/firestore';
import { collection } from '@angular/fire/firestore';
import { addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

export interface account{
  id?: string;
  username: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  password: string;
  relationship: string;

}
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }


  getAcc(): Observable<account[]>{
    const accountRef = collection(this.firestore, '1');
    return collectionData(accountRef, {idField: 'id'}) as Observable<account[]>;
  }
  getAccById(id: string): Observable<account> {
    const accountRef = doc(this.firestore, '1/${id}');
    return docData(accountRef, {idField: 'id'}) as Observable<account>;
  }
  addAcc(account: account) {
    const accountRef = collection(this.firestore, '1');
    return addDoc(accountRef,account) ;
  }
  deleteAcc(account: account) {
    const accountRef = doc(this.firestore, '1/${id}');
    return deleteDoc(accountRef);
  }
  updateAcc(account: account) {
    const accountRef = doc(this.firestore, '1/${id}');
    return updateDoc(accountRef,{username:account.username, idNumber: account.idNumber, 
      phoneNumber: account.phoneNumber, email: account.email, password: account.password, relationship: account.relationship
    });
  }
}