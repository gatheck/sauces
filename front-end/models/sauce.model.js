const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
  userId:{
    type: String,
    required: true 
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 250,
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true,
    maxlength: 250,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true,
  },
  mainPepper: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  heat: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  usersLiked: {
    type: [String],
    required: true,
  },
  usersDisliked: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("Sauce", sauceSchema);
