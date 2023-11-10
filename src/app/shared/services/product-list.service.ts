import { Injectable } from '@angular/core';
import {ProductModel} from "../models";
import {v4 as uuidv4} from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class ProductListService {

  private products: ProductModel[] = [];

  constructor() {
    this.initializeData();
    this.loadProductsData();
  }

  private initializeData() {
    this.loadProductsData();
    if (this.products.length === 0) {
      const initialProducts: ProductModel[] = [
        {
          id: uuidv4(),
          name: 'Tour Package 1',
          description: 'Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves. Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves.Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves.Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves.Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves.Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves.',
          price: 100,
          image: 'tour-package1.jpg',
          ratings: 4.5,
        },
        {
          id: uuidv4(),
          name: 'Tour Package 2',
          description: 'Ocean seashore with beautiful turquoise water and sea waves.',
          price: 150,
          image: 'tour-package2.jpg',
          ratings: 4.8,
        },
        {
          id: uuidv4(),
          name: 'Tour Package 3',
          description: 'Tourist walking towards historical architectural monument.',
          price: 120,
          image: 'tour-package3.jpg',
          ratings: 4.2,
        },
        {
          id: uuidv4(),
          name: 'Tour Package 4',
          description: 'Bell tower part of ensemble of city cathedral.',
          price: 90,
          image: 'tour-package4.jpg',
          ratings: 4.6,
        },
      ];

      for (const product of initialProducts) {
        this.saveProductsData(product);
      }
    }
  }

  private loadProductsData() {
    this.products = JSON.parse(localStorage.getItem('products')) || [];
  }

  getProductsData() {
    this.loadProductsData();
    return this.products;
  }

  private saveProductsData(product: ProductModel) {
    this.products.push(product);
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  getProductById(id: string): ProductModel | undefined {
    return this.products.find((product) => product.id === id);
  }

}
