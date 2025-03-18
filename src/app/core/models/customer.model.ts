export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: Address;
  createdDate: Date;
  updatedDate: Date;
  status: 'Active' | 'Inactive';
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
