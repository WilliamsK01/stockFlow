// article
export interface Article {
  id: number;
  reference: string;
  designation: string;
  description: string;
  category: string;
  classification: string;
  uniteMesure: string;
  weight?: number | null;
  volume?: number | null;
  seuilMin: number;
  seuilMax: number;
  unitPrice: number;
  supplier: string;
  location: string;
  bareCodes: string;
  stock: number;
  status: string;
}

// category
export interface Category {
  id: number;
  name: string;
  description: string;
  parent: string;
  nbArticles: number;
  stockValue: number;
  color: string;
  seuilRotation: number;
  autoClassification: boolean;
  active: boolean;
}

// supplier
export interface Supplier {
  id: number,
  name: string,
  contact: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  postalCode: string,
  country: string,
  deliveryTime: number,
  paymentTerms: string,
  discount: number,
  notes: number,
  nbOrder: number,
  totalAmount: number,
  status: string,
  certifications: string[],
}

// Movement
export interface Movement {
  id: number,
  reference: string,
  type: string,
  article: string,
  designation: string,
  quantity: number,
  sourceWarehouse: string,
  destinationWarehouse: string,
  sourceLocation: string,
  destinationLocation: string,
  user: string,
  creationDate: Date,
  executionDate: Date,
  status: string,
  reason: string,
  lotNumber: string,
  unitCost: number,
  notes: string,
}
