// import { Injectable } from '@angular/core';
// import { collectionData, doc, docData, Firestore, collection, addDoc, deleteDoc, updateDoc, query, orderBy, limit, getDocs } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { Timestamp } from '@angular/fire/firestore';

// export interface Account {
//   id?: string;
//   username: string;
//   idNumber: string;
//   phoneNumber: string;
//   email: string;
//   password: string;
//   relationship: string;
// }

// export interface Student {
//   id?: string;
//   name: string;
//   studentID: string;
//   birthDate: string;
//   studentClass: string;
//   address: string;
//   gender: string;
//   subscriptionType: string;
//   profileImageUrl: string; // Add field for image upload URL
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class DataService {
//   constructor(private firestore: Firestore) { }

//   // Parent methods
//   getAcc(): Observable<Account[]> {
//     const accountRef = collection(this.firestore, '1');
//     return collectionData(accountRef, { idField: 'id' }) as Observable<Account[]>;
//   }

//   getAccById(id: string): Observable<Account> {
//     const accountRef = doc(this.firestore, `1/${id}`);
//     return docData(accountRef, { idField: 'id' }) as Observable<Account>;
//   }

//   addAcc(account: Account) {
//     const accountRef = collection(this.firestore, '1');
//     return addDoc(accountRef, account);
//     createdAt: Timestamp.now() // Adds the timestamp when the account is created
//   }

//   deleteAcc(account: Account) {
//     const accountRef = doc(this.firestore, `1/${account.id}`);
//     return deleteDoc(accountRef);
//   }

//   updateAcc(account: Account) {
//     const accountRef = doc(this.firestore, `1/${account.id}`);
//     return updateDoc(accountRef, {
//       username: account.username,
//       idNumber: account.idNumber,
//       phoneNumber: account.phoneNumber,
//       email: account.email,
//       password: account.password,
//       relationship: account.relationship
//     });
//   }

//   // Student methods
//   // async addStu(parentId: string, student: Student): Promise<void> {
//   //   try {
//   //     const studentRef = collection(this.firestore, `1/${parentId}/students`);
//   //     const docRef = await addDoc(studentRef, student);
//   //     console.log('Student added with ID:', docRef.id);
//   //   } catch (error) {
//   //     console.error('Error adding student:', error);
//   //     throw new Error('Failed to add student');
//   //   }
//   // }

//   // getStudents(parentId: string): Observable<Student[]> {
//   //   const studentRef = collection(this.firestore, `1/${parentId}/students`);
//   //   return collectionData(studentRef, { idField: 'id' }) as Observable<Student[]>;
//   // }

//   // updateStudent(parentId: string, student: Student) {
//   //   const studentRef = doc(this.firestore, `1/${parentId}/students/${student.id}`);
//   //   return updateDoc(studentRef, {
//   //     name: student.name,
//   //     studentID: student.studentID,
//   //     birthDate: student.birthDate,
//   //     studentClass: student.studentClass,
//   //     address: student.address,
//   //     gender: student.gender,
//   //     subscriptionType: student.subscriptionType,
//   //     profileImageUrl: student.profileImageUrl
//   //   });
//   // }

//   // deleteStudent(parentId: string, studentId: string) {
//   //   const studentRef = doc(this.firestore, `1/${parentId}/students/${studentId}`);
//   //   return deleteDoc(studentRef);
//   // }

// //   // Get the most recently created parent account ID
// //   async getLastCreatedParentId(): Promise<string | null> {
// //     const accountRef = collection(this.firestore, '1');
// //     const accountQuery = query(accountRef, orderBy('createdAt', 'desc'), limit(1));
// //     const querySnapshot = await getDocs(accountQuery);
// //     if (!querySnapshot.empty) {
// //       return querySnapshot.docs[0].id;
// //     }
// //     return null;
// //   }

// //   // Add a child to the parent's document
// //   addChild(parentId: string, childData: Student) {
// //     const childRef = collection(this.firestore, `1/${parentId}/children`);
// //     return addDoc(childRef, childData);
// //   }
// // }
// // Get the most recently created parent account ID
// // Get the most recently created parent account ID
// async getLastCreatedParentId(): Promise<string | null> {
//   try {
//     const accountRef = collection(this.firestore, '1');
//     const accountQuery = query(accountRef, orderBy('createdAt', 'desc'), limit(1));
//     const querySnapshot = await getDocs(accountQuery);

//     if (!querySnapshot.empty) {
//       const lastCreatedParentId = querySnapshot.docs[0].id;
//       console.log('Last created parent ID:', lastCreatedParentId); // Logging for debugging
//       return lastCreatedParentId;
//     } else {
//       console.warn('No parent accounts found');
//     }
//   } catch (error) {
//     console.error('Error retrieving last created parent ID:', error);
//   }
//   return null;
// }


// // Add a child to the parent's document
// async addChild(parentId: string, childData: Student) {
//   try {
//     if (!parentId) {
//       throw new Error('Invalid parent ID');
//     }

//     const childRef = collection(this.firestore, `1/${parentId}/children`);
//     const docRef = await addDoc(childRef, childData);
//     console.log('Child added successfully with ID:', docRef.id); // Logging for debugging
//     return docRef;
//   } catch (error) {
//     console.error('Error adding child:', error);
//     throw new Error('Failed to add child');
//   }
// }
// }
import { Injectable } from '@angular/core';
import { collectionData, doc, docData, Firestore, collection, addDoc, deleteDoc, updateDoc, query, orderBy, limit, getDocs, getDoc ,DocumentData} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export interface Account {
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
  studentID: string;
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

  // Parent methods
  getAcc(): Observable<Account[]> {
    const accountRef = collection(this.firestore, '1');
    return collectionData(accountRef, { idField: 'id' }) as Observable<Account[]>;
  }

  getAccById(id: string): Observable<Account> {
    const accountRef = doc(this.firestore, `1/${id}`);
    return docData(accountRef, { idField: 'id' }) as Observable<Account>;
  }

  async addAcc(account: Account): Promise<string> {
    const accountRef = collection(this.firestore, '1');
    const docRef = await addDoc(accountRef, {
      ...account,
      createdAt: Timestamp.now() // Adds the timestamp when the account is created
    });
    console.log('Parent account created with ID:', docRef.id); // Log the created ID
    return docRef.id; // Return the ID for further use
  }

  deleteAcc(account: Account) {
    const accountRef = doc(this.firestore, `1/${account.id}`);
    return deleteDoc(accountRef);
  }

  updateAcc(account: Account) {
    const accountRef = doc(this.firestore, `1/${account.id}`);
    return updateDoc(accountRef, {
      username: account.username,
      idNumber: account.idNumber,
      phoneNumber: account.phoneNumber,
      email: account.email,
      password: account.password,
      relationship: account.relationship
    });
  }

  // Create parent account and add student
  async createParentAndAddChild(account: Account, studentData: Student): Promise<void> {
    try {
      const parentId = await this.addAcc(account); // Create parent account and get the ID
      console.log('Parent ID obtained:', parentId);

      // Check if the parentId is valid before adding the student
      if (parentId) {
        await this.addChild(parentId, studentData); // Add the child with the parent ID
        console.log('Student added successfully under parent ID:', parentId);
      } else {
        console.warn('Failed to retrieve parent ID.');
      }
    } catch (error) {
      console.error('Error in creating parent and adding child:', error);
    }
  }

  async getLastCreatedParentId(): Promise<string | null> {
    try {
        const accountRef = collection(this.firestore, '1');
        const accountQuery = query(accountRef, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(accountQuery);

        if (!querySnapshot.empty) {
            const lastCreatedParentId = querySnapshot.docs[0].id;
            console.log('Last created parent ID:', lastCreatedParentId); // Logging for debugging
            return lastCreatedParentId;
        } else {
            console.warn('No parent accounts found');
        }
    } catch (error) {
        console.error('Error retrieving last created parent ID:', error);
    }
    return null;
}


  async addChild(parentId: string, childData: Student) {
    try {
      if (!parentId) {
        throw new Error('Invalid parent ID');
      }

      const childRef = collection(this.firestore, `1/${parentId}/children`);
      const docRef = await addDoc(childRef, childData);
      console.log('Child added successfully with ID:', docRef.id); // Logging for debugging
      return docRef;
    } catch (error) {
      console.error('Error adding child:', error);
      throw new Error('Failed to add child');
    }
  }
  // In your DataService class
// In your DataService class
async addChildToLastCreatedParent(childData: Student): Promise<void> {
  try {
      const parentId = await this.getLastCreatedParentId(); // Retrieve the last created parent ID
      if (!parentId) {
          throw new Error('No parent ID found');
      }
      
      // Log the parent ID for debugging
      console.log('Adding child to parent ID:', parentId);
      
      // Add the child to the retrieved parent ID
      const childRef = collection(this.firestore, `1/${parentId}/children`);
      const docRef = await addDoc(childRef, childData);
      console.log('Child added successfully with ID:', docRef.id); // Log the child ID for debugging
  } catch (error) {
      console.error('Error adding child to last created parent:', error);
      throw new Error('Failed to add child to last created parent');
  }
}
async getStudentsByParentId(parentId: string): Promise<Student[]> {
  const childRef = collection(this.firestore, `1/${parentId}/children`);
  const querySnapshot = await getDocs(childRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];
}
// New method to save the cluster data (name, lat, lng)
async saveToCluster(clusterData: { name: string; lat: number; lng: number }) {
  const clusterCollectionRef = collection(this.firestore, 'cluster'); // Use 'collection' function here
  return addDoc(clusterCollectionRef, clusterData); // Use 'addDoc' function to add data
}

}