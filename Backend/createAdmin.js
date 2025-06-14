const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust path if needed

// 1. Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/smartlms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log("MongoDB connected");

  // 2. Hash password
  const hashedPassword = await bcrypt.hash('123456', 10);

  // 3. Create admin user
  const admin = new User({
    name: 'Admin',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin'
  });

  await admin.save();
  console.log('Admin user created successfully!');
  mongoose.disconnect();
})
.catch(err => console.log(err));
