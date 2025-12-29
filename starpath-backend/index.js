require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { OpenAI } = require('openai');

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ============================================
// MIDDLEWARE - Must be BEFORE routes
// ============================================
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL, 'https://starpath.vercel.app'] // Add your Vercel URL here
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// DATABASE CONNECTION
// ============================================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        console.log('⚠️  App will continue without database - some features may not work');
    });

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err.message);
});

const Student = require('./models/Student');

// ============================================
// STUDENT ROUTES
// ============================================

// Register or log in student by name
app.post('/api/student/register', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Name required" });
        }

        let student = await Student.findOne({ name: name.trim() });
        if (!student) {
            student = await Student.create({ name: name.trim() });
        }
        res.json(student);
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: "Failed to register student" });
    }
});

// Get student profile
app.get('/api/student/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(student);
    } catch (err) {
        console.error('Get student error:', err);
        res.status(500).json({ error: "Failed to fetch student" });
    }
});

// Add achievement
app.post('/api/student/:id/achievement', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Achievement title required" });
        }

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        student.achievements.push({ title, description, date: new Date() });
        await student.save();
        res.json(student);
    } catch (err) {
        console.error('Achievement error:', err);
        res.status(500).json({ error: "Failed to add achievement" });
    }
});

// Save progress
app.post('/api/student/:id/progress', async (req, res) => {
    try {
        const { id } = req.params;
        const { score, total, mode, subject, details } = req.body;

        if (typeof score !== 'number' || typeof total !== 'number') {
            return res.status(400).json({ error: "Score and total required" });
        }

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        student.scores.push({
            date: new Date(),
            score,
            total,
            mode,
            subject,
            details,
        });
        await student.save();
        res.json(student);
    } catch (err) {
        console.error('Progress error:', err);
        res.status(500).json({ error: "Failed to save progress" });
    }
});

// ============================================
// AI / PRACTICE ROUTES
// ============================================

// Generate full NAPLAN numeracy test
app.post('/api/generate-naplan-numeracy-test', async (req, res) => {
    const { count = 40, year = "year 5" } = req.body;
    const batchSize = Math.ceil(count / 4);

    const prompts = [
        `Generate ${batchSize} unique Year 5 NAPLAN Numeracy questions on fractions and number lines.
        - Mix multiple choice and short answer.
        - At least 2 must include a "diagram" field describing a number line or visual fraction.
        - Do not repeat names, numbers, or formats.
        - Output each as JSON: { "type": "...", "text": "...", "options": [if MCQ], "answer": "...", "diagram": "if needed, a clear description" }
        - Only a JSON array.`,

        `Generate ${batchSize} unique Year 5 NAPLAN Numeracy questions on geometry, area, perimeter.
        - At least 2 must include a "diagram" of a shape.
        - Mix question types.
        - Output as JSON array.`,

        `Generate ${batchSize} unique Year 5 NAPLAN Numeracy questions on data, graphs, charts.
        - At least 2 must include a "diagram" of a bar chart or tally chart.
        - Output as JSON array.`,

        `Generate ${count - 3 * batchSize} unique Year 5 NAPLAN Numeracy questions on measurement, problem solving, estimation.
        - At least 2 must include a "diagram" of a measuring tape, ruler, or marked object.
        - Output as JSON array.`
    ];

    try {
        let allQuestions = [];
        for (const prompt of prompts) {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.8,
                max_tokens: 1800,
            });
            const arr = response.choices[0].message.content.match(/\[.*\]/s);
            let batchQuestions = arr ? JSON.parse(arr[0]) : [];
            allQuestions = allQuestions.concat(batchQuestions);
        }

        // Trim to requested count
        allQuestions = allQuestions.slice(0, count);

        // Normalize type field for every question
        allQuestions = allQuestions.map(q => {
            let type = q.type ? q.type.toLowerCase() : undefined;
            if (!type) {
                if (q.options && Array.isArray(q.options) && q.options.length > 0) {
                    type = "mcq";
                } else {
                    type = "short";
                }
            }
            return { ...q, type };
        });

        res.json({ questions: allQuestions });
    } catch (err) {
        console.error('Generate test error:', err);
        res.status(500).json({ error: "Could not generate test" });
    }
});

// Check answer with AI
app.post('/api/check-answer', async (req, res) => {
    const { question, studentAnswer, correctAnswer } = req.body;

    if (!question || !correctAnswer) {
        return res.status(400).json({ error: "Question and correct answer required" });
    }

    const prompt = `
    A student was asked: "${question}"
    The correct answer is: "${correctAnswer}"
    The student's answer is: "${studentAnswer}"
    Is the student's answer mathematically equivalent to the correct answer? Respond only with "yes" or "no".
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
        });
        const content = response.choices[0].message.content.trim().toLowerCase();
        res.json({ correct: content.startsWith("yes") });
    } catch (err) {
        console.error('Check answer error:', err);
        res.status(500).json({ error: "AI answer check failed" });
    }
});

// Generate single adaptive question
app.post('/api/generate-question', async (req, res) => {
    const { topic, subtopic, level } = req.body;

    if (!topic) {
        return res.status(400).json({ error: "Topic required" });
    }

    const prompt = `
    Generate a Grade 5 NAPLAN-style math question for the topic: ${topic}, subtopic: ${subtopic || 'general'}.
    Level: ${level || 'medium'}.
    Randomly choose either a multiple choice or short answer format.
    - If multiple choice, provide 4 options and indicate the correct one.
    - If short answer, require a number or fraction.
    Provide the question, the type ("mcq" or "short"), options (if MCQ), the correct answer, and a smart trick or hint for solving it in JSON format:
    { "type": "...", "question": "...", "options": [if MCQ], "answer": "...", "trick": "..." }
    Only output valid JSON, no explanation.
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;

        // Parse JSON output robustly
        let data;
        try {
            data = JSON.parse(content);
            if (typeof data === "string") data = JSON.parse(data);
        } catch {
            // Try to extract JSON from within string
            let extracted = content.match(/{[\s\S]*}/);
            if (extracted) {
                try {
                    data = JSON.parse(extracted[0]);
                } catch {
                    data = { question: content, answer: "", trick: "" };
                }
            } else {
                data = { question: content, answer: "", trick: "" };
            }
        }
        res.json(data);

    } catch (err) {
        console.error('Generate question error:', err);
        res.status(500).json({ error: "Failed to generate question" });
    }
});

// ============================================
// SERVER START
// ============================================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
