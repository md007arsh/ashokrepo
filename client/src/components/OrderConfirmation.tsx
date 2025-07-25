import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

export function OrderConfirmation({ isOpen, onClose, orderNumber }: OrderConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center">
        <div className="space-y-6">
          <div>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600">
              We will reach out to you shortly to confirm your order details.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Order ID: <span className="font-mono font-semibold">#{orderNumber}</span>
            </p>
          </div>
          
          <Button onClick={onClose} className="w-full bg-primary hover:bg-blue-600">
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
