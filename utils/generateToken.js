const jwt = require('jsonwebtoken');

generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

module.exports = generateToken;
