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
  notes: string,
  nbOrder: number,
  totalAmount: number,
  rating: number,
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

// Warehouse
export interface Warehouse {
  id: number,
  name: string,
  code: string,
  address: string,
  city: string,
  postalCode: string,
  country: string,
  manager: string,
  phone: string,
  email: string,
  area: number,
  maxCapacity: number,
  currentOccupation: number,
  nbLocations: number,
  occupiedLocations: number,
  type: string,
  temperature: string,
  notes: string,
  status: string,
}

// Reception
export interface ReceptionLine {
  articleRef: string;
  designation: string;
  orderedQty: number;
  receivedQty: number;
  unitPrice: number;
}

export interface Reception {
  id: number;
  reference: string;
  supplier: string;
  warehouse: string;
  expectedDate: string;
  receivedDate?: string;
  status: string; // "Pending" | "Received" | "Partial" | "Cancelled"
  lines: ReceptionLine[];
  notes: string;
  totalValue: number;
}

// Order
export interface OrderLine {
  articleRef: string;
  designation: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  reference: string;
  type: string; // "Purchase" | "Sale"
  supplier: string;
  orderDate: string;
  expectedDate: string;
  status: string; // "Draft" | "Confirmed" | "In Progress" | "Delivered" | "Cancelled"
  warehouse: string;
  notes: string;
  totalAmount: number;
  lines: OrderLine[];
}

// Alert
export interface Alert {
  id: number;
  reference: string;
  type: string; // "Low Stock" | "Expiry" | "Capacity" | "Threshold"
  level: string; // "Critical" | "High" | "Medium" | "Low"
  article?: string;
  warehouse?: string;
  message: string;
  status: string; // "Active" | "Acknowledged" | "Resolved"
  createdAt: string;
  resolvedAt?: string;
}

