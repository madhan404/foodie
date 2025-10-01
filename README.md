# Foodie - Food Delivery Application

A full-stack MERN (MongoDB, Express, React, Node.js) food delivery application with role-based authentication and order management.

## Features

### Customer Features
- Browse restaurants and menu items
- Search and filter restaurants
- Add items to cart
- Place orders (Cash on Delivery)
- Track order status
- View order history
- Profile management

### Staff Features
- View assigned orders
- Update order status (Confirmed, Preparing, Out for Delivery, Delivered)
- View order details and customer information
- Real-time order management

### Admin Features
- Manage restaurants (Create, Update, Delete)
- Manage menu items (Create, Update, Delete)
- Manage categories
- User management (View all users, Toggle status)
- Order management (View all orders, Assign to staff)
- Staff management

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React
- React Router for navigation
- Axios for API calls
- TailwindCSS for styling
- Framer Motion for animations
- Lucide React for icons

## Project Structure

```
project/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Restaurant.js
│   │   │   ├── MenuItem.js
│   │   │   ├── Category.js
│   │   │   └── Order.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── adminController.js
│   │   │   ├── staffController.js
│   │   │   └── customerController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   ├── staff.js
│   │   │   └── customer.js
│   │   └── middleware/
│   │       └── auth.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── client/
    ├── src/
    │   ├── api/
    │   │   └── api.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Home.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── StaffOrders.jsx
    │   └── App.jsx
    └── package.json
```

## Setup Instructions

### 1. Clone the Repository

### 2. Backend Setup

```bash
cd server
npm install
```

Configure the `.env` file (already configured):
```
MONGODB_URI=mongodb+srv://user1:12345@cluster0.x6kepfv.mongodb.net/foodie?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## Default User Roles

After registration, you can create users with different roles:

### To create an admin account:
Register via the signup form, then manually update the user's role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### To create a staff account:
Use the same method:
```javascript
db.users.updateOne(
  { email: "staff@example.com" },
  { $set: { role: "staff" } }
)
```

### Customer accounts:
Default role when signing up is "customer"

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Customer APIs
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `GET /api/categories` - Get all categories
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

### Admin APIs
- `POST /admin/restaurants` - Create restaurant
- `PUT /admin/restaurants/:id` - Update restaurant
- `DELETE /admin/restaurants/:id` - Delete restaurant
- `POST /admin/menu-items` - Create menu item
- `PUT /admin/menu-items/:id` - Update menu item
- `DELETE /admin/menu-items/:id` - Delete menu item
- `POST /admin/categories` - Create category
- `GET /admin/users` - Get all users
- `GET /admin/orders` - Get all orders
- `PATCH /admin/orders/:id/assign` - Assign order to staff

### Staff APIs
- `GET /staff/orders` - Get assigned orders
- `GET /staff/orders/:id` - Get order details
- `PATCH /staff/orders/:id/status` - Update order status

## Usage Flow

### Admin Workflow:
1. Login with admin credentials
2. Create categories (e.g., Pizza, Burgers, Desserts)
3. Create restaurants with details (name, image URL, cuisine, etc.)
4. Add menu items to restaurants
5. Monitor incoming orders
6. Assign orders to staff members
7. Manage users and their roles

### Staff Workflow:
1. Login with staff credentials
2. View assigned orders
3. Update order status as it progresses:
   - Confirmed → Preparing → Out for Delivery → Delivered
4. View customer and restaurant details for delivery

### Customer Workflow:
1. Sign up / Login
2. Browse restaurants and categories
3. View menu items and add to cart
4. Place order with delivery address
5. Track order status
6. View order history

## Order Status Flow

1. **Pending** - Order placed by customer
2. **Confirmed** - Admin assigns order to staff
3. **Preparing** - Staff marks order as being prepared
4. **Out for Delivery** - Staff marks order as out for delivery
5. **Delivered** - Staff marks order as delivered

## Payment Method

Currently supports **Cash on Delivery** only.

## Development Notes

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Role-based access control is implemented
- Protected routes ensure proper authorization
- MongoDB validation ensures data integrity

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Real-time order tracking with WebSocket
- Push notifications
- Rating and review system
- Order history analytics
- Multiple delivery addresses
- Favorite restaurants and items
- Promo codes and discounts

## License

This project is for educational purposes.
