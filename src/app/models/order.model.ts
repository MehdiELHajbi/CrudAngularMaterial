export interface Order {
  id: number;
  productId: number;
  quantity: number;
  customerName: string;
  orderDate: Date;
  total: number;
}