const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
});

const scoreSchema = new mongoose.Schema({
    date: Date,
    mode: String,        // 'ai-naplan', 'past-paper', etc.
    subject: String,     // 'numeracy', etc.
    score: Number,
    total: Number,
    details: Array,      // Optional: Per-question data
});

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    created: { type: Date, default: Date.now },
    achievements: [achievementSchema],
    scores: [scoreSchema],
});

module.exports = mongoose.model('Student', studentSchema);
