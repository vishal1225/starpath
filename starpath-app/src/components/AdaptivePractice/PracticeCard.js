import React from "react";

export default function PracticeCard({
    topicName, score, total, maxQuestions, level,
    question, input, setInput, loading, handleSubmit,
    feedback, showTrick, handleShowHint, hintUsedForCurrentQ,
    showAnswer, correctAnswer, trick,
    totalHintsUsed, questionsWithoutHints
}) {
    const progressPercent = (total / maxQuestions) * 100;
    const isCorrect = feedback.startsWith("✅");
    const isWrong = feedback.startsWith("❌");
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-violet-50 to-sky-50 flex flex-col">
            {/* Top Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <h1 className="font-extrabold text-xl text-fuchsia-700">{topicName} Practice</h1>
                    <span className={`
                        px-3 py-1 rounded-full text-xs font-bold
                        ${level === 'easy' ? 'bg-green-100 text-green-700' : 
                          level === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'}
                    `}>
                        {level?.toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-lg bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white rounded-full px-4 py-1 font-bold shadow">
                        {score}/{total}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200">
                <div 
                    className="h-1 bg-gradient-to-r from-fuchsia-500 to-violet-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Main Question Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-2xl">
                    {/* Question Number */}
                    <div className="text-center mb-6">
                        <span className="inline-block bg-white rounded-full px-6 py-2 shadow-md">
                            <span className="text-2xl font-bold text-fuchsia-700">Question {total + 1}</span>
                            <span className="text-gray-400 text-lg"> / {maxQuestions}</span>
                        </span>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
                        {/* Question Text */}
                        <div className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed min-h-[60px]">
                            {question}
                        </div>

                        {/* Hint Section - BEFORE Answer */}
                        {!isCorrect && !isWrong && (
                            <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-amber-800">
                                        💡 Need help?
                                    </span>
                                    {hintUsedForCurrentQ && (
                                        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                                            Hint viewed
                                        </span>
                                    )}
                                </div>
                                
                                {!showTrick ? (
                                    <button
                                        onClick={handleShowHint}
                                        className="w-full py-2 px-4 bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium rounded-lg transition-colors text-sm"
                                    >
                                        {hintUsedForCurrentQ ? "Show Hint Again" : "Show Hint"} 
                                        {!hintUsedForCurrentQ && (
                                            <span className="text-amber-600 ml-1">(Try without first! 🌟)</span>
                                        )}
                                    </button>
                                ) : (
                                    <div className="mt-2">
                                        <div className="text-amber-900 font-medium mb-2">
                                            <span className="text-amber-600">Smart Trick:</span> {trick}
                                        </div>
                                        <button
                                            onClick={() => handleShowHint()}
                                            className="text-xs text-amber-600 hover:text-amber-800 underline"
                                        >
                                            Hide hint
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Answer Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Your Answer:
                            </label>
                            <div className="flex gap-4">
                                <input
                                    className={`flex-1 border-2 rounded-xl p-4 text-xl outline-none transition-colors
                                        ${isCorrect ? 'border-green-400 bg-green-50' : 
                                          isWrong ? 'border-red-300 bg-red-50' :
                                          'border-gray-200 focus:border-violet-400'}
                                        disabled:bg-gray-100`}
                                    placeholder="Type your answer here..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && !loading && !isCorrect && handleSubmit()}
                                    disabled={loading || isCorrect}
                                    autoComplete="off"
                                />
                                <button
                                    className={`px-8 py-4 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                        ${isWrong 
                                            ? 'bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white'
                                            : 'bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white'
                                        }`}
                                    onClick={handleSubmit}
                                    disabled={!input || isCorrect || loading}
                                >
                                    {loading ? "..." : isWrong ? "Next →" : "Submit"}
                                </button>
                            </div>
                        </div>

                        {/* Feedback Area */}
                        {feedback && (
                            <div className={`p-4 rounded-xl mb-4 ${
                                isCorrect ? 'bg-green-100 border-2 border-green-300' : 
                                'bg-red-100 border-2 border-red-300'
                            }`}>
                                <div className={`font-medium text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                    {feedback}
                                </div>
                                
                                {/* Show correct answer after wrong attempt */}
                                {showAnswer && !isCorrect && (
                                    <div className="mt-3 p-3 bg-white/50 rounded-lg">
                                        <span className="text-gray-600">Correct answer: </span>
                                        <span className="font-bold text-green-700">{correctAnswer}</span>
                                    </div>
                                )}
                                
                                {/* Show trick after wrong answer */}
                                {showTrick && isWrong && trick && (
                                    <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                        <span className="text-amber-700 font-medium">💡 Trick: </span>
                                        <span className="text-amber-900">{trick}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center gap-2 text-violet-600 mt-4">
                                <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="font-medium">Loading next question...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Stats */}
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 border-t">
                <div className="max-w-2xl mx-auto flex justify-between items-center text-sm">
                    <div className="flex gap-4">
                        <span className="text-gray-500">
                            <span className="font-medium text-emerald-600">{questionsWithoutHints}</span> solved without hints
                        </span>
                        <span className="text-gray-500">
                            <span className="font-medium text-amber-600">{totalHintsUsed}</span> hints used
                        </span>
                    </div>
                    <div className="text-gray-500">
                        {maxQuestions - total} questions remaining
                    </div>
                </div>
            </div>
        </div>
    );
}
