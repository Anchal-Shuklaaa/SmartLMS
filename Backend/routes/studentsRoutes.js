
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const User = require('../models/User');

// Get All Courses
router.get('/courses', protect(['student']), async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Enroll in Course
router.post('/enroll/:courseId', protect(['student']), async (req, res) => {
  const student = await User.findById(req.user.id);
  student.enrolledCourses.push(req.params.courseId);
  await student.save();
  res.json({ message: 'Enrolled successfully' });
});


// Get Profile
router.get('/profile', protect(['student']), async (req, res) => {
  const student = await User.findById(req.user.id).populate('enrolledCourses');
  res.json(student);
});

// Unenroll from Course
router.delete('/unenroll/:courseId', protect(['student']), async (req, res) => {
  const student = await User.findById(req.user.id);
  student.enrolledCourses = student.enrolledCourses.filter(
    courseId => courseId.toString() !== req.params.courseId
  );
  await student.save();
  res.json({ message: 'Unenrolled successfully' });
});


module.exports = router;

