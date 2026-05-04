# 🧪 SmartTutorET Core Features Testing Guide

## System Status ✅

All systems are ready for testing:
- ✅ Backend: Running on port 5000
- ✅ Frontend: Running on port 3000
- ✅ MongoDB: Connected and working
- ✅ All 4 user roles: Functional
- ✅ Authentication: Complete
- ✅ Create Course Form: Added to Courses page

---

## Pre-Testing Setup

### 1. Start Backend
```bash
cd backend
npm run dev
```
Expected output: `✅ MongoDB Connected Successfully` and `Server running on port 5000`

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Expected output: `VITE v... ready in ... ms`

### 3. Open Browser
Navigate to: `http://localhost:3000`

---

## Test Users

### Pre-Created Users (No Password Required)
- **Admin**: admin@smarttutor.com / password123
- **Manager**: manager@smarttutor.com / password123

### New Users (Register During Testing)
- **Student**: Register with any email
- **Tutor**: Register with any email

---

## 🎯 Feature 1: Courses

### Test 1.1: Manager Creates Course

**Steps:**
1. Login as manager: `manager@smarttutor.com / password123`
2. Go to Manager Dashboard (should auto-redirect)
3. Click "Create Course" button (top right)
4. Fill the form:
   - Title: "Web Development 101"
   - Description: "Learn web development from scratch"
   - Category: "Web Development"
   - Level: "Beginner"
   - Price: 99
   - Duration: 40
   - Syllabus: "HTML, CSS, JavaScript, React"
5. Click "Create Course"

**Expected Result:**
- ✅ Toast message: "Course created successfully!"
- ✅ Modal closes
- ✅ Course appears in "My Courses" section
- ✅ Course appears in Courses browse page

**Troubleshooting:**
- If form doesn't submit: Check browser console for errors
- If course doesn't appear: Refresh the page
- If error message: Check backend terminal for API errors

---

### Test 1.2: Student Browses Courses

**Steps:**
1. Logout (click profile → logout)
2. Register as new student:
   - Email: student1@test.com
   - Password: password123
   - First Name: John
   - Last Name: Doe
   - Role: Student
3. Go to "Courses" page (from sidebar)
4. Should see the course created in Test 1.1

**Expected Result:**
- ✅ Course card displays with:
  - Course title
  - Category
  - Description (first 2 lines)
  - Price
  - "View Details" button
- ✅ Search functionality works

**Troubleshooting:**
- If no courses appear: Check if manager created course in Test 1.1
- If search doesn't work: Check browser console

---

### Test 1.3: Student Views Course Details

**Steps:**
1. Click "View Details" on any course
2. Should see full course information

**Expected Result:**
- ✅ Course details page shows:
  - Full title and description
  - Category, Level, Duration, Price
  - Number of enrolled students
  - Tutor name (if assigned)
  - "Enroll Now" button (if not enrolled)
  - "Already Enrolled" message (if enrolled)

**Troubleshooting:**
- If page doesn't load: Check backend terminal
- If buttons don't appear: Check user role in browser console

---

### Test 1.4: Manager Posts Tutor Vacancy

**Steps:**
1. Login as manager
2. Go to Manager Dashboard
3. In "My Courses" section, find the course created in Test 1.1
4. Click "Manage" link
5. Should see course details page
6. Look for "Post Tutor Vacancy" button (or similar)
7. Fill form:
   - Requirements: "5+ years experience in web development"
   - Deadline: Select a future date
8. Click "Post"

**Expected Result:**
- ✅ Toast message: "Tutor vacancy posted successfully!"
- ✅ Course now shows vacancy status
- ✅ Tutors can now apply to this course

**Troubleshooting:**
- If button doesn't appear: Check if you're logged in as manager
- If form doesn't submit: Check all fields are filled

---

## 🎯 Feature 2: Tutor Applications

### Test 2.1: Tutor Applies to Course

**Steps:**
1. Logout and register as new tutor:
   - Email: tutor1@test.com
   - Password: password123
   - First Name: Jane
   - Last Name: Smith
   - Role: Tutor
