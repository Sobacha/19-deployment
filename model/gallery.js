'use strict';

const mongoose = require('mongoose');

const Gallery = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    //    ref: 'user',
    ref: 'auth',
  },
});

module.exports = mongoose.model('gallerie', Gallery);
