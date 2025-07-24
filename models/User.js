// server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  community: { type: String },
  points: { type: Number, default: 100 },
  carbonFootprint: { type: Number, default: 0 },
  wasteReduced: { type: Number, default: 0 },
  communityRank: { type: Number, default: 0 },
  badges: { type: [String], default: ["Welcome Warrior"] },
  joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
