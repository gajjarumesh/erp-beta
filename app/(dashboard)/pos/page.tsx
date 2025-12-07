'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function POSPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product: any) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600 mt-2">Process sales transactions quickly and efficiently</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Search & Selection */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Sample products - would be loaded from API */}
                {[
                  { id: 1, name: 'Product 1', price: 29.99, sku: 'PRD001' },
                  { id: 2, name: 'Product 2', price: 49.99, sku: 'PRD002' },
                  { id: 3, name: 'Product 3', price: 19.99, sku: 'PRD003' },
                ].map((product) => (
                  <Card
                    key={product.id}
                    className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => addToCart({ ...product, quantity: 1 })}
                  >
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.sku}</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      ${product.price.toFixed(2)}
                    </p>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Cart & Checkout */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Cart</h2>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(index)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" size="lg">
                        Cash Payment
                      </Button>
                      <Button className="w-full" variant="outline" size="lg">
                        Card Payment
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>

            <Card className="p-4 mt-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Session:</span>
                  <span className="font-medium">Open</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Opening Balance:</span>
                  <span className="font-medium">$100.00</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Close Session
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
