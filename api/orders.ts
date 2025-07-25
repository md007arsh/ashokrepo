import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertOrderSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get all orders
        const orders = await storage.getAllOrders();
        return res.json(orders);

      case 'POST':
        // Create new order
        const orderData = insertOrderSchema.parse(req.body);
        const newOrder = await storage.createOrder(orderData);
        return res.status(201).json(newOrder);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Orders API Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid order data", errors: error.errors });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
} 