import {MerchantModel} from "../models";

export const MERCHANTS: MerchantModel[] =
  [
    {
      id: 'default1',
      name: 'Merchant 1',
      contact_number: 123456789,
      email: 'merchant1@gmail.com',
      description: 'Description for Merchant 1',
      documents: null,
      document_description: '',
      status: 'APPROVE',
    },
    {
      id: 'default2',
      name: 'Merchant 2',
      contact_number: 987654321,
      email: 'merchant2@gmail.com',
      description: 'Description for Merchant 2',
      documents: null,
      document_description: '',
      status: 'APPROVE',
    },
  ];
