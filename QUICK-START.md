# ⚡ Quick Start - Deploy in 5 Minutes

## 🚀 Super Fast Deployment to Vercel

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database (Free)
1. Go to [console.neon.tech](https://console.neon.tech) and sign up
2. Create a new project
3. Copy your connection string

### 3. Deploy to Vercel (Free)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Import your GitHub repo
4. Add environment variable: `DATABASE_URL` = your Neon connection string
5. Deploy!

### 4. Initialize Database
```bash
npm run db:push
```

### 5. Test Your Live App
- Visit your Vercel URL
- Go to `/admin` (username: admin, password: admin123)
- Add some products
- Test the shopping cart

## 🎯 That's it! Your e-commerce store is live!

For detailed instructions, see [README-DEPLOYMENT.md](./README-DEPLOYMENT.md)

## 🔧 Local Development
```bash
# Start development server
npm run dev

# Test with Vercel dev environment
npm run dev:vercel
```

## 📝 Important URLs
- **Your Store**: `https://your-project.vercel.app`
- **Admin Panel**: `https://your-project.vercel.app/admin`
- **API Docs**: `https://your-project.vercel.app/api/products` 