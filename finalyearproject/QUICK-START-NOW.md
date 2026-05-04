# ⚡ Quick Start - Run These Commands Now

## You're in MongoDB shell - Exit it first!

Type this in your MongoDB terminal:
```
exit
```

---

## Now Run These Commands (Copy & Paste)

### 1. Test Database Connection
```bash
npm run test-db
```

You should see:
```
✅ MongoDB Connected Successfully!
```

---

### 2. Create Admin & Manager Users
```bash
npm run seed
```

You should see:
```
✅ Admin user created
✅ Manager user created
✅ Seeding completed successfully!
```

---

### 3. Start Backend Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
Server running on port 5000
```

**Keep this terminal open!**

---

### 4. Test API (New Terminal)
```bash
cd backend
npm run test-api
```

You should see:
```
✅ Health check passed
✅ Student registration successful!
✅ Login successful!
✅ Admin login successful!
🎉 All tests completed!
```

---

### 5. Start Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

You should see:
```
➜  Local:   http://localhost:3000/
```

---

## 6. Test in Browser

Go to: **http://localhost:3000**

### Try These:

**Register Student:**
- Email: test@student.com
- Password: password123
- Role: Learn (Student)

**Login Admin:**
- Email: admin@smarttutor.com
- Password: password123

**Login Manager:**
- Email: manager@smarttutor.com
- Password: password123

---

## ✅ Done!

All roles should work now! 🎉
