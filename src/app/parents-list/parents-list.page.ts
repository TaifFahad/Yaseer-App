// import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-parents-list',
//   templateUrl: './parents-list.page.html',
//   styleUrls: ['./parents-list.page.scss'],
// })
// export class ParentsListPage implements OnInit {
//   parents: any[] = [];

//   constructor(private afs: AngularFirestore, private router: Router) { }

//   ngOnInit() {
//     this.afs.collection('1').valueChanges({ idField: 'id' }).subscribe(parents => {
//       this.parents = parents;
//     });
//   }

//   openChatRoom(parent: any) {
//     // Navigate to the communication page with the selected parent's ID
//     this.router.navigate(['/communication', parent.id]);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';

interface Parent {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string; // Optional, will be set from child
}

interface Child {
  profileImageUrl?: string;
}

@Component({
  selector: 'app-parents-list',
  templateUrl: './parents-list.page.html',
  styleUrls: ['./parents-list.page.scss'],
})
export class ParentsListPage implements OnInit {
  parents: Parent[] = [];
  loading: any;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    // Show loading spinner while fetching data
    this.loading = await this.loadingController.create({
      message: 'جاري التحميل',
    });
    await this.loading.present();

    // Fetch the list of parents from Firestore and include 'id' field
    this.afs.collection('1').snapshotChanges().subscribe(parentsSnapshot => {
      // Process each parent document
      this.parents = parentsSnapshot.map(doc => {
        const data = doc.payload.doc.data() as Parent;
        const id = doc.payload.doc.id;
        return { ...data, id }; // Assign 'id' to the parent object
      });

      // After fetching, load profile images for each parent
      let completedRequests = 0; // To track the number of completed image fetches
      this.parents.forEach(parent => {
        this.loadProfileImage(parent.id).subscribe(profileImageUrl => {
          parent.profileImageUrl = profileImageUrl || 'assets/default-avatar.jpg'; // Fallback if no image
          completedRequests++;

          // Once all profile images are loaded, dismiss the loading spinner
          if (completedRequests === this.parents.length) {
            this.loading.dismiss();
          }
        });
      });

      // If there are no profile images to load, dismiss the loading spinner immediately
      if (this.parents.length === 0) {
        this.loading.dismiss();
      }
    });
  }

  // Function to get the profile image URL for each parent from their children's collection
  loadProfileImage(parentId: string): Observable<string | null> {
    const childrenRef = this.afs.collection(`1/${parentId}/children`);
    return new Observable(observer => {
      childrenRef.get().subscribe(snapshot => {
        if (!snapshot.empty) {
          const childDoc = snapshot.docs[0];  // Get the first child (you can change logic to handle multiple children if needed)
          const childData = childDoc.data() as Child;  // Cast to Child type
          observer.next(childData.profileImageUrl || null);  // Return the profileImageUrl or null
        } else {
          observer.next(null); // No children, return null
        }
      });
    });
  }

  openChatRoom(parent: any) {
    // Navigate to the communication page with the selected parent's ID
    this.router.navigate(['/communication', parent.id]);
  }
}