2. Go to "Courses" page
3. Find the course with open vacancy (from Test 1.4)
4. Click "View Details"
5. Should see "Apply to Teach" button
6. Click "Apply to Teach"
7. Fill form:
   - Cover Letter: "I have 5 years of experience teaching web development"
   - Experience: "Taught at XYZ Institute, created 10+ courses"
8. Click "Submit Application"

**Expected Result:**
- ✅ Toast message: "Application submitted successfully!"
- ✅ Redirected to Applications page
- ✅ Application shows status: "pending"

**Troubleshooting:**
- If "Apply to Teach" button doesn't appear: Check if vacancy is open
- If error "Already applied": You've already applied to this course
- If error "No open vacancy": Manager hasn't posted vacancy yet

---

### Test 2.2: Manager Reviews Application

**Steps:**
1. Login as manager
2. Go to Manager Dashboard
3. In "Tutor Applications" section, should see the application from Test 2.1
4. Click "Approve" button

**Expected Result:**
- ✅ Toast message: "Application approved"
- ✅ Application status changes to "approved"
- ✅ Tutor is assigned to course
- ✅ Tutor receives notification

**Alternative: Reject Application**
1. Click "Reject" button
2. Enter rejection reason: "Need more experience"
3. Click OK

**Expected Result:**
- ✅ Toast message: "Application rejected"
- ✅ Application status changes to "rejected"
- ✅ Tutor receives notification with reason

**Troubleshooting:**
- If applications don't appear: Check if tutor applied in Test 2.1
- If buttons don't work: Check backend terminal for errors

---

### Test 2.3: Tutor Receives Notification

**Steps:**
1. Login as tutor (from Test 2.1)
2. Go to "Notifications" page
3. Should see notification about application approval/rejection

**Expected Result:**
- ✅ Notification displays:
  - Title: "Application approved" or "Application rejected"
  - Message with course name
  - Timestamp
- ✅ If approved: Message says "You are now assigned to teach this course"
- ✅ If rejected: Message includes rejection reason

**Troubleshooting:**
- If no notifications: Check if manager reviewed application
- If notifications don't load: Check backend terminal

---

## 🎯 Feature 3: Payments

### Test 3.1: Student Makes Payment

**Steps:**
1. Login as student (from Test 1.2)
2. Go to "Courses" page
3. Find the course (from Test 1.1)
4. Click "View Details"
5. Click "Enroll Now" button
6. Fill payment form:
   - Amount: Should be auto-filled with course price (99)
   - Payment Method: Select "Credit Card"
7. Click "Submit Payment"

**Expected Result:**
- ✅ Toast message: "Payment submitted! Awaiting approval."
- ✅ Redirected to Payments page
- ✅ Payment shows status: "pending"
- ✅ Amount shows: $99

**Troubleshooting:**
- If "Enroll Now" button doesn't appear: Check if already enrolled
- If error "Already enrolled": You're already enrolled in this course
- If error "Pending payment exists": You have a pending payment for this course

---

### Test 3.2: Admin Approves Payment

**Steps:**
1. Login as admin: `admin@smarttutor.com / password123`
2. Go to Admin Dashboard
3. Should see "Pending Payments" section
4. Find the payment from Test 3.1
5. Click "Approve" button

**Expected Result:**
- ✅ Toast message: "Payment approved"
- ✅ Payment status changes to "approved"
- ✅ Student is enrolled in course
- ✅ Student receives notification

**Alternative: Reject Payment**
1. Click "Reject" button
2. Enter rejection reason: "Invalid payment method"
3. Click OK

**Expected Result:**
- ✅ Toast message: "Payment rejected"
- ✅ Payment status changes to "rejected"
- ✅ Student receives notification with reason

**Troubleshooting:**
- If payments don't appear: Check if student submitted payment in Test 3.1
- If buttons don't work: Check backend terminal

---

### Test 3.3: Student Enrolled After Approval

