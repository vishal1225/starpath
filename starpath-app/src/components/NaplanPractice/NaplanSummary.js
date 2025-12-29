import React from "react";

export default function NaplanSummary({ questions, answers, onRetry }) {
    let correct = 0;
    
    const isAnswerCorrect = (userAnswer, correctAnswer) => {
        const user = (userAnswer || "").toString().trim().toLowerCase();
        const correct = (correctAnswer || "").toString().trim().toLowerCase();
        return user === correct;
    };

    questions.forEach((q, idx) => {
        if (isAnswerCorrect(answers[idx], q.answer)) correct++;
    });

    const percentage = Math.round((correct / questions.length) * 100);

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl p-10 text-center">
            <h2 className="text-3xl font-extrabold text-violet-700 mb-4">Test Complete!</h2>
            <div className="text-2xl mb-2">
                Your score: <b className="text-emerald-700">{correct} / {questions.length}</b>
            </div>
            <div className="text-lg text-gray-600 mb-6">
                {percentage}% correct
            </div>
            <div className="mb-6 max-h-96 overflow-y-auto">
                {questions.map((q, idx) => {
                    const userCorrect = isAnswerCorrect(answers[idx], q.answer);
                    return (
                        <div 
                            key={idx} 
                            className="mb-2 flex items-center justify-between px-4 py-2 rounded-lg text-left"
                            style={{ background: userCorrect ? "#dcfce7" : "#fee2e2" }}
                        >
                            <div className="flex-1">
                                <b>Q{idx + 1}:</b> {q.text}
                                <div className="text-sm text-gray-700">
                                    <b>Your answer:</b>{" "}
                                    {answers[idx] || <span className="italic text-gray-400">No answer</span>}
                                    {" "} | <b>Correct:</b> {q.answer}
                                </div>
                            </div>
                            <div className="ml-2">
                                {userCorrect
                                    ? <span className="text-green-600 text-2xl font-bold">✔</span>
                                    : <span className="text-red-600 text-2xl font-bold">✘</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
            <button
                className="mt-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold px-8 py-3 rounded-2xl shadow-lg text-lg"
                onClick={onRetry}
            >
                Try Again
            </button>
        </div>
    );
}
