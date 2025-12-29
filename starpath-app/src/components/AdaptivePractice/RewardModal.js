import React from "react";

export default function RewardModal({ 
    score, 
    total, 
    percent, 
    totalHintsUsed = 0,
    questionsWithoutHints = 0,
    independentPercent = 0,
    onContinue 
}) {
    const isStarPerformer = percent >= 95;
    const isIndependent = independentPercent >= 80; // 80%+ solved without hints

    // Determine achievement level
    let achievementLevel = "bronze";
    if (isStarPerformer && isIndependent) {
        achievementLevel = "gold";
    } else if (percent >= 80 && independentPercent >= 60) {
        achievementLevel = "silver";
    }

    const getEncouragement = () => {
        if (isStarPerformer && isIndependent) {
            return "Outstanding! You're a true math master! 🏆";
        }
        if (percent >= 80) {
            if (independentPercent >= 60) {
                return "Excellent work! You're becoming more independent!";
            }
            return "Great score! Try using fewer hints next time.";
        }
        if (percent >= 50) {
            if (totalHintsUsed <= 3) {
                return "Good effort! Keep practicing to improve.";
            }
            return "You're learning! Try to solve more without hints.";
        }
        return "Keep practicing! Each attempt makes you stronger.";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                {/* Achievement Badge */}
                <div className="mb-6">
                    {achievementLevel === "gold" && (
                        <div className="text-6xl mb-2">🏆</div>
                    )}
                    {achievementLevel === "silver" && (
                        <div className="text-6xl mb-2">🥈</div>
                    )}
                    {achievementLevel === "bronze" && (
                        <div className="text-6xl mb-2">🎯</div>
                    )}
                </div>

                <h1 className="text-3xl font-extrabold text-violet-700 mb-2">
                    Session Complete!
                </h1>
                
                <p className="text-gray-600 mb-6">{getEncouragement()}</p>

                {/* Main Score */}
                <div className="bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-2xl p-6 mb-6">
                    <div className="text-5xl font-black text-violet-700 mb-1">
                        {score}/{total}
                    </div>
                    <div className="text-2xl font-bold text-fuchsia-600">
                        {Math.round(percent)}% Correct
                    </div>
                </div>

                {/* Independence Stats */}
                <div className="bg-amber-50 rounded-2xl p-4 mb-6">
                    <h3 className="font-bold text-amber-800 mb-3">📊 Independence Report</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white rounded-xl p-3">
                            <div className="text-2xl font-bold text-emerald-600">
                                {questionsWithoutHints}
                            </div>
                            <div className="text-gray-600">
                                Solved without hints
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-3">
                            <div className="text-2xl font-bold text-amber-600">
                                {totalHintsUsed}
                            </div>
                            <div className="text-gray-600">
                                Hints used
                            </div>
                        </div>
                    </div>

                    {/* Independence Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Independence Level</span>
                            <span>{Math.round(independentPercent)}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className={`h-3 rounded-full transition-all ${
                                    independentPercent >= 80 ? 'bg-emerald-500' :
                                    independentPercent >= 50 ? 'bg-amber-500' :
                                    'bg-orange-500'
                                }`}
                                style={{ width: `${independentPercent}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {independentPercent >= 80 
                                ? "🌟 Excellent! You're solving independently!"
                                : independentPercent >= 50
                                ? "📈 Good progress! Keep reducing hint usage."
                                : "💪 Practice solving without hints to level up!"
                            }
                        </div>
                    </div>
                </div>

                {/* Badges Earned */}
                {(isStarPerformer || isIndependent) && (
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-700 mb-2">Badges Earned:</h3>
                        <div className="flex justify-center gap-2 flex-wrap">
                            {isStarPerformer && (
                                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                                    ⭐ Star Performer
                                </span>
                            )}
                            {isIndependent && (
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                                    🧠 Independent Thinker
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Tips for improvement */}
                {totalHintsUsed > total * 0.5 && (
                    <div className="bg-blue-50 rounded-xl p-3 mb-6 text-sm text-blue-800">
                        <strong>💡 Tip:</strong> Try reading the question twice before using a hint. 
                        You might surprise yourself!
                    </div>
                )}

                <button 
                    className="w-full py-4 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-bold rounded-2xl shadow-lg transition-all"
                    onClick={onContinue}
                >
                    Continue to Dashboard
                </button>
            </div>
        </div>
    );
}
