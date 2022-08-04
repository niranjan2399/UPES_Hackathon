const mongoose = require('mongoose');

const techSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    max: 10,
    min: 10,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  }
});


// now we need to create colllection
const It = new mongoose.model('It', techSchema);

module.exports = It;
