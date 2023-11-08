import { Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {

  products = [
    {image:'assets/images/carousel1.jpg',},
    {image:'assets/images/carousel2.jpg',},
    {image:'assets/images/carousel3.jpg',},
    {image:'assets/images/carousel4.jpg',},
    {image:'assets/images/carousel5.jpg',},
    {image:'assets/images/carousel1.jpg',},
    {image:'assets/images/carousel2.jpg',},
    {image:'assets/images/carousel3.jpg',},
  ]
}
