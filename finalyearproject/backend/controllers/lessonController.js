const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Resource = require('../models/Resource');
const Progress = require('../models/Progress');

const createLesson = async (req, res) => {
  try {
    const { course: courseId, title, subject, description, week, order, videoUrl, duration, resources } = req.body;

    // Verify tutor is assigned to this course
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ 
          success: false, 
          message: 'Course not found' 
        });
      }

      if (course.assignedTutor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'You are not assigned to this course' 
        });
      }
    }

    const lesson = new Lesson({
      course: courseId || undefined,
      tutor: req.user._id,
      title,
      subject,
      description,
      week,
      order,
      videoUrl,
      duration
    });

    await lesson.save();

    // Add resources if provided
    if (resources && resources.length > 0) {
      for (const resource of resources) {
        await Resource.create({
          course: courseId || undefined,
          lesson: lesson._id,
          uploadedBy: req.user._id,
          subject: subject,
          ...resource
        });
      }
    }

    await lesson.populate('course', 'title');

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLessons = async (req, res) => {
  try {
    const { course } = req.query;
    let query = {};

    if (course) query.course = course;

    // Students only see published lessons
    if (req.user.role === 'student') {
      query.isPublished = true;
    }

    const lessons = await Lesson.find(query)
      .populate('course', 'title')
      .populate('tutor', 'firstName lastName')
      .sort({ week: 1, order: 1 });

    res.json({ success: true, count: lessons.length, data: lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course', 'title')
      .populate('tutor', 'firstName lastName');

    if (!lesson) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lesson not found' 
      });
    }

    // Get resources for this lesson
    const resources = await Resource.find({ lesson: lesson._id });

    res.json({ success: true, data: { ...lesson.toObject(), resources } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('course tutor', 'title firstName lastName');

    if (!lesson) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lesson not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Lesson updated successfully', 
      data: lesson 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lesson not found' 
      });
    }

    // Delete associated resources
    await Resource.deleteMany({ lesson: lesson._id });

    res.json({ success: true, message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const publishLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lesson not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Lesson published successfully', 
      data: lesson 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markLessonComplete = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lesson not found' 
      });
    }

    // Update progress
    let progress = await Progress.findOne({
      student: req.user._id,
      course: lesson.course
    });

    if (!progress) {
      progress = new Progress({
        student: req.user._id,
        course: lesson.course
      });
    }

    if (!progress.completedLessons.includes(lesson._id)) {
      progress.completedLessons.push(lesson._id);
      
      // Calculate total progress
      const totalLessons = await Lesson.countDocuments({ 
        course: lesson.course, 
        isPublished: true 
      });
      progress.totalProgress = Math.round(
        (progress.completedLessons.length / totalLessons) * 100
      );
      
      await progress.save();
    }

    res.json({ 
      success: true, 
      message: 'Lesson marked as complete', 
      data: progress 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
  publishLesson,
  markLessonComplete
};
