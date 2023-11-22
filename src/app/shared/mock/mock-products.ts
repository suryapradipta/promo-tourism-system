import {ProductModel} from "../models";
import {v4 as uuidv4} from "uuid";

export const PRODUCTS: ProductModel[] = [
  {
    id: uuidv4(),
    name: 'Riverside Retreat in Pitt Meadows',
    description:
      'Escape to the serene beauty of Pitt Meadows, ' +
      'nestled in the heart of British Columbia. ' +
      'Our Riverside Retreat offers a perfect weekend getaway for nature enthusiasts, ' +
      'families, and those seeking a peaceful break.',
    price: 399,
    image: 'assets/images/tour-package1.jpg',
    category: "cruise",
    reviews: [
      {
        id: "defaultReviews1",
        orderID: "",
        rating: 5,
        comment: "good"
      }
    ],
    merchantId:'defaultMerchantID1',
  },
  {
    id: uuidv4(),
    name: 'Sacred Serenity: Pura Batur Spiritual Retreat',
    description:
      'Nestled against the backdrop of the majestic Mount Batur, this experience promises a harmonious blend of spirituality, culture, and natural beauty.',
    price: 699,
    image: 'assets/images/tour-package2.jpg',
    category: "shopping",
    reviews: [
      {
        id: "defaultReviews2",
        orderID: "",
        rating: 3,
        comment: "good"
      }
    ],
    merchantId:'defaultMerchantID1',
  },
  {
    id: uuidv4(),
    name: 'Sun-Kissed Serenity: Tropical Beach Escape',
    description:
      'Picture yourself on a pristine sandy shore, surrounded by azure waters and swaying palm trees. This tropical retreat is designed for those seeking pure relaxation and seaside bliss.',
    price: 149,
    image: 'assets/images/tour-package3.jpg',
    category: "diving",
    reviews: [
      {
        id: "defaultReviews3",
        orderID: "",
        rating: 4,
        comment: "good"
      }
    ],
    merchantId:'defaultMerchantID1',
  },
  {
    id: uuidv4(),
    name: 'Enchanted Family Escape: Disneyland Adventure',
    description: 'Create lifelong memories as you step into a world of fantasy, meet beloved characters, and experience the thrill of iconic rides in the heart of the magic kingdom.',
    price: 200,
    image: 'assets/images/tour-package4.jpg',
    category: "shopping",
    reviews: [
      {
        id: "defaultReviews4",
        orderID: "",
        rating: 1,
        comment: "good"
      }
    ],
    merchantId:'defaultMerchantID1',
  },
  {
    id: uuidv4(),
    name: 'Northern Bliss: Vågan Fjord Adventure',
    description: 'Immerse yourself in the breathtaking landscapes of majestic fjords, charming fishing villages, and the mesmerizing Northern Lights.',
    price: 269,
    image: 'assets/images/tour-package5.jpg',
    category: "cruise",
    reviews: [
      {
        id: "defaultReviews5",
        orderID: "",
        rating: 3,
        comment: "good"
      }
    ],
    merchantId:'defaultMerchantID2',
  },
  {
    id: uuidv4(),
    name: 'Canal Charm: A Romantic Getaway',
    description: 'Our "Canal Charm" package invites you to experience the magic of meandering water channels, historic architecture, and intimate moments in this picturesque destination.',
    price: 90,
    image: 'assets/images/tour-package6.jpg',
    category: "shopping",
    reviews: [
      {
        id: "defaultReviews6",
        orderID: "",
        rating: 5,
        comment: "good"
      }
    ],
    merchantId:'defaultMerchantID2',
  },
  {
    id: uuidv4(),
    name: 'Adriatic Tranquility: Split-Dalmatia Escape',
    description: 'Our "Adriatic Tranquility" escape invites you to explore charming coastal towns, indulge in local cuisine, and relax in the beauty of this Croatian paradise.',
    price: 69,
    image: 'assets/images/tour-package7.jpg',
    category: "homestay",
    reviews: [
      {
        id: "defaultReviews7",
        orderID: "",
        rating: 3,
        comment: "good"
      }
    ],
    merchantId:'defaultMerchantID2',
  },
  {
    id: uuidv4(),
    name: 'Adriatic Odyssey: Discover Split-Dalmatia Magic',
    description: 'Explore historic cities, relax on pristine beaches, and savor the rich flavors of Croatian cuisine.',
    price: 125,
    image: 'assets/images/tour-package8.jpg',
    category: "honeymoon",
    reviews: [
      {
        id: "defaultReviews8",
        orderID: "",
        rating: 2,
        comment: "good"
      }
    ],
    merchantId:'defaultMerchantID2',
  },
];

