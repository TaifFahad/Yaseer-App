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
export interface Student {
  id?: string;
  name: string;
  idNumber: string;
  birthDate: string;
  studentClass: string;
  address: string;
  gender: string;
  subscriptionType: string;
  profileImageUrl: string; // Add field for image upload URL
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

//parent methods
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
// Student methods

  // Add student info to a parent's subcollection
   // Add student info to a parent's subcollection
//    async addStu(parentId: string, student: Student): Promise<void> {
//     try {
//       const studentRef = collection(this.firestore, `parents/${parentId}/students`);
//       const docRef = await addDoc(studentRef, student);
//       console.log('Student added with ID:', docRef.id);
//     } catch (error) {
//       console.error('Error adding student:', error);
//       throw new Error('Failed to add student'); // Re-throw error or handle as necessary
//     }
//   }

//   // Get all students for a specific parent
//   getStudents(parentId: string): Observable<Student[]> {
//     const studentRef = collection(this.firestore, `parents/${parentId}/students`);
//     return collectionData(studentRef, { idField: 'id' }) as Observable<Student[]>;
//   }

//   // Update a student's info
//   updateStudent(parentId: string, student: Student) {
//     const studentRef = doc(this.firestore, `parents/${parentId}/students/${student.id}`);
//     return updateDoc(studentRef, {
//       name: student.name,
//       idNumber: student.idNumber,
//       birthDate: student.birthDate,
//       studentClass: student.studentClass,
//       address: student.address,
//       gender: student.gender,
//       subscriptionType: student.subscriptionType,
//       profileImageUrl: student.profileImageUrl // Add image upload URL
//     });
//   }

//   // Delete a student
//   deleteStudent(parentId: string, studentId: string) {
//     const studentRef = doc(this.firestore, `parents/${parentId}/students/${studentId}`);
//     return deleteDoc(studentRef);
//   }
// }

}