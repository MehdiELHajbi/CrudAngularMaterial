export interface Order {
  id: number;
  productId: number;
  quantity: number;
  customerName: string;
  orderDate: Date;
  total: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  trackingNumber: string;
  notes: string;
}