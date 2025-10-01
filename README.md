# 🍔 Foodie - Food Delivery Application  

A full-stack **MERN** (MongoDB, Express, React, Node.js) food delivery app with **role-based authentication** and real-time order management. 🚀  

---

## 🚦 Tech Stack  

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/FramerMotion-0055FF?logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/JWT-black?logo=jsonwebtokens&logoColor=white" alt="JWT"/>
</p>  

---

## ✨ Features  

### 🧑‍🎓 Customer Features
- 🍽 Browse restaurants & menus  
- 🔍 Search and filter restaurants  
- 🛒 Add items to cart  
- 💳 Place orders (Cash on Delivery)  
- 📦 Track order status in real-time  
- 📜 View order history  
- 👤 Profile management  

### 👨‍🍳 Staff Features
- 📋 View assigned orders  
- 🔄 Update order status: Confirmed → Preparing → Out for Delivery → Delivered  
- 🏷 View order details and customer info  
- ⚡ Real-time order updates  

### 👑 Admin Features
- 🏢 Manage restaurants (Create, Update, Delete)  
- 🍔 Manage menu items & categories  
- 👥 User management (View all users, toggle status)  
- 📦 Order management & staff assignment  
- 🧑‍🍳 Staff management  

---

## 📂 Project Structure  

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

---

## 🚀 Getting Started  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/madhan404/foodie.git
cd foodie

2️⃣ Backend Setup
cd server
npm install

Configure .env:

MONGODB_URI=mongodb://localhost:27017/foodie
JWT_SECRET=your_super_secret_key
PORT=5000
NODE_ENV=development

Start backend:

npm start

Backend runs on 👉 http://localhost:3000

3️⃣ Frontend Setup
cd ../client
npm install
npm run dev


Frontend runs on 👉 http://localhost:5173

🧑‍🤝‍🧑 User Roles

👑 Admin: Manage restaurants, menu, users, orders, staff

👨‍🍳 Staff: View & update assigned orders

🧑‍🎓 Customer: Browse & order food

Default admin creation (in MongoDB):

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)

🔗 API Endpoints
Authentication

POST /api/auth/register - Register

POST /api/auth/login - Login

GET /api/auth/me - Get current user

Customer

GET /api/restaurants

GET /api/restaurants/:id/menu

POST /api/orders

GET /api/orders

Admin

POST /admin/restaurants

PUT /admin/restaurants/:id

DELETE /admin/restaurants/:id

POST /admin/menu-items

PATCH /admin/orders/:id/assign

Staff

GET /staff/orders

PATCH /staff/orders/:id/status

📦 Order Status Flow

⏳ Pending

✅ Confirmed

🍳 Preparing

🛵 Out for Delivery

🎉 Delivered

🔮 Future Enhancements

💳 Payment gateway (Stripe, PayPal)

🔔 Push notifications

⭐ Ratings & reviews

📊 Order analytics

🎁 Promo codes & discounts


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

🤝 Contributing

Contributions welcome! 🎉 Please open an issue before major changes.

📄 License

MIT License. See LICENSE
 for details.

🙋‍♂️ Contact

Made with ❤️ by Foodie Team

🌐 Website: Foodie deploying soon

---

If you want, I can also **add colorful shields/badges for MongoDB, Express, React, Tailwind, JWT, Framer Motion** at the top like in your `RestIn` README, to make it look **super professional on GitHub**.  

Do you want me to do that?
