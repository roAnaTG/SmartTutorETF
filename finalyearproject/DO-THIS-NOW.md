# ⚡ DO THIS NOW - Quick Fix

## You Have "Network Error"? Follow These Steps:

---

## 1️⃣ Stop Everything
Press `Ctrl+C` in backend and frontend terminals

---

## 2️⃣ Backend Commands (Copy & Paste)

```bash
cd backend
npm install
npm run test-db
npm run seed
npm run dev
```

**Wait for:** `✅ MongoDB Connected Successfully`

**Keep terminal open!**

---

## 3️⃣ Test Backend (New Terminal)

```bash
cd backend
npm run test-api
```

**Should see:** `✅ All tests completed!`

---

## 4️⃣ Frontend Commands (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

**Should see:** `Local: http://localhost:3000/`

---

## 5️⃣ Test in Browser

Go to: **http://localhost:3000**

### Register Student:
- Email: test@student.com
- Password: password123
- Role: **Learn (Student)**

### Login Admin:
- Email: **admin@smarttutor.com**
- Password: **password123**

### Login Manager:
- Email: **manager@smarttutor.com**
- Password: **password123**

---

## ✅ Done!

All roles should work now:
- ✅ Student registration
- ✅ Tutor registration
- ✅ Admin login
- ✅ Manager login

---

## ❌ Still Not Working?

### MongoDB not running?
```bash
mongosh
# If fails: net start MongoDB (Windows)
```

### Port 5000 in use?
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <number> /F
```

### Clean reinstall?
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

---

## 📞 More Help

- [FINAL-SETUP.md](FINAL-SETUP.md) - Complete guide
- [FIX-NETWORK-ERROR.md](FIX-NETWORK-ERROR.md) - Detailed troubleshooting
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - All errors

---

**Just follow steps 1-5 above!** 🚀
