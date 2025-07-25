import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { Cart } from "@/components/Cart";
import { CheckoutModal } from "@/components/CheckoutModal";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleCheckoutSuccess = (orderNum: string) => {
    setOrderNumber(orderNum);
    setShowConfirmation(true);
  };

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">ShopEase</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-primary transition-colors">Home</a>
              <a href="#products" className="text-gray-700 hover:text-primary transition-colors">Products</a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Cart onCheckout={() => setShowCheckout(true)} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Discover Amazing Products</h2>
              <p className="text-xl mb-8 text-blue-100">Shop the latest collection of premium products with fast delivery and excellent customer service.</p>
              <Button onClick={scrollToProducts} className="bg-white text-primary hover:bg-gray-100">
                Shop Now
              </Button>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Shopping and e-commerce lifestyle" 
                className="rounded-xl shadow-2xl w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Explore our carefully curated product categories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group cursor-pointer hover:-translate-y-1 transition-transform">
              <img 
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Electronics category" 
                className="w-full h-64 object-cover rounded-xl" 
              />
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">Electronics</h3>
                <p className="text-gray-600">Latest gadgets and tech</p>
              </div>
            </div>
            
            <div className="group cursor-pointer hover:-translate-y-1 transition-transform">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Fashion category" 
                className="w-full h-64 object-cover rounded-xl" 
              />
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">Fashion</h3>
                <p className="text-gray-600">Trending styles & apparel</p>
              </div>
            </div>
            
            <div className="group cursor-pointer hover:-translate-y-1 transition-transform">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Home category" 
                className="w-full h-64 object-cover rounded-xl" 
              />
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">Home & Living</h3>
                <p className="text-gray-600">Decor and essentials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg">Discover our most popular items</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-9 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">ShopEase</h3>
              <p className="text-gray-400">Your trusted online shopping destination for quality products and excellent service.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>hello@shopease.com</p>
                <p>(555) 123-4567</p>
                <p>123 Business St, City</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShopEase. All rights reserved. | <Link href="/admin" className="hover:text-white transition-colors">Admin Access</Link></p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handleCheckoutSuccess}
      />
      
      <OrderConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        orderNumber={orderNumber}
      />
    </div>
  );
}
