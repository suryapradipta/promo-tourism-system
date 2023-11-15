import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  footerNavigation = {
    products: [
      { name: 'Diving', href: '#' },
      { name: 'Cruise', href: '#' },
      { name: 'Honeymoon', href: '#' },
      { name: 'Homesay', href: '#' },
      { name: 'Shopping', href: '#' },
    ],
    customerService: [
      { name: 'Contact', href: '#' },
      { name: 'Shipping', href: '#' },
      { name: 'Returns', href: '#' },
      { name: 'Warranty', href: '#' },
      { name: 'Secure Payments', href: '#' },
      { name: 'FAQ', href: '#' },
      { name: 'Find a store', href: '#' },
    ],
    company: [
      { name: 'Who we are', href: '#' },
      { name: 'Sustainability', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Terms & Conditions', href: '#' },
      { name: 'Privacy', href: '#' },
    ],
    legal: [
      { name: 'Terms of Service', href: '#' },
      { name: 'Return Policy', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Shipping Policy', href: '#' },
    ],
    bottomLinks: [
      { name: 'Accessibility', href: '#' },
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
    ],
  };
}
