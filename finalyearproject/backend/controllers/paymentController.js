const Transaction = require('../models/Transaction');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const Progress = require('../models/Progress');
const { sendEmail, emailTemplates } = require('../utils/email');
const { generateTransactionId } = require('../utils/helpers');

const createPayment = async (req, res) => {
  try {
    const { course: courseId, amount, paymentMethod } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already enrolled in this course' 
      });
    }

    // Check for existing pending payment
    const existingPayment = await Transaction.findOne({
      user: req.user._id,
      course: courseId,
      status: 'pending'
    });

    if (existingPayment) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have a pending payment for this course' 
      });
    }

    const transaction = new Transaction({
      user: req.user._id,
      course: courseId,
      amount,
      paymentMethod,
      transactionId: generateTransactionId()
    });

    await transaction.save();
    await transaction.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'course', select: 'title price' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Payment submitted successfully. Awaiting approval.',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    // Students see their own payments
    if (req.user.role === 'student') {
      query.user = req.user._id;
    }

    if (status) query.status = status;

    const payments = await Transaction.find(query)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title price')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Transaction.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title price description')
      .populate('reviewedBy', 'firstName lastName');

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const reviewPayment = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    const payment = await Transaction.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title');

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment already reviewed' 
      });
    }

    payment.status = status;
    payment.reviewedBy = req.user._id;
    payment.reviewedAt = Date.now();
    if (rejectionReason) payment.rejectionReason = rejectionReason;

    await payment.save();

    // If approved, enroll student in course
    if (status === 'approved') {
      await Course.findByIdAndUpdate(payment.course._id, {
        $addToSet: { enrolledStudents: payment.user._id }
      });

      // Create progress record
      const progress = new Progress({
        student: payment.user._id,
        course: payment.course._id
      });
      await progress.save();
    }

    // Create notification
    const notification = new Notification({
      recipient: payment.user._id,
      type: status === 'approved' ? 'payment-approved' : 'payment-rejected',
      title: `Payment ${status}`,
      message: status === 'approved' 
        ? `Your payment for ${payment.course.title} has been approved. You are now enrolled!`
        : `Your payment for ${payment.course.title} has been rejected.`,
      relatedId: payment._id,
      relatedModel: 'Transaction'
    });
    await notification.save();

    // Send email
    const emailHtml = status === 'approved'
      ? emailTemplates.paymentApproved(
          payment.user.firstName,
          payment.course.title,
          payment.amount
        )
      : emailTemplates.paymentRejected(
          payment.user.firstName,
          payment.course.title,
          rejectionReason
        );

    await sendEmail(
      payment.user.email,
      `Payment ${status} - SmartTutorET`,
      emailHtml
    );

    res.json({
      success: true,
      message: `Payment ${status} successfully`,
      data: payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentPayments = async (req, res) => {
  try {
    const payments = await Transaction.find({ user: req.user._id })
      .populate('course', 'title price thumbnail')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  reviewPayment,
  getStudentPayments
};
