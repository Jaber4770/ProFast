# 🚚 Zap-Shift (or Profast) – Parcel Delivery Web App

A fully functional and responsive web application designed for seamless parcel delivery service management. Built using modern web technologies, the platform allows users to register, place parcel orders, track deliveries, and manage roles efficiently.

![Parcel Delivery App Screenshot](./screenshot.png)

---

## 📝 Project Overview

Zap-Shift is a MERN stack-based parcel delivery solution with real-time parcel status tracking, user authentication, and role-based dashboard management for Admins, Delivery Personnel, and Customers.

---

## 🛠️ Main Technologies Used

- **MongoDB** – NoSQL database for storing parcel and user data
- **Express.js** – Backend server framework
- **React.js** – Frontend library for building UI
- **Node.js** – JavaScript runtime environment
- **JWT (JSON Web Tokens)** – For secure user authentication
- **Firebase** – For hosting or authentication (if used)
- **Tailwind CSS / DaisyUI** – For styling (based on usage)
- **React Router** – Client-side routing
- **Axios** – HTTP client for API requests
- **SweetAlert2** – Elegant alerts and confirmations

---

## 🌟 Main Features

- 🔐 **Authentication System** (Sign Up / Login / JWT-based)
- 📦 **Parcel Management** (Create, Update, Cancel, Deliver)
- 🧑‍💼 **Role-Based Dashboards**:
  - **Admin**: Manage users, deliveries, statistics
  - **Delivery Man**: View assigned parcels, update status
  - **Customer**: Place orders, track parcels
- 📊 **Dashboard Analytics** (Parcel status summary, charts)
- 🔍 **Parcel Search & Filter**
- 📄 **Order History and Delivery Logs**
- 📨 **Email or SMS Notifications** (if implemented)

---

## 📦 Dependencies Used

```bash
# Frontend
react, react-router-dom, axios, sweetalert2, tailwindcss, daisyui, jwt-decode

# Backend
express, cors, mongoose, jsonwebtoken, dotenv, bcryptjs, nodemon



💻 Frontend (React)

# Navigate to client folder
cd client

# Install dependencies
npm install

# Start the frontend
npm run dev
