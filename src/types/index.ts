
export interface BagCategory {
  id: string;
  name: string;
  price: number;
}

export interface BagItem {
  categoryId: string;
  quantity: number;
  price: number;
}

export interface Customer {
  name: string;
  phone: string;
  location: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: BagItem[];
  totalPrice: number;
  date: string;
  delivered: boolean;
}
