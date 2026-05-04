# ⚡ Quick Testing Reference

## 🚀 Start Services

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: MongoDB (if not running)
mongosh
```

---

## 👥 Test Users

| Role | Email | Password | Action |
|------|-------|----------|--------|
| Admin | admin@smarttutor.com | password123 | Login |
| Manager | manager@smarttutor.com | password123 | Login |
| Student | Register new | password123 | Register |
| Tutor | Register new | password123 | Register |

---

## 🎯 Quick Test Flow (15 minutes)

### 1️⃣ Create Course (Manager)
- Login as manager
- Dashboard → "Create Course" button
- Fill: Title, Description, Category, Price (99), Duration (40)
- Click "Create Course"
- ✅ Should see success message

### 2️⃣ Post Vacancy (Manager)
- Dashboard → "My Courses" → "Manage"
- Click "Post Tutor Vacancy"
- Fill: Requirements, Deadline
- Click "Post"
- ✅ Should see success message

### 3️⃣ Apply to Course (Tutor)
- Register as tutor
- Courses → Find course → "View Details"
- Click "Apply to Teach"
- Fill: Cover Letter, Experience
- Click "Submit Application"
- ✅ Should see success message

### 4️⃣ Approve Application (Manager)
- Dashboard → "Tutor Applications"
- Click "Approve"
- ✅ Should see success message

### 5️⃣ Make Payment (Student)
- Register as student
- Courses → Find course → "View Details"
- Click "Enroll Now"
- Select payment method
- Click "Submit Payment"
- ✅ Should see success message

### 6️⃣ Approve Payment (Admin)
- Login as admin
- Dashboard → "Pending Payments"
- Click "Approve"
- ✅ Should see success message

### 7️⃣ Verify Enrollment (Student)
- Login as student
- Go to "My Courses"
- ✅ Should see the course

---

## 🔍 Verification Checklist

- [ ] Course created and visible
- [ ] Vacancy posted successfully
- [ ] Tutor application submitted
- [ ] Manager approved application
- [ ] Payment submitted
- [ ] Admin approved payment
- [ ] Student enrolled in course
- [ ] No errors in browser console
- [ ] No errors in backend terminal

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot create course" | Make sure you're logged in as manager |
| "Cannot apply" | Make sure vacancy is posted |
| "Cannot pay" | Make sure you're logged in as student |
| "API errors" | Check backend is running on port 5000 |
| "Page won't load" | Check MongoDB is running |
| "No courses appear" | Refresh page or create a course first |

---

## 📊 Expected Results

✅ All 3 features working smoothly:
- Courses: Manager creates → Student browses → Views details
- Applications: Tutor applies → Manager approves → Tutor notified
- Payments: Student pays → Admin approves → Student enrolled

---

## 📝 Notes

- Email notifications are optional (app works without them)
- All data is stored in MongoDB
- No test data is needed - create as you test
- Each test should take ~2-3 minutes

---

**Start testing now! 🚀**

