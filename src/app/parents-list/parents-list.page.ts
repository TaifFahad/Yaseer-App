import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parents-list',
  templateUrl: './parents-list.page.html',
  styleUrls: ['./parents-list.page.scss'],
})
export class ParentsListPage implements OnInit {
  parents: any[] = [];

  constructor(private afs: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.afs.collection('1').valueChanges({ idField: 'id' }).subscribe(parents => {
      this.parents = parents;
    });
  }

  openChatRoom(parent: any) {
    // Navigate to the communication page with the selected parent's ID
    this.router.navigate(['/communication', parent.id]);
  }
}