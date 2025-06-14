const bcrypt = require('bcryptjs');

// In your registration handler
const hashedPassword = await bcrypt.hash(req.body.password, 10);
const user = new User({
  name: req.body.name,
  email: req.body.email,
  password: hashedPassword,
  role: req.body.role
});
await user.save();