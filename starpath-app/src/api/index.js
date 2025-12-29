import { API_BASE_URL } from '../config/api';

/**
 * Base API request handler with error handling
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `API error: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Request failed: ${endpoint}`, error);
        throw error;
    }
}

// ============================================
// Student API
// ============================================
export const studentApi = {
    /**
     * Register or login a student by name
     */
    register: (name) => 
        apiRequest('/api/student/register', {
            method: 'POST',
            body: JSON.stringify({ name }),
        }),

    /**
     * Get student profile by ID
     */
    getProfile: (studentId) => 
        apiRequest(`/api/student/${studentId}`),

    /**
     * Save student progress after a practice session
     */
    saveProgress: (studentId, { score, total, mode, subject, details }) =>
        apiRequest(`/api/student/${studentId}/progress`, {
            method: 'POST',
            body: JSON.stringify({ score, total, mode, subject, details }),
        }),

    /**
     * Award an achievement to a student
     */
    awardAchievement: (studentId, { title, description }) =>
        apiRequest(`/api/student/${studentId}/achievement`, {
            method: 'POST',
            body: JSON.stringify({ title, description }),
        }),
};

// ============================================
// Practice API
// ============================================
export const practiceApi = {
    /**
     * Generate a single adaptive question
     */
    generateQuestion: ({ topic, subtopic, level }) =>
        apiRequest('/api/generate-question', {
            method: 'POST',
            body: JSON.stringify({ topic, subtopic, level }),
        }),

    /**
     * Check if student's answer is correct using AI
     */
    checkAnswer: ({ question, studentAnswer, correctAnswer }) =>
        apiRequest('/api/check-answer', {
            method: 'POST',
            body: JSON.stringify({ question, studentAnswer, correctAnswer }),
        }),

    /**
     * Generate a full NAPLAN numeracy test
     */
    generateNaplanTest: ({ count = 40, year = 'year 5' } = {}) =>
        apiRequest('/api/generate-naplan-numeracy-test', {
            method: 'POST',
            body: JSON.stringify({ count, year }),
        }),
};

