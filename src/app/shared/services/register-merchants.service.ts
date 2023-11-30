import {Injectable} from '@angular/core';
import {MerchantModel} from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegisterMerchantsService {
  private merchants: MerchantModel[] = [];

  constructor() {
  }
  getMerchantsData(): MerchantModel[] {
    return this.merchants;
  }
}
