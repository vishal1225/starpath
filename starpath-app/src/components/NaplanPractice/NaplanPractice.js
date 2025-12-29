import React, { useState, useEffect, useCallback } from "react";
import NaplanQuestion from "./NaplanQuestion";
import NaplanSummary from "./NaplanSummary";
import { useStudent } from "../StudentContext";
import { studentApi } from "../../api";

const DURATION = 50 * 60; // 50 minutes in seconds

function minutesToTimer(m) {
    const min = Math.floor(m / 60);
    const sec = m % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

export default function NaplanPractice({ customQuestions, onComplete }) {
    const { student } = useStudent();
    const questions = customQuestions;
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(DURATION);
    const [finished, setFinished] = useState(false);
    const [showNavigator, setShowNavigator] = useState(false);

    const handleSubmit = useCallback(() => {
        setFinished(true);
    }, []);

    useEffect(() => {
        if (finished) return;
        if (timeLeft === 0) {
            handleSubmit();
            return;
        }
        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, finished, handleSubmit]);

    const handleAnswer = (val) => setAnswers(a => ({ ...a, [current]: val }));
    const handleNext = () => setCurrent(c => Math.min(c + 1, questions.length - 1));
    const handlePrev = () => setCurrent(c => Math.max(c - 1, 0));
    const handleJump = idx => {
        setCurrent(idx);
        setShowNavigator(false);
    };

    const handlePracticeEnd = useCallback(async (score, total) => {
        if (!student?._id) return;
        
        try {
            await studentApi.saveProgress(student._id, {
                score,
                total,
                mode: "ai-naplan",
                subject: "numeracy",
                details: Object.keys(answers).map(idx => ({
                    question: questions[idx]?.text,
                    answer: answers[idx],
                    correct: questions[idx]?.answer === answers[idx]
                }))
            });

            if ((100 * score) / total >= 95) {
                await studentApi.awardAchievement(student._id, {
                    title: "Star Performer",
                    description: "Scored above 95% on a NAPLAN practice test!"
                });
            }
        } catch (err) {
            console.error("Failed to save progress:", err);
        }

        if (onComplete) onComplete(score, total);
    }, [student, answers, questions, onComplete]);

    if (finished) {
        let score = 0;
        questions.forEach((q, idx) => {
            if (
                typeof q.answer !== "undefined" &&
                answers[idx] &&
                answers[idx].toString().trim().toLowerCase() === q.answer.toString().trim().toLowerCase()
            ) {
                score++;
            }
        });
        
        handlePracticeEnd(score, questions.length);
        
        return (
            <NaplanSummary
                questions={questions}
                answers={answers}
                onRetry={() => {
                    setAnswers({});
                    setCurrent(0);
                    setTimeLeft(DURATION);
                    setFinished(false);
                }}
            />
        );
    }

    const answeredCount = Object.keys(answers).length;
    const progressPercent = (answeredCount / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-indigo-100 flex flex-col">
            {/* Top Header Bar */}
            <div className="bg-white/80 backdrop-blur-sm shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <h1 className="font-extrabold text-xl text-violet-800">NAPLAN Practice</h1>
                    <div className="hidden sm:block text-sm text-gray-500">
                        {answeredCount} of {questions.length} answered
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-full px-4 py-1 font-bold shadow">
                        ⏰ {minutesToTimer(timeLeft)}
                    </div>
                    <button
                        onClick={() => setShowNavigator(!showNavigator)}
                        className="px-3 py-1 rounded-lg bg-violet-100 text-violet-700 text-sm font-medium hover:bg-violet-200 transition"
                    >
                        {showNavigator ? "Hide" : "Questions"}
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200">
                <div 
                    className="h-1 bg-gradient-to-r from-fuchsia-500 to-violet-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Question Navigator Dropdown */}
            {showNavigator && (
                <div className="bg-white/95 backdrop-blur-sm shadow-lg px-6 py-4 border-b">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-sm font-medium text-gray-600 mb-3">Jump to question:</div>
                        <div className="flex flex-wrap gap-2">
                            {questions.map((q, idx) => (
                                <button
                                    key={idx}
                                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all
                                        ${idx === current 
                                            ? "bg-fuchsia-600 text-white scale-110 shadow-lg" 
                                            : answers[idx] 
                                                ? "bg-emerald-400 text-white" 
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    onClick={() => handleJump(idx)}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Question Area - Takes full remaining space */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-2xl">
                    {/* Question Number */}
                    <div className="text-center mb-6">
                        <span className="inline-block bg-white rounded-full px-6 py-2 shadow-md">
                            <span className="text-2xl font-bold text-violet-700">Question {current + 1}</span>
                            <span className="text-gray-400 text-lg"> / {questions.length}</span>
                        </span>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
                        <NaplanQuestion
                            question={questions[current]}
                            answer={answers[current] || ""}
                            onAnswer={handleAnswer}
                        />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center gap-4">
                        <button
                            className="flex-1 px-6 py-3 rounded-2xl bg-white text-violet-700 font-bold shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            disabled={current === 0}
                            onClick={handlePrev}
                        >
                            <span>←</span> Previous
                        </button>
                        
                        {current === questions.length - 1 ? (
                            <button
                                className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                                onClick={handleSubmit}
                            >
                                Submit Test ✓
                            </button>
                        ) : (
                            <button
                                className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                onClick={handleNext}
                            >
                                Next <span>→</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Status */}
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 text-center text-sm text-gray-500 border-t">
                <span className="text-emerald-600 font-medium">{answeredCount} answered</span>
                {" • "}
                <span className="text-orange-500 font-medium">{questions.length - answeredCount} remaining</span>
            </div>
        </div>
    );
}
