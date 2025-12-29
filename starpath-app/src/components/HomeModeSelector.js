import React from "react";
import { Calculator, Star } from "lucide-react";

export default function HomeModeSelector({ onNaplan, onAdaptive }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-12">
            <div className="text-center mt-12">
                <h1 className="text-4xl font-extrabold text-violet-700 mb-4 tracking-tight drop-shadow">
                    Welcome to StarPath
                </h1>
                <p className="text-lg text-gray-700">Choose your learning mode:</p>
            </div>
            <div className="flex flex-col md:flex-row gap-10 mt-6">
                <button
                    className="w-80 h-40 bg-gradient-to-br from-blue-200 via-blue-100 to-violet-100 rounded-3xl shadow-2xl border-2 border-violet-300 flex flex-col items-center justify-center hover:scale-105 transition text-violet-800 text-xl font-bold"
                    onClick={onNaplan}
                >
                    <Calculator className="w-12 h-12 mb-2 text-blue-600" />
                    Take a Full NAPLAN Practice Test
                    <div className="text-base font-normal text-gray-500 mt-1">
                        All 40 questions, real-timed exam
                    </div>
                </button>
                <button
                    className="w-80 h-40 bg-gradient-to-br from-fuchsia-200 via-violet-50 to-violet-100 rounded-3xl shadow-2xl border-2 border-fuchsia-300 flex flex-col items-center justify-center hover:scale-105 transition text-fuchsia-700 text-xl font-bold"
                    onClick={onAdaptive}
                >
                    <Star className="w-12 h-12 mb-2 text-fuchsia-500" />
                    Adaptive Practice Mode
                    <div className="text-base font-normal text-gray-500 mt-1">
                        Smart, topic-based, AI-powered learning
                    </div>
                </button>
            </div>
        </div>
    );
}
