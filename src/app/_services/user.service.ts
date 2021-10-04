import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

const USER_API = 'http://localhost:8080/api/user/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(`${USER_API}get`);
  }

  editUser(user, roles): Observable<any> {
    return this.http.post(`${USER_API}edit/${user.id}`, {
      username: user.username,
      roles: roles
    }, httpOptions);
  }

  deleteUser(userId): Observable<any> {
    return this.http.delete(`${USER_API}delete/${userId}`);
  }
}
