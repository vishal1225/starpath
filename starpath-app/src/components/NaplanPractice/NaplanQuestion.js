import React from "react";
import DiagramRenderer from "../DiagramRenderer";

export default function NaplanQuestion({ question, answer, onAnswer }) {
    const type = (question.type || "").toLowerCase();

    const isMCQ =
        question.options &&
        question.options.length > 0 &&
        ["mcq", "multiple choice", "multiple-choice"].includes(type);

    const isShort =
        (!question.options || question.options.length === 0) ||
        type === "short" ||
        type === "short answer" ||
        type === "short-answer" ||
        (!type && (!question.options || question.options.length === 0));

    return (
        <div>
            {/* Diagram (auto-render if possible) */}
            {question.diagram && (
                <div className="mb-6">
                    <DiagramRenderer description={question.diagram} />
                </div>
            )}

            {/* Images (for real tests or extra diagrams) */}
            {question.images && question.images.map((src, idx) => (
                <img
                    key={idx}
                    src={src}
                    alt={`Diagram for question ${idx + 1}`}
                    className="mb-6 mx-auto max-w-full rounded-lg shadow"
                />
            ))}

            {/* Question text */}
            {question.text && (
                <div className="text-xl font-semibold text-gray-800 mb-8 leading-relaxed">
                    {question.text}
                </div>
            )}

            {/* Multiple Choice Options */}
            {isMCQ && (
                <div className="flex flex-col gap-3">
                    {question.options.map((opt, idx) => {
                        const isSelected = answer === opt;
                        const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
                        
                        return (
                            <label 
                                key={opt} 
                                className={`
                                    flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all
                                    border-2 
                                    ${isSelected 
                                        ? "border-violet-500 bg-violet-50 shadow-md" 
                                        : "border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/50"
                                    }
                                `}
                            >
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                                    ${isSelected 
                                        ? "bg-violet-500 text-white" 
                                        : "bg-white text-gray-600 border-2 border-gray-300"
                                    }
                                `}>
                                    {optionLetter}
                                </div>
                                <input
                                    type="radio"
                                    name={`q${question.id || 'current'}`}
                                    value={opt}
                                    checked={isSelected}
                                    onChange={() => onAnswer(opt)}
                                    className="sr-only"
                                />
                                <span className={`text-lg ${isSelected ? "text-violet-800 font-medium" : "text-gray-700"}`}>
                                    {opt}
                                </span>
                                {isSelected && (
                                    <span className="ml-auto text-violet-500 text-xl">✓</span>
                                )}
                            </label>
                        );
                    })}
                </div>
            )}

            {/* Short Answer */}
            {isShort && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Your Answer:
                    </label>
                    <input
                        type="text"
                        className="w-full border-2 border-gray-200 focus:border-violet-400 rounded-xl p-4 text-xl outline-none transition-colors"
                        placeholder="Type your answer here..."
                        value={answer || ""}
                        onChange={e => onAnswer(e.target.value)}
                        autoComplete="off"
                    />
                </div>
            )}
        </div>
    );
}
