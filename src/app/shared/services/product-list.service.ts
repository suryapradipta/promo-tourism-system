import {Injectable} from '@angular/core';
import {ProductModel} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private products: ProductModel[] = [];

  getProductsData(): ProductModel[] {
    return this.products;
  }


}
