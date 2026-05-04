const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validate, paymentSchema } = require('../middleware/validation');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('student'), validate(paymentSchema), paymentController.createPayment);
router.get('/', auth, paymentController.getPayments);
router.get('/my-payments', auth, authorize('student'), paymentController.getStudentPayments);
router.get('/:id', auth, paymentController.getPaymentById);
router.put('/:id', auth, authorize('admin'), paymentController.reviewPayment);

module.exports = router;
