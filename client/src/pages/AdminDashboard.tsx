import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import { Product, Order } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Edit, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    if (!localStorage.getItem("adminAuthenticated")) {
      navigate("/admin");
    }
  }, [navigate]);

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest("POST", "/api/products", productData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowProductForm(false);
      resetForm();
      toast({ title: "Product created successfully" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PUT", `/api/products/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowProductForm(false);
      setEditingProduct(null);
      resetForm();
      toast({ title: "Product updated successfully" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/products/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully" });
    },
  });

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      image: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/");
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct.id,
        data: productForm,
      });
    } else {
      createProductMutation.mutate(productForm);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Super Admin</span>
              <Button onClick={handleLogout} variant="destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Customer Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customerName}</div>
                              <div className="text-sm text-gray-500">{order.customerAddress}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{order.customerEmail}</div>
                              <div className="text-sm text-gray-500">{order.customerPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {(order.items as any[]).map((item, idx) => (
                                <div key={idx} className="text-sm">
                                  {item.productName} × {item.quantity}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">${order.total}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      {!orders?.length && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Product Inventory</h2>
                <Button 
                  onClick={() => setShowProductForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products?.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center space-x-4">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                                <div className="font-medium">{product.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>${product.price}</TableCell>
                            <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {!products?.length && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                              No products found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={productForm.image}
                onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                type="submit" 
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
