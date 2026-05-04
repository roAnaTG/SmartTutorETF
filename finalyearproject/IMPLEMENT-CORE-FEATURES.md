# 🎯 Implement Core Features - Step by Step

## Overview

You have 3 core features to implement:
1. **Courses** - Manager creates, students browse
2. **Tutor Applications** - Tutor applies, manager reviews
3. **Payments** - Student pays, admin approves

All backend code is already written. We just need to:
1. Test each feature
2. Fix any issues
3. Improve frontend UI

---

## ✅ Feature 1: Courses

### What's Already Done
- ✅ Backend API endpoints
- ✅ Database model
- ✅ Frontend pages
- ✅ API services

### How to Test

#### 1. Manager Creates Course

**In Browser:**
1. Login as manager: manager@smarttutor.com / password123
2. Go to Manager Dashboard
3. Click "Create Course" button
4. Fill form:
   - Title: "Web Development 101"
   - Description: "Learn web development from scratch"
   - Category: "Web Development"
   - Level: "Beginner"
   - Price: 99
   - Duration: 40
5. Click "Create Course"

**Expected:** Course created successfully ✅

#### 2. Student Browses Courses

**In Browser:**
1. Login as student (or register new)
2. Go to "Courses" page
3. Should see the course created above
4. Click "View Details"
5. Should see full course information

**Expected:** Course displayed with all details ✅

#### 3. Post Tutor Vacancy

**In Browser:**
1. Login as manager
2. Go to Manager Dashboard
3. Find the course you created
4. Click "Manage"
5. Click "Post Tutor Vacancy"
6. Fill requirements and deadline
7. Click "Post"

**Expected:** Vacancy posted successfully ✅

---

## ✅ Feature 2: Tutor Applications

### What's Already Done
- ✅ Backend API endpoints
- ✅ Database model
- ✅ Email notifications
- ✅ Frontend pages

### How to Test

#### 1. Tutor Applies to Course

**In Browser:**
1. Login as tutor (or register new)
2. Go to "Courses" page
3. Find a course with open vacancy
4. Click "View Details"
5. Click "Apply to Teach"
6. Fill form:
   - Cover Letter: "I have 5 years of experience..."
   - Experience: "Taught web development at..."
7. Click "Submit Application"

**Expected:** Application submitted successfully ✅

#### 2. Manager Reviews Application

**In Browser:**
1. Login as manager
2. Go to Manager Dashboard
3. See "Pending Applications" section
4. Click "Approve" or "Reject"
5. If reject, enter reason

**Expected:** Application reviewed, tutor notified ✅

#### 3. Tutor Receives Notification

**In Browser:**
1. Login as tutor
2. Go to "Notifications" page
3. Should see approval/rejection notification

**Expected:** Notification displayed ✅

---

## ✅ Feature 3: Payments

### What's Already Done
- ✅ Backend API endpoints
- ✅ Database model
- ✅ Email notifications
- ✅ Frontend pages

### How to Test

#### 1. Student Makes Payment

**In Browser:**
1. Login as student
2. Go to "Courses" page
3. Find a course
4. Click "View Details"
5. Click "Enroll Now"
6. Fill payment form:
   - Amount: (auto-filled)
   - Payment Method: "Credit Card"
7. Click "Submit Payment"

**Expected:** Payment submitted, status = "pending" ✅

#### 2. Admin Approves Payment

**In Browser:**
1. Login as admin: admin@smarttutor.com / password123
2. Go to Admin Dashboard
3. See "Pending Payments" section
4. Click "Approve" or "Reject"
5. If reject, enter reason

**Expected:** Payment reviewed ✅

#### 3. Student Enrolled After Approval

**In Browser:**
1. Login as student
2. Go to "My Courses" page
3. Should see the course (after admin approves)

**Expected:** Student enrolled in course ✅

---

## 🔧 Testing Checklist

### Courses
- [ ] Manager can create course
- [ ] Course appears in browse list
- [ ] Student can view course details
- [ ] Manager can post tutor vacancy
- [ ] Course shows vacancy status

