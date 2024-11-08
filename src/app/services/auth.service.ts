
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Firestore, setDoc, doc, query, getDocs, collection, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async register({ username, idNumber, phoneNumber, email, password, relationship }: { username: string; idNumber: string; phoneNumber: string; email: string; password: string; relationship:string }) {
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Get the UID of the newly created user
      const userId = userCredential.user.uid; 

      // Prepare user data to save in Firestore
      const userData = {
        username,
        idNumber,
        phoneNumber,
        email,
        password,
        relationship,

        createdAt: new Date(),
      };

      // Save additional user data in Firestore
      await setDoc(doc(this.firestore, '1', userId), userData); // '1' is your Firestore collection name

      return userCredential; // Return the userCredential for further use if needed
    } catch (e) {
      console.error('Registration error:', e);
      return null; // Log error for debugging
    }
  }

  // Add login method and other methods here...

//Add login method and other methods here...

  async login({ email, password }: { email: string; password: string; }): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user; // Return the user object
    } catch (e) {
      console.error('Login error:', e);
      return null; // Handle errors appropriately
    }
  }
  
    // Get the currently logged in user's ID
    getCurrentUserId(): string | null {
      const user = this.auth.currentUser;
      return user ? user.uid : null;
    }
  

  logout() {
    // Implement logout functionality if needed
  }
}