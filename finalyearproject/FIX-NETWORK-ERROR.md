# 🔧 Fix "Network Error" - Complete Guide

## What Happened?

You were getting "Network Error" when trying to login/register. This means the frontend can't communicate with the backend.

---

## ✅ Solution - Follow These Steps

### Step 1: Stop Everything

Press `Ctrl+C` in both backend and frontend terminals to stop them.

---

### Step 2: Update Backend Dependencies

```bash
cd backend
npm install
```

This will install the correct package versions.

---

### Step 3: Verify MongoDB is Running

```bash
mongosh
```

If it connects, type `exit`. If not, start MongoDB:
- **Windows:** `net start MongoDB`
- **macOS:** `brew services start mongodb-community`
- **Linux:** `sudo systemctl start mongodb`

---

### Step 4: Test Database Connection

```bash
npm run test-db
```

Expected output:
```
✅ MongoDB Connected Successfully!
```

---

### Step 5: Create Admin Users (if not done)

```bash
npm run seed
```

Expected output:
```
✅ Admin user created
✅ Manager user created
```

---

### Step 6: Start Backend Server

```bash
npm run dev
```

Expected output:
```
✅ MongoDB Connected Successfully
Server running on port 5000
```

**IMPORTANT:** Keep this terminal open!

---

### Step 7: Test Backend API

Open a **NEW terminal** and run:

```bash
cd backend
npm run test-api
```

Expected output:
```
🧪 Testing SmartTutorET API...

1️⃣ Testing health endpoint...
✅ Health check passed

2️⃣ Testing student registration...
✅ Student registration successful!

3️⃣ Testing login...
✅ Login successful!

4️⃣ Testing admin login...
✅ Admin login successful!

🎉 All tests completed!
✅ Backend is working correctly!
```

If you see this, **backend is working!** Continue to Step 8.

If you see errors, check the troubleshooting section below.

---

### Step 8: Start Frontend

Open a **NEW terminal**:

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

---

### Step 9: Test in Browser

1. Open: http://localhost:3000
2. Click "Create an account"
3. Fill in the form:
   - First Name: Test
   - Last Name: Student
   - Email: test@student.com
   - Role: Learn (Student)
   - Password: password123
4. Click "Create account"

**It should work now!** ✅

---

## 🎯 Quick Test Checklist

Run these commands in order:

```bash
# 1. MongoDB running?
mongosh

# 2. Backend folder
cd backend

# 3. Install dependencies
npm install

# 4. Test database
npm run test-db

# 5. Create admin users
npm run seed

# 6. Start backend
npm run dev

# In NEW terminal:
# 7. Test API
cd backend
npm run test-api

# In NEW terminal:
# 8. Start frontend
cd frontend
npm install
npm run dev
```

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "Cannot find module"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error: "Port 5000 already in use"**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <number> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

---

### test-api fails

**Error: "ECONNREFUSED"**
- Backend is not running
- Start it: `npm run dev`

**Error: "Invalid credentials"**
- Run: `npm run seed` to create admin users

**Error: "buffering timed out"**
- MongoDB not running
- Start it: `mongosh` (if fails, start MongoDB service)

---

### Frontend shows "Network Error"

**Check backend is running:**
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"success":true,"message":"Server is running","mongodb":"Connected"}
```

**If curl fails:**
- Backend is not running
- Go back to Step 6

**If curl works but frontend fails:**
- Clear browser cache (Ctrl+Shift+Delete)
- Clear localStorage (F12 → Application → Local Storage → Clear)
- Restart frontend

---

### Registration/Login not working

**Check backend terminal for errors**

Common issues:
1. MongoDB not connected → Run `npm run test-db`
2. Wrong password hash → Run `npm run seed` again
3. Validation error → Check all fields are filled

---

## 📊 What Should You See?

### Backend Terminal:
```
✅ MongoDB Connected Successfully
Server running on port 5000
```

When you register/login:
```
POST /api/auth/register 201 xxx ms
POST /api/auth/login 200 xxx ms
```

### Frontend Terminal:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Browser Console (F12):
- No red errors
- Network tab shows successful API calls (200/201 status)

---

## 🎓 Test All Roles

### 1. Student Registration
- Go to: http://localhost:3000/register
- Role: Learn (Student)
- Register and login

### 2. Tutor Registration
- Go to: http://localhost:3000/register
- Role: Teach (Tutor)
- Register and login

### 3. Admin Login
- Go to: http://localhost:3000/login
- Email: admin@smarttutor.com
- Password: password123

### 4. Manager Login
- Go to: http://localhost:3000/login
- Email: manager@smarttutor.com
- Password: password123

---

## ✅ Success Indicators

- [ ] MongoDB connects (mongosh works)
- [ ] Backend starts without errors
- [ ] `npm run test-api` passes all tests
- [ ] Frontend starts on port 3000
- [ ] Can register student
- [ ] Can register tutor
- [ ] Can login as admin
- [ ] Can login as manager
- [ ] No "Network Error" in browser

---

## 🆘 Still Not Working?

1. **Stop everything** (Ctrl+C in all terminals)
2. **Restart MongoDB**
   ```bash
   # Windows
   net stop MongoDB
   net start MongoDB
   
   # Mac
   brew services restart mongodb-community
   
   # Linux
   sudo systemctl restart mongodb
   ```
3. **Clean install backend**
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```
4. **Clean install frontend**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```
5. **Start from Step 1 again**

---

## 📞 Quick Commands Reference

```bash
# MongoDB
mongosh                          # Test connection
net start MongoDB                # Windows: start
brew services start mongodb      # Mac: start

# Backend
cd backend
npm install                      # Install dependencies
npm run test-db                  # Test database
npm run seed                     # Create admin users
npm run dev                      # Start server
npm run test-api                 # Test API

# Frontend
cd frontend
npm install                      # Install dependencies
npm run dev                      # Start frontend

# Test
curl http://localhost:5000/api/health
```

---

**Follow these steps carefully and it will work!** 🚀
