import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "./_services/token-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  private roles: string[];
  isLoggedIn = false;
  showDocumentComponent = false;
  showUsersComponent = false;
  username: string;

  title = 'documentrepositoryapp';

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if(this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showDocumentComponent = this.roles.includes('ROLE_VIEW_DOCUMENTS');
      this.showUsersComponent = this.roles.includes('ROLE_VIEW_USERS');

      this.username = user.username;
    }
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
