import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Form} from "@angular/forms";

const DOCUMENT_API = 'http://localhost:8080/api/document/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  getDocuments(): Observable<any> {
    return this.http.get<any>(`${DOCUMENT_API}get`);
  }

  addDocument(formData: FormData): Observable<any> {
    return this.http.post(`${DOCUMENT_API}add`, formData);
  }

  editDocument(document, documentId): Observable<any> {
    return this.http.post(`${DOCUMENT_API}edit/${documentId}`, {
      name: document.documentName
    }, httpOptions);
  }

  deleteDocument(documentId): Observable<any> {
    return this.http.delete(`${DOCUMENT_API}delete/${documentId}`);
  }

  addVersion(formData, documentId): Observable<any> {
    return this.http.post(`${DOCUMENT_API}add/version/${documentId}`, formData);
  }

  editVersion(version, versionId): Observable<any> {
    return this.http.post(`${DOCUMENT_API}edit/version/${versionId}`, {
      version: version.version,
      dateOfCreation: version.dateOfCreation,
    }, httpOptions);
  }

  editVersionAndFile(formData, versionId): Observable<any> {
    return this.http.post(`${DOCUMENT_API}edit/version/and/file/${versionId}`, formData);
  }

  deleteVersion(versionId): Observable<any> {
    return this.http.delete(`${DOCUMENT_API}delete/version/${versionId}`);
  }

  downloadFile(fileName): Observable<any> {
    return this.http.get(`${DOCUMENT_API}download/${fileName}`, {
      responseType: 'blob'
    });
  }
}
