import {AfterViewInit, Component, OnInit} from '@angular/core';
import { initCarousels } from 'flowbite';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements AfterViewInit{
  ngAfterViewInit(): void {
      initCarousels();
  }


  // An array of objects, each containing the path to an image for the carousel.
  carousels = [
    { image: 'assets/images/carousel1.jpg' },
    { image: 'assets/images/carousel2.jpg' },
    { image: 'assets/images/carousel3.jpg' },
    { image: 'assets/images/carousel4.jpg' },
    { image: 'assets/images/carousel5.jpg' },
  ];
}