### Tutor Applications
- [ ] Tutor can apply to course
- [ ] Manager can see applications
- [ ] Manager can approve application
- [ ] Manager can reject application
- [ ] Tutor receives notification
- [ ] Tutor assigned to course after approval

### Payments
- [ ] Student can submit payment
- [ ] Payment shows "pending" status
- [ ] Admin can see pending payments
- [ ] Admin can approve payment
- [ ] Admin can reject payment
- [ ] Student enrolled after approval
- [ ] Student can see course in "My Courses"

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot create course"
**Solution:**
1. Make sure you're logged in as manager
2. Check all fields are filled
3. Check backend terminal for errors

### Issue: "Cannot apply to course"
**Solution:**
1. Make sure course has open vacancy
2. Make sure you're logged in as tutor
3. Check you haven't already applied

### Issue: "Cannot make payment"
**Solution:**
1. Make sure you're logged in as student
2. Make sure you're not already enrolled
3. Check all payment fields are filled

### Issue: "Email not sending"
**Solution:**
1. Email is optional - app works without it
2. Check .env has correct email settings
3. Check backend terminal for email errors

---

## 📊 Data Flow

### Courses
```
Manager Creates Course
    ↓
Course saved in database
    ↓
Students browse courses
    ↓
Student views details
    ↓
Manager posts vacancy
    ↓
Tutors can apply
```

### Tutor Applications
```
Tutor applies to course
    ↓
Application saved (status: pending)
    ↓
Manager reviews application
    ↓
Manager approves/rejects
    ↓
Tutor assigned to course (if approved)
    ↓
Email sent to tutor
    ↓
Notification created
```

### Payments
```
Student submits payment
    ↓
Payment saved (status: pending)
    ↓
Admin reviews payment
    ↓
Admin approves/rejects
    ↓
Student enrolled (if approved)
    ↓
Progress record created
    ↓
Email sent to student
    ↓
Notification created
```

---

## ✨ Frontend Improvements Needed

### Courses Page
- [ ] Add "Create Course" modal for manager
- [ ] Show course thumbnail/image
- [ ] Show enrolled students count
- [ ] Show tutor name if assigned

### Course Detail Page
- [ ] Show full course info
- [ ] Show tutor info (if assigned)
- [ ] Show "Apply to Teach" button (for tutor)
- [ ] Show "Enroll Now" button (for student)
- [ ] Show vacancy requirements

### Applications Page
- [ ] Show application status
- [ ] Show review date
- [ ] Show rejection reason (if rejected)
- [ ] Manager can see all applications

### Payments Page
- [ ] Show payment status
- [ ] Show payment date
- [ ] Show rejection reason (if rejected)
- [ ] Admin can see all payments

---

## 🚀 Next Steps

1. **Test all 3 features** using the checklist above
2. **Fix any issues** found during testing
3. **Improve UI** based on feedback
4. **Add validations** for better UX
5. **Test edge cases** (duplicate applications, etc.)

---

## 📝 Testing Script

### Quick Test (5 minutes)

```bash
# 1. Start backend & frontend
cd backend && npm run dev
# In new terminal:
cd frontend && npm run dev

# 2. Test Courses
- Login as manager
- Create course
- Login as student
- View course

# 3. Test Applications
- Login as tutor
- Apply to course
- Login as manager
- Approve application

# 4. Test Payments
- Login as student
- Make payment
- Login as admin
- Approve payment
- Check student enrolled
```

---

## ✅ Success Criteria

All 3 features work smoothly when:
- ✅ Manager can create courses
- ✅ Students can browse and view courses
- ✅ Tutors can apply to teach
- ✅ Manager can approve/reject applications
- ✅ Students can make payments
- ✅ Admin can approve/reject payments
- ✅ Students are enrolled after payment approval
- ✅ Notifications are sent
- ✅ No errors in browser console
- ✅ No errors in backend terminal

---

**Start testing now!** 🚀
