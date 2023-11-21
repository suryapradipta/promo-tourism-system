import {AuthModel} from "../models";
import {v4 as uuidv4} from "uuid";

export const USERS: AuthModel[] =
  [
    {
      id: uuidv4(),
      email: 'customer@gmail.com',
      password: 'customer',
      role: 'customer',
      isFirstLogin: false
    }, {
    id: uuidv4(),
    email: 'ministry@gmail.com',
    password: 'ministry',
    role: 'ministry',
    isFirstLogin: false
  },
    {
      id: 'defaultMerchantID1',
      email: 'merchant1@gmail.com',
      password: 'merchant',
      role: 'merchant',
      isFirstLogin: false
    },
    {
      id: 'defaultMerchantID2',
      email: 'merchant2@gmail.com',
      password: 'merchant',
      role: 'merchant',
      isFirstLogin: false
    }
  ];
