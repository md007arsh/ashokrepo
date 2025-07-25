import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CheckoutForm, OrderItem } from "@/types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderNumber: string) => void;
}

export function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { items, clearCart, getTotalPrice } = useCart();
  const [formData, setFormData] = useState<CheckoutForm>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (data) => {
      clearCart();
      onClose();
      onSuccess(data.orderNumber);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderItems: OrderItem[] = items.map(item => ({
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const orderData = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      items: orderItems,
      total: getTotalPrice().toFixed(2),
    };

    createOrderMutation.mutate(orderData);
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                required
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                required
                value={formData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="customerPhone">Phone Number *</Label>
            <Input
              id="customerPhone"
              type="tel"
              required
              value={formData.customerPhone}
              onChange={(e) => handleInputChange("customerPhone", e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="customerAddress">Shipping Address *</Label>
            <Textarea
              id="customerAddress"
              required
              rows={3}
              value={formData.customerAddress}
              onChange={(e) => handleInputChange("customerAddress", e.target.value)}
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 mb-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 border-t font-semibold">
              <span>Total:</span>
              <span className="text-xl text-primary">${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={createOrderMutation.isPending}
          >
            {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
