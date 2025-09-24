# Meraki Admin Dashboard Setup

This guide explains how to set up and use the local database with admin interface for the Meraki luxury goods e-commerce application.

## 🗄️ Database Setup

The application uses **SQLite** with **Prisma ORM** for local database management.

### Database Schema

- **Categories**: Product categories (Leather Goods, Electronics, Fragrances, etc.)
- **Products**: Product information with full details
- **Users**: Customer accounts
- **Orders**: Order management
- **OrderItems**: Individual items in orders
- **CartItems**: Shopping cart items
- **Admin**: Admin user accounts

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

The database is already configured and migrated with sample data. If you need to reset:

```bash
# Reset database
npx prisma db push --force-reset

# Migrate sample data
npm run migrate
```

### 3. Start the Application

```bash
# Start both frontend and backend
npm run dev:full

# Or start them separately:
# Backend API server (port 3001)
npm run server

# Frontend development server (port 5173)
npm run dev
```

## 🔐 Admin Access

### Default Admin Credentials

- **Email**: `admin@meraki.com`
- **Password**: `admin123`

### Admin Login

1. Navigate to `http://localhost:5173/admin/login`
2. Use the credentials above
3. You'll be redirected to the admin dashboard

## 📊 Admin Dashboard Features

### Overview Tab
- **Statistics**: Total products, orders, users, and categories
- **Recent Products**: Latest products added to the store
- **Recent Orders**: Latest customer orders

### Products Tab
- **Product List**: View all products in a table format
- **Product Management**: Add, edit, delete products
- **Stock Management**: View and update inventory levels
- **Category Filtering**: Filter products by category

### Categories Tab
- **Category Management**: Add, edit, delete categories
- **Product Count**: See how many products are in each category

### Orders Tab
- **Order Management**: View and manage customer orders
- **Status Updates**: Update order status (Pending, Processing, Shipped, Delivered, Cancelled)

## 🛠️ API Endpoints

The backend API runs on `http://localhost:3001` and provides:

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/init` - Initialize admin user

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - Get products (with pagination, search, filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get orders (with pagination, status filtering)
- `PUT /api/orders/:id/status` - Update order status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 📁 File Structure

```
├── server/
│   └── index.js              # Express API server
├── prisma/
│   └── schema.prisma         # Database schema
├── scripts/
│   └── migrate-data.js       # Data migration script
├── src/pages/
│   ├── AdminLogin.tsx        # Admin login page
│   └── AdminDashboard.tsx    # Admin dashboard
└── dev.db                    # SQLite database file
```

## 🔧 Development

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate Prisma client
npx prisma generate
```

### Adding New Features

1. **Update Schema**: Modify `prisma/schema.prisma`
2. **Push Changes**: Run `npx prisma db push`
3. **Update API**: Add endpoints in `server/index.js`
4. **Update UI**: Modify admin components

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure the `.env` file exists with `DATABASE_URL="file:./dev.db"`
   - Run `npx prisma db push` to create the database

2. **Admin Login Fails**
   - Run `npm run migrate` to create the admin user
   - Check if the server is running on port 3001

3. **API Not Responding**
   - Ensure the backend server is running: `npm run server`
   - Check the console for error messages

4. **Frontend Not Loading**
   - Ensure the frontend server is running: `npm run dev`
   - Check if port 5173 is available

### Reset Everything

```bash
# Stop all servers
# Delete database
rm dev.db

# Recreate everything
npx prisma db push
npm run migrate
npm run dev:full
```

## 📝 Notes

- The database file (`dev.db`) is created locally and contains all your data
- Admin credentials are stored securely with bcrypt hashing
- All prices are stored in cents (e.g., $74.99 = 7499)
- Product highlights and tags are stored as JSON strings
- The admin interface is protected by JWT authentication

## 🔒 Security Considerations

- Change default admin password in production
- Use environment variables for sensitive data
- Implement proper CORS settings for production
- Add rate limiting for API endpoints
- Use HTTPS in production

## 📈 Next Steps

- Add product image upload functionality
- Implement order management features
- Add user management
- Create product analytics
- Add inventory alerts
- Implement backup/restore functionality
