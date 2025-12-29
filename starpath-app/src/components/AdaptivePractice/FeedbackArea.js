import React from "react";

export default function FeedbackArea({
                                         feedback,
                                         showTrick,
                                         setShowTrick,
                                         showAnswer,
                                         correctAnswer,
                                         trick,
                                     }) {
    return (
        <div>
            {feedback && (
                <div className="mb-2 text-base">
                    {feedback}
                    {!feedback.startsWith("✅") && (
                        <button
                            className="ml-4 text-fuchsia-700 underline font-bold"
                            onClick={() => setShowTrick(true)}
                        >
                            Show Trick
                        </button>
                    )}
                </div>
            )}
            {showTrick && (
                <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-xl mb-2 text-base shadow-inner">
                    <b className="text-yellow-800">Smart Trick:</b> {trick}
                    <button
                        className="mt-2 ml-3 px-3 py-1 text-sm bg-violet-100 rounded-xl text-violet-700"
                        onClick={() => setShowTrick(false)}
                    >
                        Close
                    </button>
                </div>
            )}
            {showAnswer && !feedback.startsWith("✅") && (
                <div className="text-green-700 mt-2 text-base">
                    Correct answer: <b>{correctAnswer}</b>
                </div>
            )}
        </div>
    );
}
