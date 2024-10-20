// import { Injectable } from '@angular/core';
// import{Auth} from '@angular/fire/auth'
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { Firestore, setDoc, doc } from '@angular/fire/firestore'; // Import Firestore functions

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor(private auth: Auth, private firestore: Firestore) { }
//  // Register a new user
//   async register({ email, password }: { email: string; password: string; }) {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
//       return userCredential; // Return userCredential instead of user
//     } catch (e) {
//       console.error('Registration error:', e);
//       return null; // Log error for debugging
//     }
//   }

  
//   async login({ email, password }: { email: string; password: string; }) {
//     try{
//       const user= await signInWithEmailAndPassword(this.auth,
//         email,
//         password);
//       return user
//     }
//       catch (e){
// return null;
//       }
//   }

//   logout(){}
// }


//   // // Register a new user
//   // async register({ email, password }: { email: string; password: string; }) {
//   //   try {
//   //     const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
//   //     return userCredential; // Return userCredential instead of user
//   //   } catch (e) {
//   //     console.error('Registration error:', e);
//   //     return null; // Log error for debugging
//   //   }
//   // }
//   // async register({ username, idNumber, phoneNumber, password }: any) {
//   //   try {
//   //     const result = await this.afAuth.createUserWithEmailAndPassword(username + '@example.com', password);
//   //     // You can save other user details in your database here
//   //     return result;
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   //}




import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

async register({ username, idNumber, phoneNumber, email, password }: { username: string; idNumber: string; phoneNumber: string; email: string; password: string; }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    return userCredential; // Return userCredential instead of user
  } catch (e) {
    console.error('Registration error:', e);
    return null; // Log error for debugging
  }
}

  async login({ email, password }: { email: string; password: string; }): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user; // Return the user object
    } catch (e) {
      console.error('Login error:', e);
      return null; // Handle errors appropriately
    }
  }

  logout() {
    // Implement logout functionality if needed
  }
}
