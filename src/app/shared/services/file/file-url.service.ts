import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUrlService {
  getFileUrl(filename: string): string {
    if (!filename) return '';
    return `${environment.apiUrl}/files/server/src/uploads/${filename}`;
  }
}
