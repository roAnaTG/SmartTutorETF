const Session = require('../models/Session');
const Course = require('../models/Course');
const Group = require('../models/Group');
const Notification = require('../models/Notification');
const { sendEmail, emailTemplates } = require('../utils/email');

const createSession = async (req, res) => {
  try {
    const { course: courseId, title, subject, description, type, scheduledAt, duration, group } = req.body;

    // Verify tutor is assigned to this course (only if courseId is provided)
    let enrolledStudents = [];
    if (courseId) {
      const course = await Course.findById(courseId).populate('enrolledStudents', 'firstName lastName email');
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
      enrolledStudents = course.enrolledStudents;
    }

    const session = new Session({
      course: courseId,
      tutor: req.user._id,
      title,
      subject,
      description,
      type,
      scheduledAt,
      duration,
      group
    });

    await session.save();
    await session.populate([
      { path: 'course', select: 'title' },
      { path: 'tutor', select: 'firstName lastName' },
      { path: 'group', select: 'name' }
    ]);

    // Notify enrolled students
    const students = group 
      ? (await Group.findById(group).populate('students', 'firstName lastName email')).students
      : enrolledStudents;

    for (const student of students) {
      // Create notification
      await Notification.create({
        recipient: student._id,
        type: 'session-scheduled',
        title: 'New Session Scheduled',
        message: `A new session "${title}" has been scheduled${session.course ? ` for ${session.course.title}` : ` in ${subject}`}`,
        relatedId: session._id,
        relatedModel: 'Session'
      });

      // Send email
      await sendEmail(
        student.email,
        'New Session Scheduled - SmartTutorET',
        emailTemplates.sessionScheduled(
          student.firstName,
          title,
          scheduledAt,
          duration
        )
      );
    }

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const { course, status, upcoming } = req.query;
    let query = {};

    if (course) query.course = course;
    if (status) query.status = status;

    // Filter for upcoming sessions
    if (upcoming === 'true') {
      query.scheduledAt = { $gte: new Date() };
    }

    // Students see sessions for their enrolled courses
    if (req.user.role === 'student') {
      const enrolledCourses = await Course.find({ 
        enrolledStudents: req.user._id 
      }).select('_id');
      query.course = { $in: enrolledCourses.map(c => c._id) };
    }

    // Tutors see their own sessions
    if (req.user.role === 'tutor') {
      query.tutor = req.user._id;
    }

    const sessions = await Session.find(query)
      .populate('course', 'title')
      .populate('tutor', 'firstName lastName')
      .populate('group', 'name')
      .sort({ scheduledAt: 1 });

    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('course', 'title description')
      .populate('tutor', 'firstName lastName email')
      .populate('group', 'name students')
      .populate('attendees.user', 'firstName lastName');

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('course tutor group', 'title firstName lastName name');

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Session updated successfully', 
      data: session 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const joinSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    // Check if already joined
    const alreadyJoined = session.attendees.find(
      a => a.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.json({ 
        success: true, 
        message: 'Already joined', 
        data: session 
      });
    }

    session.attendees.push({
      user: req.user._id,
      joinedAt: new Date()
    });

    await session.save();

    res.json({ 
      success: true, 
      message: 'Joined session successfully', 
      data: session 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const leaveSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    const attendeeIndex = session.attendees.findIndex(
      a => a.user.toString() === req.user._id.toString()
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Not joined to this session' 
      });
    }

    session.attendees[attendeeIndex].leftAt = new Date();
    await session.save();

    res.json({ 
      success: true, 
      message: 'Left session successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  joinSession,
  leaveSession
};
