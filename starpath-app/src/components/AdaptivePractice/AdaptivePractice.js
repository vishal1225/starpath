import React, { useState, useEffect, useCallback } from "react";
import PracticeCard from "./PracticeCard";
import RewardModal from "./RewardModal";
import { practiceApi } from "../../api";

const SUBTOPIC_MAP = {
    fractions: "Multiplying fractions by whole numbers",
    geometry: "Properties of shapes",
    decimals: "Reading and writing decimals",
};

/**
 * Calculate next difficulty level based on performance AND hint usage
 * - High score + low hints = harder questions
 * - Low score or high hints = easier questions
 */
function getNextLevel(score, total, hintCount) {
    if (total === 0) return "easy";
    
    const correctPercent = (score / total) * 100;
    const hintPercent = (hintCount / total) * 100; // % of questions where hint was used
    
    // Adjust score based on hint usage
    // If student used hints on 50%+ of questions, treat their score as lower
    const adjustedScore = correctPercent - (hintPercent * 0.3);
    
    if (adjustedScore > 80) return "hard";
    if (adjustedScore < 50) return "easy";
    return "medium";
}

export default function AdaptivePractice({
    topic = "Fractions",
    subtopic,
    topicName = "Fractions",
    onComplete = () => {},
    maxQuestions = 10,
}) {
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [currentQ, setCurrentQ] = useState(null);
    const [input, setInput] = useState("");
    const [feedback, setFeedback] = useState("");
    const [showTrick, setShowTrick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [needsAdvance, setNeedsAdvance] = useState(false);
    
    // Hint tracking
    const [hintUsedForCurrentQ, setHintUsedForCurrentQ] = useState(false);
    const [totalHintsUsed, setTotalHintsUsed] = useState(0);
    const [questionsWithoutHints, setQuestionsWithoutHints] = useState(0);

    const effectiveSubtopic = subtopic || SUBTOPIC_MAP[topic.toLowerCase()] || "";

    const getQuestion = useCallback(async (userScore, userTotal, hintCount) => {
        setLoading(true);
        setFeedback("");
        setShowTrick(false);
        setShowAnswer(false);
        setInput("");
        setNeedsAdvance(false);
        setHintUsedForCurrentQ(false);
        
        const level = getNextLevel(userScore, userTotal, hintCount);
        
        try {
            const q = await practiceApi.generateQuestion({ 
                topic, 
                subtopic: effectiveSubtopic, 
                level 
            });
            setCurrentQ(q);
        } catch (e) {
            setCurrentQ({ 
                question: "Error loading question. Please try again.", 
                answer: "", 
                trick: "" 
            });
        } finally {
            setLoading(false);
        }
    }, [topic, effectiveSubtopic]);

    useEffect(() => {
        getQuestion(0, 0, 0);
    }, [getQuestion]);

    // Handle when student requests a hint
    const handleShowHint = () => {
        if (!hintUsedForCurrentQ) {
            setTotalHintsUsed(prev => prev + 1);
            setHintUsedForCurrentQ(true);
        }
        setShowTrick(true);
    };

    const handleSubmit = async () => {
        if (!input || loading) return;
        setLoading(true);

        if (needsAdvance) {
            const nextTotal = total + 1;
            if (nextTotal >= maxQuestions) {
                setLoading(false);
                onComplete(score, nextTotal, {
                    totalHintsUsed,
                    questionsWithoutHints,
                });
            } else {
                setTotal(nextTotal);
                setLoading(false);
                getQuestion(score, nextTotal, totalHintsUsed);
            }
            return;
        }

        let correct = false;
        try {
            const result = await practiceApi.checkAnswer({
                question: currentQ.question,
                studentAnswer: input,
                correctAnswer: String(currentQ.answer),
            });
            correct = result.correct;
        } catch {
            correct = false;
        }
        setLoading(false);

        const nextScore = score + (correct ? 1 : 0);
        const nextTotal = total + 1;
        
        // Track if solved without hint
        if (correct && !hintUsedForCurrentQ) {
            setQuestionsWithoutHints(prev => prev + 1);
        }

        if (correct) {
            setScore(nextScore);
            setTotal(nextTotal);
            
            // Give extra praise if solved without hint
            if (!hintUsedForCurrentQ) {
                setFeedback("✅ Correct! Amazing - you solved it without a hint! 🌟");
            } else {
                setFeedback("✅ Correct! Great job.");
            }
            
            setShowTrick(false);
            setShowAnswer(false);
            
            setTimeout(() => {
                if (nextTotal >= maxQuestions) {
                    onComplete(nextScore, nextTotal, {
                        totalHintsUsed,
                        questionsWithoutHints: questionsWithoutHints + (correct && !hintUsedForCurrentQ ? 1 : 0),
                    });
                } else {
                    getQuestion(nextScore, nextTotal, totalHintsUsed);
                }
            }, 1500);
        } else {
            setFeedback("❌ Not quite right. Review the hint and try to understand the solution.");
            setShowTrick(true); // Show hint after wrong answer
            setShowAnswer(true);
            setNeedsAdvance(true);
        }
    };

    if (!currentQ) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-violet-50 to-sky-50">
                <div className="animate-pulse text-lg text-gray-500">Loading question…</div>
            </div>
        );
    }

    // Session end: reward modal
    if (total >= maxQuestions) {
        const percent = total > 0 ? (100 * score) / total : 0;
        const independentPercent = total > 0 ? (100 * questionsWithoutHints) / total : 0;
        
        return (
            <RewardModal
                score={score}
                total={total}
                percent={percent}
                totalHintsUsed={totalHintsUsed}
                questionsWithoutHints={questionsWithoutHints}
                independentPercent={independentPercent}
                onContinue={() => onComplete(score, total, { totalHintsUsed, questionsWithoutHints })}
            />
        );
    }

    return (
        <PracticeCard
            topicName={topicName}
            score={score}
            total={total}
            maxQuestions={maxQuestions}
            level={getNextLevel(score, total, totalHintsUsed)}
            question={currentQ.question}
            input={input}
            setInput={setInput}
            loading={loading}
            handleSubmit={handleSubmit}
            feedback={feedback}
            showTrick={showTrick}
            handleShowHint={handleShowHint}
            hintUsedForCurrentQ={hintUsedForCurrentQ}
            showAnswer={showAnswer}
            correctAnswer={currentQ.answer}
            trick={currentQ.trick}
            totalHintsUsed={totalHintsUsed}
            questionsWithoutHints={questionsWithoutHints}
        />
    );
}
