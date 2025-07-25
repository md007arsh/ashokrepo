#!/usr/bin/env node
/**
 * Development server for testing Vercel serverless functions locally
 * This simulates the Vercel environment for local development
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Function to dynamically load and execute API functions
async function loadApiFunction(functionPath) {
  try {
    const module = await import(functionPath);
    return module.default;
  } catch (error) {
    console.error(`Error loading function ${functionPath}:`, error);
    return null;
  }
}

// API routes - simulate Vercel serverless functions
app.use('/api/*', async (req, res) => {
  const apiPath = req.path.replace('/api/', '');
  const segments = apiPath.split('/').filter(Boolean);
  
  // Map API paths to function files
  let functionFile;
  
  if (segments[0] === 'products') {
    functionFile = join(__dirname, 'api', 'products.ts');
  } else if (segments[0] === 'orders') {
    functionFile = join(__dirname, 'api', 'orders.ts');
  } else if (segments.join('/') === 'admin/login') {
    functionFile = join(__dirname, 'api', 'admin', 'login.ts');
  }
  
  if (!functionFile || !fs.existsSync(functionFile.replace('.ts', '.js'))) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  try {
    const handler = await loadApiFunction(functionFile.replace('.ts', '.js'));
    if (handler) {
      // Add query parameters for individual resource requests
      if (segments[1] && segments[0] === 'products') {
        req.query.id = segments[1];
      }
      
      await handler(req, res);
    } else {
      res.status(500).json({ message: 'Function handler not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Serve static files from client/dist
app.use(express.static(join(__dirname, 'client', 'dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running at http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`📡 API: http://localhost:${PORT}/api/products`);
  console.log('');
  console.log('💡 This simulates the Vercel serverless environment');
  console.log('📝 For production deployment, see README-DEPLOYMENT.md');
}); 