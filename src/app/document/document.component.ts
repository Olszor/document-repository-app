import { Component, OnInit } from '@angular/core';
import {Document} from "../models/document";
import {DocumentService} from "../_services/document.service";
import {TokenStorageService} from "../_services/token-storage.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Version} from "../models/version";
import { saveAs } from  "file-saver";

@Component({
  selector: 'app-document',
  templateUrl: './document/document.component.html',
  styleUrls: ['./document/document.component.css']
})
export class DocumentComponent implements OnInit {

  isLoggedIn = false;
  showDocuments = false;
  showAddDocument = false;
  showEditDocument = false;
  showDeleteDocument = false;
  loggedUserRoles: string[];
  message: string;
  isSuccessful = false;
  isFailed = false;
  documents: Document[];
  addDocument: Document;
  editDocument: Document;
  editVersion: Version;
  viewDocument: Document;
  deleteDocument: Document;
  deleteVersion: Version;
  file: File | null;

  constructor(private documentService: DocumentService, private tokenStorageService: TokenStorageService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if(this.isLoggedIn) {
      const loggedUser = this.tokenStorageService.getUser();
      this.loggedUserRoles = loggedUser.roles;

      this.showDocuments = this.loggedUserRoles.includes('ROLE_VIEW_DOCUMENTS');
      this.showAddDocument = this.loggedUserRoles.includes('ROLE_ADD_DOCUMENTS');
      this.showEditDocument = this.loggedUserRoles.includes('ROLE_EDIT_DOCUMENTS');
      this.showDeleteDocument = this.loggedUserRoles.includes('ROLE_DELETE_DOCUMENTS');
      this.getDocuments();
    }
  }

  public getDocuments(): void {
    this.documentService.getDocuments().subscribe(
      data => {
        this.documents = data;
      },
      error => {

      }
    );
  }

  openEditModal(content, document) {
    this.editDocument = document;
    this.modalService.open(content, {ariaLabelledBy: 'editDocument'});
  }

  openEditVersionModal(content, version) {
    this.editVersion = version;
    this.modalService.open(content, {ariaLabelledBy: 'editVersion'})
  }

  openAddDocumentModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'addDocument'});
  }

  openAddVersionModal(content, document) {
    this.addDocument = document;
    this.modalService.open(content, {ariaLabelledBy: 'addVersion'});
  }

  openDeleteDocumentModal(content, document) {
    this.deleteDocument = document;
    this.modalService.open(content, {ariaLabelledBy: 'deleteDocument'});
  }

  openDeleteVersionModal(content, version) {
    this.deleteVersion = version;
    this.modalService.open(content, {ariaLabelledBy: 'deleteVersion'});
  }

  openVersionModal(content, document) {
    this.viewDocument = document;
    this.modalService.open(content, {ariaLabelledBy: 'viewDocument'});
  }

  onAddDocument(document) {
    const formData = new FormData();
    formData.append("name", document.documentName);
    formData.append("version", document.version);
    formData.append("dateOfCreation", document.dateOfCreation);
    formData.append("file", this.file!, this.file!.name);
    this.documentService.addDocument(formData).subscribe(
      data => {
        this.isSuccessful = true;
        this.isFailed = false;
        this.getDocuments();
        this.message = data.message;
      },
      error => {
        this.isFailed = true;
        this.isSuccessful = false;
        this.message = error.error.message;
      }
    );
    this.file = null;
  }

  onAddVersion(version) {
    const formData = new FormData();
    formData.append("version", version.version);
    formData.append("dateOfCreation", version.dateOfCreation);
    formData.append("file", this.file!, this.file!.name);
    this.documentService.addVersion(formData, this.addDocument.id).subscribe(
      data => {
        this.isSuccessful = true;
        this.isFailed = false;
        this.modalService.dismissAll();
        this.getDocuments();
        this.message = data.message;
      },
      error => {
        this.isFailed = true;
        this.isSuccessful = false;
        this.message = error.error.message;
      }
    );
    this.file = null;
  }

  onEditDocument(document) {
    this.documentService.editDocument(document, this.editDocument.id).subscribe(
      data => {
        this.isSuccessful = true;
        this.isFailed = false;
        this.getDocuments();
        this.message = data.message;
      },
      error => {
        this.isFailed = true;
        this.isSuccessful = false;
        this.message = error.error.message;
      }
    );
  }

  onEditVersion(version) {
    if(this.file == null) {
      this.documentService.editVersion(version, this.editVersion.id).subscribe(
        data => {
          this.isSuccessful = true;
          this.isFailed = false;
          this.modalService.dismissAll();
          this.getDocuments();
          this.message = data.message;
        },
        error => {
          this.isFailed = true;
          this.isSuccessful = false;
          this.message = error.error.message;
        }
      );
    } else {
      const formData = new FormData();
      formData.append("version", version.version);
      formData.append("dateOfCreation", version.dateOfCreation);
      formData.append("file", this.file, this.file.name);
      this.documentService.editVersionAndFile(formData, this.editVersion.id).subscribe(
        data => {
          this.isSuccessful = true;
          this.isFailed = false;
          this.modalService.dismissAll();
          this.getDocuments();
          this.message = data.message;
        },
        error => {
          this.isFailed = true;
          this.isSuccessful = false;
          this.message = error.error.message;
        }
      );
      this.file = null;
    }
  }

  onDeleteDocument(documentId) {
    this.documentService.deleteDocument(documentId).subscribe(
      data => {
        this.isSuccessful = true;
        this.isFailed = false;
        this.getDocuments();
        this.message = data.message;
      },
      error => {
        this.isFailed = true;
        this.isSuccessful = false;
        this.message = error.error.message;
      }
    );
  }

  onDeleteVersion(versionId) {
    this.documentService.deleteVersion(versionId).subscribe(
      data => {
        this.isSuccessful = true;
        this.isFailed = false;
        this.modalService.dismissAll();
        this.getDocuments();
        this.message = data.message;
      },
      error => {
        this.isFailed = true;
        this.isSuccessful = false;
        this.message = error.error.message;
      }
    );
  }

  onDownloadFile(fileName) {
    this.documentService.downloadFile(fileName).subscribe(blob => saveAs(blob, fileName));
  }

  fileChange(event) {
    this.file = event.target.files[0];
  }

}
