import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MerchantModel} from "../models";

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private apiUrl = 'http://localhost:3000/api/merchants';

  constructor(private http: HttpClient) { }

  registerMerchant(
    name: string,
    contact_number: number,
    email: string,
    company_description: string
  ): Observable<any> {
    const merchantData :MerchantModel =
      {
        document_description: null,
        documents: null,
        _id: null,
        status: null,
        name,
        contact_number,
        email,
        company_description };


    return this.http.post(`${this.apiUrl}/register-merchant`, merchantData);
  }

  uploadDocuments(merchantId: string, files: File[], documentDescription: string): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('documents', files[i]);
    }
    formData.append('document_description', documentDescription);

    return this.http.post(`${this.apiUrl}/${merchantId}/upload`, formData);
  }

  getPendingApplications(): Observable<MerchantModel[]> {
    return this.http.get<MerchantModel[]>(`${this.apiUrl}/pending`);
  }

  getMerchantById(id: string): Observable<MerchantModel> {
    return this.http.get<MerchantModel>(`${this.apiUrl}/${id}`);
  }

  approveMerchant(merchantId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/approve/${merchantId}`, {});
  }

  rejectMerchant(merchantId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reject/${merchantId}`, {});
  }
}