**Steps:**
1. Login as student (from Test 1.2)
2. Go to "My Courses" page
3. Should see the course (from Test 1.1)

**Expected Result:**
- ✅ Course appears in "My Courses"
- ✅ Course shows:
  - Title
  - Category
  - Tutor name (if assigned)
  - "View Course" or similar button

**Troubleshooting:**
- If course doesn't appear: Check if admin approved payment in Test 3.2
- If page is empty: Refresh the page

---

## 📊 Complete Testing Checklist

### Courses Feature
- [ ] Manager can create course
- [ ] Course appears in browse list
- [ ] Student can view course details
- [ ] Manager can post tutor vacancy
- [ ] Course shows vacancy status
- [ ] Search functionality works

### Tutor Applications Feature
- [ ] Tutor can apply to course
- [ ] Manager can see applications
- [ ] Manager can approve application
- [ ] Manager can reject application
- [ ] Tutor receives notification
- [ ] Tutor assigned to course after approval

### Payments Feature
- [ ] Student can submit payment
- [ ] Payment shows "pending" status
- [ ] Admin can see pending payments
- [ ] Admin can approve payment
- [ ] Admin can reject payment
- [ ] Student enrolled after approval
- [ ] Student can see course in "My Courses"

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot create course"
**Solution:**
1. Make sure you're logged in as manager
2. Check all required fields are filled (Title, Description, Category)
3. Check backend terminal for errors
4. Try refreshing the page

### Issue: "Cannot apply to course"
**Solution:**
1. Make sure course has open vacancy (manager must post it)
2. Make sure you're logged in as tutor
3. Check you haven't already applied to this course
4. Check backend terminal for errors

### Issue: "Cannot make payment"
**Solution:**
1. Make sure you're logged in as student
2. Make sure you're not already enrolled
3. Check all payment fields are filled
4. Check backend terminal for errors

### Issue: "Notifications not appearing"
**Solution:**
1. Email is optional - app works without it
2. Check backend terminal for email errors
3. Refresh the Notifications page
4. Check if the action (approval/rejection) was completed

### Issue: "API errors in browser console"
**Solution:**
1. Check backend is running: `npm run dev` in backend folder
2. Check MongoDB is running: `mongosh` should connect
3. Check .env file has correct MONGO_URI
4. Check frontend API_BASE_URL is correct: `http://localhost:5000/api`

### Issue: "Page shows 'Loading...' forever"
**Solution:**
1. Check backend terminal for errors
2. Check browser console for errors
3. Try refreshing the page
4. Check network tab in browser DevTools

---

## 📝 Testing Notes

### What to Look For
- ✅ No errors in browser console
- ✅ No errors in backend terminal
- ✅ Toast messages appear correctly
- ✅ Data persists after page refresh
- ✅ Correct user can see correct data
- ✅ Buttons are disabled when appropriate

### Performance Expectations
- Page loads should be < 2 seconds
- API calls should complete < 1 second
- No lag when typing in forms

### Data Validation
- Required fields should show error if empty
- Numbers should accept only numbers
- Emails should be validated
- Amounts should be positive

---

## 🚀 Next Steps After Testing

1. **If all tests pass:**
   - Document any UI/UX improvements needed
   - Test edge cases (duplicate applications, etc.)
   - Test with multiple users simultaneously
   - Proceed to other features (Lessons, Sessions, Groups, etc.)

2. **If tests fail:**
   - Document the exact error
   - Check backend terminal for error details
   - Check browser console for error details
   - Report the issue with steps to reproduce

3. **UI/UX Improvements:**
   - Add loading states to buttons
   - Add confirmation dialogs for important actions
   - Add success animations
   - Improve error messages
   - Add form validations

---

## 📞 Support

If you encounter any issues:
1. Check the "Common Issues & Solutions" section above
2. Check backend terminal for error messages
3. Check browser console (F12) for error messages
4. Check network tab (F12) to see API responses
5. Verify all services are running (backend, frontend, MongoDB)

---

**Happy Testing! 🎉**

