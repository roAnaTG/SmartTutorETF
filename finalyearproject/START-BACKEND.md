# 🚀 Start Backend - Step by Step

## Step 1: Make Sure MongoDB is Running

```bash
mongosh
```

If it connects, type `exit` and continue.

If it fails:
- **Windows:** `net start MongoDB`
- **macOS:** `brew services start mongodb-community`
- **Linux:** `sudo systemctl start mongodb`

---

## Step 2: Install/Update Dependencies

```bash
cd backend
npm install
```

This will install the correct versions of all packages.

---

## Step 3: Test Database Connection

```bash
npm run test-db
```

You should see: ✅ MongoDB Connected Successfully!

---

## Step 4: Create Admin/Manager Users

```bash
npm run seed
```

Creates:
- Admin: admin@smarttutor.com / password123
- Manager: manager@smarttutor.com / password123

---

## Step 5: Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
Server running on port 5000
```

---

## Step 6: Test the API

Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "mongodb": "Connected"
}
```

---

## ✅ Backend is Ready!

Now start the frontend in a new terminal:
```bash
cd frontend
npm install
npm run dev
```

---

## 🐛 Troubleshooting

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <number> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### "MongoDB connection error"
Make sure MongoDB is running: `mongosh`

---

## 🎯 Quick Commands

```bash
# Test everything is working
npm run test-db    # Test MongoDB
npm run seed       # Create admin users
npm run dev        # Start server

# In browser
http://localhost:5000/api/health
```
