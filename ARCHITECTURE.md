# Sweet Solutions - Architecture Overview

## 🏗️ Project Structure

This project is split into **two separate repositories** for optimal team collaboration and AWS deployment:

### Frontend (`sweet-solutions-frontend/`)
- **Framework**: Next.js 16 with App Router
- **UI**: Radix UI + Tailwind CSS
- **State**: React Context + Custom Hooks
- **Deployment**: Vercel (recommended)

### Backend (`sweet-solutions-backend/`)
- **Framework**: Express.js + Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Deployment**: AWS Lambda/API Gateway (recommended)

## 🔄 Data Flow

```
Frontend (Next.js) → API Client → Backend (Express) → Database (MongoDB)
```

## 🚀 Current Status

### ✅ **Completed**
- Complete UI/UX implementation
- Role-based authentication system
- REST API with all endpoints
- Database models and validation
- Mock data for development
- Production-ready architecture

### 🔄 **Development Mode**
- Currently using **mock data** for demonstration
- Backend API is **fully functional** and ready
- Easy switch to live data via environment variables

## 🎯 **AWS Deployment Plan**

### Phase 1: Frontend (Vercel)
```bash
# Deploy frontend
vercel --prod
```

### Phase 2: Backend (AWS)
```bash
# Deploy backend to AWS Lambda
serverless deploy
```

### Phase 3: Database (AWS)
- MongoDB Atlas or AWS RDS
- Update connection strings

## 👥 **Team Roles**

- **Frontend Developer**: `sweet-solutions-frontend/`
- **Backend Developer**: `sweet-solutions-backend/`
- **DevOps**: AWS deployment and configuration

## 🔧 **Development Commands**

### Frontend
```bash
cd sweet-solutions-frontend
npm install
npm run dev
```

### Backend
```bash
cd sweet-solutions-backend
npm install
npm run dev
```

## 📊 **Features Implemented**

- ✅ User authentication (Manager/Employee roles)
- ✅ Employee management
- ✅ Shift scheduling
- ✅ Time-off requests
- ✅ Payroll tracking
- ✅ CSV export functionality
- ✅ Responsive design
- ✅ Real-time notifications

## 🎨 **Design System**

- **Brand Colors**: Cream, Coral, Teal, Pink
- **Typography**: Poppins font family
- **Components**: shadcn/ui with custom styling
- **Accessibility**: WCAG 2.1 compliant

---

**Note**: This is a **professional prototype** with production-ready architecture. The mock data can be easily replaced with live AWS services.
