const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const User = require('../models/User');

// Add new course – admin only
router.post('/courses', protect(['admin']), async (req, res) => {
  const { title, description, category, price, thumbnail } = req.body;

  const newCourse = new Course({ title, description, category, price, thumbnail });
  await newCourse.save();
  res.json({ message: 'Course added successfully', course: newCourse });
});

// Get all courses – admin only
router.get('/courses', protect(['admin']), async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Delete a course – admin only
router.delete('/courses/:id', protect(['admin']), async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Get admin profile
router.get('/profile', protect(['admin']), async (req, res) => {
  const admin = await User.findById(req.user.id);
  res.json({ name: admin.name, email: admin.email, role: admin.role });
});


// Upload lecture to a course
router.post('/courses/:id/lectures', protect(['admin']), async (req, res) => {
  const { title, url, type, published } = req.body;

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.lectures.push({ title, url, type, published });
    await course.save();
    res.json({ message: 'Lecture added successfully', lectures: course.lectures });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add lecture' });
  }
});

// Schedule Zoom meeting for a course
router.post('/courses/:id/meeting', protect(['admin']), async (req, res) => {
  const { zoomLink } = req.body;

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const students = await User.find({ role: 'student', enrolledCourses: course._id });
    const studentEmails = students.map(s => s.email);

    res.json({
      message: 'Zoom meeting scheduled',
      course: course.title,
      zoomLink,
      studentsNotified: studentEmails
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send meeting link' });
  }
});

// Get all students (with enrolled courses)
router.get('/students', protect(['admin']), async (req, res) => {
  const students = await User.find({ role: 'student' }).populate('enrolledCourses', 'title');
  res.json(students);
});

module.exports = router;
