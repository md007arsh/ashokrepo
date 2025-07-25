import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertProductSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { id } = req.query;

    switch (req.method) {
      case 'GET':
        if (id) {
          // Get single product
          const productId = parseInt(id as string);
          const product = await storage.getProduct(productId);
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
          return res.json(product);
        } else {
          // Get all products
          const products = await storage.getAllProducts();
          return res.json(products);
        }

      case 'POST':
        // Create new product
        const productData = insertProductSchema.parse(req.body);
        const newProduct = await storage.createProduct(productData);
        return res.status(201).json(newProduct);

      case 'PUT':
        // Update product
        if (!id) {
          return res.status(400).json({ message: "Product ID is required" });
        }
        const updateId = parseInt(id as string);
        const updateData = insertProductSchema.partial().parse(req.body);
        const updatedProduct = await storage.updateProduct(updateId, updateData);
        if (!updatedProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        return res.json(updatedProduct);

      case 'DELETE':
        // Delete product
        if (!id) {
          return res.status(400).json({ message: "Product ID is required" });
        }
        const deleteId = parseInt(id as string);
        const deleted = await storage.deleteProduct(deleteId);
        if (!deleted) {
          return res.status(404).json({ message: "Product not found" });
        }
        return res.json({ message: "Product deleted successfully" });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Products API Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
} 