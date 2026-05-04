# ⚡ Quick Reference Card

## 🚀 Start Development (Copy & Paste)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (new terminal)
cd frontend
npm run dev

# Browser
http://localhost:3000
```

---

## 👥 Test Accounts

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@smarttutor.com   | password123 |
| Manager | manager@smarttutor.com | password123 |
| Student | Register new           | Any         |
| Tutor   | Register new           | Any         |

---

## 📁 Important Files

### Backend
- `backend/server.js` - Main server
- `backend/.env` - Configuration
- `backend/controllers/` - Business logic
- `backend/routes/` - API endpoints
- `backend/models/` - Database schemas

### Frontend
- `frontend/src/App.jsx` - Router
- `frontend/src/pages/` - Page components
- `frontend/src/services/api.js` - API calls
- `frontend/src/context/` - State management

---

## 🔧 Common Commands

```bash
# Backend
cd backend
npm install              # Install dependencies
npm run dev             # Start server
npm run test-db         # Test database
npm run seed            # Create admin users

# Frontend
cd frontend
npm install             # Install dependencies
npm run dev             # Start frontend
npm run build           # Build for production

# Database
mongosh                 # Connect to MongoDB
use finalsmartet        # Select database
db.users.find()         # View users
db.dropDatabase()       # Delete all data
```

---

## 🌐 URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health
- MongoDB: mongodb://127.0.0.1:27017/finalsmartet

---

## 📊 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
```

### Courses
```
GET    /api/courses
POST   /api/courses
GET    /api/courses/:id
PUT    /api/courses/:id
DELETE /api/courses/:id
```

### Applications
```
POST   /api/applications
GET    /api/applications
PUT    /api/applications/:id
```

### Payments
```
POST   /api/payments
GET    /api/payments
PUT    /api/payments/:id
```

### Lessons
```
GET    /api/lessons
POST   /api/lessons
GET    /api/lessons/:id
```

### Sessions
```
GET    /api/sessions
POST   /api/sessions
POST   /api/sessions/:id/join
```

### Groups
```
GET    /api/groups
POST   /api/groups
POST   /api/groups/:id/students
```

### Assessments
```
GET    /api/assessments
POST   /api/assessments
POST   /api/assessments/:id/submit
```

### Progress
```
GET    /api/progress
GET    /api/progress/:courseId
```

### Notifications
```
GET    /api/notifications
PUT    /api/notifications/:id/read
```

---

## 🎯 Feature Checklist

### ✅ Done
- [ ] User registration
- [ ] User login
- [ ] User profiles
- [ ] Dashboards

### 🔄 Next
- [ ] Courses
- [ ] Tutor applications
- [ ] Payments
- [ ] Lessons
- [ ] Sessions
- [ ] Assessments
- [ ] Groups
- [ ] Progress
- [ ] Notifications

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm run dev
```

### Frontend won't start
```bash
cd frontend
npm install
npm run dev
```

### MongoDB not connected
```bash
mongosh  # Test connection
# If fails: net start MongoDB (Windows)
```

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <number> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

---

## 📚 Documentation

- [YOU-ARE-READY.md](YOU-ARE-READY.md) - Overview
- [PRODUCTION-READY.md](PRODUCTION-READY.md) - How to use
- [NEXT-FEATURES.md](NEXT-FEATURES.md) - How to build
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues

---

## 🎓 File Locations

### Add New Feature

1. **Backend Controller**
   - File: `backend/controllers/featureController.js`
   - Function: `const createFeature = async (req, res) => { ... }`

2. **Backend Route**
   - File: `backend/routes/feature.js`
   - Route: `router.post('/', auth, featureController.createFeature)`

3. **Frontend Page**
   - File: `frontend/src/pages/Feature.jsx`
   - Component: `const Feature = () => { ... }`

4. **API Service**
   - File: `frontend/src/services/api.js`
   - Function: `export const featureAPI = { ... }`

5. **Add to Router**
   - File: `frontend/src/App.jsx`
   - Route: `<Route path="/feature" element={<Feature />} />`

---

## ✨ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (Email)
- Joi (Validation)
- Bcrypt (Password)

### Frontend
- React 18 + Vite
- React Router v6
- Axios (HTTP)
- Tailwind CSS
- Chart.js (Charts)
- React Hot Toast (Notifications)

---

## 🚀 Ready to Build!

Everything is set up. Start building features! 🎯

---

**Print this card and keep it handy!** 📋
