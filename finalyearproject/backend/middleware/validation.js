const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    
    next();
  };
};

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  role: Joi.string().valid('student', 'tutor').required(),
  phone: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const courseSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string().required(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  price: Joi.number().min(0).required(),
  duration: Joi.number().required()
});

const applicationSchema = Joi.object({
  course: Joi.string().required(),
  coverLetter: Joi.string().min(20).required(),
  experience: Joi.string().min(20).required()
});

const paymentSchema = Joi.object({
  course: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  paymentMethod: Joi.string().valid('credit-card', 'paypal', 'bank-transfer').required()
});

const lessonSchema = Joi.object({
  course: Joi.string().optional().allow(''),
  title: Joi.string().min(3).required(),
  subject: Joi.string().required(),
  description: Joi.string().min(5).required(),
  week: Joi.number().min(1).optional(),
  order: Joi.number().min(1).optional(),
  videoUrl: Joi.string().uri().allow('').optional(),
  duration: Joi.number().optional()
});

const sessionSchema = Joi.object({
  course: Joi.string().optional().allow(''),
  title: Joi.string().min(3).required(),
  subject: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  type: Joi.string().valid('live', 'peer-to-peer'),
  scheduledAt: Joi.date().required(),
  duration: Joi.number().min(1).optional(),
  group: Joi.string().optional().allow('')
});

const groupSchema = Joi.object({
  course: Joi.string().optional().allow(''),
  name: Joi.string().min(3).required(),
  subject: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  maxMembers: Joi.number().min(2).max(100).optional()
});

const assessmentSchema = Joi.object({
  course: Joi.string().optional().allow(''),
  title: Joi.string().min(3).required(),
  subject: Joi.string().required(),
  description: Joi.string().min(5).required(),
  type: Joi.string().valid('quiz', 'assignment', 'exam'),
  questions: Joi.array().min(1).items(Joi.object({
    questionText: Joi.string().required(),
    type: Joi.string().valid('multiple-choice', 'true-false', 'short-answer').required(),
    options: Joi.array().items(Joi.string()).optional(),
    correctAnswer: Joi.string().required(),
    points: Joi.number().min(1).optional()
  })).required(),
  timeLimit: Joi.number().min(1).optional(),
  dueDate: Joi.date().optional()
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  courseSchema,
  applicationSchema,
  paymentSchema,
  lessonSchema,
  sessionSchema,
  groupSchema,
  assessmentSchema
};
