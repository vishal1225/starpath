import React, { useState } from "react";
import NaplanPractice from "./NaplanPractice";
import { practiceApi } from "../../api";

export default function NaplanNumeracyPractice() {
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function generateAITest() {
        setLoading(true);
        setError("");
        
        try {
            const data = await practiceApi.generateNaplanTest({ count: 40, year: "year 5" });
            setQuestions(data.questions);
        } catch (err) {
            setError(err.message || "Failed to generate test. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center mt-20 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
                <div className="text-xl text-center text-gray-600">
                    Generating your test...
                    <br />
                    <span className="text-sm text-gray-400">This may take a moment</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center mt-20 gap-6">
                <div className="text-red-600 font-medium">{error}</div>
                <button
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl text-xl"
                    onClick={generateAITest}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div>
            {!questions && (
                <div className="flex flex-col items-center mt-20 gap-6">
                    <button
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl text-xl"
                        onClick={generateAITest}
                    >
                        Generate AI Numeracy Test
                    </button>
                </div>
            )}
            {questions && (
                <NaplanPractice customQuestions={questions} />
            )}
        </div>
    );
}
