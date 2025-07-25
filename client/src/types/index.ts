export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export interface CheckoutForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  image: string;
}
