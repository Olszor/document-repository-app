import { Component, OnInit } from '@angular/core';
import { UserService } from "../_services/user.service";
import { User } from "../models/user";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Role} from "../models/role";
import {TokenStorageService} from "../_services/token-storage.service";
import {AuthService} from "../_services/auth.service";

@Component({
  selector: 'app-users',
  templateUrl: './users/users.component.html',
  styleUrls: ['./users/users.component.css']
})
export class UsersComponent implements OnInit {

  isLoggedIn = false;
  showUsers = false;
  showAddUser = false;
  showEditUser = false;
  showDeleteUser = false;
  loggedUserRoles: string[];
  message: string;
  isSuccessful = false;
  isFailed = false;
  users: User[];
  editUser: User;
  deleteUser: User;
  userRoles: string[] = [];
  roles: Role[] = [
    {name: "ROLE_VIEW_USERS", checked: false},
    {name: "ROLE_ADD_USERS", checked: false},
    {name: "ROLE_EDIT_USERS", checked: false},
    {name: "ROLE_DELETE_USERS", checked: false},
    {name: "ROLE_VIEW_DOCUMENTS", checked: false},
    {name: "ROLE_ADD_DOCUMENTS", checked: false},
    {name: "ROLE_EDIT_DOCUMENTS", checked: false},
    {name: "ROLE_DELETE_DOCUMENTS", checked: false},
  ]

  constructor(private userService: UserService, private authService: AuthService, private tokenStorageService: TokenStorageService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if(this.isLoggedIn) {
      const loggedUser = this.tokenStorageService.getUser();
      this.loggedUserRoles = loggedUser.roles;

      this.showUsers = this.loggedUserRoles.includes('ROLE_VIEW_USERS');
      this.showAddUser = this.loggedUserRoles.includes('ROLE_ADD_USERS');
      this.showEditUser = this.loggedUserRoles.includes('ROLE_EDIT_USERS');
      this.showDeleteUser = this.loggedUserRoles.includes('ROLE_DELETE_USERS');
      this.getUsers();
    }
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
      }
    )
  }

  openEditModal(content, user) {
    this.editUser = user;
    this.setRoles();
    this.modalService.open(content, {ariaLabelledBy: 'editUser'});
  }

  openAddModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'addUser'});
  }

  openDeleteModal(content, user) {
    this.deleteUser = user;
    this.modalService.open(content, {ariaLabelledBy: 'deleteUser'});
  }

  onUpdateUser(user: User) {
    console.log(user.username);
    user.id = this.editUser.id;
    this.roles
      .filter(role => role.checked)
      .forEach(role => {
        this.userRoles.push(role.name);
        role.checked = false;
      })

    this.userService.editUser(user, this.userRoles).subscribe(
      data => {
        this.isSuccessful = true;
        this.isFailed = false;
        this.getUsers();
        this.message = data.message;
        if(user.id == this.tokenStorageService.getUser().id) {
          this.tokenStorageService.signOut();
          window.location.reload();
        }
      },
      error => {
        this.message = error.error.message;
        this.isFailed = true;
        this.isSuccessful = false;
      }
    )
    this.userRoles = [];
  }

  onAddUser(user) {
    this.roles
      .filter(role => role.checked)
      .forEach(role => {
        this.userRoles.push(role.name);
        role.checked = false;
      })

    this.authService.addUser(user, this.userRoles).subscribe(
      data => {
        this.isSuccessful = true;
        this.isFailed = false;
        this.getUsers();
        this.message = data.message;
      },
      error => {
        this.isFailed = true;
        this.isSuccessful = false;
        this.message = error.error.message;
      }
    )
    this.userRoles = [];
  }

  onDeleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(
      data => {
        this.isSuccessful = true;
        this.isFailed = false;
        this.getUsers();
        this.message = data.message;
      },
      error => {
        this.isFailed = true;
        this.isSuccessful = false;
        this.message = error.error.message;
      }
    )
  }

  setRoles() {
    this.roles
      .map(role => role.checked = !!this.editUser.roles.find(userRole => userRole.name == role.name))
  }
}
