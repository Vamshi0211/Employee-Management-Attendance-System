# Employee Attendance and Leave Management System

## 📌 Overview
The Employee Attendance and Leave Management System is a full-stack web application designed to digitize and streamline employee operations within an organization. It enables employees to track attendance, apply for leaves, and view updates, while administrators manage approvals and announcements.

---

## 🚀 Features

### 👤 Employee Features
- User authentication (Login/Register)
- Daily check-in / check-out
- Attendance dashboard with analytics
- Calendar-based attendance tracking
- Leave application & tracking
- View company notices

### 🛠️ Admin Features
- Admin authentication
- Approve/Reject leave requests
- Create & manage notices
- View leave statistics
- Monitor employee activities

---

## 🏗️ Tech Stack

### Frontend
- React.js
- TypeScript
- React Router DOM
- Lucide React Icons
- React Hot Toast
- Inline CSS

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB Atlas
- Mongoose ODM

---

## ⚙️ Architecture
This project follows a **Client-Server-Database architecture**:
- Frontend → Handles UI and user interaction
- Backend → Handles business logic & APIs
- Database → Stores user, attendance, leave, and notice data

---

## 📂 Project Structure

```
employee-management-system
│
├── backend
│   ├── models
│   ├── routes
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── layout
│   │   ├── pages
│   │   ├── App.tsx
│   │   └── index.tsx
```

---

## 🔐 API Endpoints

### Authentication
- POST `/api/auth/login`
- POST `/api/auth/register`

### Attendance
- POST `/api/attendance/checkin`
- POST `/api/attendance/checkout`
- GET `/api/attendance/:userId`

### Leave
- POST `/api/leave/apply`
- GET `/api/leave/history`
- PUT `/api/admin/leave/status`

### Notices
- GET `/api/admin/notices`
- POST `/api/admin/notices`

---

## 🖥️ UI Highlights
- Responsive dashboard
- Sidebar navigation
- Attendance calendar
- Leave tracking cards
- Admin control panel
- Mobile-friendly layout

---

## ▶️ How to Run the Project

### Prerequisites
- Node.js & npm
- MongoDB (Local or Atlas)
- VS Code

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Open in Browser
```
http://localhost:3000
```

---

## 📊 Modules

1. Authentication Module  
2. Dashboard Module  
3. Attendance Management  
4. Calendar Module  
5. Leave Application  
6. Leave Tracker  
7. Notice Management  
8. Admin Panel  

---

## 🎯 Objectives
- Automate attendance tracking
- Reduce manual errors
- Improve HR efficiency
- Provide centralized data access

---

## ✅ Conclusion
This system successfully replaces manual attendance processes with a digital platform, improving accuracy, efficiency, and transparency. Built with modern technologies, it is scalable, maintainable, and suitable for real-world deployment.

---

## 🔮 Future Enhancements
- Biometric integration
- Real-time notifications
- Payroll integration
- Advanced analytics dashboard
- Cloud deployment

---


