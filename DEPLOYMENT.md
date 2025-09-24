# 🚀 Vercel Deployment Guide

This guide will help you deploy your Meraki luxury goods store to Vercel with a portable SQLite database.

## ✅ **What You Get:**
- **Zero database management** - SQLite file included
- **Portable** - entire store in one Git repo
- **Simple deployment** - just `vercel deploy`
- **No monthly costs** - free tier covers small stores
- **Fast** - SQLite is incredibly fast for small datasets

## 🛠️ **Pre-Deployment Setup:**

### 1. **Install Vercel CLI**
```bash
npm install -g vercel
```

### 2. **Login to Vercel**
```bash
vercel login
```

### 3. **Set Environment Variables**
```bash
vercel env add JWT_SECRET
# Enter a strong secret key (e.g., your-random-secret-key-here)
```

## 🚀 **Deployment Steps:**

### 1. **Initialize Vercel Project**
```bash
vercel
```
- Follow the prompts
- Choose your project name
- Select "Yes" for all questions

### 2. **Deploy to Production**
```bash
vercel --prod
```

### 3. **Set Production Environment Variable**
```bash
vercel env add JWT_SECRET --prod
# Enter the same secret key as before
```

## 🎯 **That's It!**

Your store is now live at `https://your-project-name.vercel.app`

### **Admin Access:**
- Go to: `https://your-project-name.vercel.app/admin/login`
- Email: `admin@meraki.com`
- Password: `admin123`

## 📊 **Database Management:**

### **View Data:**
- The SQLite database is included in your deployment
- All 20 products and 4 categories are pre-loaded
- Admin user is automatically created

### **Backup Data:**
- Your database is in the `database/products.db` file
- It's automatically backed up with your Git repo
- No external database to manage!

### **Add More Products:**
- Use the admin dashboard to add/edit/delete products
- All changes are saved to the SQLite database
- Changes persist across deployments

## 🔧 **Local Development:**

### **Run Locally:**
```bash
# Install dependencies
npm install

# Run migration (if needed)
npm run migrate:vercel

# Start development server
npm run dev:next
```

### **Test API Routes:**
- Products: `http://localhost:3000/api/products`
- Categories: `http://localhost:3000/api/categories`
- Admin Login: `http://localhost:3000/api/admin/login`

## 📁 **Project Structure:**
```
meraki/
├── database/
│   └── products.db          # SQLite database
├── src/
│   ├── pages/
│   │   ├── api/             # Vercel API routes
│   │   └── admin/           # Admin pages
│   └── components/          # React components
├── vercel.json              # Vercel configuration
└── next.config.js           # Next.js configuration
```

## 🎉 **Benefits:**

- **Simple**: Just deploy and go
- **Portable**: Everything in one repo
- **Fast**: SQLite is lightning fast
- **Reliable**: No external dependencies
- **Cost-effective**: Free tier covers small stores
- **Scalable**: Easy to upgrade when needed

## 🔄 **Updates:**

To update your store:
1. Make changes locally
2. Test with `npm run dev:next`
3. Deploy with `vercel --prod`

Your database and all data persist across deployments!

## 🆘 **Troubleshooting:**

### **Database Issues:**
- Check that `database/products.db` exists
- Run `npm run migrate:vercel` if needed

### **API Issues:**
- Check Vercel function logs
- Verify environment variables are set

### **Frontend Issues:**
- Check browser console for errors
- Verify API routes are working

## 📞 **Support:**

If you need help:
1. Check the Vercel dashboard for logs
2. Test API routes directly
3. Verify environment variables
4. Check the database file exists

Your store is now production-ready! 🎉
