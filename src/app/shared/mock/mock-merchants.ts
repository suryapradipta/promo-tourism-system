import {MerchantModel} from "../models";

export const MERCHANTS: MerchantModel[] =
  [
    {
      id: 'defaultMerchant1',
      name: 'City Explorer Tours',
      contact_number: 123456789,
      email: 'merchant1@gmail.com',
      description: 'Discover the hidden gems of urban landscapes with City Explorer Tours.',
      documents: null,
      document_description: 'Legal documents for business operation and customer safety.',
      status: 'APPROVE',
    },
    {
      id: 'defaultMerchant2',
      name: 'Serenity Suites & Spa',
      contact_number: 987654321,
      email: 'merchant2@gmail.com',
      description: 'Experience tranquility and luxury at Serenity Suites & Spa.',
      documents: null,
      document_description: 'Certifications ensuring the highest standards of hospitality and safety.',
      status: 'APPROVE',
    },
  ];
