import { Component } from '@angular/core';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css'],
})
export class PackageComponent {
  /**
   * Array of travel packages with details such as name, hyperlink, and image source.
   */
  packages = [
    {
      name: 'Diving',
      href: '#',
      imageSrc: 'assets/images/diving.jpg',
    },
    {
      name: 'Cruise',
      href: '#',
      imageSrc: 'assets/images/cruise.jpg',
    },
    {
      name: 'Honeymoon',
      href: '#',
      imageSrc: 'assets/images/honeymoon.jpg',
    },
    {
      name: 'Homestay',
      href: '#',
      imageSrc: 'assets/images/homestay.jpg',
    },
    {
      name: 'Shopping',
      href: '#',
      imageSrc: 'assets/images/shopping.jpg',
    },
  ];
}
