
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  price: Number,
  thumbnail: String, 
  lectures: [{
    title: String,
    url: String,
    type: { type: String, enum: ['video', 'pdf', 'link'] },
    published: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('Course', courseSchema);
